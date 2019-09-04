import * as _ from 'lodash';
import { Connection, createConnections } from 'typeorm';
import { env } from '../src/env';

const connectionName = 'databaseCreation';

const newConnections: Promise<Connection[]> = createConnections([{
    name: connectionName,
    username: env.db.username,
    password: env.db.password,
    type: env.db.type as any,
    host: env.db.host,
    port: env.db.port,
}]);

newConnections.then(async (connections: Connection[]) => {
    const connection = _.find(connections, (connectionF: Connection) => {
        return connectionF.name === connectionName;
    });
    if (connection) {
        const runner = connection.createQueryRunner();
        await runner.createDatabase(env.db.database, true);
        const hasDatabase = await runner.hasDatabase(env.db.database);
        connection.close();
        if (hasDatabase) {
            console.log(`Database ${env.db.database}  has been created successfully`);
            process.exit(0);
        } else {
            console.log(`Database ${env.db.database}  has not been created`);
            process.exit(1);
        }
    } else {
        console.log('No found connection to create database, please check the .env file or environment variables');
        process.exit(1);
    }
}).catch((error) => {
    console.log(error);
    process.exit(1);
});
