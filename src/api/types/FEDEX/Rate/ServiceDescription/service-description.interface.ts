import { Names } from './names.interface';

export interface ServiceDescription {
    ServiceType: string;
    Code: number;
    Names: Names[];
    Description: string;
    AstraDescription: string;
}
