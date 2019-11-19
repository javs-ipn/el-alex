
export interface StatusInfo {
    ActionStatus: string;
    Condition?: {
        ArrayOfConditionItem: {
            ConditionCode: string;
            ConditionData: string;
        }
    };
}
