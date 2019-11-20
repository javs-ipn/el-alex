import { Body, JsonController, Post } from 'routing-controllers';
import { GenericRateObject } from './../../types/RateRequest/generic-rate-object.class';
import { RateService } from './../../services/Rate/rate.service';
import { GenericRateResponse } from 'src/api/types/RateResponse/generic-rate-response.interface';
@JsonController('/rate')
export class RateController {

    constructor(private rateService: RateService) { }

    @Post('/')
    public rate(@Body() genericObject: GenericRateObject): Promise<GenericRateResponse> {
        return this.rateService.rateShipment(genericObject);
    }
}
