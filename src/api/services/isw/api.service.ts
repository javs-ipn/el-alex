import { OrderRepository } from './../../repositories/Order/order.repository';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ClientRepository } from '../../repositories/Client/client.repository';
import { CoffeShopRepository } from '../../repositories/CoffeShop/coffe-shop.repository';

@Service()
export class ApiService {
    constructor(
        @OrmRepository() private clientRepository: ClientRepository,
        @OrmRepository() private storeRepository: CoffeShopRepository,
        @OrmRepository() private orderRepository: OrderRepository) {
    }

    public async clientLogin(client: any): Promise<any> {
        console.log('client', client);
        let responseLogin = false;
        const clientFound = await this.clientRepository.login(client);
        if (clientFound) {
            responseLogin = true;
        }
        return Promise.resolve(responseLogin);
    }

    public async storeLogin(store: any): Promise<any> {
        let responseLogin = false;
        const storeFound = await this.storeRepository.login(store);
        if (storeFound) {
            responseLogin = true;
        }
        return Promise.resolve(responseLogin);
    }

    public async clientRegister(client: any): Promise<any> {
        const registeredClient = await this.clientRepository.clientRegister(client);
        return Promise.resolve(registeredClient);
    }

    public async storeRegister(store: any): Promise<any> {
        const registeredStore = await this.storeRepository.storeRegister(store);
        return Promise.resolve(registeredStore);
    }

    public async coffeShopProductsById(coffeShopId: number): Promise<any> {
        const foundCoffeeShop = await this.storeRepository.getCoffeShopById(coffeShopId);
        const relatedProducts = foundCoffeeShop.coffeeHasProduct;
        return Promise.resolve(relatedProducts);
    }

    public async coffeShops(): Promise<any> {
        const foundCoffeeShops = await this.storeRepository.getCoffeShops();
        return Promise.resolve(foundCoffeeShops);
    }

    public async clientOrders(clientId: number): Promise<any> {
        const clientOrders = await this.orderRepository.getOrdersByClientId(clientId);
        return Promise.resolve(clientOrders);
    }

    public async coffeeShopOrders(coffeeShopId: number): Promise<any> {
        const clientOrders = await this.orderRepository.getOrdersByCoffeShopId(coffeeShopId);
        return Promise.resolve(clientOrders);
    }
}
