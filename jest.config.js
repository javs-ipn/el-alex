module.exports = {
    "collectCoverage": true,
    "coverageDirectory": "<rootDir>/coverage",
    "transform": {
        ".(ts|tsx)": "<rootDir>/test/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "testEnvironment": "node",
    "setupTestFrameworkScriptFile": "./test/unit/lib/setup.ts"
}


