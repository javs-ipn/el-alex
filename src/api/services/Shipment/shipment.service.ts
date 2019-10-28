import { Credential } from '../../models/Credential/Credential';
import {Courier} from '../../models/Courier/Courier';
// import { Courier as CourierEnum } from '../../types/enums/courier-enum';
import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
import { Service } from 'typedi';
import { RedpackShipmentService } from '../Redpack/redpack-shipment.service';
import { Rate } from '../../models/Rate/rate.model';
import { RedpackInsuredService } from '../Redpack/redpack-insure-shipment.service';
import { ShipmentResponse } from '../../types/ShipmentResponse/generic-shipment-response.interface';

@Service()
export class ShipmentService {
    constructor(
        private redpackShipmentService: RedpackShipmentService,
        private redpackInsureService: RedpackInsuredService) { }

    public async shipmentRequest(idRate: number): Promise<ShipmentResponse> {
        // TODO - Add prefered couriers functionality
        // TODO - Get Courier from repository
        const credential = new Credential();
        const courier = new Courier();
        courier.name = 'REDPACK';
        courier.rateAction = 'ShipmentRequest';
        courier.shipmentRequestUrl = 'https://ws.redpack.com.mx/RedpackAPI_WS/services/RedpackWS?wsdl';
        credential.courier = courier;
        credential.username = '';
        credential.password = '';
        credential.options = '{"PIN": "QA RQkCWF0cxuAmJL6L45p9AvdN7llAsaRz", "idUsuario": "1435"}';
        const rate: Rate = {
            id: 1,
            customsValue: 23002.2,
            internalId: '1',
            insurance: true,
            // tslint:disable-next-line:max-line-length
            dimensionsPackages: '{"description": "Company name", "contentValue": 123, "weight":10, "length":10, "height":10, "width":10}',
            cityOrigin: 'MX',
            cityDestination: 'MX',
            additionalCharges: '[{}]',
            contactNameOrigin: 'Aejandro Vázquez',
            contactNameDestination: 'Alejandro Vázquez',
            corporateNameOrigin: 'MEDISTIK',
            corporateNameDestination: 'MEDISTIK',
            countryCodeOrigin: 'MX',
            countryCodeDestination: 'MX',
            deliveryType: 'REGULAR_PICKUP',
            emailOrigin: 'javs.ipn@outlook.com',
            emailDestination: 'alejandro.vazquez@netlogistik.com',
            extendedZoneShipment: false,
            multipleShipment: false,
            neighborhoodOrigin: 'Providencia',
            neighborhoodDestination: 'Providencia',
            netoPrice: 200,
            packageType: 'NON_DOCUMENTS',
            phoneNumberOrigin: '5538778187',
            phoneNumberDestination: '5538778187',
            pickupDate: new Date('October 25 2019 12:30'),
            rateDate: new Date('October 25 2019 12:30'),
            rated: true,
            serviceId: 1,
            status: false,
            recipientStreetLines1: 'Calle Edo de Tamaulipas',
            shipperStreetLines1: 'Calle Edo de Tamaulipas',
            tenantId: '54321',
            totalHeight: 223,
            totalLength: 212,
            totalWeight: 213,
            totalPrice: 212,
            totalWidth: 122,
            zipcodeOrigin: '54948',
            zipcodeDestination: '45167',
            contentDescription: '',
            recipientReference: 'Hay una paletería',
            shipperReference: 'Hay una paletería',
        };
        let shipmentResponse: ShipmentResponse = undefined;

        shipmentResponse = await this.handleRedpackRequest(rate, credential);
        return Promise.resolve(shipmentResponse);
    }

    private async handleRedpackRequest(rate: Rate, credential: Credential): Promise<ShipmentResponse> {
        try {
            const ranges = this.redpackShipmentService.getDeliveryServiceWaybillRanges(rate.service);
            const rangePerService = this.redpackShipmentService.getWaybillRangeByServiceType(rate.service, ranges);
            const waybillNumberToGenerate = this.redpackShipmentService.getWaybillNumber(rangePerService);
            const stringXMLRequest = this.redpackShipmentService.createShipmentRequestXMLString(rate, waybillNumberToGenerate, credential);
            const shipmentResponse: ShipmentResponse = await this.handleWaybillRequestRedpack(stringXMLRequest, credential);
            rangePerService.lastUsed = (Number.parseInt(rangePerService.lastUsed) + 1).toString();
            // await this.courierService.updateWaybillRanges(rate.serviceId, JSON.stringify(ranges), credential.tenantId);
            if (rate.insurance) {
                const insuredLabelString = this.redpackInsureService.changeXMLStringToInsureWaybillNumber(stringXMLRequest);
                await this.redpackInsureService.requestShipmentInsuredService(insuredLabelString, credential);
            }
            return shipmentResponse;
        } catch (error) {
            throw new GenericBussinessLogicError(`No implementation found for ${rate.service.name}`);
        }
    }

    /**
     * @description - Handles the reponse for redpack
     * @param {string[]} requestLabelString XML strings for shipment request
     * @param {WaybillRequest} foundWaybillRequest waybill data
     * @returns {WaybillRequest} Updated waybill with the pdf and waybill number
     */
    private async handleWaybillRequestRedpack(requestLabelString: string, credential: Credential): Promise<any> {
        try {
            const shipmentResponse = await this.redpackShipmentService.requestShipmentService(requestLabelString,
                credential);
            return Promise.resolve(shipmentResponse);
        } catch (error) {
            throw new GenericBussinessLogicError(error);
        }
    }
}
