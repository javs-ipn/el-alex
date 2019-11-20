import {JsonController, Post, Body} from 'routing-controllers';
import {Courier} from '../../models/Courier/Courier';
import {Credential} from '../../models/Credential/Credential';
import {GenericTrakingObject} from '../../types/RateRequest/generic-traking-object.class';
import {GenericRateObject} from '../../types/RateRequest/generic-rate-object.class';
import {Rate} from '../../models/Rate/rate.model';
import {MultiRateEnvioClickService} from '../../services/EnvioClick/rate-multi-packages-envioclick.service';
import {ShipmentRequestEnvioClickService} from '../../services/EnvioClick/shipment-request-envioclick.service';
import {TrackingRequestEnvioClickService} from '../../services/EnvioClick/tracking-request-envioclick.service';
import {TrackingMultiEnvioClickService} from '../../services/EnvioClick/tracking-multi-packages-envioclick.service';
import * as _ from 'lodash';
// import {ShipmentResponse} from '../../types/ShipmentResponse/generic-shipment-response.interface';

// !@Todo Temporal user & pass
const TEMPUSER = 'medistiklogmx';
const TEMPPASS = 'B#3zV!1zE#4d';
const TEMPAPIKEY = '3179f152-803b-48dd-bac9-570d1043995a';

@JsonController('/envioclick')
export class EnvioClickRequestController {
    constructor(
        private shipmentEnvioClickService: ShipmentRequestEnvioClickService,
        private trackingEnvioClickService: TrackingRequestEnvioClickService,
        private trackingMultiEnvioClickService: TrackingMultiEnvioClickService,
        private multiRatenvioClickService: MultiRateEnvioClickService) {
    }

    /**
     * @description Connects to EnvioClick tracking service and response a tracking request
     * @param genericTracking Generic object Tracking
     */
    @Post('/tracking')
    public async tracking(@Body() genericTracking: GenericTrakingObject): Promise<any> {
        const credential = new Credential();
        const courier = new Courier();
        courier.trackingAction = 'TrackingRequest';
        courier.trackingRequestUrl = 'https://api.envioclickpro.com/api/v1/track';
        credential.courier = courier;
        credential.username = TEMPUSER;
        credential.password = TEMPPASS;
        const envioclickTracking = await this.trackingEnvioClickService.generateObject(genericTracking);
        return Promise.resolve(this.trackingEnvioClickService.trackingRequest(envioclickTracking, credential));
    }

    /**
     * @description Connects to DHL tracking service and response a tracking request
     * @param genericTracking Generic object Tracking
     */
    @Post('/tracking-multi')
    public async trackingMulti(@Body() genericTracking: GenericTrakingObject): Promise<any> {
        const credential = new Credential();
        const courier = new Courier();
        courier.trackingAction = 'TrackingRequest';
        courier.trackingRequestUrl = 'https://api.envioclickpro.com/api/v1/track-multipackage';
        credential.courier = courier;
        credential.username = TEMPUSER;
        credential.password = TEMPPASS;
        const envioclickTracking = await this.trackingMultiEnvioClickService.generateObject(genericTracking);
        return Promise.resolve(this.trackingMultiEnvioClickService.trackingRequest(envioclickTracking, credential));
    }

    /**
     * @description Connects to EnvioClick rate service and response a rate request
     * @param genericRate Generic object Rate
     */
    // @Post('/rate')
    // public async rate(@Body() genericRate: GenericRateObject): Promise<GenericRateResponse> {
    //     const credential = new Credential();
    //     const courier = new Courier();
    //     courier.rateAction = 'Quotation';
    //     courier.rateRequestUrl = 'https://api.envioclickpro.com/api/v1/quotation';
    //     credential.courier = courier;
    //     credential.username = TEMPUSER;
    //     credential.password = TEMPAPIKEY;
    //     const response: GenericRateResponse = await this.handleEnvioClickRequest(genericRate, credential, courier);
    //     return Promise.resolve(response);
    // }

    /**
     * @description Connects to EnvioClick rate service and response a rate request
     * @param genericRate Generic object Rate
     */
    @Post('/rate-multipackages')
    public async rateMultiPackages(@Body() genericRate: GenericRateObject): Promise<any> {
        const credential = new Credential();
        const courier = new Courier();
        courier.rateAction = 'Quotation';
        courier.rateRequestUrl = 'https://api.envioclickpro.com/api/v1/quotation_multipackages';
        credential.courier = courier;
        credential.username = TEMPUSER;
        credential.password = TEMPAPIKEY;
        const envioclickRate = await this.multiRatenvioClickService.generateObject(genericRate);
        return Promise.resolve(this.multiRatenvioClickService.rateRequest(envioclickRate, credential));
    }

    /**
     * @description ...
     */
    @Post('/shipment')
    public async shipment(): Promise<any> {
        const credential = new Credential();
        const courier = new Courier();
        // TODO - Do rate repository functionality
        const rate: Rate = {
            id: 1,
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
            customsValue: 200,
        };

        courier.rateAction = 'ShipmentRequest';
        courier.shipmentRequestUrl = 'https://api.envioclickpro.com/api/v1/sandbox_shipment/request';
        credential.courier = courier;
        credential.username = TEMPUSER;
        credential.password = TEMPAPIKEY;

        // const response: ShipmentResponse = await this.handleEnvioClickRequest(rate, credential, courier);

        const envioclickShipment = await this.shipmentEnvioClickService.generateObject(rate);
        return Promise.resolve(this.shipmentEnvioClickService.shipmentRequest(envioclickShipment, credential));
    }
}
