import { TrackingIds } from './tracking-ids.interface';
import { OperationalDetail } from './operational-detail.interface';
import { Label } from './label.interface';

export interface CompletedPackageDetails {
    SequenceNumber: number;
    TrackingIds: TrackingIds;
    GroupNumber: number;
    OperationalDetail: OperationalDetail[];
    Label: Label;
    SignatureOption: string;
}
