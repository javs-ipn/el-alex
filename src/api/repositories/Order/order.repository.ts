import { Order } from './../../models/Order/Order';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Order)
export class OrderRepository extends Repository<any> {

    public async getOrdersByClientId(clientIdValue: number): Promise<Order[]> {
        return await this.find({
            where: { clientId: clientIdValue },
            relations: ['orderHasProduct', 'orderHasProduct.product'],
        });
    }

    public async getOrdersByCoffeShopId(coffeShopIdValue: number): Promise<Order[]> {
        return await this.find({
            where: { coffeeShopId: coffeShopIdValue },
            relations: ['orderHasProduct', 'orderHasProduct.product'],
        });
    }

}
