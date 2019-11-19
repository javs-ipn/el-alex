import { LabelImage } from './dhl-label-image.interface';
import { Notification } from './dhl-notification.interface';
import { PackageResult } from './dhl-package-result.interface';

export interface ShipmentResponse {
    PackagesResult: PackageResult;
    Notification: Notification[];
    LabelImage: LabelImage[];
    ShipmentIdentificationNumber: string;
    DispatchConfirmationNumber: string;
}
