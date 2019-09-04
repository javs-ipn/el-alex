import { RepositoryMock } from './repository.mock';
import { DeliveryServiceType } from '../../../src/api/models/DeliveryServiceType/DeliveryServiceType';

export class DeliveryServiceTypeRepositoryMock extends RepositoryMock<DeliveryService> {

    public findAllMock = jest.fn();
    public getDeliveryServiceTypeMock = jest.fn();
    public getDeliveryServiceTypeByIdMock = jest.fn();
    public findOneByNameMock = jest.fn();
    public findByIdMock = jest.fn();
    public createQueryBuilderMock = jest.fn( () => ({
        leftJoinAndMapMany: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnThis(),
    }));

    public findAllByTenantId(tenantId: number): Promise<DeliveryServiceType[]> {
        this.createQueryBuilderMock();
        return this.find(Promise.resolve(this.list));
    }

    public findAll(...args: any[]): Promise<DeliveryServiceType[]> {
        this.findAllMock(args);
        return this.find(Promise.resolve(this.list));
    }

    public getDeliveryServiceType(): Promise<DeliveryServiceType[]> {
        this.getDeliveryServiceTypeMock();
        return this.find();
    }

    public findById(id: number): Promise<DeliveryServiceType> {
        this.findByIdMock(id);
        return this.findOne(Promise.resolve(this.one));
    }

    public findOneByName(name: string): Promise<DeliveryServiceType> {
        this.findOneByNameMock(name);
        return this.findOne(name);
    }
}
