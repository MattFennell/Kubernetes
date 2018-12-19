import chai from "chai";
import http from "chai-http";
import randomstring from "randomstring";
import * as userHelpers from '../../helpers/userHelpers';
import * as config from '../../config';
import * as sqlHelpers from '../../helpers/sqlHelpers';
import * as tokenHelpers from '../../helpers/tokenHelpers';
import * as connectionHelpers from '../../helpers/connectionHelpers';
import * as category_templates from '../../response_templates/category_templates';
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

describe("API Category Tests", function () {
    describe("Endpoint /api/category", function () {
        describe("should allow an admin to create categories", function () {
            let response;
            let category;
            let categoryDB;
            let readCategoryTemplate = category_templates.categoryRT();
            before(async function () {
                let user = userHelpers.randomUserCredentials();
                let userUUID = await sqlHelpers.addUser(pool, user, true);
                let token = await tokenHelpers.generateAccessToken(userUUID);
                category = "CATEGORY_" + randomstring.generate({ length: 20, charset: "alphanumeric" });

                response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send(category);

                categoryDB = await sqlHelpers.getCategory(pool, category);
            })
            it("should return a 201", function () {
                expect(response.statusCode).to.equal(201);
            })
            it("should have correct response body", function () {
                expect(response.body).to.matchPattern(readCategoryTemplate);
            })
            it("category should appear in database", function () {
                expect(categoryDB.description).to.equal(category);
            })
        })
        describe("should NOT allow a category to be created", function () {
            describe("by a non-admin", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let category = "CATEGORY_" + randomstring.generate({ length: 20, charset: "alphanumeric" });

                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send(category);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with a missing token", function () {
                let response;

                before(async function () {
                    let token = "";
                    let category = "CATEGORY_" + randomstring.generate({ length: 20, charset: "alphanumeric" });

                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send(category);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with an expired token", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let expiredToken = tokenHelpers.generateAccessToken(userUUID, "1 seconds");
                    let category = "CATEGORY_" + randomstring.generate({ length: 20, charset: "alphanumeric" });;

                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", expiredToken).send(category);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with an invalid category", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let category = "";

                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send(category);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a missing category", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);

                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send();
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with special characters", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let category = "!£$%^&*()";

                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send(category);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with 64+ characters in the category name", function () {
                let response;
    
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user, true);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let category = randomstring.generate({ "length": 64, "charset": "alphanumeric" });
    
                    response = await chai.request(API).post("/category").set('content-type', 'text/plain').set("Authorization", token).send(category);
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
    describe("Endpoint /api/category/all", function () {
        describe("should allow a user to get all categories", function () {
            let response;

            before(async function () {
                let user = userHelpers.randomUserCredentials();
                let userUUID = await sqlHelpers.addUser(pool, user);
                let token = await tokenHelpers.generateAccessToken(userUUID);

                response = await chai.request(API).get("/category/all").set('content-type', 'text/plain').set("Authorization", token)
            })
            it("should return a 200", function () {
                expect(response.statusCode).to.equal(200);
            })
            it("should have correct data keys", function () {
                expect(response.body[0]).to.have.keys("description", "id");
            })
        })
        describe("should NOT allow", function () {
            describe("an invalid token to get all categories", function () {
                let response;

                before(async function () {
                    let token = "";

                    response = await chai.request(API).get("/category/all").set('content-type', 'text/plain').set("Authorization", token)
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("an expired token to get all categories", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let expiredToken = tokenHelpers.generateAccessToken(userUUID, "1 seconds");

                    response = await chai.request(API).get("/category/all").set('content-type', 'text/plain').set("Authorization", expiredToken)
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("a random string access token to get all categories", function () {
                let response;

                before(async function () {
                    let token = randomstring.generate({ "length": 20, "charset": "alphanumeric" });

                    response = await chai.request(API).get("/category/all").set('content-type', 'text/plain').set("Authorization", token)
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should equal 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
        })
    })
    describe("Endpoint /api/category/date/total", function () {
        describe("should get total cost per category", function () {
            describe("within a valid date range", function () {
                let response;
                let readCategoryTemplate = category_templates.categoryDateTotalRT();

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let endDate = "9999-11-22T01:23:45.678Z";
                    let startDate = "1999-11-22T01:23:45.678Z";
                    let i;
                    let total = 0;
                    let category = await sqlHelpers.addCategory(pool);

                    for (i = 0; i < 10; i++) {
                        let amount = -Math.floor(Math.random() * 1000);
                        let date = new Date();
                        let payee = await sqlHelpers.addPayee(pool);
                        let description = "";
                        total += amount;
                        await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);
                    }

                    readCategoryTemplate.category.description = category.description;
                    readCategoryTemplate.category.id = category.uuid;
                    readCategoryTemplate.amountSpent = total;
                    readCategoryTemplate.totalVisits = i;

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ endDate: endDate, startDate: startDate })
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readCategoryTemplate);
                })
            })
            describe("with only a valid end date", function () {
                let response;
                let readCategoryTemplate = category_templates.categoryDateTotalRT();

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let endDate = "9999-11-22T01:23:45.678Z";
                    let i;
                    let total = 0;
                    let category = await sqlHelpers.addCategory(pool);

                    for (i = 0; i < 10; i++) {
                        let amount = -Math.floor(Math.random() * 1000);
                        let date = new Date();
                        let payee = await sqlHelpers.addPayee(pool);
                        let description = "";
                        total += amount;
                        await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);
                    }

                    readCategoryTemplate.category.description = category.description;
                    readCategoryTemplate.category.id = category.uuid;
                    readCategoryTemplate.amountSpent = total;
                    readCategoryTemplate.totalVisits = i;

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ endDate: endDate })
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readCategoryTemplate);
                })
            })
            describe("with only a valid start date", function () {
                let response;
                let readCategoryTemplate = category_templates.categoryDateTotalRT();

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let startDate = "1999-11-22T01:23:45.678Z";
                    let i;
                    let total = 0;
                    let category = await sqlHelpers.addCategory(pool);

                    for (i = 0; i < 10; i++) {
                        let amount = -Math.floor(Math.random() * 1000);
                        let date = new Date();
                        let payee = await sqlHelpers.addPayee(pool);
                        let description = "";
                        total += amount;
                        await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);
                    }

                    readCategoryTemplate.category.description = category.description;
                    readCategoryTemplate.category.id = category.uuid;
                    readCategoryTemplate.amountSpent = total;
                    readCategoryTemplate.totalVisits = i;

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ startDate: startDate })
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body[0]).to.matchPattern(readCategoryTemplate);
                })
            })
        })
        describe("should NOT get total cost per category", function () {
            describe("with no date query", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({})
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an end date before start date", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "1999-11-22T01:23:45.678Z";
                    let startDate = "9999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ endDate: endDate, startDate: startDate })
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid end date", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ endDate: "" })
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with an invalid start date", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await tokenHelpers.generateAccessToken(userUUID);
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ startDate: "" })
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body to be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
            describe("with a missing token", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = "";
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";
                    let startDate = "1999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ endDate: endDate, startDate: startDate })
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error to be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with an expired token", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let expiredToken = tokenHelpers.generateAccessToken(userUUID, "1 seconds");
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";
                    let startDate = "1999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", expiredToken).query({ endDate: endDate, startDate: startDate })
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error to be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
            describe("with a random string access token", function () {
                let response;

                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = randomstring.generate({ "length": 20, "charset": "alphanumeric" });
                    let amount = -Math.floor(Math.random() * 1000);
                    let date = new Date();
                    let category = await sqlHelpers.addCategory(pool);
                    let payee = await sqlHelpers.addPayee(pool);
                    let description = "";
                    let endDate = "9999-11-22T01:23:45.678Z";
                    let startDate = "1999-11-22T01:23:45.678Z";

                    await sqlHelpers.addTransaction(pool, amount, date, description, category.uuid, userUUID, payee.uuid);

                    response = await chai.request(API).get("/category/date/total").set("Authorization", token).query({ endDate: endDate, startDate: startDate })
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error to be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
            })
        })
    })
})
