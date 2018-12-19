import chai from "chai";
import http from "chai-http";
import JWT from "jsonwebtoken";
import randomstring from "randomstring";
import delay from "delay";
import moment from "moment";
import * as userHelpers from '../../helpers/userHelpers';
import * as config from '../../config';
import * as sqlHelpers from '../../helpers/sqlHelpers';
import * as tokenHelpers from '../../helpers/tokenHelpers';
import * as connectionHelpers from '../../helpers/connectionHelpers';
import * as user_templates from '../../response_templates/user_templates';
import chaiJsonPattern from 'chai-json-pattern';
import addContext from 'mochawesome/addContext';

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
afterEach(function () {
    if (this.currentTest.state === 'failed') {
        addContext(this, {
            title: 'How I feel when tests fail',
            value: 'http://i.imgur.com/c4jt321.png'
        })
    }
})

describe("API Authentication Tests", function () {
    describe("Endpoint /api/user", function () {
        describe("successfully registers a user", function () {
            describe("with valid credentials", function () {
                let response;
                let user = userHelpers.randomUserCredentials();
                let userDB;
                let readUserTemplate = user_templates.userCurrentRT();
                before(async function () {
                    response = await chai.request(API).post("/user").send(user);
                    userDB = await sqlHelpers.getUserByName(pool, user.username)
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readUserTemplate);
                })
                it("user should appear in database", function () {
                    expect(userDB.username).to.equal(user.username);
                })
            })
            describe("with a username equal to 63 chars or less", function () {
                let response;
                let user = userHelpers.randomUserCredentials("TEST", 59, "alphanumeric", 6, "numeric")
                user.firstName = "FIRST" + randomstring.generate({
                    length: 58,
                    charset: "alphabetic"
                })
                let userDB;
                let readUserTemplate = user_templates.userCurrentRT();
                before(async function () {
                    response = await chai.request(API).post("/user").send(user);
                    userDB = await sqlHelpers.getUserByName(pool, user.username)
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readUserTemplate);
                })
                it("user should appear in database", function () {
                    expect(userDB.username).to.equal(user.username);
                })
            })
        })
        describe("fails to register a user", function () {
            describe("that has already registered", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    await sqlHelpers.addUser(pool, user);
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 409", function () {
                    expect(response.statusCode).to.equal(409);
                })
                it("response body error should equal 'Conflict'", function () {
                    expect(response.body.error).to.equal("Conflict")
                })
            })
            describe("with a valid username with a leading space", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.username = " " + user.username;
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a valid password with a leading space", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.password = " " + user.password;
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a valid username with a trailing space", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.username = user.username + " ";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a valid password with a trailing space", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.password = user.password + " ";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a blank username", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.username = "";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a blank password", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.password = "";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with an alphanumeric password", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials("TEST_", 20, "alphabetic", 6, "alphanumeric")
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a username greater than 63 chars", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials("TEST_", 59, "alphanumeric", 6, "numeric")
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            // Failed test - BUG reported as GBA-436
            describe.skip("with an email greater than 255 chars", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let emailname = randomstring.generate({ length: 126, charset: "alphabetic" })
                    user.email = emailname + "@" + emailname + ".com";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })

            describe("with a first name greater than 63 chars", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.firstName = randomstring.generate({ length: 64, charset: "alphabetic" })
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a surname greater than 63 chars", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.surname = randomstring.generate({ length: 64, charset: "alphabetic" })
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a 5 char PIN", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials("TEST_", 20, "alphabetic", 5, "numeric")
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a 7 char PIN", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials("TEST_", 20, "alphabetic", 7, "numeric")
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a 6 char PIN with a special character", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials("TEST_", 20, "alphabetic", 5, "numeric")
                    user.password = user.password + "$";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a username with special characters", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.username = user.username + "!£$%^&*()";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a blank email", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.email = "";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a blank first name", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.firstName = "";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a blank surname", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.surname = "";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with an alphanumeric first name", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.firstName = user.firstName + "123";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with an alphanumeric surname", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.surname = user.surname + "123";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with an email missing '@' sign", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.email = user.username + ".com";
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with an email missing dot suffix", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    user.email = user.email.slice(0, -4);
                    response = await chai.request(API).post("/user").send(user);
                })
                it("should return a 400", function () {
                    expect(response.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(response.body.error).to.equal("Bad Request")
                })
            })
            describe("with a duplicate email", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let user2 = userHelpers.randomUserCredentials();
                    user2.email = user.email;
                    await chai.request(API).post("/user").send(user);
                    response = await chai.request(API).post("/user").send(user2);
                })
                it("should return a 409", function () {
                    expect(response.statusCode).to.equal(409);
                })
                it("response body error should equal 'Conflict'", function () {
                    expect(response.body.error).to.equal("Conflict");
                })
            })
        })
    })
    describe("Endpoint /api/token", function () {
        describe("should give a token pair to", function () {
            describe("a registered user", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                before(async function () {
                    await sqlHelpers.addUser(pool, user);
                    response = await chai.request(API).post("/token").send(user);
                })
                it("should give a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should contain access and refresh keys", function () {
                    expect(response.body).to.have.all.keys(["access", "refresh"]);
                })
                it("access property should not be empty or undefined", function () {
                    expect(response.body.access).not.to.be.oneOf(["", undefined])
                })
                it("refresh property should not be empty or undefined", function () {
                    expect(response.body.refresh).not.to.be.oneOf(["", undefined])
                })
            })
        })
        describe("should not give a token pair to", function () {
            describe("a random, non-registered user", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                before(async function () {
                    response = await chai.request(API).post("/token").send(user);
                })
                it("should give a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("should not contain access and refresh keys", function () {
                    expect(response.body).to.not.have.keys(["access", "refresh"]);
                })
            })
            describe("a random string refresh token", function () {
                let response
                before(async function () {
                    response = await chai.request(API).post("/token").send({ refresh: randomstring.generate({ length: 60, charset: "alphanumeric" }) });
                })
                it("should give a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("should not contain access and refresh keys", function () {
                    expect(response.body).to.not.have.keys(["access", "refresh"]);
                })
            })
            describe("a refresh token that has been previously used", function () {
                let user = userHelpers.randomUserCredentials();
                let response;
                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = await sqlHelpers.addRefreshToken(pool, userUUID, true);
                    response = await chai.request(API).post("/token").send({ refresh: token });
                })
                it("should give a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("should not contain access and refresh keys", function () {
                    expect(response.body).to.not.have.keys(["access", "refresh"]);
                })
            })
        })
        describe("should give multiple unique token pairs to a single user when requested with a 1s delay", function () {
            let user = userHelpers.randomUserCredentials();
            let token1;
            let token2;
            before(async function () {
                await sqlHelpers.addUser(pool, user);
                token1 = await chai.request(API).post("/token").send(user);
                await delay(1000);
                token2 = await chai.request(API).post("/token").send(user);
            })
            it("access tokens should not be the same", function () {
                expect(token1.body.access).to.not.equal(token2.body.access);
            })
            it("refresh tokens should not be the same", function () {
                expect(token1.body.refresh).to.not.equal(token2.body.refresh);
            })
        })

        describe("should allow the use of valid refresh tokens by a created user", function () {
            let user = userHelpers.randomUserCredentials();
            let token;
            let response
            before(async function () {
                let userUUID = await sqlHelpers.addUser(pool, user);
                token = await sqlHelpers.addRefreshToken(pool, userUUID);
                response = await chai.request(API).post("/token").send({ refresh: token });
            })
            it("should give a 201", function () {
                expect(response.statusCode).to.equal(201);
            })
            it("should contain access and refresh keys", function () {
                expect(response.body).to.have.all.keys(["access", "refresh"]);
            })
            it("access property should not be empty or undefined", function () {
                expect(response.body.access).not.to.be.oneOf(["", undefined])
            })
            it("refresh property should not be empty or undefined", function () {
                expect(response.body.refresh).not.to.be.oneOf(["", undefined])
            })
        })
    })
    describe("Token Expiry Tests", function () {
        describe("Access tokens", function () {
            describe("that have expired should not be accepted by the /api/user/current endpoint", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let expiredToken = tokenHelpers.generateAccessToken(userUUID, "1 seconds");
                    // We don't need to wait any time as the tokens generated by the tokenHelpers are backdated 30 seconds!
                    response = await chai.request(API).get("/user/current").set("Authorization", expiredToken);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
                it("response body message should be 'Access Denied'", function () {
                    expect(response.body.message).to.equal("Access Denied");
                })
            })
            describe("generated by the API should be valid for a day after issue", function () {
                let response;
                let timeIssued;
                const EXPECTED_DURATION_MINUTES = 60 * 24;
                const DURATION_TOLERANCE = 1;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    timeIssued = moment();
                    response = await chai.request(API).post("/token").send(user);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have an expiry time of a day", function () {
                    let decodedToken = JWT.decode(response.body.access);
                    let timeExpires = moment.unix(decodedToken.exp);
                    let tokenDuration = moment.duration(timeExpires.diff(timeIssued));
                    let durationMinutes = tokenDuration.asMinutes();
                    expect(durationMinutes).to.be.greaterThan(EXPECTED_DURATION_MINUTES - DURATION_TOLERANCE);
                    expect(durationMinutes).to.be.lessThan(EXPECTED_DURATION_MINUTES + DURATION_TOLERANCE);
                })
            })
        })
        describe("Refresh tokens", function () {
            describe("that have expired should not be accepted by the /api/token endpoint", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let expiredToken = await sqlHelpers.addRefreshToken(pool, userUUID, false, "1 second");
                    // We don't need to wait any time as the tokens generated by the tokenHelpers are backdated 30 seconds!
                    response = await chai.request(API).get("/token").send({ "refresh": expiredToken });
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body error should be 'Forbidden'", function () {
                    expect(response.body.error).to.equal("Forbidden");
                })
                it("response body message should be 'Access Denied'", function () {
                    expect(response.body.message).to.equal("Access Denied");
                })
            })
            describe("generated by the API should be valid for one year after issue", function () {
                let response;
                let timeIssued;
                const EXPECTED_DURATION_YEARS = 1;
                const DURATION_UNCERTAINTY = 1 / 365;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    timeIssued = moment();
                    response = await chai.request(API).post("/token").send(user);
                })
                it("should return a 201", function () {
                    expect(response.statusCode).to.equal(201);
                })
                it("should have an expiry time of one year", function () {
                    let decodedToken = JWT.decode(response.body.refresh);
                    let timeExpires = moment.unix(decodedToken.exp);
                    let tokenDuration = moment.duration(timeExpires.diff(timeIssued));
                    let durationMinutes = tokenDuration.asYears();
                    expect(durationMinutes).to.be.greaterThan(EXPECTED_DURATION_YEARS - DURATION_UNCERTAINTY);
                    expect(durationMinutes).to.be.lessThan(EXPECTED_DURATION_YEARS + DURATION_UNCERTAINTY);
                })
            })
        })
    })
})
