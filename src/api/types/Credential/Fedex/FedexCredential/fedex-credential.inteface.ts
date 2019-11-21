import { ClientDetail } from '../ClientDetail/client-detail.interface';
import { WebAuthenticationDetail } from '../WebAuthenticationDetail/web-authentication-detail.interface';
import { SOAPServiceVersion } from '../SoapServiceVersion/soap-service-version.interface';
export interface FedexCredential {
    clientDetail: ClientDetail;
    version?: SOAPServiceVersion;
    webAuthenticationDetail: WebAuthenticationDetail;
}
