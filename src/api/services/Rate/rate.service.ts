import {Courier} from '../../models/Courier/Courier';
import {CourierId} from '../../types/enums/courier-id.enum';
import {Credential} from '../../models/Credential/Credential';
import {CredentialService} from '../Credential/credential.service';
import {CredentialType} from '../../types/enums/credential-type.enum';
import {FedexCredential} from '../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import {FedexRateService} from '../FEDEX/RATE/fedex-rate.service';
import {GenericBussinessLogicError} from '../../errors/Generic/generic-bussinessLogic.error';
import {GenericRateObject} from '../../types/RateRequest/generic-rate-object.class';
import {RateReplyDetail} from '../../types/FEDEX/Rate/RateReplyDetail/rate-reply-detail.interface';
import {RateResponse} from '../../types/RateResponse/GenericRate/rate.response.interface';
import * as _ from 'lodash';
import {RedpackRateService} from '../../services/Redpack/redpack-rate.service';
import {Service} from 'typedi';

@Service()
export class RateService {
    constructor(
        private credentialService: CredentialService,
        private redpackCoverageService: RedpackRateService,
        private fedexRateService: FedexRateService
    ) {
    }

    public async rateShipment(genericRateObject: GenericRateObject): Promise<RateResponse> {
        const rateResponse: RateResponse = await this.handleRedpackRequest(genericRateObject);
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

    public async handleRedpackRequest(genericRateObject: GenericRateObject): Promise<RateResponse> {
        let coverageResponse = undefined;
        // TODO - Add prefered couriers functionality
        // TODO - Get Courier from repository
        const courier = new Courier();
        courier.name = 'REDPACK';
        courier.rateAction = 'rastreo';
        courier.rateRequestUrl = 'https://ws.redpack.com.mx/RedpackAPI_WS/services/RedpackWS?wsdl';
        const credential = new Credential();
        credential.courier = courier;
        credential.username = '';
        credential.password = '';
        credential.options = '{"PIN": "QA RQkCWF0cxuAmJL6L45p9AvdN7llAsaRz", "idUsuario": "1435"}';
        try {
            const coverageRequestString = this.redpackCoverageService.generateCoverageXMLString(genericRateObject, credential);
            const foundRates = await this.redpackCoverageService.requestCoverageService(coverageRequestString, credential.courier);
            coverageResponse = this.redpackCoverageService.getGenericCoverageResponse((_.first(foundRates)), credential.courier);
            return Promise.resolve(coverageResponse);
        } catch (error) {
            throw new GenericBussinessLogicError(error);
        }
    }
}
