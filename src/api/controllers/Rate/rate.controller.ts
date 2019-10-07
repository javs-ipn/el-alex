import { Body, JsonController, Post } from 'routing-controllers';
import { GenericRateObject } from './../../types/RateRequest/generic-rate-object.class';
import { RateResponse } from '../../types/RateResponse/GenericRate/rate.response.interface';
import { RateService } from './../../services/Rate/rate.service';
@JsonController('/rate')
export class RateController {

    constructor(private rateService: RateService) { }

    @Post('/')
    public rate(@Body() genericObject: GenericRateObject): Promise<RateResponse> {
        return this.rateService.rateShipment(genericObject);
    }
}
