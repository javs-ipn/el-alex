import { CustomRedpackBaseResponse } from './custom-base-response.interface';
import { CustomRedpackRateResponse } from './custom-redpack-rate-response.interface';
export interface CustomRedpackCoverageResponse extends CustomRedpackBaseResponse {
    rates: CustomRedpackRateResponse[];
}
