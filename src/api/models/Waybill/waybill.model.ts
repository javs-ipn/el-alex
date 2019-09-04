import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'waybill' })
export class Waybill {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'rate_id' , type: 'int', nullable: false, comment: 'The foreign key for rate table'} )
    public rateId: number;

    @Column({ name: 'external_id', type: 'nvarchar', length: '255', nullable: true, comment: 'The external identifier number'})
    public externalId: string;

    @Column({ name: 'main_waybill_number', type: 'nvarchar', length: '255', nullable: false, comment: 'The main waybil number'})
    public mainWaybillNumber: string;

    @Column({ name: 'waybill_url', type: 'nvarchar', length: 'max', nullable: false, comment: 'The waybill url for storage'})
    public waybillUrl: string;

    @Column({ name: 'waybill_type', type: 'nvarchar', length: '255'})
    public waybillType: string;

    @Column({ name: 'pod_url', type: 'nvarchar', length: 'max', nullable: true})
    public podUrl: string;

    @Column({ name: 'pod_type', type: 'nvarchar', length: '255', nullable: true, comment: ''})
    public podType: string;

    @Column({ name: 'waybill_numbers', type: 'nvarchar', length: 'max', nullable: true, comment: 'The json object for all multiple waybills'})
    public waybillNumbers: string;

    @CreateDateColumn({ name: 'created_date', type: 'datetime', nullable: false, comment: 'The created date for the waybill'})
    public createdDate: Date;

    @Column({ name: 'tenant_id', type: 'nvarchar', length: '255', nullable: false, comment: 'The tenant for the client'})
    public tenantId: number;
}
