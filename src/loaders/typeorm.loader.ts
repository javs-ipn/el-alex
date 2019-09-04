import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createConnection } from 'typeorm';

import { env } from '../env';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {

    const connection = await createConnection({
        type: env.db.type as any, // See createConnection options for valid types
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        synchronize: env.db.synchronize,
        timezone: env.db.timezone,
        options: {
            encrypt: env.db.encrypt,
        },
        logging: env.db.logging,
        entities: env.app.dirs.entities,
        migrations: env.app.dirs.migrations,
        namingStrategy: new SnakeNamingStrategy(),
    });

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.close());
    }
};
