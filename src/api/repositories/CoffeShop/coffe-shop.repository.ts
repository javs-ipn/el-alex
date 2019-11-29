import { CoffeShop } from './../../models/CoffeShop/CoffeShop';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(CoffeShop)
export class CoffeShopRepository extends Repository<any> {

    public async login(store: any): Promise<any> {
        const storesFound = await this.createQueryBuilder('coffe_shop')
            .where('coffe_shop.email = :email', { email: store.email })
            .andWhere('coffe_shop.password = :password', { password: store.password })
            .getOne();
        return storesFound;
    }

    public async storeRegister(store: any): Promise<any> {
        const registeredClient = await this.createQueryBuilder('coffe_shop')
            .insert()
            .into(CoffeShop)
            .values([
                {
                    storeName: store.storeName,
                    email: store.email,
                    ownersName: store.ownersName,
                    phone: store.phone,
                    password: store.password,
                },
            ])
            .execute();
        return registeredClient;
    }

    public async getCoffeShopById(coffeShopId: number): Promise<CoffeShop> {
        return await this.findOne({
            relations: ['coffeeHasProduct', 'coffeeHasProduct.product'],
            where: { id: coffeShopId },
        });
    }

    public async getCoffeShops(): Promise<CoffeShop[]> {
        return await this.find({
            relations: ['coffeeHasProduct', 'coffeeHasProduct.product'],
        });
    }
}
