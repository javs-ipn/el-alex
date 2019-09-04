import { DeliveryService } from '../../../src/api/models/DeliveryService/DeliveryService';
import { DeliveryServiceNotFoundError } from '../../../src/api/errors/DeliveryService/delivery-service.notfound.error';
import { DeliveryServiceRepositoryMock } from '../lib/delivery-service.repository.mock';
import { DeliveryServiceService } from '../../../src/api/services/DeliveryService/delivery-service.service';
import { LogMock } from '../lib/log.mock';

describe('DeliveryServiceService', () => {
    test('getAllDeliveryServices should return a list of all delivery Services found', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();

        const deliveryService = new DeliveryService();
        deliveryService.id = 1;
        deliveryService.name = 'DHL';
        deliveryService.tenantId = 54321;
        deliveryService.description = 'A delivery service option for fast..';

        repo.list = [deliveryService];
        const deliveryServiceService = new DeliveryServiceService(repo as any, log);
        const list = await deliveryServiceService.getAllDeliveryServices(54321);
        expect(list[0].id).toBe(1);
        expect(list[0].tenantId).toBe(54321);
        done();
    });

    test('getAllDeliveryServices should thrown a DeliveryServiceNotFoundError', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();
        repo.list = undefined;
        const equipmentService = new DeliveryServiceService(repo as any, log);
        try {
            await equipmentService.getAllDeliveryServices(54321);
        } catch (error) {
            expect(error.message).toBe(new DeliveryServiceNotFoundError('No active delivery services found for tenantId = 54321').message);
        }
        done();
    });

    test('getDeliveryServiceByIdAndTenant should return one deliveryService', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();

        const deliveryService = new DeliveryService();
        deliveryService.id = 1;
        deliveryService.name = 'DHL';
        deliveryService.tenantId = 54321;
        deliveryService.description = 'A delivery service option for fast..';

        repo.one = deliveryService;
        const deliveryServiceService = new DeliveryServiceService(repo as any, log);
        const deliveryServiceFound = await deliveryServiceService.getDeliveryServiceByIdAndTenant(1, 54321);
        expect(deliveryServiceFound.id).toBe(1);
        expect(deliveryServiceFound.tenantId).toBe(54321);
        done();
    });

    test('getDeliveryServiceByIdAndTenant should throw a DeliveryServiceNotFoundError', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();
        repo.one = undefined;
        const equipmentService = new DeliveryServiceService(repo as any, log);
        try {
            await equipmentService.getDeliveryServiceByIdAndTenant(1, 54321);
        } catch (error) {
            expect(error.message).toBe(new DeliveryServiceNotFoundError('No active delivery services found for id = 1 tenantId = 54321').message);
        }
        done();
    });

    test('createDeliveryService should return the created deliveryService', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();

        const deliveryService = new DeliveryService();
        deliveryService.name = 'New delivery Service 1';
        deliveryService.tenantId = 54321;
        deliveryService.description = 'Just another description';
        deliveryService.deliveryAccount = 'account';
        deliveryService.deliveryPassword = 'password';
        deliveryService.shipmentRequestApiUrl = 'http://something';
        deliveryService.deliveryUser = 'user';
        deliveryService.isActive = true;
        repo.list = [];
        const deliveryServiceService = new DeliveryServiceService(repo as any, log);
        const deliveryServiceCreated = await deliveryServiceService.createDeliveryService(deliveryService);
        expect(deliveryServiceCreated).toBeDefined();
        done();
    });

    test('updateDeliveryService should return the updated deliveryService', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();

        const deliveryService = new DeliveryService();
        deliveryService.id = 1;
        deliveryService.name = 'DHL Express';
        deliveryService.tenantId = 54321;
        deliveryService.description = 'New description';
        deliveryService.shipmentRequestApiUrl = 'http://something';
        repo.one = deliveryService;
        const deliveryServiceService = new DeliveryServiceService(repo as any, log);

        const newDeliveryServiceValues = new DeliveryService();
        newDeliveryServiceValues.tenantId = 54321;
        newDeliveryServiceValues.name = 'DHL Express';
        newDeliveryServiceValues.description = 'New description';
        newDeliveryServiceValues.deliveryAccount = 'account';
        newDeliveryServiceValues.deliveryPassword = 'password';
        deliveryService.shipmentRequestApiUrl = 'http://something';
        newDeliveryServiceValues.deliveryUser = 'user';
        newDeliveryServiceValues.isActive = true;
        await deliveryServiceService.updateDeliveryService(1, newDeliveryServiceValues, 54321);
        expect(deliveryService).toBeDefined();
        done();
    });

    test('deleteDeliveryService should return UpdateResult', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();

        const deliveryService = new DeliveryService();
        deliveryService.id = 1;
        deliveryService.name = 'DHL Express';
        deliveryService.tenantId = 54321;
        deliveryService.shipmentRequestApiUrl = 'http://something';
        repo.one = deliveryService;
        const deliveryServiceService = new DeliveryServiceService(repo as any, log);
        const deletedService = await deliveryServiceService.deleteDeliveryService(1, 54321);
        expect(deletedService).toBeDefined();
        done();
    });

    test('getDeliveryServiceByName should return delivery Service found with matching name', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceRepositoryMock();

        const deliveryService = new DeliveryService();
        deliveryService.id = 1;
        deliveryService.name = 'DHL';
        deliveryService.tenantId = 54321;
        deliveryService.shipmentRequestApiUrl = 'http://something';
        deliveryService.description = 'A delivery service option for fast..';

        repo.one = deliveryService;
        const deliveryServiceService = new DeliveryServiceService(repo as any, log);
        const deliveryServiceFound = await deliveryServiceService.getDeliveryServiceByName('DHL', 54321);
        expect(deliveryServiceFound.name).toBe('DHL');
        done();
    });

});
