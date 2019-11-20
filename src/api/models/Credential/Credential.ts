import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Courier } from '../Courier/Courier';

@Entity('credential')
export class Credential {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'tenant_id' })
    public tenantId: string;

    @Column({ name: 'client_name' })
    public clientName: string;

    @Column({ name: 'courier_id' })
    public courierId: number;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'username' })
    public username: string;

    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'options' })
    public options: string;

    @Column({ name: 'is_active' })
    public isActive: boolean;

    @CreateDateColumn({ name: 'created' })
    public created: Date;

    @UpdateDateColumn({ name: 'updated' })
    public updated: Date;

    @ManyToOne(type => Courier, courier => courier.credentials)
    @JoinColumn({ name: 'courier_id' })
    public courier: Courier;
}
