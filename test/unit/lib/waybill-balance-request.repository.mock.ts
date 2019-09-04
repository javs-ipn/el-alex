import { RepositoryMock } from './repository.mock';
import { WaybillBalanceRequest } from '../../../src/api/models/WaybillBalanceRequest/WaybillBalanceRequest';
import { PaginatedBody } from '../../../src/api/types/PaginatedBody/paginated-body.class';
import { WaybillBalanceRequestFilterParams } from 'src/api/types/WaybillBalanceRequestFilterParams/waybill-balance-request-filter-params.class';

export class WaybillBalanceRequestRepositoryMock extends RepositoryMock<WaybillBalanceRequest> {

    public getAllWaybillBalanceRequestMock = jest.fn();
    public findByPaginatedAndParamsMock = jest.fn();

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

    public getAllWaybillBalanceRequest(...args: any[]): Promise<WaybillBalanceRequest[]> {
        this.getAllWaybillBalanceRequestMock(args);
        return this.find(args);
    }
    public createWaybillBalanceRequest(waybillBalanceRequest: WaybillBalanceRequest): Promise<WaybillBalanceRequest> {
        return this.save(waybillBalanceRequest);
    }

    public getWaybillBalanceRequestByIdAndTenant(waybillBalanceRequestId: number, tenant: number): Promise<WaybillBalanceRequest> {
        return this.findOne(waybillBalanceRequestId, tenant);
    }

    public findByPaginatedAndParams(paginatedBody: PaginatedBody<WaybillBalanceRequestFilterParams>): Promise<WaybillBalanceRequest[]> {
        this.findByPaginatedAndParamsMock(paginatedBody);
        return Promise.resolve(this.list);
    }

    public getApprovedWaybillByServiceType(deliveryServiceTypeId: number, clientId: number, tenantId: number, paymentType: string): Promise<number> {
        const acceptedQuantity = this.one.acceptedQuantity;
        return Promise.resolve(acceptedQuantity);
    }

}
