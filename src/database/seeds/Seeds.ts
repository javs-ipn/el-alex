import { Connection, EntityManager } from 'typeorm';
import { Courier } from '../../api/models/Courier/Courier';
import { CourierService } from '../../api/models/CourierService/CourierService';
import { Factory, Seed } from 'src/lib/seed';

export class Seeds implements Seed {

    private readonly COURIER_DHL = 'DHL';
    private readonly COURIER_ESTAFETA = 'Estafeta';
    private readonly COURIER_FEDEX = 'Fedex';
    private readonly COURIER_REDPACK = 'RedPack';
    private readonly COURIER_PAQUETE_EXPRESS = 'Paquete Express';
    private readonly COURIER_ENVIOCLICK = 'EnvioClick';

    /**
     * Function to control flow of seed
     * @param factory Factory
     * @param connection Connection
     */
    public async seed(factory: Factory, connection: Connection): Promise<any> {
        const entityManager = connection.createEntityManager();

        console.log('Seeding process start...\n');

        console.log('Seeding Courier Catalog...\n');
        const deliveryServiceResult = await this.insertCourier(entityManager, connection);
        if (deliveryServiceResult) {
            console.log('Ok.');
        } else {
            console.log('Error trying to insert Couriers.\n');
        }

        console.log('Seeding Courier Service Catalog...\n');
        const deliveryServiceType = await this.insertCourierService(entityManager, connection);
        if (deliveryServiceType) {
            console.log('Ok.');
        } else {
            console.log('Error trying to insert Courier Services.\n');
        }
    }

