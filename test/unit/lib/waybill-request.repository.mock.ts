import { WaybillRequest } from '../../../src/api/models/WaybillRequest/WaybillRequest';
import { RepositoryMock } from './repository.mock';

export class WaybillRequestRepositoryMock extends RepositoryMock<WaybillRequest> {

    public findMock = jest.fn();
    public findAllMock = jest.fn();
    public findOneMock = jest.fn();
    public findOneByIdMock = jest.fn();
    public softDeleteMock = jest.fn();
    public saveMock = jest.fn();
    public updateMock = jest.fn();
    public deleteMock = jest.fn();
    public deleteByIdMock = jest.fn();
    public findOneByIdAndTenantIdMock = jest.fn();
    public findByPaginatedAndParamsMock = jest.fn();
    public saveWaybillRequestMock = jest.fn();
    public updateWaybillRequestMock = jest.fn();
    public deleteWaybillRequestMock = jest.fn();
    public getAllWaybillRequestsByTenantId = jest.fn();
    public getWaybillRequestsByPaginatedAndParams = jest.fn();
    public getWaybillRequestByIdAndTenantId = jest.fn();
    public updateGeneratedWaybillMock = jest.fn();

    public createQueryBuilder = jest.fn(() => ({
        leftJoinAndMapOne: jest.fn().mockReturnThis(),
        leftJoinAndMapMany: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnThis(),
    }));

    public find(...args: any[]): Promise<WaybillRequest[]> {
        this.findMock(args);
        return Promise.resolve(this.list);
    }
    public findAll(...args: any[]): Promise<WaybillRequest[]> {
        this.findAllMock(args);
        return Promise.resolve(this.list);
    }
    public findOneById(...args: any[]): Promise<WaybillRequest> {
        this.findOneByIdMock(args);
        return Promise.resolve(this.one);
    }

    public findAllByTenant(...args: any[]): Promise<WaybillRequest[]> {
        this.findAllMock(args);
        return Promise.resolve(this.list);
    }

    public findAllByPaginatedAndParams(...args: any[]): Promise<WaybillRequest[]> {
        this.getWaybillRequestsByPaginatedAndParams(args);
        return Promise.resolve(this.list);
    }

    public findOneByIdAndTenantId(waybillRequestId: number, tenantId: number): Promise<WaybillRequest> {
        this.findOneByIdAndTenantIdMock(waybillRequestId, tenantId);
        return Promise.resolve(this.one);
    }

    public findByPaginatedAndParams(options: any): Promise<WaybillRequest[]> {
        this.findByPaginatedAndParamsMock(options);
        return Promise.resolve(this.list);
    }

    public saveWaybillRequest(waybillRequestToSave: WaybillRequest): Promise<WaybillRequest> {
        this.saveWaybillRequestMock(waybillRequestToSave);
        return Promise.resolve(this.one);
    }

    public updateWaybillRequest(waybillRequestId: number, waybillRequestToUpdate: WaybillRequest): Promise<WaybillRequest> {
        this.updateWaybillRequestMock(waybillRequestId, waybillRequestToUpdate);
        return Promise.resolve(this.one);
    }

    public deleteWaybillRequest(waybillRequestId: number): Promise<WaybillRequest> {
        this.deleteWaybillRequestMock(waybillRequestId);
        return Promise.resolve(this.one);
    }
    public updateGeneratedWaybill(waybillRequest: WaybillRequest): Promise<WaybillRequest> {
        this.updateGeneratedWaybillMock(waybillRequest);
        return Promise.resolve(this.one);
    }

    public getGeneratedWaybillByServiceType(deliveryServiceTypeId: number, clientId: number, tenantId: number, paymentType: string): Promise<number> {
        const generatedQuantity = this.one.requestedQuantity;
        return Promise.resolve(generatedQuantity);
    }
}
