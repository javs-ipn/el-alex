import { Body, JsonController, Post } from 'routing-controllers';
import { GenericShipmentRequest } from './../../types/ShipmentRequest/generic-shipment-request.class';

@JsonController('/shipment')
export class ShipmentController {

    @Post('/')
    public shipment(@Body() genericShipmentObject: GenericShipmentRequest): Promise<GenericShipmentRequest> {
        return Promise.resolve(genericShipmentObject);
    }
}
