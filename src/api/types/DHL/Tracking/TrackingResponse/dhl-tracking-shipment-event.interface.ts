
export interface PieceEvent {

    Date: string;
    Time: string;
    ServiceEvent: {
        EventCode: string,
        Description: string
    };
    ServiceArea: {
        ServiceAreaCode: string;
        Description: string;
    };
    Signatory?: string;
}
