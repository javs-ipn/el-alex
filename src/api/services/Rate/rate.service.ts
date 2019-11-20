import * as _ from 'lodash';
import { Courier } from '../../models/Courier/Courier';
import { CourierId } from '../../types/enums/courier-id.enum';
import { CourierService } from '../../models/CourierService/CourierService';
import { Credential } from '../../models/Credential/Credential';
import { CredentialService } from '../Credential/credential.service';
import { CredentialType } from '../../types/enums/credential-type.enum';
import { FedexCredential } from '../../types/Credential/Fedex/FedexCredential/fedex-credential.inteface';
import { FedexRateService } from '../FEDEX/RATE/fedex-rate.service';
import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
import { GenericRateObject } from '../../types/RateRequest/generic-rate-object.class';
import { GenericRateResponse } from '../../types/RateResponse/generic-rate-response.interface';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Rate } from '../../models/Rate/rate.model';
import { RatePackage } from '../../types/RateRequest/rate-package.class';
import { RateReplyDetail } from '../../types/FEDEX/Rate/RateReplyDetail/rate-reply-detail.interface';
import { RateRepository } from '../../repositories/Rate/rate.repository';
// import { RedpackRateService } from '../../services/Redpack/redpack-rate.service';
import { Service } from 'typedi';

@Service()
export class RateService {

    /**
     * @description Determines if a rate request has multiple packages.
     * @param {RatePackage[]} packages The packages
     */
    public static isMultipleShipment(packages: RatePackage[]): boolean {
        let isMultipleShipment: boolean;
        if (_.size(packages) >= 2) {
            isMultipleShipment = true;
        } else {
            isMultipleShipment = false;
        }
        return isMultipleShipment;
    }

    constructor(
        @OrmRepository() private rateRepository: RateRepository,
        private credentialService: CredentialService,
        // private redpackCoverageService: RedpackRateService,
        private fedexRateService: FedexRateService
    ) {
    }

    /**
     * @description Handles rate fedex request.
     * @param genericRateObject
     */
    private async handleFedexRequest(genericRateObject: GenericRateObject): Promise<GenericRateResponse> {
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
            genericRateResponse = this.fedexRateService.getGenericRateResponse(rates);
            await this.rateRepository.saveRates(rates);
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, error);
        }
        return genericRateResponse;
    }
}
