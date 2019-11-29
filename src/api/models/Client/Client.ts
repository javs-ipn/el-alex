import {
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Order } from '../Order/Order';

@Entity('client')
export class Client {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ name: 'email' })
    public email: string;

    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'student_ballot' })
    public studentBallot: string;

    @ManyToMany(type => Order, order => order.clients)
    public orders: Order[];
}
