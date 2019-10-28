import { JsonController, Post } from 'routing-controllers';
import { ShipmentService } from '../../services/Shipment/shipment.service';
import { ShipmentResponse } from '../../types/ShipmentResponse/generic-shipment-response.interface';
@JsonController('/shipment')
export class RateController {

    constructor(private shipmentService: ShipmentService) { }

    @Post('/')
    public async shipment(idRate: number): Promise<ShipmentResponse> {
        return this.shipmentService.shipmentRequest(idRate);
    }
}
