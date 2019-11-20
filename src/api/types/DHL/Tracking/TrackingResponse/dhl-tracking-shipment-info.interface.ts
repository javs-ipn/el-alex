export interface ShipmentInfo {

    OriginServiceArea: {
        ServiceAreaCode: string;
        Description: string;
    };
    DestinationServiceArea: {
        ServiceAreaCode: string;
        Description: string;
        FacilityCode: string;
    };
    ShipperName: string;
    ConsigneeName: string;
    ShipmentDate: string;
    Pieces: string;
    Weight: string;
}
