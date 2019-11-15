import { FedexResponseBase } from '../../Response/fedex-response-base.interface';
import { RateReplyDetail } from '../RateReplyDetail/rate-reply-detail.interface';

export interface FedexRateResponse extends FedexResponseBase {
    RateReplyDetails: RateReplyDetail[];
}
