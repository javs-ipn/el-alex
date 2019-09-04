import { DeliveryService } from '../../../src/api/models/DeliveryService/DeliveryService';
import { RepositoryMock } from './repository.mock';
import { UpdateResult } from 'typeorm';

export class DeliveryServiceRepositoryMock extends RepositoryMock<DeliveryService> {

    public findAllMock = jest.fn();
    public getDeliveryServiceMock = jest.fn();
    public getDeliveryServiceByIdAndTenantMock = jest.fn();
    public createDeliveryServiceMock = jest.fn();
    public updateServiceMock = jest.fn();
    public deleteServiceMock = jest.fn();
    public getDeliveryServiceByNameMock = jest.fn();

    public findAll(...args: any[]): Promise<DeliveryService[]> {
        this.findAllMock(args);
        return this.find(args);
    }
    public getDeliveryService(id: number): Promise<DeliveryService> {
        return this.findOne(id);
    }
    public getDeliveryServiceByIdAndTenant(deliveryServiceId: number, tenant: number): Promise<DeliveryService> {
        return this.findOne(deliveryServiceId, tenant);
    }
    public createDeliveryService(deliveryService: DeliveryService): Promise<DeliveryService> {
        return this.save(deliveryService);
    }
    public updateDeliveryService(deliveryServiceId: number, deliveryService: DeliveryService): Promise<DeliveryService> {
        return this.updateServiceMock(deliveryServiceId, deliveryService);
    }
    public deleteDeliveryService(deliveryServiceId: number, tenantId: number): Promise<UpdateResult> {
        return this.softDelete(deliveryServiceId, tenantId);
    }
    public getDeliveryServiceByName(deliveryServiceName: string, tenantId: number): Promise<DeliveryService> {
        return this.findOne(deliveryServiceName, tenantId);
    }

}
