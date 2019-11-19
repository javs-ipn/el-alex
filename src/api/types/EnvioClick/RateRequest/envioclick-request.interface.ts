import { RatePackage } from './envioclick-rate-package.interface';

export interface RateRequestEnvioClick {
    package: RatePackage;
    origin_zip_code: string;
    destination_zip_code: string;
}
