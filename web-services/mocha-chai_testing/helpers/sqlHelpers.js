import uuid4 from "uuid/v4";
import mariadb from "mariadb";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import moment from "moment";
import randomstring from "randomstring";
import * as tokenHelpers from './tokenHelpers';
import * as config from '../config';

export async function getPool() {
    return await mariadb.createPool({ host: config.DB_IP, port: config.DB_PORT, user: config.DB_USERNAME, password: config.DB_PASSWORD, database: config.DB_DATABASE, connectTimeout: 1000, socketTimeout: 1000, acquireTimeout: 1000 });
}
export async function checkPool(pool) {
    pool.getConnection()
        .then(conn => {
        })
        .catch(err => {
            console.log("SETUP ERROR! CANNOT MAKE A CONNECTION TO THE DATABASE.")
            console.log(err)
            process.exit(1)
        })
}

export async function closePool(pool) {
    try {
        await pool.end();
    } catch (err) {
        throw err;
    }
}

export async function setupDatabase(pool) {
    let connection = await pool.getConnection();
    await checkAndAddUserAuthority(connection);
}

async function checkAndAddUserAuthority(connection) {
    let search;
    let authoritiesRequired = ["ROLE_ADMIN", "ROLE_USER"];
    search = await connection.query({
        sql: "SELECT role FROM gradapp.user_authority",
        rowsAsArray: true
    });
    let authoritiesInDatabase = new Set([].concat.apply([], search));


    let authoritiesToInsert = authoritiesRequired.filter((item) => {
        return !authoritiesInDatabase.has(item);
    })

    if (authoritiesToInsert.length > 0) {
        console.log("Inserting missing user authorities into database:", authoritiesToInsert);
        for (let i = 0; i < authoritiesToInsert.length; i++) {
            await connection.query("INSERT INTO user_authority VALUES (?)",
                [authoritiesToInsert[i]]);
        }
    }
}

async function linkUserAuthorityADMIN(connection, userUUID) {
    await connection.query("INSERT INTO appuser_userauthority (applicationuser_id, userauthority_id) VALUES (?, ?)",
        [userUUID, "ROLE_ADMIN"])
}
async function linkUserAuthorityUSER(connection, userUUID) {
    await connection.query("INSERT INTO appuser_userauthority (applicationuser_id, userauthority_id) VALUES (?, ?)",
        [userUUID, "ROLE_USER"])
}

function boolBufferToBool(boolBuffer) {
    return new Boolean(boolBuffer[0]);
}

export async function getUserInfo(pool, userUUID) {
    let connection = await pool.getConnection();

    let userQueryResult = await connection.query("SELECT * FROM application_user WHERE id = ?",
        userUUID);
    let details = userQueryResult[0]
    if (details === undefined) {
        return null
    }

    let authoritiesQueryResult = await connection.query({
        sql: "SELECT userauthority_id FROM appuser_userauthority WHERE applicationuser_id = :userUUID",
        rowsAsArray: true,
        namedPlaceholders: true
    }, { userUUID }
    );
    let userAuthorities = new Set([].concat.apply([], authoritiesQueryResult));
    details.authorities = userAuthorities;

    let bools = ['enabled', 'locked'];
    bools.forEach((key) => {
        details[key] = boolBufferToBool(details[key]);
    })
    return details;
}

export async function getUserByName(pool, username) {
    let connection = await pool.getConnection();

    let userQueryResult = await connection.query("SELECT * FROM application_user WHERE username = ?",
        username);
    let details = userQueryResult[0]
    if (details === undefined) {
        return null
    }
    return details;
}

