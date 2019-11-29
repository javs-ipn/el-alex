import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('coffe_shop')
export class CoffeShop {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({name: 'store_name'})
    public storeName: string;

    @Column({name: 'owners_name'})
    public ownersName: string;

    @Column({name: 'email'})
    public email: string;

    @Column({name: 'password'})
    public password: string;

    @Column({name: 'phone'})
    public phone: string;

}
