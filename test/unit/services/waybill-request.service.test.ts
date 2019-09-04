import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';
import { DeliveryServiceTypeRepositoryMock } from '../lib/delivery-service-type.repository.mock';
import { DeliveryServiceTypeService } from '../../../src/api/services/DeliveryServicetype/delivery-service-type.service';
import { LogMock } from '../lib/log.mock';
import { PaginatedBody } from '../../../src/api/types/PaginatedBody/paginated-body.class';
import { WaybillDetail } from '../../../src/api/models/WaybillDetail/WaybillDetail';
import { WaybillDetailService } from '../../../src/api/services/WaybillDetail/waybill-detail.service';
import { WaybillRequest } from '../../../src/api/models/WaybillRequest/WaybillRequest';
import { WaybillRequestFilterParams } from '../../../src/api/types/WaybillRequestFilterParams/waybill-request-filter-params.class';
import { WaybillRequestGenericObject } from '../../../src/api/types/WaybillRequestGenericObject/waybill-request-generic-object.class';
import { WaybillRequestRepositoryMock } from '../lib/waybill-request.repository.mock';
import { WaybillRequestService } from '../../../src/api/services/WaybillRequest/waybill-request.service';
import { WaybillDetailRepositoryMock } from '../lib/waybill-detail.repositoy.mock';

