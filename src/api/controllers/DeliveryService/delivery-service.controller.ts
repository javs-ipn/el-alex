import { Body, JsonController, Post } from 'routing-controllers';
import { Courier } from './../../models/Courier/Courier';
import { CourierService } from './../../models/CourierService/CourierService';
import { Credential } from '../../models/Credential/Credential';
import { EstafetaRateService } from './../../services/Estafeta/estafeta-rate.service';
import { EstafetaShipmentService } from './../../services/Estafeta/estafeta-shipment.service';
import { GenericRateObject } from '../../types/RateRequest/generic-rate-object.class';
import { Rate } from './../../models/Rate/rate.model';

@JsonController('/estafeta')
export class EquipmentController {

    constructor(
        private es: EstafetaRateService,
        private spr: EstafetaShipmentService) { }

    @Post('/rate')
    public async test(@Body() genericRate: GenericRateObject): Promise<any> {
        const credential = new Credential();
        const courier = new Courier();
        courier.rateAction = 'FrecuenciaCotizador';
        courier.rateRequestUrl = 'http://frecuenciacotizador.estafeta.com/Service.asmx';
        credential.courier = courier;
        const requestString = this.es.createRateRequestXmlString(genericRate, credential);
        return Promise.resolve(this.es.requestRateEstafeta(requestString, credential.courier));

    }

    @Post('/shipment')
    public async test1(): Promise<any> {
        const credential = new Credential();
        const courier = new Courier();
        courier.shipmentAction = 'CreateLabelExtended';
        courier.shipmentRequestUrl = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';
        credential.courier = courier;
        const rate = new Rate();
        rate.contentDescription = 'simple test';
        rate.cityOrigin = 'Mexico city';
        rate.contactNameOrigin = 'Leo';
        rate.corporateNameOrigin = 'Net';
        rate.countryCodeOrigin = 'MX';
        rate.emailOrigin = 'leo@algo.com';
        rate.neighborhoodOrigin = 'Jorge Negrete';
        rate.phoneNumberOrigin = '111111111111111';
        rate.zipcodeOrigin = '07280';

        rate.cityDestination = 'Mexico city';
        rate.contactNameDestination = 'Leo';
        rate.corporateNameDestination = 'Net';
        rate.countryCodeDestination = 'MX';
        rate.emailDestination = 'leo@algo.com';
        rate.neighborhoodDestination = 'Jorge Negrete';
        rate.phoneNumberDestination = '111111111111111';
        rate.zipcodeDestination = '07280';

        rate.dimensionsPackages = '[ { "packageNumber": 1, "dimensions": "12X12X12X12" } ]';

        rate.recipientStreetLines1 = 'José María Pino Suárez 30, Centro Histórico de la Cdad. de México, Colonia centro';
        rate.recipientReference = 'Frente al samborns';

        rate.shipperStreetLines1 = 'Av Cuautepec 32, Jorge Negrete, 07280 Ciudad de México, CDMX Preguntar por Sr luis';
        rate.shipperReference = 'algo';

        const service = new CourierService();
        service.serviceCode = '70';
        service.courier = courier;

        rate.service = service;
        const requestString = this.spr.createSingleRequestXmlString(rate, credential);
        return Promise.resolve(this.spr.requestSingleLabelEstafetaExtended(requestString, credential));

    }

}
