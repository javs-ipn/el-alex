import * as _ from 'lodash';
import { DeliveryService } from '../../../src/api/models/DeliveryService/DeliveryService';
import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';
import { DeliveryServiceTypeRepositoryMock } from '../lib/delivery-service-type.repository.mock';
import { DeliveryServiceTypeService } from '../../../src/api/services/DeliveryServicetype/delivery-service-type.service';
import { DHLApiService } from '../../../src/api/services/DHL/dhl-api.service';
import { EstafetaService } from '../../../src/api/services/ESTAFETA/estafeta-soap.service';
import { GenerateWaybillService } from '../../../src/api/services/GenerateWaybill/generate-waybill.service';
import { GenericBussinessLogicError } from '../../../src/api/errors/Generic/generic-bussinessLogic.error';
import { HashService } from '../../../src/api/services/Hash/hash-methods.service';
import { LogMock } from '../lib/log.mock';
import { WaybillBalanceRequest } from '../../../src/api/models/WaybillBalanceRequest/WaybillBalanceRequest';
import { WaybillBalanceRequestRepositoryMock } from '../lib/waybill-balance-request.repository.mock';
import { WaybillBalanceRequestService } from '../../../src/api/services/WaybillBalanceRequest/waybill-balance-request.service';
import { WaybillDetail } from '../../../src/api/models/WaybillDetail/WaybillDetail';
import { WaybillDetailService } from '../../../src/api/services/WaybillDetail/waybill-detail.service';
import { WaybillRequest } from '../../../src/api/models/WaybillRequest/WaybillRequest';
import { WaybillRequestRepositoryMock } from '../lib/waybill-request.repository.mock';
import { WaybillRequestService } from '../../../src/api/services/WaybillRequest/waybill-request.service';
import { WaybillDetailRepositoryMock } from '../lib/waybill-detail.repositoy.mock';

