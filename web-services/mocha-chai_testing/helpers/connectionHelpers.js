import delay from 'delay';
import chai from 'chai';
import moment from 'moment';
import * as config from '../config';
import http from "chai-http"

chai.use(http);
const API = config.API;

function dateStamp() {
    return `[${moment().format('YYYY-MM-DD HH:mm:ss')}]: `;
}

export async function checkAPIConnection(maxAttempts, msBetweenAttempts) {
    console.log("\n" + dateStamp() + `Attempting to connect to the API [${maxAttempts - 1} retries, ${msBetweenAttempts} ms delay]`)
    for (let i = 0; i < maxAttempts; i++) {
        try {
            await chai.request(API).get("/");
            console.log(dateStamp() + "API Connection Successful");
            return
        } catch (err) {
            if (i + 1 == maxAttempts) {
                console.error(dateStamp() + "SETUP ERROR! CANNOT MAKE A CONNECTION TO THE API!");
                console.error(err);
                process.exit(1);
            }
        }
        await delay(msBetweenAttempts);
    }
}

export async function checkDBPoolConnection(pool) {
    console.log("\n" + dateStamp() + "Attempting to connect to the database")
    pool.getConnection()
        .then(conn => {
            console.log(dateStamp() + "Database Connection Successful");
        })
        .catch(err => {
            console.error(dateStamp() + "SETUP ERROR! CANNOT MAKE A CONNECTION TO THE DATABASE!");
            console.error(err)
            process.exit(1)
        })
}
