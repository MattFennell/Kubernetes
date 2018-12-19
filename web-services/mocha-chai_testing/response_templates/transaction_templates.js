import { isString } from "util";

export function transactionRT(){
    return   {
        "amount": Number,
        "category": {
          "description": String,
          "id": String
        },
        "date": String,
        "description": isString,
        "id": String,
        "payee": {
          "id": String,
          "name": String
        }
      }
}

export function transactionCategoryIDDateRT() {
    return {
        "amount": Number,
        "category": {
            "description": String,
            "id": String
        },
        "date": String,
        "description": isString,
        "id": String,
        "payee": {
            "id": String,
            "name": String
        }
    }
}

export function transactionMonthCountRT() {
    return {
        "count": Number,
        "month": Number,
        "year": Number
    }
}