    /**
     * @description Create registries necesaries of delivery service
     * @param entityManager
     * @param connection
     */
    public async insertCourier(entityManager: EntityManager, connection: Connection): Promise<boolean> {

        const couriersArray = [
            {
                name: this.COURIER_DHL,
                description: 'Paqueteria DHL',
                rateRequestUrl: 'https://wsbexpress.dhl.com/rest/sndpt/RateRequest',
                shipmentRequestUrl: 'https://wsbexpress.dhl.com/rest/sndpt/ShipmentRequest',
                trackingRequestUrl: 'https://wsbexpress.dhl.com/rest/sndpt/TrackingRequest',
                podRequestUrl: 'https://wsbexpress.dhl.com/rest/sndpt/getePOD',
                maxPackages: 30,
                isRest: true,
                rateAction: '',
                shipmentAction: '',
                trackingAction: '',
                podAction: '',
            },
            {
                name: this.COURIER_ESTAFETA,
                description: 'Paqueteria Estafeta',
                rateRequestUrl: 'http://frecuenciacotizador.estafeta.com/Service.asmx?WSDL',
                shipmentRequestUrl: 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl',
                trackingRequestUrl: 'https://trackingqa.estafeta.com/Service.asmx?wsdl',
                podRequestUrl: 'http://localhost:3000',
                maxPackages: 30,
                isRest: false,
                rateAction: '',
                shipmentAction: '',
                trackingAction: '',
                podAction: '',
            },
            {
                name: this.COURIER_REDPACK,
                description: 'Paqueteria Redpack',
                rateRequestUrl: 'http://localhost:3000',
                shipmentRequestUrl: 'http://localhost:3000',
                trackingRequestUrl: 'http://localhost:3000',
                podRequestUrl: 'http://localhost:3000',
                maxPackages: 30,
                isRest: false,
                rateAction: '',
                shipmentAction: '',
                trackingAction: '',
                podAction: '',
            },
            {
                name: this.COURIER_FEDEX,
                description: 'Paqueteria FEDEX',
                rateRequestUrl: 'http://localhost:3000',
                shipmentRequestUrl: 'http://localhost:3000',
                trackingRequestUrl: 'http://localhost:3000',
                podRequestUrl: 'http://localhost:3000',
                maxPackages: 30,
                isRest: false,
                rateAction: '',
                shipmentAction: '',
                trackingAction: '',
                podAction: '',
            },
            {
                name: this.COURIER_PAQUETE_EXPRESS,
                description: 'Paqueteria Paquete Express',
                rateRequestUrl: 'http://localhost:3000',
                shipmentRequestUrl: 'http://localhost:3000',
                trackingRequestUrl: 'http://localhost:3000',
                podRequestUrl: 'http://localhost:3000',
                maxPackages: 30,
                isRest: false,
                rateAction: '',
                shipmentAction: '',
                trackingAction: '',
                podAction: '',
            },
            {
                name: this.COURIER_ENVIOCLICK,
                description: 'EnvioClick',
                rateRequestUrl: 'http://localhost:3000',
                shipmentRequestUrl: 'http://localhost:3000',
                trackingRequestUrl: 'http://localhost:3000',
                podRequestUrl: 'http://localhost:3000',
                maxPackages: 30,
                isRest: true,
                rateAction: '',
                shipmentAction: '',
                trackingAction: '',
                podAction: '',
            },
        ];

        const repository = connection.getRepository(Courier);
        for (const courierItem of couriersArray) {
            try {
                const existCourier = await entityManager.findOne(Courier, { name: courierItem.name });
                if (!existCourier) {
                    const courierToSave = new Courier();
                    courierToSave.name = courierItem.name;
                    courierToSave.description = courierItem.description;
                    courierToSave.rateRequestUrl = courierItem.rateRequestUrl;
                    courierToSave.shipmentRequestUrl = courierItem.shipmentRequestUrl;
                    courierToSave.trackingRequestUrl = courierItem.trackingRequestUrl;
                    courierToSave.podRequestUrl = courierItem.podRequestUrl;

                    courierToSave.rateAction = courierItem.rateAction;
                    courierToSave.shipmentAction = courierItem.shipmentAction;
                    courierToSave.trackingAction = courierItem.trackingAction;
                    courierToSave.podAction = courierItem.podAction;
                    courierToSave.isRest = courierItem.isRest;
                    courierToSave.maxPackages = courierItem.maxPackages;
                    await repository.save(courierToSave);
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        }
        return true;

    }

    /**
     *
     * @param entityManager
     * @param connection
     */
    public async insertCourierService(entityManager: EntityManager, connection: Connection): Promise<boolean> {

        const dhl = await entityManager.findOne(Courier, { name: this.COURIER_DHL });
        const estafeta = await entityManager.findOne(Courier, { name: this.COURIER_ESTAFETA });
        const fedex = await entityManager.findOne(Courier, { name: this.COURIER_FEDEX });
        const redpack = await entityManager.findOne(Courier, { name: this.COURIER_REDPACK });
        // const paqueteExpress = await entityManager.findOne(Courier, { name: this.COURIER_PAQUETE_EXPRESS });
        // const envioclick = await entityManager.findOne(Courier, { name: this.COURIER_ENVIOCLICK });

        const deliveryServicesTypeArray = [
            // dhl
            {
                name: 'EXPRESS DOMESTIC 9:00',
                description: 'Entrega máximo 9:00 am al día siguiente hábil (Máx 30Kg)',
                serviceCode: 'I',
                isForeign: false,
                courierId: dhl.id,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 30,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
            },
            {
                name: 'EXPRESS DOMESTIC 10:30',
                description: 'Entrega máximo 10:30 am al día siguiente hábil (Máx 30 kg)',
                serviceCode: 'O',
                isForeign: false,
                courierId: dhl.id,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 30,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
            },
            {
                name: 'EXPRESS DOMESTIC 12:00',
                description: 'Entrega máximo 12:00 pm al día siguiente (Máx 30 Kg)',
                serviceCode: '1',
                isForeign: false,
                courierId: dhl.id,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 30,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
            },
            {
                name: 'DOMESTIC ECONOMY SELECT',
                description: 'Entrega de 2 a 3 días hábiles solo GDL y MTY  en horario abierto de 9:00 a 20:30 hrs (Min 2 Kg - Máx 2500 Kg)',
                serviceCode: 'G',
                isForeign: false,
                courierId: dhl.id,
                minWeight: 2,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 2500,
                minHeight: 0,
                minLength: 0,
            },
            {
                name: 'EXPRESS DOMESTIC',
                description: 'Entrega al dia siguiente hábil en horario abierto de 9:00 a 20:30 hrs',
                serviceCode: 'N',
                isForeign: false,
                courierId: dhl.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'EXPRESS 12:00',
                description: 'Entrega máximo 12:00 pm al día siguiente hábil',
                serviceCode: 'Y',
                isForeign: true,
                courierId: dhl.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'EXPRESS 10:30',
                description: 'Entrega máximo 10:30 am al día siguiente hábil',
                serviceCode: 'M',
                isForeign: true,
                courierId: dhl.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'EXPRESS WORDLWIDE',
                description: 'Entrega al día siguiente hábil en horario abierto',
                serviceCode: 'P',
                isForeign: true,
                courierId: dhl.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            // Estafeta
            {
                name: '09:30',
                description: 'Entrega al día siguiente hábil como maximo a las 09:30 am',
                serviceCode: '30',
                isForeign: false,
                courierId: estafeta.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: '11:30',
                description: 'Entrega al día siguiente hábil como maximo a las 11:30 am',
                serviceCode: '50',
                isForeign: false,
                courierId: estafeta.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'DIA SIG',
                description: 'Entrega al día siguiente hábil en horario abierto de 9 a 18 hrs',
                serviceCode: '60',
                isForeign: false,
                courierId: estafeta.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'DOS DIAS',
                description: 'Entrega como máximo a los dos días hábiles en horario abierto de 9 a 18 hrs',
                serviceCode: 'D0',
                isForeign: false,
                courierId: estafeta.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'TERRESTRE',
                description: 'Entrega de 3 a 5 días hábiles en horario abierto de 9 a 18 hrs',
                serviceCode: '70',
                isForeign: false,
                courierId: estafeta.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            // Fedex
            {
                name: 'NACIONAL FIRST',
                description: 'Entrega al día siguiente hábil como maximo a las 08:30 am',
                serviceCode: ' ',
                isForeign: false,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'NACIONAL PRIORITY',
                description: 'Entrega al día siguiente hábil como maximo a las 10:30 am',
                serviceCode: ' ',
                isForeign: false,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'NACIONAL STANDARD OVERNIGHT',
                description: 'Entrega de 1 a 2 días hábiles en horario abierto de 9 a 18',
                serviceCode: ' ',
                isForeign: false,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'NACIONAL ECONOMICO',
                description: 'Entrega de 2 a 5 días hábiles en horario abierto de 9 a 18 hrs',
                serviceCode: ' ',
                isForeign: false,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'INTERNATIONAL FIRST',
                description: 'Entrega 1 a 3 días hábiles en algunos destinos',
                serviceCode: ' ',
                isForeign: true,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'INTERNATIONAL PRIORITY',
                description: 'Entrega 1 a 3 días hábiles',
                serviceCode: ' ',
                isForeign: true,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'INTERNATIONAL ECONOMY',
                description: 'Entrega 4 a 6 días hábiles',
                serviceCode: ' ',
                isForeign: true,
                courierId: fedex.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            // REDPACk
            {
                name: 'EXPRESS',
                description: 'Entrega de 24 a 48 hrs hábiles en horario abierto de 9 a 18 hrs',
                serviceCode: ' ',
                isForeign: false,
                courierId: redpack.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'ECOEXPRESS',
                description: 'Entrega de 48 a 120 hrs hábiles en horario abierto de 9 a 18 hrs',
                serviceCode: ' ',
                isForeign: false,
                courierId: redpack.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
            {
                name: 'METROPOLITANO',
                description: 'Entrega en 48 hrs hábiles en horario abierto de 9 a 18 hrs de acuerdo a cobertura al cp',
                serviceCode: ' ',
                isForeign: false,
                courierId: redpack.id,
                minWeight: 0,
                minHeight: 0,
                minLength: 0,
                maxLength: 0,
                maxWidth: 0,
                minWidth: 0,
                maxHeight: 0,
                maxWeight: 0,
            },
        ];

        const repository = connection.getRepository(CourierService);
        for (const courierServiceItem of deliveryServicesTypeArray) {
            try {
                const existCourierService = await entityManager.findOne(CourierService, { name: courierServiceItem.name });
                if (!existCourierService) {
                    const courierService = new CourierService();
                    courierService.name = courierServiceItem.name;
                    courierService.isForeign = courierServiceItem.isForeign;
                    courierService.description = courierServiceItem.description;
                    courierService.serviceCode = courierServiceItem.serviceCode;
                    courierService.minWeight = courierServiceItem.minWeight;
                    courierService.maxWeight = courierServiceItem.maxWeight;
                    courierService.courierId = courierServiceItem.courierId;
                    courierService.maxLength = courierServiceItem.maxLength;
                    courierService.minLength = courierServiceItem.minLength;
                    courierService.maxWidth = courierServiceItem.maxWidth;
                    courierService.minWidth = courierServiceItem.minWidth;
                    courierService.maxHeight = courierServiceItem.maxHeight;
                    courierService.minHeight = courierServiceItem.minHeight;
                    await repository.save(courierService);
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        }
        return true;
    }

}
