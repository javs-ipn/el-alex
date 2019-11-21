import { CourierService } from './../CourierService/CourierService';
import { PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rate')
export class Rate {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'insurance', nullable: false, comment: 'Package insurance'})
    public insurance: boolean;

    @Column({ name: 'customs_value', type: 'int', nullable: false, comment: 'Insurance amount'})
    public customsValue: number;

    @Column({ name: 'internal_id', type: 'nvarchar', length: 'max', nullable: false, comment: 'Identifier for the system'})
    public internalId: string;

    @Column({ name: 'zipcode_origin', type: 'nvarchar', length: '255', nullable: false, comment: 'The zipcode origin for rate request' })
    public zipcodeOrigin: string;

    @Column({ name: 'zipcode_destination', type: 'nvarchar', length: '255', nullable: false, comment: 'The zipcode destination for rate request' })
    public zipcodeDestination: string;

    @Column({ name: 'neighborhood_origin', type: 'nvarchar', length: '255', nullable: true, comment: 'The neighborhood origin for rate request' })
    public neighborhoodOrigin: string;

    @Column({ name: 'neighborhood_destination', type: 'nvarchar', length: '255', nullable: true, comment: 'The neighborhood destination for rate request' })
    public neighborhoodDestination: string;

    @Column({ name: 'city_origin', type: 'nvarchar', length: '255', nullable: true, comment: 'The city origin for rate request' })
    public cityOrigin: string;

    @Column({ name: 'city_destination', type: 'nvarchar', length: '255', nullable: true, comment: 'The city destination for rate request' })
    public cityDestination: string;

    @Column({ name: 'country_code_origin', type: 'nvarchar', length: '255', nullable: true, comment: 'The country code origin, ISO_2 format' })
    public countryCodeOrigin: string;

    @Column({ name: 'country_code_destination', type: 'nvarchar', length: '255', nullable: true, comment: 'The country code destination, ISO_2 format' })
    public countryCodeDestination: string;

    @Column({ name: 'recipient_street_lines_1', type: 'nvarchar', length: '30', nullable: true, comment: 'The main address' })
    public recipientStreetLines1: string;

    @Column({ name: 'recipient_reference', type: 'nvarchar', length: '30', nullable: true, comment: 'The secondary address' })
    public recipientReference: string;

    @Column({ name: 'shipper_street_lines_1', type: 'nvarchar', length: '30', nullable: true, comment: 'The main address' })
    public shipperStreetLines1: string;

    @Column({ name: 'shipper_reference', type: 'nvarchar', length: '30', nullable: true, comment: 'The secondary address' })
    public shipperReference: string;

    @Column({ name: 'content_description', type: 'nvarchar', length: '30', nullable: true, comment: 'The optional address' })
    public contentDescription: string;

    @Column({ name: 'contact_name_origin', type: 'nvarchar', length: '30', nullable: true, comment: 'The person who makes the shipment' })
    public contactNameOrigin: string;

    @Column({ name: 'contact_name_destination', type: 'nvarchar', length: '30', nullable: true, comment: 'The person who receives the shipment' })
    public contactNameDestination: string;

    @Column({ name: 'corporate_name_origin', type: 'nvarchar', length: '30', nullable: true, comment: 'The company who makes the shipment' })
    public corporateNameOrigin: string;

    @Column({ name: 'corporate_name_destination', type: 'nvarchar', length: '30', nullable: true, comment: 'The company who receives the shipment' })
    public corporateNameDestination;

    @Column({ name: 'phone_number_origin', type: 'nvarchar', length: '30', nullable: true, comment: 'The phone number who makes the shipment' })
    public phoneNumberOrigin: string;

    @Column({ name: 'phone_number_destination', type: 'nvarchar', length: '30', nullable: true, comment: 'The phone number who receives the shipment' })
    public phoneNumberDestination: string;

    @Column({ name: 'email_origin', type: 'nvarchar', length: '30', nullable: true, comment: 'The email who makes the shipment' })
    public emailOrigin: string;

    @Column({ name: 'email_destination', type: 'nvarchar', length: '30', nullable: true, comment: 'The email who receives the shipment' })
    public emailDestination: string;

    @Column({ name: 'delivery_type', type: 'nvarchar', length: '30', nullable: false, comment: 'The delivery type: REGULAR_PICKUP|REQUEST_COURIER' })
    public deliveryType: string;

    @Column({ name: 'pickup_date', type: 'datetime', nullable: true, comment: 'The date to pickup request' })
    public pickupDate: Date;

    @Column({ name: 'package_type', type: 'nvarchar', nullable: false, comment: 'The package type that will be sent: DOCUMENT|PACKAGE' })
    public packageType: string;

    @Column({ name: 'total_length', type: 'int', nullable: false, comment: 'The total length in the shipment' })
    public totalLength: number;

    @Column({ name: 'total_width', type: 'int', nullable: false, comment: 'The total width in the shipment' })
    public totalWidth: number;

    @Column({ name: 'total_weight', type: 'int', nullable: false, comment: 'The total weight in the shipment' })
    public totalWeight: number;

    @Column({ name: 'total_height', type: 'int', nullable: false, comment: 'The total height in the shipment' })
    public totalHeight: number;

    @Column({ name: 'dimensions_packages', type: 'nvarchar', length: 'max', nullable: false, comment: 'The json object for the dimensions of all packages' })
    public dimensionsPackages: string;

    @CreateDateColumn({ name: 'rate_date', type: 'datetime', nullable: false, comment: 'The rate date for the shipment' })
    public rateDate: Date;

    @Column({ name: 'total_price', type: 'int', nullable: true, comment: 'The total price for shipment' })
    public totalPrice: number;

    @Column({ name: 'sub_total_price', type: 'int', nullable: true, comment: 'The neto price for shipment' })
    public subTotalPrice: number;

    @Column({ name: 'charges_detail', type: 'nvarchar', length: 'max', nullable: true, comment: 'The json object for additional charges of all packages' })
    public chargesDetail: string;

    @Column({ name: 'service_id', type: 'int', nullable: false, comment: 'The foreign key to courier_service' })
    public serviceId: number;

    @Column({ name: 'extended_zone_shipment', nullable: false, comment: 'Indicates if a shipment is extended' })
    public extendedZoneShipment: boolean;

    @Column({ name: 'multiple_shipment', nullable: false, comment: 'Indicate if a shipment is multiple' })
    public multipleShipment: boolean;

    @Column({ name: 'tenant_id', type: 'nvarchar', length: '255', nullable: false, comment: 'The tenant for the client' })
    public tenantId: string;

    @Column({ name: 'rated', nullable: false, comment: 'Indicates if a shipment was rated before' })
    public rated: boolean;

    @Column({ name: 'status', nullable: false, comment: 'Indicates if a rate was use' })
    public status: boolean;

    @Column({ name: 'service_name', type: 'nvarchar', length: '255', nullable: false})
    public serviceName: string;

    @Column({ name: 'courier_estimated_delivery_date', type: 'nvarchar', length: '255', nullable: false})
    public courierEstimatedDeliveryDate: string;

    @ManyToOne(type => CourierService, service => service.rates)
    @JoinColumn({ name: 'service_id' })
    public service: CourierService;

}
