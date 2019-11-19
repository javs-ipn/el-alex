import {StatusMessages} from './status-messages.interface';
import {Data} from './data.interface';

export interface EnvioClickRateResponse {
    status: string;
    status_codes: any[];
    status_messages: StatusMessages;
    data: Data;
}
