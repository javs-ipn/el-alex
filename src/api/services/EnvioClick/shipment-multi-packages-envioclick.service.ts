import * as _ from 'lodash';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { Service } from 'typedi';
import { Rate } from 'src/api/models/Rate/rate.model';
import { Credential } from '../../models/Credential/Credential';
import { ShipmentRequestEnvioClick } from 'src/api/types/EnvioClick/Shipment/evioclick-shipment.interface';

@Service()
export class ShipmentRequestEnvioClickService {
    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    /**
     * @description Calls for DHL api shipment request chaining promises and resolves them
     * @param {ShipmentRequest} shipmentRequest Shipment Request object needed by DHL
     * @param {Credential} credential Object containing the url, username and password
     */
    public async shipmentRequest(shipmentRequest: ShipmentRequestEnvioClick, credential: Credential): Promise<any> {
        this.log.debug('calling for dhl api shipment request');
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `${credential.password}`,
            },
        };
        const dhlShipmentRequest: AxiosPromise<any> = axios.post(credential.courier.shipmentRequestUrl, shipmentRequest, axiosRequestConfig);
        return await dhlShipmentRequest
            .then((results: AxiosResponse<any>) => {
                const shipmentResponse: any = results.data;
                return Promise.resolve(shipmentResponse);
            }).catch((error) => {
                if (!_.has(error, 'request')) {
                    throw error.message;
                } else {
                    throw error.response.data;
                }
            });
    }

    /**
     * @description Creates a DHL shipment request object
     * @param {Rate} rate - generic shipment object
     * @returns {Promise<ShipmentRequestObjectDHL>} - DHL shipment request object
     */
    public generateObject(rate: Rate): Promise<ShipmentRequestEnvioClick> {
        const packages = JSON.parse(rate.dimensionsPackages);
        const shipmentRequest: ShipmentRequestEnvioClick = {
            idRate: rate.id,
            myShipmentReference: 'My Shipment 1A',
            requestPickup: true,
            pickupDate: rate.pickupDate.toString(),
            insurance: true,
            thermalLabel: false,
            package: packages,
            origin: {
                company: rate.corporateNameOrigin,
                firstName: rate.contactNameOrigin.split(' ')[0],
                lastName: rate.contactNameOrigin.split(' ')[1],
                email: rate.emailOrigin,
                phone: rate.phoneNumberOrigin,
                street: rate.shipperStreetLines1,
                number: '32',
                suburb: rate.neighborhoodOrigin,
                crossStreet: rate.shipperStreetLines1,
                reference: rate.recipientReference,
                zipCode: rate.zipcodeOrigin,
            },
            destination: {
                company: rate.corporateNameDestination,
                firstName: rate.contactNameDestination.split(' ')[0],
                lastName: rate.contactNameDestination.split(' ')[1],
                fullName: rate.contactNameDestination,
                email: rate.emailDestination,
                phone: rate.phoneNumberDestination,
                street: rate.phoneNumberDestination,
                number: '32',
                suburb: rate.neighborhoodDestination,
                fullAddress: rate.shipperStreetLines1,
                state: rate.cityDestination,
                crossStreet: rate.recipientStreetLines1,
                reference: rate.shipperReference,
                zipCode: rate.zipcodeDestination,
            },
        };

        console.log(shipmentRequest);

        return Promise.resolve(shipmentRequest);
    }

}
