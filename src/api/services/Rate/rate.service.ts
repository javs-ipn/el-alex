import { Courier } from './../../models/Courier/Courier';
import { CourierEnum } from './../../types/enums/courier-enum';
import { CourierId } from './../../types/enums/courier-id.enum';
import { CourierService } from './../../models/CourierService/CourierService';
import { Credential } from './../../models/Credential/Credential';
import { CredentialService } from './../Credential/credential.service';
import { CredentialType } from './../../types/enums/credential-type.enum';
import { DHLOptions } from './../../types/DHL/Options/dhl-options.interface';
import { DHLRateService } from './../DHL/RateRequest/rate-request-dhl.service';
import { FedexCredential } from './../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import { FedexRateService } from './../FEDEX/Rate/fedex-rate.service';
import { GenericBussinessLogicError } from './../../errors/Generic/generic-bussinessLogic.error';
import { GenericRateObject } from './../../types/RateRequest/generic-rate-object.class';
import { GenericRateResponse } from './../../types/RateResponse/generic-rate-response.interface';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { PackageUtilService } from './../Package/package.util.service';
import { Rate } from './../../models/Rate/rate.model';
import { RateReplyDetail } from './../../types/FEDEX/Rate/RateReplyDetail/rate-reply-detail.interface';
import { RateRepository } from './../../repositories/Rate/rate.repository';
import { Service } from 'typedi';
import { EnvioClickRateResponse } from 'src/api/types/EnvioClick/RateResponse/envioclick-rate-response.interface';
import { EnvioClickRateRequest } from 'src/api/types/EnvioClick/RateRequest/envioclick-rate-request.interface';
import { EnvioClickRateService } from '../EnvioClick/rate-request-envioclick.service';
@Service()
export class RateService {

    constructor(
        @OrmRepository() private rateRepository: RateRepository,
        private credentialService: CredentialService,
        private fedexRateService: FedexRateService,
        private dhlRateService: DHLRateService,
        private envioClickRateService: EnvioClickRateService
    ) {
    }

    public async rateShipment(genericObject: GenericRateObject): Promise<GenericRateResponse> {
        // TODO - Add prefers functionality
        const rateResponse: GenericRateResponse = await this.handleEnvioClickRequest(genericObject);
        return Promise.resolve(rateResponse);
    }

    /**
     * @description Handles the  dhl rate request
     * @param {GenericRateObject} genericRateObject Generic rate object
     */
    public async handleDHLRequest(genericRateObject: GenericRateObject): Promise<GenericRateResponse> {
        let credential: Credential;
        let courier: Courier;
        let dhlOptions: DHLOptions;
        try {
            credential = await this.credentialService.getCredentialByCourierIdTenantAndType(
                CourierId.DHL, genericRateObject.tenantId, CredentialType.RATE);
            courier = credential.courier;
            dhlOptions = this.dhlRateService.getDHLOptions(courier.rateRequestUrl, credential);
            const dhlRateRequestObject = this.dhlRateService.generateRateObject(genericRateObject, dhlOptions);
            const rateResponse = await this.dhlRateService.rateRequest(dhlRateRequestObject, dhlOptions);
            const ratesToBeSaved = this.dhlRateService.getRatesToBeSaved(courier, genericRateObject, rateResponse);
            const savedRates = await this.rateRepository.saveRates(ratesToBeSaved);
            const genericRateResponse = PackageUtilService.getGenericRateResponse(CourierEnum.DHL, savedRates);
            return genericRateResponse;
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, error);
        }
    }

    public async handleFedexRequest(genericRateObject: GenericRateObject): Promise<GenericRateResponse> {
        let clientCredential: Credential;
        let fedexCourier: Courier;
        let fedexCourierServices: CourierService[];
        let fedexCredential: FedexCredential;
        let genericRateResponse: GenericRateResponse;
        let rateReplyDetails: RateReplyDetail[];
        let rates: Rate[];
        let ratesFilterByExistingDatabase: RateReplyDetail[];
        let xmlDataRequest: string;
        try {
            clientCredential = await this.credentialService
                .getCredentialByCourierIdTenantAndType(CourierId.FEDEX, genericRateObject.tenantId, CredentialType.RATE);
            fedexCredential = this.fedexRateService.getFedexCredential(clientCredential);
            fedexCourier = clientCredential.courier;
            fedexCourierServices = fedexCourier.courierServices;
            xmlDataRequest = this.fedexRateService.generateAvailableServicesRateXML(fedexCredential, genericRateObject);
            rateReplyDetails = await this.fedexRateService.rateAvailableServicesRequest(xmlDataRequest, fedexCourier.rateRequestUrl, fedexCourier.rateAction);
            ratesFilterByExistingDatabase = this.fedexRateService.filterExistingDatabaseFedexServices(fedexCourierServices, rateReplyDetails);
            rates = this.fedexRateService.generateRateObjects(ratesFilterByExistingDatabase, genericRateObject, fedexCourierServices);
            const savedRates = await this.rateRepository.saveRates(rates);
            genericRateResponse = PackageUtilService.getGenericRateResponse(CourierEnum.FEDEX, savedRates);
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, error);
        }
        return genericRateResponse;
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
            const rateRequest: EnvioClickRateRequest = await this.envioClickRateService.generateObject(genericRate);
            const rateResponse: EnvioClickRateResponse = await this.envioClickRateService.rateRequest(rateRequest, credential);
            const genericRateResponse: any = await this.envioClickRateService.getGenericRateResponse(rateResponse, credential.courier);
            return Promise.resolve(genericRateResponse);
        } catch (error) {
            throw new GenericBussinessLogicError(error);
        }
    }
}
