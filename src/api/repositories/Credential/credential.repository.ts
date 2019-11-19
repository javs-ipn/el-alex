import { Credential } from '../../models/Credential/Credential';
import { CredentialType } from '../../types/enums/credential-type.enum';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Credential)
export class CredentialRepository extends Repository<Credential> {

    /**
     * @description Gets a credential needed by customer tenant id and credential type given.
     * @param {number} courierId The courier id to be found.
     * @param {number} tenant Customer tenant id.
     * @param {CredentialType} credentialType Credential type enum {RATE,SHIP,TRACK,POD}.
     * @returns {Promise<Credential>} Returns a credential required.
     */
    public async getCredentialByCourierIdTenantAndType(courierId: number, tenant: string, credentialType: CredentialType): Promise<Credential> {
        try {
            const credentialFound = await this.createQueryBuilder('credential')
                .innerJoinAndSelect('credential.courier', 'courier')
                .innerJoinAndSelect('courier.courierServices', 'courierService')
                .where('credential.courier_id = :courierId', { courierId })
                .andWhere('credential.tenant_id = :tenant', { tenant })
                .andWhere('credential.type = :credentialType', { credentialType })
                .getOne();
            return credentialFound;
        } catch (error) {
            throw error;
        }
    }
}
