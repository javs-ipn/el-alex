import {RateRequestPackage} from './rate-request-package.interface';

export interface EnvioClickRateRequest {
    package: RateRequestPackage;
    origin_zip_code: string;
    destination_zip_code: string;
}
