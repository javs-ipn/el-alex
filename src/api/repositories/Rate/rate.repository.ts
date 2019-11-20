import { Repository, EntityRepository, getConnection, EntityManager } from 'typeorm';
import { Rate } from '../../models/Rate/rate.model';

@EntityRepository(Rate)
export class RateRepository extends Repository<Rate> {

    /**
     * @description Saves all given rates in database.
     * @param {Rate[]} rates Rates to save.
     * @returns {Rate[]} Returns the saved rates.
     */
    public async saveRates(rates: Rate[]): Promise<Rate[]> {
        const ratesSavedInDatabase  = await getConnection().transaction(async (entityManager: EntityManager) => {
            const rateRepoTransaction = entityManager.getCustomRepository(RateRepository);
            return rateRepoTransaction.save(rates);
        });
        return ratesSavedInDatabase;
    }

}
