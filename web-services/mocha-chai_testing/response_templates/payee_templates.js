export function payeeRT() {
    return {
        "name": String,
        "id": String
    }
}

export function payeeSummaryRT(totalSpend = Number, totalVisits = Number) {
    return {
        "address": String,
        "totalSpend": totalSpend,
        "totalVisits": totalVisits
      }
}
