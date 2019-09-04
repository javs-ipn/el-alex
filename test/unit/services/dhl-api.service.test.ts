import * as _ from 'lodash';
import * as moment from 'moment';
import { DeliveryService } from '../../../src/api/models/DeliveryService/DeliveryService';
import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';
import { DHLApiService } from '../../../src/api/services/DHL/dhl-api.service';
import { DHLOptions } from 'src/api/types/DHL/Options/dhl-options.interface';
import { HashService } from '../../../src/api/services/Hash/hash-methods.service';
import { LogMock } from '../lib/log.mock';
import { ShipmentRequestObject } from 'src/api/types/DHL/ShipmentRequest/dhl-shipment-request.interface';
import { ShipmentResponseObject } from '../../../src/api/types/DHL/ShipmentResponse/dhl-shipment-response-object.interface';
import { WaybillDetail } from '../../../src/api/models/WaybillDetail/WaybillDetail';
import { WaybillRequest } from '../../../src/api/models/WaybillRequest/WaybillRequest';

describe('DHLApiService', () => {
    const TENANT_ID = 54321;
    const paymentType = 'CONSUMO';
    const watingStatusId = 2;
    const max = 20;
    const min = 1;
    const waybillRequestList: WaybillRequest[] = [];
    let deliveryServiceType: DeliveryServiceType;
    let deliveryService: DeliveryService;
    let waybillDetail: WaybillDetail;
    let waybillRequestRepo: WaybillRequest;
    let shipmentRequestObject: ShipmentRequestObject;
    let dhlOptions: DHLOptions;

    beforeAll(() => {
        const elementsNumber = 4;
        deliveryServiceType = new DeliveryServiceType();
        deliveryServiceType.id = 4;
        deliveryServiceType.name = 'DOMESTIC ECONOMY SELECT';
        deliveryServiceType.description = 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)';
        deliveryServiceType.serviceCode = 'G';
        deliveryServiceType.minWeight = 2;
        deliveryServiceType.maxWeight = 25;
        deliveryServiceType.maxLength = 13;
        deliveryServiceType.maxWidth = 44;
        deliveryServiceType.maxHeight = 5;
        deliveryServiceType.isForeign = false;
        deliveryServiceType.deliveryServiceId = 1;

        deliveryService = new DeliveryService();
        deliveryService.deliveryAccount = '123456789';
        deliveryService.deliveryPassword = 'B#3zV!1zE#4d';
        deliveryService.deliveryUser = 'medistiklogmx';
        deliveryService.shipmentRequestApiUrl = 'https://wsbexpress.dhl.com/rest/sndpt/ShipmentRequest';
        deliveryService.name = 'DHL';
        deliveryService.id = 1;
        deliveryService.tenantId = 54321;

        deliveryService.deliveryServiceTypes = [deliveryServiceType];
        deliveryServiceType.deliveryService = deliveryService;

        for (let i = 1; i <= elementsNumber; i++) {
            const waybillRequest = new WaybillRequest();
            waybillRequest.id = i;
            waybillRequest.tenantId = TENANT_ID;
            waybillRequest.requestedQuantity = Math.round(Math.random() * (max - min) + min);
            waybillRequest.paymentType = paymentType;
            waybillRequest.statusId = watingStatusId;
            waybillRequest.created = new Date();
            waybillRequest.updated = new Date();
            waybillRequest.deliveryServiceTypeId = 4;
            waybillRequest.deliveryServiceType = deliveryServiceType;
            waybillRequestList.push(waybillRequest);
        }

        waybillDetail = new WaybillDetail();
        waybillDetail.id = 1001;
        waybillDetail.statusId = 7;
        waybillDetail.waybillRequestId = 1;
        waybillDetail.contentDescription = 'Example request';
        waybillDetail.packageType = 'DOC';
        waybillDetail.shipperName = 'Steve Adams';
        waybillDetail.shipperCompanyName = 'Example Company';
        waybillDetail.shipperPhoneNumber = '55249000';
        waybillDetail.shipperEmail = 'email@example.com';
        waybillDetail.shipperAddress = 'Barranca del Muerto 329; San ';
        waybillDetail.shipperCity = 'belgra';
        waybillDetail.shipperZipcode = '03900';
        waybillDetail.recipientName = 'Example person contac';
        waybillDetail.recipientCompanyName = 'Recipient Company';
        waybillDetail.recipientPhoneNumber = '8765434567';
        waybillDetail.recipientEmail = 'recipient@mail.com';
        waybillDetail.recipientAddress = 'Calle Montes Urales 470; L';
        waybillDetail.recipientCity = 'Monterrey';
        waybillDetail.recipientZipcode = '11000';
        waybillDetail.shipperCountryCode = 'MX';
        waybillDetail.recipientCountryCode = 'MX';
        waybillDetail.length = 3;
        waybillDetail.width = 4;
        waybillDetail.height = 5;
        waybillDetail.weight = 2;
        waybillDetail.boxNumber = 1;
        waybillDetail.isInsured = true;
        waybillDetail.insuredAmount = 1;
        waybillDetail.updated = new Date();
        waybillDetail.created = new Date();

        waybillRequestRepo = new WaybillRequest();
        waybillRequestRepo.id = 1;
        waybillRequestRepo.clientId = 999;
        waybillRequestRepo.tenantId = 54321;
        waybillRequestRepo.requestedQuantity = 1;
        waybillRequestRepo.paymentType = 'PREPAGO';
        waybillRequestRepo.updated = new Date();
        waybillRequestRepo.created = new Date();
        waybillRequestRepo.statusId = 4;
        waybillRequestRepo.deliveryServiceTypeId = 4;
        waybillRequestRepo.deliveryServiceType = deliveryServiceType;
        waybillRequestRepo.waybillDetails = [waybillDetail];

        shipmentRequestObject = {
            ShipmentRequest: {
                RequestedShipment: {
                    InternationalDetail: {
                        Commodities: {
                            CountryOfManufacture: 'MX',
                            Description: 'Generic',
                            NumberOfPieces: 1,
                        },
                        Content: 'NON_DOCUMENTS',
                    },
                    ManifestBypass: 'N',
                    Packages: {
                        RequestedPackages: [
                            {
                                '@number': 1,
                                'CustomerReferences': 'none',
                                'Dimensions': {
                                    Height: 1,
                                    Length: 1,
                                    Width: 1,

                                },
                                'InsuredValue': 1990,
                                'PackageContentDescription': 'Generic description',
                                'Weight': 1,
                            },
                        ],
                    },
                    PaymentInfo: 'DDP',
                    Ship: {
                        Recipient: {
                            Address: {
                                City: 'cdmx',
                                CountryCode: 'MX',
                                PostalCode: '07280',
                                StreetLines: 'jose',
                            },
                            Contact: {
                                PersonName: 'Leo',
                                CompanyName: 'Net',
                                PhoneNumber: '55812612',
                            },
                        },
                        Shipper: {
                            Address: {
                                City: 'cdmx',
                                CountryCode: 'MX',
                                PostalCode: '07280',
                                StreetLines: 'jose',
                            },
                            Contact: {
                                PersonName: 'Leo',
                                CompanyName: 'Net',
                                PhoneNumber: '55812612',
                            },
                        },
                    },
                    ShipTimestamp: '',
                    ShipmentInfo: {
                        Account: '980129458',
                        Currency: 'MXN',
                        DropOffType: 'REGULAR_PICKUP',
                        ServiceType: 'N',
                        UnitOfMeasurement: 'SI',
                    },
                },
            },
        };
        dhlOptions = {
            apiURL: 'https://wsbexpress.dhl.com/rest/sndpt/ShipmentRequest',
            password: 'M!2lO!2kU#8s',
            username: 'envipaqlogiMX',
        };
    });

    test('generateShipmentRequestObject should return a shipment request object', (done) => {
        const log = new LogMock();
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const shipmentRequest = dhlApiService.generateShipmentRequestObject(waybillRequestRepo);
        expect(shipmentRequest).toBeDefined();
        done();
    });

    test('getUpdatedWaybillDetails should return a list of updated waybill details', (done) => {
        const log = new LogMock();
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const responseObject: ShipmentResponseObject = {
            ShipmentResponse: {
                DispatchConfirmationNumber: '12345',
                LabelImage: [
                    {
                        GraphicImage: 'base64pdf',
                        LabelImageFormat: 'application/pdf',
                    },
                ],
                Notification: [
                    {
                        '@code': '0',
                        'Message': 'Sucess',
                    },
                ],
                PackagesResult: {
                    PackageResult: [
                        {
                            '@number': '1',
                            'TrackingNumber': 'trackingnumber',

                        },
                    ],
                },
                ShipmentIdentificationNumber: 'identificationNumber',
            },
        };
        const updatedDetails = dhlApiService.getUpdatedWaybillDetails([responseObject], waybillRequestRepo);
        expect(updatedDetails[0].waybillPdf).toBe('base64pdf');
        done();
    });

    test('shipmentRequest should return a ShipmentResponseObject with the dhl response', async (done) => {
        const shipmentDate = moment().add(2, 'm');
        const shipmetString = shipmentDate.format(DHLApiService.DATE_FORMAT);
        shipmentRequestObject.ShipmentRequest.RequestedShipment.ShipTimestamp = shipmetString;
        const log = new LogMock();
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const response = await dhlApiService.shipmentRequest(shipmentRequestObject, dhlOptions, 1);
        expect(response).toBeDefined();
        done();
    });

    test('shipmentRequest should thrown an error', async (done) => {
        const shipmentDate = moment().add(2, 'm');
        const shipmetString = shipmentDate.format(DHLApiService.DATE_FORMAT);
        shipmentRequestObject.ShipmentRequest.RequestedShipment.ShipTimestamp = shipmetString;
        const log = new LogMock();
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const malformedObject = shipmentRequestObject;
        _.unset(malformedObject.ShipmentRequest.RequestedShipment.Ship.Recipient, 'Contact');
        malformedObject.ShipmentRequest.RequestedShipment.Ship.Recipient.Contact = {
            CompanyName: 'company',
            PersonName: 'name',
            PhoneNumber: '6567545',
        };
        try {
            await dhlApiService.shipmentRequest(malformedObject, dhlOptions, 1);
        } catch (error) {
            expect(error).toBe('Expected "PersonName" start tag, found "CompanyName" start tag (line 39, col 34)');
            done();
        }

    });
});
