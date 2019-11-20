import { Get, JsonController } from 'routing-controllers';

@JsonController('/tracking')
export class TrackingController {

    @Get('/')
    public shipment(): Promise<any> {
        return Promise.resolve({});
    }
}
