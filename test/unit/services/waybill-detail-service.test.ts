import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';
import { LogMock } from '../lib/log.mock';
import { WaybillDetail } from '../../../src/api/models/WaybillDetail/WaybillDetail';
import { WaybillDetailRepositoryMock } from '../lib/waybill-detail.repositoy.mock';
import { WaybillDetailService } from '../../../src/api/services/WaybillDetail/waybill-detail.service';
import { WaybillRequest } from '../../../src/api/models/WaybillRequest/WaybillRequest';

describe('WaybillDetailService test', () => {

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

    test('getWaybillDetailsByRequestId', async (done) => {
        const log = new LogMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [waybillDetail];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const waybillDetailListFound = await waybillDetailService.getWaybillDetailsByRequestId(1);
        expect(waybillDetailListFound[0].id).toBe(1001);
        done();
    });

    test('getWaybillDetailsByRequestId to be empty', async (done) => {
        const log = new LogMock();
        const waybillDetailRepo = new WaybillDetailRepositoryMock();
        waybillDetailRepo.list = [];
        const waybillDetailService = new WaybillDetailService(log, waybillDetailRepo as any);
        const waybillDetailListFound = await waybillDetailService.getWaybillDetailsByRequestId(1);
        expect(waybillDetailListFound).toBeDefined();
        done();
    });

});
