import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {ClientRepository} from '../../repositories/Client/client.repository';
import {CoffeShopRepository} from '../../repositories/CoffeShop/coffe-shop.repository';

@Service()
export class ApiService {
    constructor(@OrmRepository() private clientRepository: ClientRepository,
                @OrmRepository() private storeRepository: CoffeShopRepository) {
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
}
