import { DeleteResult, RemoveOptions, UpdateResult } from 'typeorm';

export class RepositoryMock<T> {

    public one: T;
    public list: T[];

    public findMock = jest.fn();
    public findAllMock = jest.fn();
    public findOneMock = jest.fn();
    public findOneByIdMock = jest.fn();
    public softDeleteMock = jest.fn();
    public saveMock = jest.fn();
    public updateMock = jest.fn();
    public deleteMock = jest.fn();
    public deleteByIdMock = jest.fn();

    public find(...args: any[]): Promise<T[]> {
        this.findMock(args);
        return Promise.resolve(this.list);
    }
    public findAll(...args: any[]): Promise<T[]> {
        this.findAllMock(args);
        return Promise.resolve(this.list);
    }
    public findOneById(...args: any[]): Promise<T> {
        this.findOneByIdMock(args);
        return Promise.resolve(this.one);
    }
    public findOne(...args: any[]): Promise<T> {
        this.findOneMock(args);
        return Promise.resolve(this.one);
    }
    public save(value: T, ...args: any[]): Promise<T> {
        this.saveMock(value, args);
        return Promise.resolve(value);
    }
    public delete(value: T, ...args: any[]): Promise<DeleteResult> {
        this.deleteMock(value, args);
        const result = new DeleteResult();
        result.affected = 1;
        return Promise.resolve(result);
    }
    public deleteById(id: any, options?: RemoveOptions): Promise<void> {
        this.deleteByIdMock(id, options);
        return Promise.resolve();
    }
    public update(value: T, ...args: any[]): Promise<boolean> {
        this.updateMock(value, args);
        return Promise.resolve(true);
    }
    public logicalDelete(id: number): Promise<UpdateResult> {
        this.softDeleteMock(id);
        return Promise.resolve(new UpdateResult());
    }
    public softDelete(id: number, tenantId: number): Promise<UpdateResult> {
        this.softDeleteMock(id, tenantId);
        return Promise.resolve(new UpdateResult());
    }
}
