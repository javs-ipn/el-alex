import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

import { Logger } from '../lib/logger';
import { TokenInfoInterface } from './TokenInfoInterface';

export function currentUserChecker(connection: Connection): (action: Action) => Promise<any | undefined> {
    const log = new Logger(__filename);

    return async function innerCurrentUserChecker(action: Action): Promise<any | undefined> {
        // here you can use request/response objects from action
        // you need to provide a user object that will be injected in controller actions
        // demo code:
        const tokeninfo: TokenInfoInterface = action.request.tokeninfo;
        const em = connection.createEntityManager();
        const user = await em.findOne<any>('UserModel', {
            where: {
                email: tokeninfo.user_id.replace('auth0|', ''),
            },
        });
        if (user) {
            log.info('Current user is ', user.toString());
        } else {
            log.info('Current user is undefined');
        }

        return user;
    };
}
