import { CustomRedpackBaseResponse } from './custom-base-response.interface';

export interface CustomRedpackInsuredResponse extends CustomRedpackBaseResponse {
    insured: boolean;
}
