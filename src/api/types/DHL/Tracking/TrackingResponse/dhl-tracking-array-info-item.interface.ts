import { StatusInfo } from './dhl-tracking-status-info-item.interface';
import { PieceDetails } from './dhl-tracking-piece-details.interface';
import { PieceEvent } from './dhl-tracking-shipment-event.interface';
import { ShipmentInfo } from './dhl-tracking-shipment-info.interface';

export interface ArrayOfAWBInfoItem {

    AWBNumber: string;
    Status: StatusInfo | StatusInfo[];
    ShipmentInfo: ShipmentInfo;
    Pieces: {
        PieceInfo: {
            ArrayOfPieceInfoItem: {
                PieceDetails: PieceDetails;
                PieceEvent: {
                    ArrayOfPieceEventItem: PieceEvent[];
                }
            };
        };
    };
}
