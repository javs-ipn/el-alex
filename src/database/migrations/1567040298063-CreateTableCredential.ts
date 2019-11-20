
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableCredential1567040298063 implements MigrationInterface {

    private courierFK = new TableForeignKey({
        name: 'fk_courier_credential',
        columnNames: ['courier_id'],
        referencedTableName: 'courier',
        referencedColumnNames: ['id'],
    });

    public async up(queryRunner: QueryRunner): Promise<any> {

        const table = new Table({
            name: 'credential',
            columns: [
                {
                    name: 'id',
                    type: 'int identity(1,1)',
                    isGenerated: true,
                    isPrimary: true,
                    comment: 'Identity for the courier credential',
                },
                {
                    name: 'name',
                    type: 'nvarchar',
                    length: '50',
                    isNullable: false,
                    comment: 'Credential name',
                },
                {
                    name: 'tenant_id',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'Tenant id',
                },
                {
                    name: 'client_name',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'Courier credential client`s name',
                },
                {
                    name: 'courier_id',
                    type: 'int',
                    isNullable: false,
                    comment: 'Related courier Id',
                },
                {
                    name: 'type',
                    type: 'nvarchar',
                    length: '20',
                    isNullable: false,
                    comment: 'Credential`s type  SHIP | TRACKING | POD | RATE',
                },
                {
                    name: 'username',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'Credential username',
                },
                {
                    name: 'password',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'Credential password',
                },
                {
                    name: 'created',
                    type: 'DATETIME',
                    default: 'GETDATE()',
                    isNullable: false,
                    comment: 'Created date for the row',
                },
                {
                    name: 'options',
                    type: 'nvarchar',
                    length: '500',
                    isNullable: false,
                    comment: 'Credentials options',
                },
                {
                    name: 'is_active',
                    type: 'smallint',
                    isNullable: false,
                    default: 1,
                    comment: 'Wether the credential is active',
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
        await queryRunner.createForeignKey('credential', this.courierFK);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('credential', this.courierFK);
        await queryRunner.dropTable('credential');
    }
}
