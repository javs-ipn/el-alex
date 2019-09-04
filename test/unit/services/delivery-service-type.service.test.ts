import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';
import { DeliveryServiceTypeRepositoryMock } from '../lib/delivery-service-type.repository.mock';
import { DeliveryServiceTypeService } from '../../../src/api/services/DeliveryServicetype/delivery-service-type.service';
import { LogMock } from '../lib/log.mock';

describe('DeliveryServiceType', () => {

    test('findAllByTenantId', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceTypeRepositoryMock();
        const deliveryServiceType = new DeliveryServiceType();
        deliveryServiceType.id = 1;
        deliveryServiceType.name = 'EXPRESS DOMESTIC 8:30';
        deliveryServiceType.description = 'll';
        deliveryServiceType.serviceCode = 'N';
        deliveryServiceType.isForeign = false;
        deliveryServiceType.deliveryServiceId = 1;
        deliveryServiceType.maxLength = 0;
        deliveryServiceType.maxWidth = 0;
        deliveryServiceType.maxHeight = 0;
        deliveryServiceType.maxWeight = 30;
        deliveryServiceType.minWeight = 0;
        repo.list = [deliveryServiceType];
        const deliveryTypeService = new DeliveryServiceTypeService(repo as any, log);
        const list = await deliveryTypeService.getAllDeliveryServiceTypes(54321);
        expect(list[0].deliveryServiceId).toBe(1);
        done();

    });

    test('findOneById', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceTypeRepositoryMock();

        const deliveryServiceType = new DeliveryServiceType();
        deliveryServiceType.id = 1;
        deliveryServiceType.name = 'EXPRESS DOMESTIC 8:30';
        deliveryServiceType.description = 'll';
        deliveryServiceType.serviceCode = 'N';
        deliveryServiceType.isForeign = false;
        deliveryServiceType.deliveryServiceId = 1;
        deliveryServiceType.maxLength = 0;
        deliveryServiceType.maxWidth = 0;
        deliveryServiceType.maxHeight = 0;
        deliveryServiceType.maxWeight = 30;
        deliveryServiceType.minWeight = 0;
        repo.one = deliveryServiceType;
        const deliveryTypeService = new DeliveryServiceTypeService(repo as any, log);
        const deliveryServiceTypeFound = await deliveryTypeService.getDeliveryServiceTypeById(1);
        expect(deliveryServiceTypeFound.id).toBe(1);
        done();
    });

    test('save deliveryServiceType should return deliveryServiceType create', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceTypeRepositoryMock();
        const deliveryServiceTypeService = new DeliveryServiceTypeService(repo as any, log);
        const deliveryServiceTypeNew = new DeliveryServiceType();
        deliveryServiceTypeNew.id = 1;
        deliveryServiceTypeNew.name = 'Domestic cheaper';
        deliveryServiceTypeNew.description = 'The most cheaper';
        deliveryServiceTypeNew.serviceCode = 'DC';
        deliveryServiceTypeNew.minWeight = 1;
        deliveryServiceTypeNew.maxWeight = 1;
        deliveryServiceTypeNew.maxLength = 33;
        deliveryServiceTypeNew.maxWidth = 1;
        deliveryServiceTypeNew.maxHeight = 1;
        deliveryServiceTypeNew.deliveryServiceId = 1;
        deliveryServiceTypeNew.isForeign = false;
        const deliveryServiceTypeCreated = await deliveryServiceTypeService.saveDeliveryServiceType(deliveryServiceTypeNew);
        expect(deliveryServiceTypeCreated).toBeDefined();
        done();

    });

    test('update deliveryServiceType should return deliveryServiceType updated', async (done) => {
        const log = new LogMock();
        const repo = new DeliveryServiceTypeRepositoryMock();
        const deliveryServiceTypeService = new DeliveryServiceTypeService(repo as any, log);
        const deliveryServiceTypeId = 1;
        const deliveryServiceTypeUpdate = new DeliveryServiceType();
        deliveryServiceTypeUpdate.id = 1;
        deliveryServiceTypeUpdate.name = 'Domestic expensive';
        deliveryServiceTypeUpdate.description = 'The most expensive';
        deliveryServiceTypeUpdate.serviceCode = 'DC';
        deliveryServiceTypeUpdate.minWeight = 1;
        deliveryServiceTypeUpdate.maxWeight = 2;
        deliveryServiceTypeUpdate.maxLength = 33;
        deliveryServiceTypeUpdate.maxWidth = 3;
        deliveryServiceTypeUpdate.maxHeight = 4;
        deliveryServiceTypeUpdate.deliveryServiceId = 1;
        deliveryServiceTypeUpdate.isForeign = true;
        repo.one = deliveryServiceTypeUpdate;
        const deliveryServiceTypeCreated = await deliveryServiceTypeService.updateDeliveryServiceType(deliveryServiceTypeId, deliveryServiceTypeUpdate);
        expect(deliveryServiceTypeCreated).toBeDefined();
        done();
    });
});
