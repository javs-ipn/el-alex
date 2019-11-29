import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany
} from 'typeorm';
import { OrderProduct } from '../OrderProduct/OrderProduct';
import { Client } from '../Client/Client';

@Entity('order')
export class Order {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'client_id' })
    public clientId: number;

    @Column({ name: 'coffee_shop_id' })
    public coffeeShopId: number;

    @Column({ name: 'quantity' })
    public quantity: number;

    @Column({ name: 'status' })
    public status: string;

    @Column({ name: 'total' })
    public total: number;

    @OneToMany(type => OrderProduct, orderHasProduct => orderHasProduct.order)
    public orderHasProduct: OrderProduct[];

    @ManyToMany(type => Client, client => client.orders)
    public clients: Client[];
}
