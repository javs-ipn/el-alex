import { BinaryBarcodes } from './binary-barcodes.interface';
import { StringBarcodes } from './string-barcodes.interface';

export interface Barcodes {
    BinaryBarcodes: BinaryBarcodes;
    StringBarcodes: StringBarcodes;
}
