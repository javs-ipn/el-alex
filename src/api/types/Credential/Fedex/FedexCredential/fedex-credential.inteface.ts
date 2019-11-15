import { ClientDetail } from '../ClientDetail/client-detail.interface';
import { SoapAction } from '../SoapAction/soap-action.interface';
import { WebAuthenticationDetail } from '../WebAuthenticationDetail/web-authentication-detail.interface';
export interface FedexCredential {
    clientDetail: ClientDetail;
    soapAction?: SoapAction;
    webAuthenticationDetail: WebAuthenticationDetail;
}
