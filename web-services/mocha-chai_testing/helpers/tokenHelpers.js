import * as config from '../config';
import JWT from "jsonwebtoken";
import uuid4 from "uuid/v4";

const jwtBaseOptions = {
    audience: config.JWT_FQDN,
    issuer: config.JWT_FQDN,
    algorithm: "HS512"
}

const secret = config.JWT_SECRET;

function getTokenBaseOptions() {
    return Object.assign(jwtBaseOptions, {})
}

export function generateAccessToken(userUUID, expiresIn = "5 minutes") {
    let options = getTokenBaseOptions();
    options.expiresIn = expiresIn;
    options.subject = userUUID;
    return JWT.sign(
        {
            type: "access",
            iat: Math.floor(Date.now() / 1000) - 30
        },
        secret, options)
}

export function generateRefreshToken(userUUID, expiresIn, jwtid = uuid4()) {
    let options = getTokenBaseOptions();
    options.expiresIn = expiresIn;
    options.subject = userUUID;
    options.jwtid = jwtid;
    return JWT.sign(
        {
            type: "refresh",
            iat: Math.floor(Date.now() / 1000) - 30
        },
        secret, options)
}

