import { CoffeeHasProduct } from './../CoffeeHasProduct/CoffeeHasProduct';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

@Entity('coffee_shop')
export class CoffeShop {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'store_name' })
    public storeName: string;

    @Column({ name: 'owners_name' })
    public ownersName: string;

    @Column({ name: 'email' })
    public email: string;

    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'phone' })
    public phone: string;

    @OneToMany(type => CoffeeHasProduct, coffeeShopHasProduct => coffeeShopHasProduct.coffeeShop)
    public coffeeHasProduct: CoffeeHasProduct[];

}
