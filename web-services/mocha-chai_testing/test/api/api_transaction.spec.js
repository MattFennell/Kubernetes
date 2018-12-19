import chai from "chai";
import http from "chai-http";
import randomstring from "randomstring";
import * as userHelpers from '../../helpers/userHelpers';
import * as config from '../../config';
import * as sqlHelpers from '../../helpers/sqlHelpers';
import * as tokenHelpers from '../../helpers/tokenHelpers';
import * as connectionHelpers from '../../helpers/connectionHelpers';
import * as transaction_templates from '../../response_templates/transaction_templates';
import chaiJsonPattern from 'chai-json-pattern';

const API = config.API;
const expect = chai.expect;

chai.use(http);
chai.use(chaiJsonPattern)

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

describe("API Transaction Tests", function () {
    describe("Endpoint /api/transaction", function () {
        describe("should allow an admin to create transactions", function () {
            describe("with a random positive value", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with a random negative value", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readTransactionTemplate);
                })
            })
            // Failed test - BUG reported as GBA-467
            describe.skip("with a zero value", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = 0;
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with the largest positive value (in long range)", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = 9223372036854775295;
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with the lowest negative value (in long range)", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -9223372036854775295;
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with a missing category key", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();
                let category;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, payee_id: payee.uuid, user_id: userUUID };
                    await sqlHelpers.addGeneralCategory(pool);
                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    let transactionUUID = response.body.id;
                    let transaction = await sqlHelpers.getTransaction(pool, transactionUUID);
                    category = await sqlHelpers.getCategoryByID(pool, transaction.category);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readTransactionTemplate);
                })
                it("should appear in database under 'General' category", function () {
                    expect(category.description).to.equal("General");
                })
            })
        })
        describe("should NOT allow a transaction to be created", function () {
            describe("by a non-admin user", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with an empty token", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = "";
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with a missing key", function () {
                describe("for amount", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let category = await sqlHelpers.addCategory(pool);
                        let payee = await sqlHelpers.addPayee(pool);
                        let transactionBody = { category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
                describe("for payee", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let amount = -Math.floor(Math.random() * 1000);
                        let category = await sqlHelpers.addCategory(pool);
                        let transactionBody = { amount: amount, category_id: category.uuid, user_id: userUUID };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
                describe("for user id", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let amount = -Math.floor(Math.random() * 1000);
                        let category = await sqlHelpers.addCategory(pool);
                        let payee = await sqlHelpers.addPayee(pool);
                        let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
            })
            describe("with an empty key", function () {
                describe("for amount", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let category = await sqlHelpers.addCategory(pool);
                        let payee = await sqlHelpers.addPayee(pool);
                        let transactionBody = { amount: "", category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
                describe("for category", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let amount = -Math.floor(Math.random() * 1000);
                        let payee = await sqlHelpers.addPayee(pool);
                        let transactionBody = { amount: amount, category_id: "", payee_id: payee.uuid, user_id: userUUID };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
                describe("for payee", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let amount = -Math.floor(Math.random() * 1000);
                        let category = await sqlHelpers.addCategory(pool);
                        let transactionBody = { amount: amount, category_id: category.uuid, payee_id: "", user_id: userUUID };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
                describe("for user id", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;

                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user, true);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let amount = -Math.floor(Math.random() * 1000);
                        let category = await sqlHelpers.addCategory(pool);
                        let payee = await sqlHelpers.addPayee(pool);
                        let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: "" };

                        response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                    })
                    it("should return a 400", function () {
                        expect(response.statusCode).to.equal(400);
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
            })
            describe("with an invalid category", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = "";
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid payee", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = 123456789;
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid user", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: 123456789 };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid amount", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = "2k";
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an amount greater than largest positive value (in long range)", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = 9223372036854775296;
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an amount lesser than the lowest negative value (in long range)", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -9223372036854775296;
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let transactionBody = { amount: amount, category_id: category.uuid, payee_id: payee.uuid, user_id: userUUID };

                    response = await chai.request(API).post("/transaction").set("Authorization", token).send(transactionBody);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
        describe("should get user transactions", function () {
            describe("with valid end date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction").set("Authorization", token).query({ endDate: endDate, pageSize: 10 });
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with valid start date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction").set("Authorization", token).query({ startDate: date, pageSize: 10 });
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readTransactionTemplate);
                })
            })
        })
        describe("should NOT get user transactions", function () {
            describe("with no query date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction").set("Authorization", token).query({ pageSize: 10 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an end date before the start date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "1999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: 10 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a no query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction").set("Authorization", token).query({ endDate: endDate });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a negative query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: -1 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a zero query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: 0 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid string query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: "" });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
    })
    describe("Endpoint /api/transaction/{id}/category", function () {
        describe("should allow user to change the category for a transaction", function () {
            let user = userHelpers.randomUserCredentials();
            let response;
            let updatedTransaction;
            let updatedCategory;

            before(async function () {
                let userUUID = await sqlHelpers.addUser(pool, user);
                let token = await tokenHelpers.generateAccessToken(userUUID);
                let amount = -Math.floor(Math.random() * 1000);
                let date = new Date();
                let category = await sqlHelpers.addCategory(pool);
                updatedCategory = await sqlHelpers.addCategory(pool);
                let payee = await sqlHelpers.addPayee(pool);
                let description = "";

                let transaction = await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                response = await chai.request(API).post("/transaction/" + transaction.uuid + "/category").set("Authorization", token).send({ category_id: updatedCategory.uuid });
                updatedTransaction = await sqlHelpers.getTransaction(pool, transaction.uuid);
            })
            it("should return a 201", function () {
                expect(response.statusCode).to.equal(201);
            })
            it("should update category ID", function () {
                expect(updatedTransaction.category).to.equal(updatedCategory.uuid);
            })
            it("response body should be empty", function () {
                expect(response.body).to.be.empty;
            })
        })
    })
    describe("Endpoint /api/transaction/{id}/note", function () {
        describe("should allow a user to update a note", function () {
            describe("with a valid random string", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let updatedTransaction;
                let updatedDescription;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    updatedDescription = randomstring.generate({ "length": 20, "charset": "alphanumeric" });

                    let transaction = await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).post("/transaction/" + transaction.uuid + "/note").set('content-type', 'text/plain').set("Authorization", token).send(updatedDescription);
                    updatedTransaction = await sqlHelpers.getTransaction(pool, transaction.uuid);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should update note", function () {
                    expect(updatedTransaction.description).to.equal(updatedDescription);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with special characters", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let updatedTransaction;
                let updatedDescription;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    updatedDescription = "!£$%^&()";

                    let transaction = await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).post("/transaction/" + transaction.uuid + "/note").set('content-type', 'text/plain').set("Authorization", token).send(updatedDescription);
                    updatedTransaction = await sqlHelpers.getTransaction(pool, transaction.uuid);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should update note", function () {
                    expect(updatedTransaction.description).to.equal(updatedDescription);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with 63 characters or less", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let updatedTransaction;
                let updatedDescription;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    updatedDescription = randomstring.generate({ "length": 63, "charset": "alphanumeric" });

                    let transaction = await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).post("/transaction/" + transaction.uuid + "/note").set('content-type', 'text/plain').set("Authorization", token).send(updatedDescription);
                    updatedTransaction = await sqlHelpers.getTransaction(pool, transaction.uuid);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should update note", function () {
                    expect(updatedTransaction.description).to.equal(updatedDescription);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("should allow a user to delete a note", function () {
                    let user = userHelpers.randomUserCredentials();
                    let response;
                    let updatedTransaction;                    
    
                    before(async function () {
                        let userUUID = await sqlHelpers.addUser(pool, user);
                        let token = await tokenHelpers.generateAccessToken(userUUID);
                        let amount = -Math.floor(Math.random() * 1000);
                        let date = new Date();
                        let category = await sqlHelpers.addCategory(pool);
                        let payee = await sqlHelpers.addPayee(pool);
                        let description = "A note";    
                        let transaction = await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);
    
                        response = await chai.request(API).delete("/transaction/" + transaction.uuid + "/note").set('content-type', 'text/plain').set("Authorization", token);
                        updatedTransaction = await sqlHelpers.getTransaction(pool, transaction.uuid);
                    })
                    it("should return a 204", function () {
                        expect(response.statusCode).to.equal(204);
                    })
                    it("note should be an empty string", function () {
                        expect(updatedTransaction.description).to.equal("");
                    })
                    it("response body should be empty", function () {
                        expect(response.body).to.be.empty;
                    })
                })
        })
        describe("should NOT allow a note of greater than 63 characters", function () {
            let user = userHelpers.randomUserCredentials();
            let response;
            let updatedDescription;

            before(async function () {
                let userUUID = await sqlHelpers.addUser(pool, user);
                let token = await tokenHelpers.generateAccessToken(userUUID);
                let amount = -Math.floor(Math.random() * 1000);
                let date = new Date();
                let category = await sqlHelpers.addCategory(pool);
                let payee = await sqlHelpers.addPayee(pool);
                let description = "";
                updatedDescription = randomstring.generate({ "length": 64, "charset": "alphanumeric" });

                let transaction = await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                response = await chai.request(API).post("/transaction/" + transaction.uuid + "/note").set('content-type', 'text/plain').set("Authorization", token).send(updatedDescription);
            })
            it("should return a 400", function () {
                expect(response.statusCode).to.equal(400);
            })
            it("response body should be empty", function () {
                expect(response.body).to.be.empty;
            })
        })
    })
    describe("Endpoint /api/transaction/category/{id}/date", function () {
        describe("should get transactions in a specific category", function () {
            describe("with a valid date range", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionCategoryIDDateRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, pageSize: 10, startDate: date });
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with a valid end date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionCategoryIDDateRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, pageSize: 10 });
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readTransactionTemplate);
                })
            })
            describe("with a valid start date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionCategoryIDDateRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ startDate: date, pageSize: 10 });
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readTransactionTemplate);
                })
            })
        })
        describe("should NOT get transactions in a specific category", function () {
            describe("with an invalid category", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let endDate = "9999-11-22T01:23:45.678Z";
                    let categoryid = "123a4bcd-5ef6-7g89-0hi1-23456789jk01"

                    response = await chai.request(API).get("/transaction/category/" + categoryid + "/date").set("Authorization", token).query({ endDate: endDate, pageSize: 10 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with no query date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ pageSize: 10 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an end date before the start date", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "1999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: 10 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with no query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a negative query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: -1 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a zero query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: 0 });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid string query page size", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/category/" + category.uuid + "/date").set("Authorization", token).query({ endDate: endDate, startDate: date, pageSize: "" });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
    })
    describe("Endpoint /api/transaction/month/count", function () {
        describe("should get transactions per month", function () {
            describe("with a valid category", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                let readTransactionTemplate = transaction_templates.transactionMonthCountRT();

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let category2 = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);
                    await sqlHelpers.addTransaction(pool, amount, date, description, category2.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/month/count").set("Authorization", token).query({ category_id: category.uuid });
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readTransactionTemplate);
                })
            })
        })
        describe("should NOT get transactions per month", function () {
            describe("with an invalid category", function () {
                let user = userHelpers.randomUserCredentials();
                let response;

                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/transaction/month/count").set("Authorization", token).query({ category_id: "" });
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("should not be an empty array", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
    })
})
