import { DeliveryService } from '../../../src/api/models/DeliveryService/DeliveryService';
import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';
import { GenericNotFoundError } from '../../../src/api/errors/Generic/generic-notFound.error';
import { LogMock } from '../lib/log.mock';
import { PaginatedBody } from '../../../src/api/types/PaginatedBody/paginated-body.class';
import { WaybillBalanceRequest } from '../../../src/api/models/WaybillBalanceRequest/WaybillBalanceRequest';
import { WaybillBalanceRequestAddComment } from '../../../src/api/types/WaybillBalance/waybill-balance-add-comment.class';
import { WaybillBalanceRequestFilterParams } from '../../../src/api/types/WaybillBalanceRequestFilterParams/waybill-balance-request-filter-params.class';
import { WaybillBalanceRequestRepositoryMock } from '../lib/waybill-balance-request.repository.mock';
import { WaybillBalanceRequestService } from '../../../src/api/services/WaybillBalanceRequest/waybill-balance-request.service';

describe('WaybillBalanceRequestService', () => {
    test('getAllWaybillBalanceRequest should return a list of all waybill', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();

        const deliveryServiceType = new DeliveryServiceType();
        const deliveryService = new DeliveryService();
        deliveryServiceType.deliveryService = deliveryService;
        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.id = 1;
        waybillBalanceRequest.tenantId = 54321;
        waybillBalanceRequest.deliveryServiceType = deliveryServiceType;

        repo.list = [waybillBalanceRequest];
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        const list = await waybillBalanceRequestService.getAllWaybillBalanceRequest(54321);
        expect(list[0].id).toBe(1);
        expect(list[0].tenantId).toBe(54321);
        done();
    });

    test('getAllWaybillBalanceRequest should thrown an GenericNotFoundError for none entities found', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();

        repo.list = [];
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        try {
            await waybillBalanceRequestService.getAllWaybillBalanceRequest(54321);
        } catch (error) {
            expect(error.message).toBe(new GenericNotFoundError(WaybillBalanceRequest.name, undefined).message);
            done();
        }
    });

    test('getWaybillBalanceRequestPaginatedAndParams should return waybill balance request paginated', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();

        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.tenantId = 54321;
        waybillBalanceRequest.requestedPersonId = 999;
        waybillBalanceRequest.paymentType = 'CONSUMO';
        waybillBalanceRequest.statusId = 3;
        waybillBalanceRequest.deliveryServiceTypeId = 2;
        waybillBalanceRequest.requestedQuantity = 10;

        const filterParams = new WaybillBalanceRequestFilterParams();
        filterParams.requestedQuantity = '10';
        filterParams.deliveryServiceType = '';
        filterParams.deliveryService = '';
        filterParams.requestedBy = '';
        filterParams.waybillBalanceRequestId = '';
        filterParams.acceptedQuantity = '';
        filterParams.approvalPersonIds = [1, 2, 3];
        filterParams.clientIds = [1, 2, 3];
        filterParams.warehouseIds = [1, 2 , 4];
        filterParams.updatedDate = '';
        filterParams.timezoneClient = '-05:00';

        const paginatedBody = new PaginatedBody<WaybillBalanceRequestFilterParams>();
        paginatedBody.tenantId = 54321;
        paginatedBody.offset = 1;
        paginatedBody.pageNumber = 0;
        paginatedBody.searchBy = filterParams;

        repo.list = [waybillBalanceRequest];
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        const waybillBalanceRequestsFound = await waybillBalanceRequestService.getAllWaybillBalanceRequestByPaginatedAndParams(paginatedBody);
        expect(waybillBalanceRequestsFound.length).toBe(1);
        expect(waybillBalanceRequestsFound[0].tenantId).toBe(54321);

        done();
    });

    test('createWaybillBalanceRequest should return the created WaybillBalanceRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();
        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.requestedQuantity = 10;
        waybillBalanceRequest.requestedPersonId = 30;
        waybillBalanceRequest.paymentType = 'PREPAGO';
        waybillBalanceRequest.deliveryServiceTypeId = 1;
        waybillBalanceRequest.warehouseId = 200;
        waybillBalanceRequest.statusId = 3;
        repo.list = [];
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        const waybillBalanceRequestServiceCreated = await waybillBalanceRequestService.createWaybillBalanceRequest(waybillBalanceRequest);
        expect(waybillBalanceRequestServiceCreated).toBeDefined();
        done();
    });

    test('getWaybillBalanceRequestByIdAndTenant should return one waybillBalanceRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();

        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.id = 1;
        waybillBalanceRequest.tenantId = 54321;
        repo.one = waybillBalanceRequest;
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        const deliveryServiceFound = await waybillBalanceRequestService.getWaybillBalanceRequestByIdAndTenant(1, 54321);
        expect(deliveryServiceFound.id).toBe(1);
        expect(deliveryServiceFound.tenantId).toBe(54321);
        done();
    });

    test('updateWaybillBalanceRequest should return the updated waybillBalanceRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();

        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.id = 1;
        waybillBalanceRequest.requestedQuantity = 10;
        waybillBalanceRequest.requestedPersonId = 30;
        waybillBalanceRequest.paymentType = 'PREPAGO';
        waybillBalanceRequest.deliveryServiceTypeId = 1;
        waybillBalanceRequest.statusId = 3;
        waybillBalanceRequest.tenantId = 54321;
        waybillBalanceRequest.warehouseId = 201;
        repo.one = waybillBalanceRequest;
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);

        const newWaybillBalanceRequestValues = new WaybillBalanceRequest();
        newWaybillBalanceRequestValues.id = 1;
        newWaybillBalanceRequestValues.requestedQuantity = 30;
        newWaybillBalanceRequestValues.requestedPersonId = 30;
        newWaybillBalanceRequestValues.paymentType = 'PREPAGO';
        newWaybillBalanceRequestValues.deliveryServiceTypeId = 1;
        newWaybillBalanceRequestValues.statusId = 3;
        newWaybillBalanceRequestValues.tenantId = 54321;
        newWaybillBalanceRequestValues.warehouseId = 202;
        await waybillBalanceRequestService.updateWaybillBalanceRequest(1, newWaybillBalanceRequestValues, 54321);
        expect(waybillBalanceRequest).toBeDefined();
        done();
    });

    test('acceptWaybillBalanceRequest should return the accepted waybillBalanceRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();

        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.id = 1;
        waybillBalanceRequest.requestedQuantity = 10;
        waybillBalanceRequest.requestedPersonId = 30;
        waybillBalanceRequest.paymentType = 'PREPAGO';
        waybillBalanceRequest.deliveryServiceTypeId = 1;
        waybillBalanceRequest.statusId = WaybillBalanceRequest.WAITING_STATUS_ID;
        waybillBalanceRequest.tenantId = 54321;
        repo.one = waybillBalanceRequest;
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        const waybillBalanceAddComment: WaybillBalanceRequestAddComment = {
            reason: 'Aceptada sin problema',
            approvalPersonId: 1,
            acceptedQuantity: 2,
        };
        const acceptedWaybillBalanceRequest = await waybillBalanceRequestService.acceptWaybillBalanceRequest(1, 54321, waybillBalanceAddComment);
        expect(acceptedWaybillBalanceRequest).toBeDefined();
        done();
    });

    test('rejectWaybillBalanceRequest should return the rejected waybillBalanceRequest', async (done) => {
        const log = new LogMock();
        const repo = new WaybillBalanceRequestRepositoryMock();
        const waybillBalanceRequest = new WaybillBalanceRequest();
        waybillBalanceRequest.id = 1;
        waybillBalanceRequest.requestedQuantity = 10;
        waybillBalanceRequest.requestedPersonId = 30;
        waybillBalanceRequest.paymentType = 'PREPAGO';
        waybillBalanceRequest.deliveryServiceTypeId = 1;
        waybillBalanceRequest.statusId = WaybillBalanceRequest.WAITING_STATUS_ID;
        waybillBalanceRequest.tenantId = 54321;
        repo.one = waybillBalanceRequest;
        const waybillBalanceRequestService = new WaybillBalanceRequestService(repo as any, log);
        const waybillBalanceAddComment: WaybillBalanceRequestAddComment = {
            reason: 'No ha pagado puntualmente',
            approvalPersonId: 1,
            acceptedQuantity: 3,
        };
        const rejectedWaybillBalanceRequest = await waybillBalanceRequestService.rejectWaybillBalanceRequest(1, 54321, waybillBalanceAddComment);
        expect(rejectedWaybillBalanceRequest).toBeDefined();
        done();
    });
});
