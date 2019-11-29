import { Body, JsonController, Post, Get, Param } from 'routing-controllers';
import { ApiService } from '../../services/isw/api.service';

@JsonController('/isw')
export class EnvioClickRequestController {
    constructor(private apiService: ApiService) {

    }

    @Post('/clientLogin')
    public async clientLogin(@Body() client: any): Promise<any> {
        return this.apiService.clientLogin(client);
    }

    @Post('/storeLogin')
    public async storeLogin(@Body() store: any): Promise<any> {
        return this.apiService.storeLogin(store);
    }

    @Post('/clientRegister')
    public async clientRegister(@Body() client: any): Promise<any> {
        return this.apiService.clientRegister(client);
    }

    @Post('/storeRegister')
    public async storeRegister(@Body() store: any): Promise<any> {
        return this.apiService.storeRegister(store);
    }

    @Get('/products/coffeeShop/:coffeeShopId')
    public async coffeShopProducts(@Param('coffeeShopId') coffeeShopId: number): Promise<any> {
        return this.apiService.coffeShopProductsById(coffeeShopId);
    }

    @Get('/coffeeShops')
    public async coffeShops(): Promise<any> {
        return this.apiService.coffeShops();
    }

    @Get('/orders/client/:clientId')
    public async clientOrders(@Param('clientId') clientId: number): Promise<any> {
        return this.apiService.clientOrders(clientId);
    }

    @Get('/orders/coffeeShop/:coffeeShopId')
    public async coffeeShopOrders(@Param('coffeeShopId') coffeeShopId: number): Promise<any> {
        return this.apiService.coffeeShopOrders(coffeeShopId);
    }
}
