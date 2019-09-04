import { RepositoryMock } from './repository.mock';
import { WaybillDetail } from '../../../src/api/models/WaybillDetail/WaybillDetail';

export class WaybillDetailRepositoryMock extends RepositoryMock<WaybillDetail> {

    public getWaybillDetailsByRequestIdMock = jest.fn();

    public async getWaybillDetailsByRequestId(waybillRequestIdValue: number): Promise<WaybillDetail[]> {
        this.getWaybillDetailsByRequestIdMock(waybillRequestIdValue);
        return this.list;
    }
}
