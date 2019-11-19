import { Parts } from './parts.interface';

export interface Label {
    Type: string;
    ShippingDocumentDisposition: string;
    ImageType: string;
    Resolution: string;
    CopiesToPrint: number;
    Parts: Parts;
}
