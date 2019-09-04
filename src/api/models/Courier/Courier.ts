import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { CourierService } from '../CourierService/CourierService';
import { Credential } from '../Credential/Credential';

@Entity('courier')
export class Courier {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'rate_request_url' })
    public rateRequestUrl: string;

    @Column({ name: 'shipment_request_url' })
    public shipmentRequestUrl: string;

    @Column({ name: 'tracking_request_url' })
    public trackingRequestUrl: string;

    @Column({ name: 'pod_request_url' })
    public podRequestUrl: string;

    @Column({ name: 'max_packages' })
    public maxPackages: number;

    @Column({ name: 'is_rest' })
    public isRest: boolean;

    @Column({ name: 'rate_action' })
    public rateAction: string;

    @Column({ name: 'shipment_action' })
    public shipmentAction: string;

    @Column({ name: 'tracking_action' })
    public trackingAction: string;

    @Column({ name: 'pod_action' })
    public podAction: string;

    @UpdateDateColumn({ name: 'updated' })
    public updated: Date;

    @CreateDateColumn({ name: 'created' })
    public created: Date;

    @OneToMany(type => CourierService, courierService => courierService.courier)
    public courierServices: CourierService[];

    @OneToMany(type => Credential, credential => credential.courier)
    public credentials: Credential[];
}
