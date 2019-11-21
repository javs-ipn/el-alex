import * as _ from 'lodash';
import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CredentialRepository } from '../../repositories/Credential/credential.repository';
import { CredentialType } from '../../types/enums/credential-type.enum';
import { GenericBussinessLogicError } from '../../errors/Generic/generic-bussinessLogic.error';
import { Credential } from '../../models/Credential/Credential';
import { validate } from 'class-validator';
import { GenericValidationError } from '../../errors/Generic/generic-validation.error';

@Service()
export class CredentialService {

    constructor(
        @OrmRepository() private credentialRepository: CredentialRepository,
        @Logger(__filename) private log: LoggerInterface
    ) {
    }

    /**
     * @description Gets a credential needed by customer tenant id and credential type given.
     * @param {number} courierId Credential needed courier id.
     * @param {number} tenant Customer tenant id.
     * @param {CredentialType} credentialType Credential type enum {RATE,SHIP,TRACK,POD}.
     * @returns {Promise<Credential>} Returns a credential required otherwise throws an error.
     */
    public async getCredentialByCourierIdTenantAndType(courierId: number, tenant: string, credentialType: CredentialType): Promise<Credential> {
        this.log.debug('Credential by tenant and type ... ');
        let credentialFound: Credential;
        try {
            credentialFound = await this.credentialRepository.getCredentialByCourierIdTenantAndType(courierId, tenant, credentialType);
            if (!credentialFound) {
                throw new GenericBussinessLogicError(
                    `Not found credential with courierId: ${courierId} tenant: ${tenant} and credential type: ${credentialType} .`);
            }
        } catch (error) {
            throw new GenericBussinessLogicError(error.message, error);
        }
        return credentialFound;
    }

    /**
     * @description Save a new credential info.
     * @param {Credential} dataCredential The data of new credentail.
     * @returns {Promise<Credential>} The credential saved otherwise throws an error.
     */
    public async saveCredential(dataCredential: Credential): Promise<Credential> {
        this.log.debug('Save a new credential...');
        let credentialSaved: Credential;
        const errors = await validate(dataCredential);
        if (!_.isEmpty(errors)) {
            throw new GenericValidationError('Validation errors found while getting waybill request by paginated and params.', errors);
        } else {
            try {
                credentialSaved = await this.credentialRepository.save(dataCredential);
                if (!credentialSaved) {
                    throw new GenericBussinessLogicError(`Can not save credential.`);
                }
            } catch (error) {
                throw new GenericBussinessLogicError(error.message, error);
            }
        }
        return credentialSaved;
    }

}
