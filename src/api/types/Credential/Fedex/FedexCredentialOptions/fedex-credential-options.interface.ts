import { SOAPServiceVersion } from '../SoapServiceVersion/soap-service-version.interface';

export interface FedexCredentialOptions {
    account: string;
    action: string;
    meterNumber: string;
    serviceVersion: SOAPServiceVersion;
}
