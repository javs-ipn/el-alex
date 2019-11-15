export interface CustomFedexLabelResponse {
    messages: { resultCode: string, messageDescription: string };
    label: { pdfString: string };
    waybillNumber: string;
}
