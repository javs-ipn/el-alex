import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableCourierService1567040265182 implements MigrationInterface {

    private courierFK = new TableForeignKey({
        name: 'fk_courier_courier_service',
        columnNames: ['courier_id'],
        referencedTableName: 'courier',
        referencedColumnNames: ['id'],
    });

    public async up(queryRunner: QueryRunner): Promise<any> {

        const table = new Table({
            name: 'courier_service',
            columns: [
                {
                    name: 'id',
                    type: 'int identity(1,1)',
                    isGenerated: true,
                    isPrimary: true,
                    comment: 'Identity for courier service',
                },
                {
                    name: 'name',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'Courier service name',
                },
                {
                    name: 'description',
                    type: 'nvarchar',
                    length: '250',
                    isNullable: false,
                    comment: 'Courier service description',
                },
                {
                    name: 'service_code',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'Service code which is use to request to the courier',
                },
                {
                    name: 'min_length',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Min lenght for the service',
                },
                {
                    name: 'max_length',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Max lenght for the service',
                },
                {
                    name: 'min_width',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Min width for the service',
                },
                {
                    name: 'max_width',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Max width for the service',
                },
                {
                    name: 'min_height',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Min height for the service',
                },
                {
                    name: 'max_height',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Max height for the service',
                },
                {
                    name: 'min_weight',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Min weight for the service',
                },
                {
                    name: 'max_weight',
                    type: 'NUMERIC(18,2)',
                    isNullable: false,
                    comment: 'Max weight for the service',
                },
                {
                    name: 'is_foreign',
                    type: 'smallint',
                    isNullable: false,
                    default: 0,
                    comment: 'Wether the service provided is foreign',
                },
                {
                    name: 'courier_id',
                    type: 'int',
                    isNullable: false,
                    comment: 'Related courier Id',
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
        await queryRunner.createForeignKey('courier_service', this.courierFK);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('courier_service', this.courierFK);
        await queryRunner.dropTable('courier_service');
    }
}
