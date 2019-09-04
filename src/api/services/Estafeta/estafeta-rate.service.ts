import * as XMLJS from 'xml2js';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigOptions } from './../../types/Estafeta/config-options.interface';
import { Content } from '../../types/enums/content-enum';
import { Credential } from './../../models/Credential/Credential';
import { GenericRateObject } from './../../types/RateRequest/generic-rate-object.class';
import { RateLocation } from './../../types/RateRequest/rate-location.class';
import { RatePackage } from 'src/api/types/RateRequest/rate-package.class';
import { Service } from 'typedi';
import { Courier } from 'src/api/models/Courier/Courier';

@Service()
export class EstafetaRateService {

    public static FREQUENCY_REQUEST = true;
    public static LIST_TYPE_REQUEST = true;

    public static headerString = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" `
        + ` xmlns:est="http://www.estafeta.com/">`
        + `<soapenv:Header/>`
        + `<soapenv:Body>`
        + `<est:FrecuenciaCotizador soapenv:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>`;

    public static footerString = `</est:FrecuenciaCotizador>`
        + `</soapenv:Body>`
        + `</soapenv:Envelope>`;

    /**
     * @description Creates the  Estafeta rate request string
     * @param {GenericRateObject} genericRateObject - Generic object exposed to every tenant
     * @param {Credential} credential - credential found for the tenant requesting the operation
     * @returns {string} - Estafeta rate request string
     */
    public createRateRequestXmlString(
        genericRateObject: GenericRateObject,
        credential: Credential): string {
        const rateRequestString =
            `${EstafetaRateService.headerString}`
            + `${this.createConfigString(credential)}`
            + `${this.createPackageRateRequest(genericRateObject.packages)}`
            + `${this.createOriginDestinationInfo(genericRateObject.shipperLocation, genericRateObject.recipientLocation)}`
            + `${EstafetaRateService.footerString}`;
        return rateRequestString;
    }

    /**
     * @description Calls to Estafeta FrecuenciaCotizador Webservice
     * @param {string} rateRequestString - Estafeta rate request string
     * @param {Courier} courier - Relatet tenant courier
     * @returns {Promise<any>} - Response
     */
    public async requestRateEstafeta(rateRequestString: string, courier: Courier): Promise<any> {
        const axiosRequestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'text/xml',
                'Accept': 'application/json',
            },
        };
        const estafetaRateRequest: Array<AxiosPromise<any>> = [];
        const axiosRequest = axios.post(courier.rateRequestUrl, rateRequestString, axiosRequestConfig);
        estafetaRateRequest.push(axiosRequest);
        return await Promise.all(estafetaRateRequest)
            .then((results: Array<AxiosResponse<any>>) => {
                const options = { explicitArray: false, tagNameProcessors: [XMLJS.processors.stripPrefix] };
                const rateResponse: any[] = [];
                results.forEach(async (axiosResponse: AxiosResponse<any>) => {
                    await XMLJS.parseString(axiosResponse.data, options, async (err, result) => {
                        if (err === null) {
                            rateResponse.push(result.Envelope.Body.FrecuenciaCotizadorResponse.FrecuenciaCotizadorResult.Respuesta);
                        }
                    });
                });
                // @TODO - Handle response for bussiness logic
                return Promise.resolve(rateResponse);
            }).catch((error) => {
                // @TODO - Handle response for errors of Estafeta service
                throw error;
            });
    }

    /**
     * @description Creates the config section  string
     * @param {Credential} credential - tenant id credential
     * @returns {string} - Rate config section string
     */
    private createConfigString(credential: Credential): string {
        const configOptions = this.getCourierOptions(credential.options);
        const credentialsString =
            `<est:idusuario>${configOptions.userId}</est:idusuario>` +
            `<est:usuario>${credential.username}</est:usuario>` +
            `<est:contra>${credential.password}</est:contra>` +
            `<est:esFrecuencia>${EstafetaRateService.FREQUENCY_REQUEST}</est:esFrecuencia>` +
            `<est:esLista>${EstafetaRateService.LIST_TYPE_REQUEST}</est:esLista>`;
        return credentialsString;
    }

    /**
     * @description Creates the package section  string
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {string} - Rate package section string
     */
    private createPackageRateRequest(ratePackages: RatePackage[]): string {
        const packageString =
            `<est:tipoEnvio>` +
            `<est:EsPaquete>${this.isPackageType(ratePackages)}</est:EsPaquete>` +
            `<est:Largo>${this.getTotalLength(ratePackages)}</est:Largo>` +
            `<est:Peso>${this.getTotalWeight(ratePackages)}</est:Peso>` +
            `<est:Alto>${this.getTotalHeight(ratePackages)}</est:Alto>` +
            `<est:Ancho>${this.getTotalWidth(ratePackages)}</est:Ancho>` +
            `</est:tipoEnvio>`;
        return packageString;
    }

    /**
     * @description Creates the package section  string
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {string} - Rate package section string
     */
    private createOriginDestinationInfo(shipperLocation: RateLocation, recipientLocation: RateLocation): string {
        const locationString =
            `<est:datosOrigen>` +
            `<est:string>${shipperLocation.zipcode}</est:string>` +
            `</est:datosOrigen>` +
            `<est:datosDestino>` +
            `<est:string>${recipientLocation.zipcode}</est:string>` +
            `</est:datosDestino>`;
        return locationString;
    }

    /**
     * @description - Checks wheter the rate is for documents only or non documents
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {boolean} true for documents or false for non_documents
     */
    private isPackageType(ratePackages: RatePackage[]): boolean {
        let isPackage = false;
        ratePackages.map((ratePackage: RatePackage) => {
            if (ratePackage.shipmentRateDetail.contentType === Content.DOCUMENTS) {
                isPackage = true;
            }
        });
        return isPackage;

    }

    /**
     * @description - Gets the total length for the packages
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {number} total length
     */
    private getTotalLength(ratePackages: RatePackage[]): number {
        let totalLength = 0;
        ratePackages.map((ratePackage: RatePackage) => {
            totalLength += ratePackage.packageInfo.length;
        });
        return totalLength;
    }

    /**
     * @description - Gets the total width for the packages
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {number} total width
     */
    private getTotalWidth(ratePackages: RatePackage[]): number {
        let totalWidth = 0;
        ratePackages.map((ratePackage: RatePackage) => {
            totalWidth += ratePackage.packageInfo.width;
        });
        return totalWidth;
    }

    /**
     * @description - Gets the total height for the packages
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {number} total height
     */
    private getTotalHeight(ratePackages: RatePackage[]): number {
        let totalHeight = 0;
        ratePackages.map((ratePackage: RatePackage) => {
            totalHeight += ratePackage.packageInfo.height;
        });
        return totalHeight;
    }

    /**
     * @description - Gets the total weight for the packages
     * @param {RatePackage} ratePackages - Packages to be rated
     * @returns {number} total weight
     */
    private getTotalWeight(ratePackages: RatePackage[]): number {
        let totalWeight = 0;
        ratePackages.map((ratePackage: RatePackage) => {
            totalWeight += ratePackage.packageInfo.weight;
        });
        return totalWeight;
    }

    /**
     * @description - Parses the courier config options into an object
     * @param {string} credentialOptions - courier config options string
     * @returns {ConfigOptions} Config options object
     */
    private getCourierOptions(credentialOptions: string): ConfigOptions {
        const configOptions: ConfigOptions = JSON.parse(credentialOptions);
        return configOptions;
    }
}