export async function deleteUser(pool, userUUID) {
    let connection;
    try {
        connection = await pool.getConnection({});
        await connection.query(
            "DELETE FROM refresh_token WHERE (`user` = ?)",
            [userUUID]
        )
        await connection.query(
            "DELETE FROM appuser_userauthority WHERE (`applicationuser_id` = ?)",
            [userUUID]
        )
        await connection.query(
            "DELETE FROM application_user WHERE (`id` = ?)",
            [userUUID]
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
}

export async function addUser(pool, credentials, admin = false) {
    let userUUID = uuid4();
    let expiry = moment();
    expiry.add(1000, "years");
    let expiryString = expiry.format("YYYY-MM-DD HH:mm:ss")
    let connection;
    let salt = await bcrypt.genSalt(10, "a");
    let hashedPassword = await bcrypt.hash(credentials.password, salt); 
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO application_user (id, account_expiry, balance, credentials_expiry, display_name, email, enabled, first_name, locked, nickname, password, surname, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userUUID, expiryString, 420, expiryString, "DIS_" + credentials.username, credentials.email, true, credentials.firstName, false, "NN_" + credentials.username, hashedPassword, credentials.surname, credentials.username]
        )
        await linkUserAuthorityUSER(connection, userUUID);
        if (admin) {
            await linkUserAuthorityADMIN(connection, userUUID);
        }
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    return userUUID;
}

export async function addRefreshToken(pool, userUUID, used = false, expiresIn = "1000 years") {
    let token = tokenHelpers.generateRefreshToken(userUUID, expiresIn);
    let decoded = JWT.decode(token);
    let expiry = moment.unix(decoded.exp);
    let expiryString = expiry.format("YYYY-MM-DD HH:mm:ss")
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO refresh_token (refresh, expiry, used, user) VALUES (?, ?, ?, ?)",
            [decoded.jti, expiryString, used, decoded.sub]
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    return token;
}

export async function addCategory(pool) {
    let connection;
    let category = {
        description: "CATEGORY_" + randomstring.generate({ length: 20, charset: "alphanumeric" }),
        uuid: uuid4()
    }
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO category (id, description) VALUES (?, ?)",
            [category.uuid, category.description]
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    return category;
}

export async function addGeneralCategory(pool) {
    let connection;
    let category = {
        description: "General",
        uuid: uuid4()
    }
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO category (id, description) VALUES (?, ?)",
            [category.uuid, category.description]
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    return category;
}

export async function addPayee(pool) {
    let connection;
    let name = "PAYEE_" + randomstring.generate({ length: 20, charset: "alphanumeric" })
    let payee = {
        name,
        uuid: uuid4(),
        address: "ADDRESS OF PAYEE " + name
    }
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO payee (id, address, name) VALUES (?, ?, ?)",
            [payee.uuid, payee.address, payee.name]
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    return payee;
}

export async function addTransaction(pool, amount, date, description, categoryUUID, userUUID, payeeUUID) {
    let connection;
    let transaction = {
        uuid: uuid4(),
        amount,
        date,
        description,
        state: false,
        category: categoryUUID,
        customer: userUUID,
        payee: payeeUUID
    }
    try {
        connection = await pool.getConnection();
        await connection.query(
            "INSERT INTO transaction (id, amount, date, description, state, category, customer, payee) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [transaction.uuid, transaction.amount, transaction.date, transaction.description, transaction.state, transaction.category, transaction.customer, transaction.payee]
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    return transaction;
}

export async function getTransaction(pool, transactionUUID) {
    let connection;
    let queryResult;
    try {
        connection = await pool.getConnection();
        queryResult = await connection.query(
            "SELECT * from transaction WHERE id = ?",
            transactionUUID
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    let transaction = queryResult[0];
    if (transaction === undefined) {
        return null;
    }
    transaction.state = boolBufferToBool(transaction.state);
    return transaction;
}

export async function getCategory(pool, categoryDescription) {
    let connection;
    let queryResult;
    try {
        connection = await pool.getConnection();
        queryResult = await connection.query(
            "SELECT * from category WHERE description = ?",
            categoryDescription
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    let category = queryResult[0];
    if (category === undefined) {
        return null;
    }
    return category;
}

export async function getCategoryByID(pool, categoryID) {
    let connection;
    let queryResult;
    try {
        connection = await pool.getConnection();
        queryResult = await connection.query(
            "SELECT * from category WHERE id = ?",
            categoryID
        )
    } catch (err) {
        throw err;
    } finally {
        if (connection) connection.end();
    }
    let category = queryResult[0];
    if (category === undefined) {
        return null;
    }
    return category;
}