describe('Waybill Request test', () => {

    const TENANT_ID = 54321;
    const paymentType = 'consumo';
    const watingStatusId = 2;
    const max = 20;
    const min = 1;
    const waybillRequestList: WaybillRequest[] = [];
    let deliveryServiceType: DeliveryServiceType;
    let waybillDetail: WaybillDetail;
    let waybillRequestRepo: WaybillRequest;

    beforeAll(() => {
        const elementsNumber = 4;
        for (let i = 1; i <= elementsNumber; i++) {
            const waybillRequest = new WaybillRequest();
            waybillRequest.id = i;
            waybillRequest.tenantId = TENANT_ID;
            waybillRequest.clientId = 1;
            waybillRequest.clientId = 2;
            waybillRequest.requestedQuantity = Math.round(Math.random() * (max - min) + min);
            waybillRequest.paymentType = paymentType;
            waybillRequest.statusId = watingStatusId;
            waybillRequest.created = new Date();
            waybillRequest.updated = new Date();
            waybillRequest.deliveryServiceTypeId = 4;
            waybillRequestList.push(waybillRequest);
        }

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
        waybillRequestRepo.id = 78;
        waybillRequestRepo.clientId = 999;
        waybillRequestRepo.tenantId = 54321;
        waybillRequestRepo.requestedQuantity = 1;
        waybillRequestRepo.paymentType = 'PREGAGO';
        waybillRequestRepo.updated = new Date();
        waybillRequestRepo.created = new Date();
        waybillRequestRepo.statusId = 4;
        waybillRequestRepo.deliveryServiceTypeId = 4;
        waybillRequestRepo.waybillDetails = [waybillDetail];
    });

    test('findAllByTenantId', async (done) => {
        const log = new LogMock();
        const repo = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.one = waybillDetail;
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(repo as any, log, waybillDetailService, deliveryServiceTypeService);
        repo.list = waybillRequestList;
        const waybillRequestListFount = await waybillRequestService.getAllWaybillRequestsByTenantId(TENANT_ID);
        expect(waybillRequestListFount[0].tenantId).toBe(TENANT_ID);
        done();
    });

    test('findByPaginatedAndParams', async (done) => {
        const log = new LogMock();
        const repo = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.one = waybillDetail;
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(repo as any, log, waybillDetailService, deliveryServiceTypeService);
        repo.list = waybillRequestList;
        const filters = new WaybillRequestFilterParams();
        filters.deliveryService = 'esta';
        filters.warehouseIds = [];
        filters.clientIds = [];
        filters.timezoneClient = '-06:00';
        const bodyParams = new PaginatedBody<WaybillRequestFilterParams>();
        bodyParams.tenantId = TENANT_ID,
            bodyParams.offset = 2,
            bodyParams.pageNumber = 0,
            bodyParams.searchBy = filters;
        const waybillRequestListFount = await waybillRequestService.getWaybillRequestsByPaginatedAndParams(bodyParams);
        expect(waybillRequestListFount.length).toBeGreaterThanOrEqual(2);
        done();
    });

    test('findByIdAndTenantId', async (done) => {
        const log = new LogMock();
        const repo = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.one = waybillDetail;
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(repo as any, log, waybillDetailService, deliveryServiceTypeService);
        const waybillId = 1;
        repo.one = waybillRequestList[0];
        const waybillRequestFound = await waybillRequestService.getWaybillRequestByIdAndTenantId(waybillId, TENANT_ID);
        expect(waybillRequestFound.tenantId).toBe(TENANT_ID);
        expect(waybillRequestFound.id).toBe(waybillId);
        done();
    });

    test('saveWaybillRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.one = waybillDetail;
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(repo as any, log, waybillDetailService, deliveryServiceTypeService);
        const waybillRequestNew: WaybillRequestGenericObject = {
            tenantId: 54321,
            clientId: 999,
            updateClientId: 999,
            warehouseId: 2,
            deliveryServiceId: 1,
            deliveryServiceTypeId: 1,
            paymentType: 'consumo',
            packageType: 'PAQUETE',
            requestedLabels: 4,
            contentDescription: 'example request',
            isInsured: false,
            waybillPerBox: false,
            paperType: 'LASER',
            shipper: {
                countryCode: 'MX',
                countryCurrencyCode: 'MXN',
                referenceAddress: 'SOMETHING',
                secondaryAddress: 'SOMETHING',
                name: 'Adams',
                corporateName: 'example company',
                phoneNumber: '55555555',
                email: '',
                fullAddress: 'Barranca del Muerto 329, San José Insurgentes',
                streetName: '',
                streetNumber: '',
                betweenStreet: 'string',
                city: 'CDMX',
                zipcode: '03900',
                neighborhood: 'Polanco',
                isForeign: false,
                neighborhoodId: 3,
                cityId: 2,
            },
            recipient: {
                countryCode: 'MX',
                countryCurrencyCode: 'MXN',
                referenceAddress: 'SOMETHING',
                secondaryAddress: 'SOMETHING',
                name: 'Example person contac',
                corporateName: 'example company',
                phoneNumber: '8765434567',
                email: 'recipient@mail.com',
                fullAddress: 'Calle Montes Urales 470, Lomas - Virreyes, Lomas de Chapultepec,  Ciudad de México, CDMX',
                streetName: '',
                streetNumber: '',
                betweenStreet: 'string',
                city: 'CDMX',
                zipcode: '11000',
                neighborhood: 'Polanco',
                isForeign: false,
                neighborhoodId: 3,
                cityId: 2,
            },
            dimensions: {
                height: 5,
                width: 10,
                length: 10,
                weight: 5,
            },
        };
        repo.one = waybillRequestRepo;
        deliveryServiceTypeRepo.one = deliveryServiceType;
        const waybillRequestSave = await waybillRequestService.saveWaybillRequest(waybillRequestNew);
        expect(waybillRequestSave).not.toBeNull();
        done();
    });

    test('updateWaybillRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.one = waybillDetail;
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(repo as any, log, waybillDetailService, deliveryServiceTypeService);
        const waybillRequestId = 1;
        const waybillRequestGenericObject: WaybillRequestGenericObject = {
            tenantId: 54321,
            warehouseId: 2,
            clientId: 999,
            updateClientId: 998,
            deliveryServiceId: 1,
            deliveryServiceTypeId: 1,
            paymentType: 'consumo',
            packageType: 'PAQUETE',
            requestedLabels: 4,
            contentDescription: 'example request',
            isInsured: true,
            insuredAmount: 1000,
            waybillPerBox: false,
            paperType: 'LASER',
            shipper: {
                countryCode: 'MX',
                countryCurrencyCode: 'MXN',
                referenceAddress: 'SOMETHING',
                secondaryAddress: 'SOMETHING',
                name: 'Adams',
                corporateName: 'example company',
                phoneNumber: '55555555',
                email: '',
                fullAddress: 'Barranca del Muerto 329, San José Insurgentes',
                streetName: '',
                streetNumber: '',
                betweenStreet: 'string',
                city: 'CDMX',
                zipcode: '04888',
                neighborhood: 'Polanco',
                isForeign: false,
                neighborhoodId: 3,
                cityId: 2,

            },
            recipient: {
                countryCode: 'MX',
                countryCurrencyCode: 'MXN',
                referenceAddress: 'SOMETHING',
                secondaryAddress: 'SOMETHING',
                name: 'Example person contac',
                corporateName: 'example company',
                phoneNumber: '8765434567',
                email: 'recipient@mail.com',
                fullAddress: 'Calle Montes Urales 470, Lomas - Virreyes, Lomas de Chapultepec,  Ciudad de México, CDMX',
                streetName: '',
                streetNumber: '',
                betweenStreet: 'string',
                city: 'CDMX',
                zipcode: '11000',
                neighborhood: 'Polanco',
                isForeign: false,
                neighborhoodId: 3,
                cityId: 2,
            },
            dimensions: {
                height: 5,
                width: 10,
                length: 10,
                weight: 5,
            },
        };
        repo.one = waybillRequestRepo;
        deliveryServiceTypeRepo.one = deliveryServiceType;
        const waybillRequestUpdated = await waybillRequestService.updateWaybillRequest(waybillRequestGenericObject, waybillRequestId, TENANT_ID);
        expect(waybillRequestUpdated).not.toBeNull();
        done();
    });

    test('deleteWaybillRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillRequestRepositoryMock();
        const deliveryServiceTypeRepo = new DeliveryServiceTypeRepositoryMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.one = waybillDetail;
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const deliveryServiceTypeService = new DeliveryServiceTypeService(deliveryServiceTypeRepo as any, log);
        const waybillRequestService = new WaybillRequestService(repo as any, log, waybillDetailService, deliveryServiceTypeService);
        const waybillRequestIdToDelete = 78;
        repo.one = waybillRequestRepo;
        const waybillRequestDeleted = await waybillRequestService.deleteWaybillRequest(waybillRequestIdToDelete, TENANT_ID);
        expect(waybillRequestDeleted.id).toBe(78);
        done();
    });

});
