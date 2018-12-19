import chai from "chai";
import http from "chai-http";
import randomstring from "randomstring";
import * as userHelpers from '../../helpers/userHelpers';
import * as config from '../../config';
import * as sqlHelpers from '../../helpers/sqlHelpers';
import * as tokenHelpers from '../../helpers/tokenHelpers';
import * as connectionHelpers from '../../helpers/connectionHelpers';
import * as payee_templates from '../../response_templates/payee_templates';
import chaiJsonPattern from 'chai-json-pattern';

const API = config.API;
const expect = chai.expect;

chai.use(http);
chai.use(chaiJsonPattern);

let pool;

before(async function () {
    this.enableTimeouts(false);
    pool = await sqlHelpers.getPool();
    await connectionHelpers.checkDBPoolConnection(pool);
    await sqlHelpers.setupDatabase(pool);
    await connectionHelpers.checkAPIConnection(30, 1000);
})
after(async function () {
    await sqlHelpers.closePool(pool);
})

describe("API Payee Tests", function () {
    describe("Endpoint /api/payee", function () {
        describe("should create a payee", function () {
            describe("by a user with admin credentials", function () {
                let response;
                let readPayeeTemplate = payee_templates.payeeRT();

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = "PAYEE_" + randomstring.generate({ "length": 30, "charset": "alphanumeric" });

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readPayeeTemplate);
                })
            })
            describe("with 63 characters in the payee name", function () {
                let response;
                let readPayeeTemplate = payee_templates.payeeRT();

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = randomstring.generate({ "length": 63, "charset": "alphanumeric" });

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readPayeeTemplate);
                })
            })
        })
        describe("should fail to create a payee", function () {
            describe("with a non-admin user", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = "PAYEE_" + randomstring.generate({ "length": 30, "charset": "alphanumeric" });

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with a blank payee name", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = "";

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a missing payee parameter", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send();
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with special characters in the payee name", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = "PAYEE_" + randomstring.generate({ "length": 30, "charset": "alphanumeric" }) + "!£$%^&*()";

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a leading space in the payee name", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = " PAYEE_" + randomstring.generate({ "length": 30, "charset": "alphanumeric" });

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a trailing space in the payee name", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = "PAYEE_" + randomstring.generate({ "length": 30, "charset": "alphanumeric" }) + " ";

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with greater than 63 characters in the payee name", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = randomstring.generate({ "length": 64, "charset": "alphanumeric" });

                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            // Failed test - BUG reported as GBA-468
            describe.skip("with a duplicate payee name", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payee = await sqlHelpers.addPayee(pool);
                    response = await chai.request(API).post("/payee").set('content-type', 'text/plain').set("Authorization", token).send(payee.description);
                })
                it("should return a 409", function () {
                    expect(response.statusCode).to.equal(409);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
    })
    describe("Endpoint /api/payee/{id}/summary", function () {
        describe("should get transaction summary for a specific payee", function () {
            describe("with a valid user", function () {
                let response;
                let i;
                let total = 0;
                let readPayeeTemplate;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let description = "";
                    let payee = await sqlHelpers.addPayee(pool);

                    for (i = 0; i < 10; i++) {
                        let amount = -Math.floor(Math.random() * 1000);
                        let date = new Date();
                        let category = await sqlHelpers.addCategory(pool);

                        total += amount;

                        await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);
                    }
                    readPayeeTemplate = payee_templates.payeeSummaryRT(total, i);
                    response = await chai.request(API).get("/payee/" + payee.uuid + "/summary").set("Authorization", token)
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readPayeeTemplate);
                })
            })
        })
        describe("should NOT get transaction summary", function () {
            describe("for an invalid payee", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let payeeid = "12345678-9abc-defg-hijk-lmnopqrstuvx";

                    response = await chai.request(API).get("/payee/" + payeeid + "/summary").set("Authorization", token)
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid token", function () {
                let response;

                before(async function () {
                    let token = "";
                    let payeeid = await sqlHelpers.addPayee(pool);

                    response = await chai.request(API).get("/payee/" + payeeid + "/summary").set("Authorization", token)
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a random string access token", function () {
                let response;

                before(async function () {
                    let token = randomstring.generate({ "length": 20, "charset": "alphanumeric" });
                    let payeeid = await sqlHelpers.addPayee(pool);

                    response = await chai.request(API).get("/payee/" + payeeid + "/summary").set("Authorization", token)
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
    })
    describe("Endpoint /api/payee/all", function () {
        describe("should get all payees", function () {
            describe("with a valid user", function () {
                let response;
                let readPayeeTemplate = payee_templates.payeeRT();

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);

                    response = await chai.request(API).get("/payee/all").set("Authorization", token)
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                        expect(response.body[0]).to.matchPattern(readPayeeTemplate);
                })
            })
        })
        describe("should NOT get all payees", function () {
            describe("with an invalid token", function () {
                let response;

                before(async function () {
                    let token = "";

                    response = await chai.request(API).get("/payee/all").set("Authorization", token)
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with a random string access token", function () {
                let response;

                before(async function () {
                    let token = randomstring.generate({ "length": 20, "charset": "alphanumeric" });

                    response = await chai.request(API).get("/payee/all").set("Authorization", token)
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
        })
    })
})
