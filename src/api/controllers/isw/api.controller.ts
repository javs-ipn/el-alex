import {Body, JsonController, Post} from 'routing-controllers';
import {ApiService} from '../../services/isw/api.service';

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
}
