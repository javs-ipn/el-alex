import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

import { env } from '../env';
import { createGraphQLServer } from '../lib/graphql';

export const graphqlLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.graphql.enabled) {
        const expressApp = settings.getData('express_app');

        createGraphQLServer(expressApp, {
            route: env.graphql.route,
            editorEnabled: env.graphql.editor,
            queries: env.app.dirs.queries,
            mutations: env.app.dirs.mutations,
            dataLoaders: {},
        });

    }
};
