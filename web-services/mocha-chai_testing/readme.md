# web-services testing with Mocha & Chai
## Installation
Use `npm install` to install the dependencies necessary.
## Environment
The `config.js` file shows a list of environment variables that *must* be set for the tests to run.
The environment variable `NODE_TLS_REJECT_UNAUTHORIZED` must be set to `0` to connect to APIs that use self-signed certificates.

### Token setup
Access and refresh tokens must signed using the private key that is installed on the API.

To export private keys and certificates from the API Java KeyStore (JKS), the `keyExport.sh` tool can be used.
For usage instructions, run the tool with no arguments.
The tool exports both the key and certificate as PEM files which can be specified using the environment variables in `config.js`.

Additionally, the `issuer` parameter for the tokens must be set to the value used in the API server.
This can be set using the environment variable specified in `config.js`.

### Database setup
The tests require write-access to the API SQL database.
The database address, database name, and user credentials can be set with environment variables, as specified in `config.js`.

## Basic Usage
All tests should be placed in the `test` directory.
`npm run mocha test/**` should be used to run all the tests.

Custom `glob` paths could be specified to distinguish between fast and slow test files, when these are implemented.

As specified in `package.json`, the Mocha scripts pass the following arguments to Mocha:

`--require babel-core/register --require babel-polyfill` to allow `import` statements.
### CI Usage
Mocha can output `junit` reports, which is done by running tests with `npm run mocha:ci`.

A custom path for the report file is set in the environment variable `MOCHA_FILE`.
