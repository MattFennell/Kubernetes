import { isBoolean } from "util";

export function userCurrentRT() {
    return {
        "accountExpired": isBoolean,
        "authoritySet": [
            {
                "applicationUsers": null,
                "authority": String,
                "role" : String
            }
        ],
        "balance": Number,
        "credentialsExpired": isBoolean,
        "displayName": String,
        "email": String,
        "enabled": isBoolean,
        "firstName": String,
        "id": String,
        "locked": isBoolean,
        "nickname": String,
        "surname": String,
        "username": String
    };
}
