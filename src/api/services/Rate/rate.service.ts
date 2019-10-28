import { Credential } from '../../models/Credential/Credential';
import { GenericRateObject } from '../../types/RateRequest/generic-rate-object.class';
import { RateResponse } from '../../types/RateResponse/GenericRate/rate.response.interface';
import * as _ from 'lodash';
import { Courier } from '../../models/Courier/Courier';
import { RedpackRateService } from '../../services/Redpack/redpack-rate.service';
import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
import { Service } from 'typedi';

@Service()
export class RateService {
    constructor(
        private redpackCoverageService: RedpackRateService) { }

    public async rateShipment(genericRateObject: GenericRateObject): Promise<RateResponse> {
        // TODO - Add prefered couriers functionality
        // TODO - Get Courier from repository
        const courier = new Courier();
        courier.name = 'REDPACK';
        courier.rateAction = 'rastreo';
        courier.rateRequestUrl = 'https://ws.redpack.com.mx/RedpackAPI_WS/services/RedpackWS?wsdl';
        const credential = new Credential();
        credential.courier = courier;
        credential.username = '';
        credential.password = '';
        credential.options = '{"PIN": "QA RQkCWF0cxuAmJL6L45p9AvdN7llAsaRz", "idUsuario": "1435"}';

        let rateResponse: RateResponse = undefined;

        rateResponse = await this.handleRedpackRequest(genericRateObject, credential);
        return Promise.resolve(rateResponse);
    }

    private async handleRedpackRequest(genericRateObject: GenericRateObject, credential: Credential): Promise<RateResponse> {
        let coverageResponse = undefined;
        try {
            const coverageRequestString = this.redpackCoverageService.generateCoverageXMLString(genericRateObject, credential);
            const foundRates = await this.redpackCoverageService.requestCoverageService(coverageRequestString, credential.courier);
            coverageResponse = this.redpackCoverageService.getGenericCoverageResponse((_.first(foundRates)), credential.courier);
            return Promise.resolve(coverageResponse);
        } catch (error) {
            throw new GenericBussinessLogicError(error);
        }
    }
}
