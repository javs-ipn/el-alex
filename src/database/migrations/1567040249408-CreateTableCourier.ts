
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableCourier1567040249408 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const table = new Table({
            name: 'courier',
            columns: [
                {
                    name: 'id',
                    type: 'int identity(1,1)',
                    isGenerated: true,
                    isPrimary: true,
                    comment: 'Identity for courier',
                },
                {
                    name: 'name',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'Courier`s name',
                },
                {
                    name: 'description',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'Courier`s description',
                },
                {
                    name: 'rate_request_url',
                    type: 'nvarchar',
                    length: '150',
                    isNullable: false,
                    comment: 'Rate request url',
                },
                {
                    name: 'shipment_request_url',
                    type: 'nvarchar',
                    length: '150',
                    isNullable: false,
                    comment: 'Shipment request url',
                },
                {
                    name: 'tracking_request_url',
                    type: 'nvarchar',
                    length: '150',
                    isNullable: false,
                    comment: 'Tracking request url',
                },
                {
                    name: 'pod_request_url',
                    type: 'nvarchar',
                    length: '150',
                    isNullable: false,
                    comment: 'POD request url',
                },
                {
                    name: 'rate_action',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'Rate action',
                },
                {
                    name: 'shipment_action',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'Shipment action',
                },
                {
                    name: 'tracking_action',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'Tracking action',
                },
                {
                    name: 'pod_action',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'POD action',
                },
                {
                    name: 'max_packages',
                    type: 'INT',
                    isNullable: false,
                    comment: 'Max number of packages for multiple shipment',
                },
                {
                    name: 'is_rest',
                    type: 'smallint',
                    isNullable: false,
                    default: 1,
                    comment: 'Wether the courier connection is rest',
                },
                {
                    name: 'created',
                    type: 'DATETIME',
                    default: 'GETDATE()',
                    isNullable: false,
                    comment: 'Created date for the row',
                },
                {
                    name: 'updated',
                    type: 'DATETIME',
                    default: 'GETDATE()',
                    isNullable: false,
                    comment: 'Updated date for the row',
                },
            ],
        });
        await queryRunner.createTable(table, true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('courier');
    }
}
