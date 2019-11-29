import { CoffeShop } from './../CoffeShop/CoffeShop';

import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Product } from '../Product/Product';

@Entity('coffee_has_product')
export class CoffeeHasProduct {

    @PrimaryColumn({ name: 'product_id', comment: 'Product table referece' })
    public productId: number;

    @PrimaryColumn({ name: 'coffee_id', comment: 'Coffee table referece' })
    public coffeeId: number;

    @ManyToOne(type => Product, product => product.coffees)
    @JoinColumn({
        name: 'product_id',
    })
    public product: Product;

    @ManyToOne(type => CoffeShop, coffeeShop => coffeeShop.coffeeHasProduct)
    @JoinColumn({
        name: 'coffee_id',
    })
    public coffeeShop: CoffeShop;

}
