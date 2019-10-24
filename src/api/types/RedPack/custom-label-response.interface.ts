import { CustomRedpackBaseResponse } from './custom-base-response.interface';
export interface CustomRedpackLabelResponse extends CustomRedpackBaseResponse {
    label: { pdfString: string };
    waybillNumber: string;
}
