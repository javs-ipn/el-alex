import { SOAPServiceVersion } from '../SoapServiceVersion/soap-service-version.interface';

export interface FedexCredentialOptions {
    account: string;
    meterNumber: string;
    serviceVersion: SOAPServiceVersion;
}
