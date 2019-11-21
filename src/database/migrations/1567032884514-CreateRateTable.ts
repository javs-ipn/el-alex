import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRateTable1567032884514 implements MigrationInterface {

    private readonly TABLE_NAME = 'rate';

    public async up(queryRunner: QueryRunner): Promise<any> {
        const rateTable = new Table({
            name: this.TABLE_NAME,
            columns: [
                {
                    name: 'id',
                    type: 'int identity(1,1)',
                    isGenerated: true,
                    isPrimary: true,
                    comment: 'Id for the request rate',
                },
                {
                    name: 'internal_id',
                    type: 'nvarchar',
                    length: 'max',
                    isNullable: false,
                    comment: 'Identifier for the system',
                },
                {
                    name: 'zipcode_origin',
                    type: 'nvarchar',
                    length: '10',
                    isNullable: false,
                    comment: 'The zipcode origin for rate request',
                },
                {
                    name: 'zipcode_destination',
                    type: 'nvarchar',
                    length: '10',
                    isNullable: false,
                    comment: 'The zipcode destination for rate request',
                },
                {
                    name: 'content_description',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'Content description',
                },
                {
                    name: 'neighborhood_origin',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The neighborhood origin for rate request',
                },
                {
                    name: 'neighborhood_destination',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The neighborhood destination for rate request',
                },
                {
                    name: 'city_origin',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The city origin for rate request',
                },
                {
                    name: 'city_destination',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The city destination for rate request',
                },
                {
                    name: 'country_code_origin',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The country code origin, ISO_2 format',
                },
                {
                    name: 'country_code_destination',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                    comment: 'The country code destination, ISO_2 format',
                },
                {
                    name: 'shipper_street_lines_1',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'The main address',
                },
                {
                    name: 'shipper_reference',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The secondary address',
                },
                {
                    name: 'recipient_street_lines_1',
                    type: 'nvarchar',
                    length: '100',
                    isNullable: false,
                    comment: 'The main address',
                },
                {
                    name: 'recipient_reference',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The secondary address',
                },
                {
                    name: 'contact_name_origin',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The person who makes the shipment',
                },
                {
                    name: 'contact_name_destination',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The person who receives the shipment',
                },
                {
                    name: 'corporate_name_origin',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The company who makes the shipment',
                },
                {
                    name: 'corporate_name_destination',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The company who receives the shipment',
                },
                {
                    name: 'phone_number_origin',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The phone number who makes the shipment',
                },
                {
                    name: 'phone_number_destination',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The phone number who receives the shipment',
                },
                {
                    name: 'email_origin',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The email who makes the shipment',
                },
                {
                    name: 'email_destination',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The email who receives the shipment',
                },
                {
                    name: 'delivery_type',
                    type: 'nvarchar',
                    length: '30',
                    isNullable: false,
                    comment: 'The delivery type: REGULAR_PICKUP|REQUEST_COURIER',
                },
                {
                    name: 'pickup_date',
                    type: 'datetime',
                    isNullable: false,
                    comment: 'The date to pickup request',
                },
                {
                    name: 'package_type',
                    type: 'nvarchar',
                    isNullable: false,
                    comment: 'The package type that will be sent: DOCUMENT|PACKAGE',
                },
                {
                    name: 'total_length',
                    type: 'int',
                    isNullable: false,
                    comment: 'The total length in the shipment',
                },
                {
                    name: 'total_width',
                    type: 'int',
                    isNullable: false,
                    comment: 'The total width in the shipment',
                },
                {
                    name: 'total_weight',
                    type: 'int',
                    isNullable: false,
                    comment: 'The total weight in the shipment',
                },
                {
                    name: 'total_height',
                    type: 'int',
                    isNullable: false,
                    comment: 'The total height in the shipment',
                },
                {
                    name: 'dimensions_packages',
                    type: 'nvarchar',
                    length: 'max',
                    isNullable: false,
                    comment: 'The json object for the dimensions of all packages',
                },
                {
                    name: 'rate_date',
                    type: 'datetime',
                    default: 'GETDATE()',
                    isNullable: false,
                    comment: 'The rate date for the shipment',
                },
                {
                    name: 'total_price',
                    type: 'int',
                    isNullable: false,
                    comment: 'The total price for shipment',
                },
                {
                    name: 'sub_total_price',
                    type: 'int',
                    isNullable: false,
                    comment: 'The sub total price for shipment',
                },
                {
                    name: 'charges_detail',
                    type: 'nvarchar',
                    length: 'max',
                    isNullable: false,
                    comment: 'The json object for additional charges of all packages',
                },
                {
                    name: 'service_id',
                    type: 'int',
                    isNullable: false,
                    comment: 'The foreign key to courier_service',
                },
                {
                    name: 'extended_zone_shipment',
                    type: 'smallint',
                    isNullable: false,
                    comment: 'Indicates if a shipment is extended',
                },
                {
                    name: 'multiple_shipment',
                    type: 'smallint',
                    isNullable: false,
                    comment: 'Indicate if a shipment is multiple',
                },
                {
                    name: 'tenant_id',
                    type: 'int',
                    isNullable: false,
                    comment: 'The tenant for the client',
                },
                {
                    name: 'rated',
                    type: 'smallint',
                    isNullable: false,
                    comment: 'Indicates if a shipment was rated before',
                },
                {
                    name: 'status',
                    type: 'smallint',
                    isNullable: false,
                    comment: 'Indicates if a rate was use',
                },
                {
                    name: 'customs_value',
                    type: 'decimal(18,2)',
                    isNullable: false,
                },
                {
                    name: 'insurance',
                    type: 'smallint',
                    isNullable: false,
                },
                {
                    name: 'service_name',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'courier_estimated_delivery_date',
                    type: 'nvarchar',
                    length: '255',
                    isNullable: false,
                },
            ],
        });
        await queryRunner.createTable(rateTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const rateTableDrop = new Table();
        rateTableDrop.name = this.TABLE_NAME;
        await queryRunner.dropTable(rateTableDrop);
    }

}
