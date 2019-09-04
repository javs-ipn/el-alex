export interface CustomEstafetaLabelResponse {
    messages: { resultCode: string, messageDescription: string };
    label: { pdfString: string };
    waybillNumber: string;
}
