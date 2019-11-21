import { GenericBussinessLogicError } from './../../errors/Generic/generic-bussinessLogic.error';
import { Courier } from './../../models/Courier/Courier';
import { CourierId } from '../../types/enums/courier-id.enum';
import { Credential } from '../../models/Credential/Credential';
import { CredentialService } from './../Credential/credential.service';
import { CredentialType } from './../../types/enums/credential-type.enum';
import { DHLOptions } from './../../types/DHL/Options/dhl-options.interface';
import { DHLShipmentService } from './../DHL/ShipmentRequest/shipment-request-dhl.service';
import { GenericShipmentRequest } from './../../types/ShipmentRequest/generic-shipment-request.class';
import { Service } from 'typedi';
@Service()
export class ShipmentService {

    constructor(
        private dhlShipmentService: DHLShipmentService,
        private credentialService: CredentialService) {
    }

    public async generateWaybill(genericShipmentObject: GenericShipmentRequest): Promise<any> {

        return Promise.resolve({});
    }

    public async handleDHLShipmentRequest(genericShipmentObject: GenericShipmentRequest): Promise<any> {
        let credential: Credential;
        let courier: Courier;
        let dhlOptions: DHLOptions;
        try {
            credential = await this.credentialService.getCredentialByCourierIdTenantAndType(
                CourierId.DHL, genericShipmentObject.tenantId, CredentialType.RATE);
            courier = credential.courier;
            dhlOptions = this.dhlShipmentService.getDHLOptions(courier.shipmentRequestUrl, credential);
            return dhlOptions;
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, error);
        }
    }
}
