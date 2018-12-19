export const API = process.env.MCTEST_API; // Complete URL of the target API, including any prefixes such as '/api'
export const JWT_FQDN = process.env.JWT_FQDN;
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_IP = process.env.MCTEST_DB_IP; // IP of the SQL server
export const DB_PORT = process.env.MCTEST_DB_PORT; // Port of the SQL server
export const DB_USERNAME = process.env.MCTEST_DB_USERNAME; // SQL database username
export const DB_PASSWORD = process.env.MCTEST_DB_PASSWORD; // SQL database password
export const DB_DATABASE = process.env.MCTEST_DB_DATABASE; // SQL database name

let variables = [API, JWT_FQDN, JWT_SECRET, DB_IP, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE];
let allVariablesDefined = variables.every((variable) => { return typeof variable !== "undefined" && variable });
if (!allVariablesDefined) throw "CONFIGURATION ERROR: AN ENVIRONMENT VARIABLE IS NOT SET!";
