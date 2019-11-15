import { OperationalInstructions } from './operational-instructions.inteface';
import { Barcodes } from './barcodes.interface';

export interface OperationalDetail {
    OperationalInstructions: OperationalInstructions;
    Barcodes: Barcodes;
}
