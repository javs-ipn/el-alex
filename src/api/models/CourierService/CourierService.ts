import { Rate } from './../Rate/rate.model';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { Courier } from '../Courier/Courier';

@Entity('courier_service')
export class CourierService {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'service_code' })
    public serviceCode: string;

    @Column({ name: 'min_length' })
    public minLength: number;
    @Column({ name: 'max_length' })
    public maxLength: number;

    @Column({ name: 'min_width' })
    public minWidth: number;
    @Column({ name: 'max_width' })
    public maxWidth: number;

    @Column({ name: 'min_height' })
    public minHeight: number;
    @Column({ name: 'max_height' })
    public maxHeight: number;

    @Column({ name: 'min_weight' })
    public minWeight: number;
    @Column({ name: 'max_weight' })
    public maxWeight: number;

    @Column({ name: 'is_foreign' })
    public isForeign: boolean;

    @Column({ name: 'courier_id' })
    public courierId: number;

    @UpdateDateColumn({ name: 'updated' })
    public updated: Date;

    @CreateDateColumn({ name: 'created' })
    public created: Date;

    @ManyToOne(type => Courier, courier => courier.courierServices)
    @JoinColumn({ name: 'courier_id' })
    public courier: Courier;

    @OneToMany(type => Rate, rate => rate.service)
    public rates: Rate[];
}
