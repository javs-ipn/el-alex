import { SOAPServiceVersion } from '../SoapServiceVersion/soap-service-version.interface';

export interface SoapAction {
    action: string;
    version?: SOAPServiceVersion;
}
