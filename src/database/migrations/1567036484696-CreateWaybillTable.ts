import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateWaybillTable1567036484696 implements MigrationInterface {

    private readonly TABLE_NAME = 'waybill';

    public async up(queryRunner: QueryRunner): Promise<any> {
        const waybillTable: Table = new Table({
            name: this.TABLE_NAME,
            columns: [
                {
                    name: 'id',
                    type: 'int identity(1,1)',
                    isGenerated: true,
                    isPrimary: true,
                },
                {
                    name: 'rate_id',
                    type: 'int',
                    isNullable: false,
                    comment: 'The foreign key for rate table',
                },
                {
                    name: 'external_id',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: true,
                    comment: 'The external identifier number',
                },
                {
                    name: 'main_waybill_number',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The main waybil number',
                },
                {
                    name: 'waybill_url',
                    type: 'nvarchar',
                    length: 'max',
                    isNullable: false,
                    comment: 'The waybill url for storage',
                },
                {
                    name: 'waybill_type',
                    type: 'nvarchar',
                    length: '255',
                },
                {
                    name: 'pod_url',
                    type: 'nvarchar',
                    length: 'max',
                    isNullable: true,
                },
                {
                    name: 'pod_type',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: true,
                    comment: '',
                },
                {
                    name: 'waybill_numbers',
                    type: 'nvarchar',
                    length: 'max',
                    isNullable: true,
                    comment: 'The json object for all multiple waybills',
                },
                {
                    name: 'created_date',
                    type: 'datetime',
                    isNullable: false,
                    comment: 'The created date for the waybill',
                },
                {
                    name: 'tenant_id',
                    type: 'int',
                    isNullable: false,
                    comment: 'The tenant for the client',
                },
            ],
        });
        await queryRunner.createTable(waybillTable, true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const waybillTableDrop: Table = new Table();
        waybillTableDrop.name = this.TABLE_NAME;
        await queryRunner.dropTable(waybillTableDrop);
    }
}
