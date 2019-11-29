import { CoffeeHasProduct } from './../CoffeeHasProduct/CoffeeHasProduct';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderProduct } from '../OrderProduct/OrderProduct';

@Entity('product')
export class Product {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'img' })
    public img: string;

    @OneToMany(type => OrderProduct, orderProduct => orderProduct.product)
    public orders: OrderProduct[];

    @OneToMany(type => CoffeeHasProduct, coffeeProduct => coffeeProduct.product )
    public coffees: CoffeeHasProduct[];

}
