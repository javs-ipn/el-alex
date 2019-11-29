import {EntityRepository, Repository} from 'typeorm';
import {Client} from '../../models/Client/Client';

@EntityRepository(Client)
export class ClientRepository extends Repository<any> {

    public async login(client: any): Promise<any> {
        const clientsFound = await this.createQueryBuilder('client')
            .where('client.email = :email', {email: client.email})
            .andWhere('client.password = :password', {password: client.password})
            .getOne();
        return clientsFound;
    }

    public async clientRegister(client: any): Promise<any> {
        const registeredClient = await this.createQueryBuilder('client')
            .insert()
            .into(Client)
            .values([
                {
                    firstName: client.firstName,
                    lastName: client.lastName,
                    email: client.email,
                    password: client.password,
                    studentBallot: client.studentBallot,
                },
            ])
            .execute();
        return registeredClient;
    }
}