describe('GenerateWaybillService', () => {
    const TENANT_ID = 54321;
    const paymentType = 'PREPAGO';
    const watingStatusId = 4;
    const max = 20;
    const min = 1;
    const waybillRequestList: WaybillRequest[] = [];
    let deliveryServiceType: DeliveryServiceType;
    let deliveryService: DeliveryService;
    let waybillDetail: WaybillDetail;
    let waybillRequestRepo: WaybillRequest;

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
        deliveryService.deliveryAccount = '980129458';
        deliveryService.deliveryPassword = 'M!2lO!2kU#8s';
        deliveryService.deliveryUser = 'envipaqlogiMX';
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
        waybillDetail.length = 3;
        waybillDetail.width = 4;
        waybillDetail.height = 5;
        waybillDetail.weight = 2;
        waybillDetail.boxNumber = 1;
        waybillDetail.isInsured = true;
        waybillDetail.insuredAmount = 1;
        waybillDetail.shipperCountryCode = 'MX';
        waybillDetail.recipientCountryCode = 'MX';
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
    });
    test('generateWaybills should return a waybill request updated for the response', async (done) => {
        const log = new LogMock();
        const waybillRequestRepoMock = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillBalanceRequestRepoMock = new WaybillBalanceRequestRepositoryMock();
        const waybillBalance = new WaybillBalanceRequest();
        waybillBalance.id = 1;
        waybillBalance.paymentType = 'PREPAGO';
        waybillBalance.tenantId = TENANT_ID;
        waybillBalance.requestedQuantity = 10;
        waybillBalance.acceptedQuantity = 10;
        waybillBalance.approvalPersonId = 1;
        waybillBalance.requestedPersonId = 1;
        waybillBalance.deliveryServiceTypeId = 3;
        waybillBalanceRequestRepoMock.one = waybillBalance;
        const estafetaService = new EstafetaService(log);
        const waybillBalanceService = new WaybillBalanceRequestService(waybillBalanceRequestRepoMock as any, log);
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);

        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(waybillRequestRepoMock as any, log, waybillDetailService, deliveryServiceTypeService);
        const generateWaybillService = new GenerateWaybillService(waybillRequestRepoMock as any, waybillRequestService, dhlApiService,
            estafetaService, waybillBalanceService);
        waybillRequestRepoMock.one = waybillRequestRepo;

        const updatedWaybill = await generateWaybillService.generateWaybills(1, 54321);

        expect(updatedWaybill).toBeDefined();
        done();
    });

    test('generateWaybills should thrown an error for no delivery implementation found', async (done) => {
        const log = new LogMock();
        const waybillRequestRepoMock = new WaybillRequestRepositoryMock();
        const waybillBalanceRequestRepoMock = new WaybillBalanceRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillRequestImplementationNotFound = waybillRequestRepo;
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const estafetaService = new EstafetaService(log);
        const waybillBalance = new WaybillBalanceRequest();
        waybillBalance.id = 1;
        waybillBalance.paymentType = 'PREPAGO';
        waybillBalance.tenantId = TENANT_ID;
        waybillBalance.requestedQuantity = 10;
        waybillBalance.acceptedQuantity = 10;
        waybillBalance.approvalPersonId = 1;
        waybillBalance.requestedPersonId = 1;
        waybillBalance.deliveryServiceTypeId = 3;
        waybillBalanceRequestRepoMock.one = waybillBalance;
        const waybillBalanceService = new WaybillBalanceRequestService(waybillBalanceRequestRepoMock as any, log);
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(waybillRequestRepoMock as any, log, waybillDetailService, deliveryServiceTypeService);
        const generateWaybillService = new GenerateWaybillService(waybillRequestRepoMock as any, waybillRequestService, dhlApiService,
            estafetaService, waybillBalanceService);
        const deliveryServiceTypeFound = new DeliveryServiceType();
        deliveryServiceTypeFound.id = 4;
        deliveryServiceTypeFound.name = 'DOMESTIC ECONOMY SELECT';
        deliveryServiceTypeFound.description = 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)';
        deliveryServiceTypeFound.serviceCode = 'G';
        deliveryServiceTypeFound.minWeight = 2;
        deliveryServiceTypeFound.maxWeight = 25;
        deliveryServiceTypeFound.maxLength = 13;
        deliveryServiceTypeFound.maxWidth = 44;
        deliveryServiceTypeFound.maxHeight = 5;
        deliveryServiceTypeFound.isForeign = false;
        deliveryServiceTypeFound.deliveryServiceId = 1;

        const deliveryServiceFound = new DeliveryService();
        deliveryServiceFound.deliveryAccount = '123456789';
        deliveryServiceFound.deliveryPassword = 'B#3zV!1zE#4d';
        deliveryServiceFound.deliveryUser = 'medistiklogmx';
        deliveryServiceFound.shipmentRequestApiUrl = 'https://wsbexpress.dhl.com/rest/sndpt/ShipmentRequest';
        deliveryServiceFound.name = 'Patito';
        deliveryServiceFound.id = 1;
        deliveryServiceFound.tenantId = 54321;
        deliveryServiceTypeFound.deliveryService = deliveryServiceFound;
        waybillRequestImplementationNotFound.deliveryServiceType = deliveryServiceTypeFound;
        waybillRequestImplementationNotFound.statusId = 4;
        waybillRequestRepoMock.one = waybillRequestImplementationNotFound;

        try {
            await generateWaybillService.generateWaybills(1, 54321);
        } catch (error) {
            expect(error.message).toBe(new GenericBussinessLogicError('No implementation found for Patito').message);
            done();
        }
    });

    test('generateWaybills should return a waybill request updated for the response for Estafeta', async (done) => {
        const log = new LogMock();
        const waybillRequestRepoMock = new WaybillRequestRepositoryMock();
        const waybillBalanceRequestRepoMock = new WaybillBalanceRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillRequestImplementationNotFound = waybillRequestRepo;
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const estafetaService = new EstafetaService(log);
        const waybillBalance = new WaybillBalanceRequest();
        waybillBalance.id = 1;
        waybillBalance.paymentType = 'PREPAGO';
        waybillBalance.tenantId = TENANT_ID;
        waybillBalance.requestedQuantity = 10;
        waybillBalance.acceptedQuantity = 10;
        waybillBalance.approvalPersonId = 1;
        waybillBalance.requestedPersonId = 1;
        waybillBalance.deliveryServiceTypeId = 3;
        waybillBalanceRequestRepoMock.one = waybillBalance;
        const waybillBalanceService = new WaybillBalanceRequestService(waybillBalanceRequestRepoMock as any, log);
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(waybillRequestRepoMock as any, log, waybillDetailService, deliveryServiceTypeService);
        const generateWaybillService = new GenerateWaybillService(waybillRequestRepoMock as any, waybillRequestService, dhlApiService,
            estafetaService, waybillBalanceService);
        const deliveryServiceTypeFound = new DeliveryServiceType();
        deliveryServiceTypeFound.id = 4;
        deliveryServiceTypeFound.name = 'DOMESTIC ECONOMY SELECT';
        deliveryServiceTypeFound.description = 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)';
        deliveryServiceTypeFound.serviceCode = '70';
        deliveryServiceTypeFound.minWeight = 2;
        deliveryServiceTypeFound.maxWeight = 25;
        deliveryServiceTypeFound.maxLength = 13;
        deliveryServiceTypeFound.maxWidth = 44;
        deliveryServiceTypeFound.maxHeight = 5;
        deliveryServiceTypeFound.isForeign = false;
        deliveryServiceTypeFound.deliveryServiceId = 1;

        const deliveryServiceFound = new DeliveryService();
        deliveryServiceFound.deliveryAccount = '000000';
        deliveryServiceFound.deliveryPassword = 'lAbeL_K_11';
        deliveryServiceFound.deliveryUser = 'prueba1';
        deliveryServiceFound.deliveryOptions = '{"customerNumber": "0000000","suscriberId":28, "officeNum": 130}';
        deliveryServiceFound.shipmentRequestApiUrl = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';
        deliveryServiceFound.name = 'Estafeta';
        deliveryServiceFound.id = 1;
        deliveryServiceFound.tenantId = 54321;
        deliveryServiceTypeFound.deliveryService = deliveryServiceFound;
        waybillRequestImplementationNotFound.deliveryServiceType = deliveryServiceTypeFound;
        waybillRequestImplementationNotFound.statusId = 4;
        waybillRequestRepoMock.one = waybillRequestImplementationNotFound;

        const updatedWaybill = await generateWaybillService.generateWaybills(1, 54321);
        expect(updatedWaybill).toBeDefined();
        done();
    });

    test('generateWaybills should thrown an error for must be on wating status', async (done) => {
        const log = new LogMock();
        const waybillRequestRepoMock = new WaybillRequestRepositoryMock();
        const waybillBalanceRequestRepoMock = new WaybillBalanceRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillRequestImplementationNotFound = waybillRequestRepo;
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const estafetaService = new EstafetaService(log);
        const waybillBalance = new WaybillBalanceRequest();
        waybillBalance.id = 1;
        waybillBalance.paymentType = 'PREPAGO';
        waybillBalance.tenantId = TENANT_ID;
        waybillBalance.requestedQuantity = 10;
        waybillBalance.acceptedQuantity = 10;
        waybillBalance.approvalPersonId = 1;
        waybillBalance.requestedPersonId = 1;
        waybillBalance.deliveryServiceTypeId = 3;
        waybillBalanceRequestRepoMock.one = waybillBalance;
        const waybillBalanceService = new WaybillBalanceRequestService(waybillBalanceRequestRepoMock as any, log);
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(waybillRequestRepoMock as any, log, waybillDetailService, deliveryServiceTypeService);
        const generateWaybillService = new GenerateWaybillService(waybillRequestRepoMock as any, waybillRequestService, dhlApiService,
            estafetaService, waybillBalanceService);
        const deliveryServiceTypeFound = new DeliveryServiceType();
        deliveryServiceTypeFound.id = 4;
        deliveryServiceTypeFound.name = 'DOMESTIC ECONOMY SELECT';
        deliveryServiceTypeFound.description = 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)';
        deliveryServiceTypeFound.serviceCode = '70';
        deliveryServiceTypeFound.minWeight = 2;
        deliveryServiceTypeFound.maxWeight = 25;
        deliveryServiceTypeFound.maxLength = 13;
        deliveryServiceTypeFound.maxWidth = 44;
        deliveryServiceTypeFound.maxHeight = 5;
        deliveryServiceTypeFound.isForeign = false;
        deliveryServiceTypeFound.deliveryServiceId = 1;

        const deliveryServiceFound = new DeliveryService();
        deliveryServiceFound.deliveryAccount = '000000';
        deliveryServiceFound.deliveryPassword = 'lAbeL_K_11';
        deliveryServiceFound.deliveryUser = 'prueba1';
        deliveryServiceFound.deliveryOptions = '{"customerNumber": "0000000","suscriberId":28}';
        deliveryServiceFound.shipmentRequestApiUrl = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';
        deliveryServiceFound.name = 'Estafeta';
        deliveryServiceFound.id = 1;
        deliveryServiceFound.tenantId = 54321;
        deliveryServiceTypeFound.deliveryService = deliveryServiceFound;
        waybillRequestImplementationNotFound.deliveryServiceType = deliveryServiceTypeFound;
        waybillRequestImplementationNotFound.statusId = 5;
        waybillRequestRepoMock.one = waybillRequestImplementationNotFound;

        try {
            await generateWaybillService.generateWaybills(1, 54321);
        } catch (error) {
            expect(error.message).toBe(
                new GenericBussinessLogicError('Status must be on Waiting status to generate waybill').message);
            done();
        }
    });

    test('generateWaybills should thrown an error invalid string to estafeta', async (done) => {
        const log = new LogMock();
        const waybillRequestRepoMock = new WaybillRequestRepositoryMock();
        const waybillBalanceRequestRepoMock = new WaybillBalanceRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillRequestImplementationNotFound = waybillRequestRepo;
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const estafetaService = new EstafetaService(log);
        const waybillBalance = new WaybillBalanceRequest();
        waybillBalance.id = 1;
        waybillBalance.paymentType = 'PREPAGO';
        waybillBalance.tenantId = TENANT_ID;
        waybillBalance.requestedQuantity = 10;
        waybillBalance.acceptedQuantity = 10;
        waybillBalance.approvalPersonId = 1;
        waybillBalance.requestedPersonId = 1;
        waybillBalance.deliveryServiceTypeId = 3;
        waybillBalanceRequestRepoMock.one = waybillBalance;
        const waybillBalanceService = new WaybillBalanceRequestService(waybillBalanceRequestRepoMock as any, log);
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(waybillRequestRepoMock as any, log, waybillDetailService, deliveryServiceTypeService);
        const generateWaybillService = new GenerateWaybillService(waybillRequestRepoMock as any, waybillRequestService, dhlApiService,
            estafetaService, waybillBalanceService);
        const deliveryServiceTypeFound = new DeliveryServiceType();
        deliveryServiceTypeFound.id = 4;
        deliveryServiceTypeFound.name = 'DOMESTIC ECONOMY SELECT';
        deliveryServiceTypeFound.description = 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)';
        deliveryServiceTypeFound.serviceCode = '70';
        deliveryServiceTypeFound.minWeight = 2;
        deliveryServiceTypeFound.maxWeight = 25;
        deliveryServiceTypeFound.maxLength = 13;
        deliveryServiceTypeFound.maxWidth = 44;
        deliveryServiceTypeFound.maxHeight = 5;
        deliveryServiceTypeFound.isForeign = false;
        deliveryServiceTypeFound.deliveryServiceId = 1;

        const deliveryServiceFound = new DeliveryService();
        deliveryServiceFound.deliveryAccount = '000000';
        deliveryServiceFound.deliveryPassword = 'lAbeL_K_1';
        deliveryServiceFound.deliveryUser = 'prueba1';
        deliveryServiceFound.deliveryOptions = '{"customerNumber": "0000000","suscriberId":28, "officeNum": 130}';
        deliveryServiceFound.shipmentRequestApiUrl = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';
        deliveryServiceFound.name = 'Estafeta';
        deliveryServiceFound.id = 1;
        deliveryServiceFound.tenantId = 54321;
        deliveryServiceTypeFound.deliveryService = deliveryServiceFound;
        waybillRequestImplementationNotFound.deliveryServiceType = deliveryServiceTypeFound;
        waybillRequestImplementationNotFound.statusId = 4;
        waybillRequestRepoMock.one = waybillRequestImplementationNotFound;

        try {
            await generateWaybillService.generateWaybills(1, 54321);
        } catch (error) {
            expect(error.message).toBe(
                new GenericBussinessLogicError('El usuario, suscriberid o password son incorrectos, por favor verifique').message);
            done();
        }
    });

    test('generateWaybills should thrown an error for not enough credits to perform request', async (done) => {
        const log = new LogMock();
        const waybillRequestRepoMock = new WaybillRequestRepositoryMock();
        const waybillBalanceRequestRepoMock = new WaybillBalanceRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillRequestImplementationNotFound = waybillRequestRepo;
        const hashService = new HashService();
        const dhlApiService = new DHLApiService(hashService, log);
        const estafetaService = new EstafetaService(log);
        const waybillBalance = new WaybillBalanceRequest();
        waybillBalance.id = 1;
        waybillBalance.paymentType = 'PREPAGO';
        waybillBalance.tenantId = TENANT_ID;
        waybillBalance.requestedQuantity = 10;
        waybillBalance.acceptedQuantity = 0;
        waybillBalance.approvalPersonId = 1;
        waybillBalance.requestedPersonId = 1;
        waybillBalance.deliveryServiceTypeId = 3;
        waybillBalanceRequestRepoMock.one = waybillBalance;
        const deliveryServiceFound = new DeliveryService();
        deliveryServiceFound.deliveryAccount = '980129458';
        deliveryServiceFound.deliveryPassword = 'B#3zV!1zE#4d';
        deliveryServiceFound.deliveryUser = 'medistiklogmx';
        deliveryServiceFound.shipmentRequestApiUrl = 'https://wsbexpress.dhl.com/rest/sndpt/ShipmentRequest';
        deliveryServiceFound.name = 'DHL';
        deliveryServiceFound.id = 1;
        deliveryServiceFound.tenantId = 54321;
        const deliveryServiceTypeFound = new DeliveryServiceType();
        deliveryServiceTypeFound.deliveryService = deliveryServiceFound;
        waybillRequestImplementationNotFound.deliveryServiceType = deliveryServiceTypeFound;
        waybillRequestImplementationNotFound.statusId = 4;
        waybillRequestImplementationNotFound.requestedQuantity = 11;
        waybillRequestRepoMock.one = waybillRequestImplementationNotFound;
        const waybillBalanceService = new WaybillBalanceRequestService(waybillBalanceRequestRepoMock as any, log);
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(waybillRequestRepoMock as any, log, waybillDetailService, deliveryServiceTypeService);
        const generateWaybillService = new GenerateWaybillService(waybillRequestRepoMock as any, waybillRequestService, dhlApiService,
            estafetaService, waybillBalanceService);

        deliveryServiceTypeFound.id = 4;
        deliveryServiceTypeFound.name = 'DOMESTIC ECONOMY SELECT';
        // tslint:disable-next-line:max-line-length
        deliveryServiceTypeFound.description = 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)';
        deliveryServiceTypeFound.serviceCode = 'G';
        deliveryServiceTypeFound.minWeight = 2;
        deliveryServiceTypeFound.maxWeight = 25;
        deliveryServiceTypeFound.maxLength = 13;
        deliveryServiceTypeFound.maxWidth = 44;
        deliveryServiceTypeFound.maxHeight = 5;
        deliveryServiceTypeFound.isForeign = false;
        deliveryServiceTypeFound.deliveryServiceId = 1;

        try {
            await generateWaybillService.generateWaybills(1, 54321);
        } catch (error) {
            expect(error.message).toBe(
                new GenericBussinessLogicError(
                    `Client with id 999 in tenant 54321 does not have credit for deliveryService `
                    + ` DOMESTIC ECONOMY SELECT needed 11 more waybill credits`)
                    .message);
            done();
        }
    });

});
