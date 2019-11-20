import * as _ from 'lodash';
import { Courier } from '../../models/Courier/Courier';
import { CourierId } from '../../types/enums/courier-id.enum';
import { Credential } from '../../models/Credential/Credential';
import { CredentialService } from '../Credential/credential.service';
import { CredentialType } from '../../types/enums/credential-type.enum';
import { FedexCredential } from '../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import { FedexRateService } from '../FEDEX/RATE/fedex-rate.service';
import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
import { GenericRateObject } from '../../types/RateRequest/generic-rate-object.class';
import { RateReplyDetail } from '../../types/FEDEX/Rate/RateReplyDetail/rate-reply-detail.interface';
import { RedpackRateService } from '../../services/Redpack/redpack-rate.service';
import { Service } from 'typedi';
import { GenericRateResponse } from 'src/api/types/RateResponse/generic-rate-response.interface';
import { EnvioClickRateRequest } from 'src/api/types/EnvioClick/RateRequest/envioclick-rate-request.interface';
import { EnvioClickRateResponse } from 'src/api/types/EnvioClick/RateResponse/envioclick-rate-response.interface';
import { EnvioClickRateService } from '../EnvioClick/rate-request-envioclick.service';

@Service()
export class RateService {
    constructor(
        private credentialService: CredentialService,
        private redpackCoverageService: RedpackRateService,
        private fedexRateService: FedexRateService,
        private rateEnvioClickService: EnvioClickRateService
    ) {
    }

    public async rateShipment(genericRateObject: GenericRateObject): Promise<GenericRateResponse> {
        let rateResponse: GenericRateResponse = undefined;

        rateResponse = await this.handleEnvioClickRequest(genericRateObject);
        return Promise.resolve(rateResponse);
    }

    /**
     * @description Handles rate fedex request.
     * @param genericRateObject
     */
    public async handleFedexRequest(genericRateObject: GenericRateObject): Promise<any> {
        let credential: Credential;
        let courier: Courier;
        let fedexCredential: FedexCredential;
        let rateReplyDetail: RateReplyDetail[];
        let xmlDataRequest: string;
        try {
            credential = await this.credentialService
                .getCredentialByCourierIdTenantAndType(CourierId.FEDEX, genericRateObject.tenantId, CredentialType.RATE);
            fedexCredential = this.fedexRateService.getFedexCredential(credential);
            courier = credential.courier;
            xmlDataRequest = this.fedexRateService.generateAvailableServicesRateXML(fedexCredential, genericRateObject);
            rateReplyDetail = await this.fedexRateService.requestRateAvailableServices(xmlDataRequest, courier.rateRequestUrl, courier.rateAction);
            console.log(rateReplyDetail);
            // TODO generar generico rate
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, error);
        }
        return '';
    }

    public async handleRedpackRequest(genericRateObject: GenericRateObject): Promise<GenericRateResponse> {
        let credential: Credential;
        let coverageResponse = undefined;
        // TODO - Add prefered couriers functionality
        // TODO - Get Courier from repository
        // const courier = new Courier();
        // courier.name = 'REDPACK';
        // courier.rateAction = 'rastreo';
        // courier.rateRequestUrl = 'https://ws.redpack.com.mx/RedpackAPI_WS/services/RedpackWS?wsdl';
        // credential.courier = courier;
        // credential.username = '';
        // credential.password = '';
        // credential.options = '{"PIN": "QA RQkCWF0cxuAmJL6L45p9AvdN7llAsaRz", "idUsuario": "1435"}';
        try {
            credential = await this.credentialService
                .getCredentialByCourierIdTenantAndType(CourierId.ENVIO_CLICK, genericRateObject.tenantId, CredentialType.RATE);
            const coverageRequestString = this.redpackCoverageService.generateCoverageXMLString(genericRateObject, credential);
            const foundRates = await this.redpackCoverageService.requestCoverageService(coverageRequestString, credential.courier);
            coverageResponse = this.redpackCoverageService.getGenericCoverageResponse((_.first(foundRates)), credential.courier);
            return Promise.resolve(coverageResponse);
        } catch (error) {
            throw new GenericBussinessLogicError(error);
        }
    }

    /**
     * @description Handle response of EnvioClick api and turns in generic response
     * @param genericRate Generic object Rate
     * @param credential Courier credential
     */
    public async handleEnvioClickRequest(genericRate: GenericRateObject): Promise<GenericRateResponse> {
        let credential: Credential;
        try {
            credential = await this.credentialService
                .getCredentialByCourierIdTenantAndType(CourierId.ENVIO_CLICK, genericRate.tenantId, CredentialType.RATE);
            const rateRequest: EnvioClickRateRequest = await this.rateEnvioClickService.generateObject(genericRate);
            const rateResponse: EnvioClickRateResponse = await this.rateEnvioClickService.rateRequest(rateRequest, credential);
            const genericRateResponse: any = await this.rateEnvioClickService.getGenericRateResponse(rateResponse, credential.courier);
            return Promise.resolve(genericRateResponse);
        } catch (error) {
            throw new GenericBussinessLogicError(error);
        }
    }
}
