import chai from "chai";
import http from "chai-http";
import randomstring from "randomstring";
import * as userHelpers from '../../helpers/userHelpers';
import * as tokenHelpers from '../../helpers/tokenHelpers';
import * as sqlHelpers from '../../helpers/sqlHelpers';
import * as config from '../../config';
import * as connectionHelpers from '../../helpers/connectionHelpers';
import * as user_templates from '../../response_templates/user_templates';
import chaiJsonPattern from 'chai-json-pattern';
import bcrypt from 'bcrypt'

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

describe("API User Tests", function () {
    describe("Endpoint /api/user/current", function () {
        describe("should allow a valid user to delete themselves with a valid access token", function () {
            let response;
            before(async function () {
                let user = userHelpers.randomUserCredentials();
                let userUUID = await sqlHelpers.addUser(pool, user);
                let token = tokenHelpers.generateAccessToken(userUUID);
                response = await chai.request(API).del("/user/current").set("Authorization", token);
            })
            it("should return a 204", function () {
                expect(response.statusCode).to.equal(204);
            })
            it("response body should be empty", function () {
                expect(response.body).to.be.empty;
            })
        })
        describe("should not allow a random string access token to delete a user", function () {
            let response;
            before(async function () {
                response = await chai.request(API).del("/user/current").set("Authorization", randomstring.generate({ "length": 20, "charset": "alphanumeric" }));
            })
            it("should return a 403", function () {
                expect(response.statusCode).to.equal(403);
            })
            it("response body error should equal 'Forbidden'", function () {
                expect(response.body.error).to.equal('Forbidden');
            })
        })
        describe("should provide user details to", function () {
            describe("a valid user with a valid access token", function () {
                let response;
                let readUserTemplate = user_templates.userCurrentRT();
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    response = await chai.request(API).get("/user/current").set("Authorization", token);
                })
                it("should return a 200", function () {
                    expect(response.statusCode).to.equal(200);
                })
                it("should have correct response body", function () {
                    expect(response.body).to.matchPattern(readUserTemplate)
                })
            })
        })
        describe("should not provide user details to", function () {
            describe("a deleted user with a previously valid access token should not be able to get their user details", function () {
                let response;
                before(async function () {
                    let user = userHelpers.randomUserCredentials();
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    await sqlHelpers.deleteUser(pool, userUUID);
                    response = await chai.request(API).get("/user/current").set("Authorization", token);
                })
                it("should return a 403", function () {
                    expect(response.statusCode).to.equal(403);
                })
                it("response body should be empty", function () {
                    expect(response.body).to.be.empty;
                })
            })
        })
        describe("should allow a user to update", function () {
            describe("the user property 'username'", function () {
                let user = userHelpers.randomUserCredentials();
                let userUpdate = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    let updateDetail = { "username": userUpdate.username };
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, userUUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new username", function () {
                    expect(updatedInfo.username).to.equal(userUpdate.username);
                })
            })
            describe("the user property 'email'", function () {
                let user = userHelpers.randomUserCredentials();
                let userUpdate = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    let updateDetail = { "email": userUpdate.email };
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, userUUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new email", function () {
                    expect(updatedInfo.email).to.equal(userUpdate.email);
                })
            })
            describe("the user property 'firstName'", function () {
                let user = userHelpers.randomUserCredentials();
                let userUpdate = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    let updateDetail = { "firstName": userUpdate.firstName };
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, userUUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new first name", function () {
                    expect(updatedInfo.first_name).to.equal(userUpdate.firstName);
                })
            })
            describe("the user property 'surname'", function () {
                let user = userHelpers.randomUserCredentials();
                let userUpdate = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    let updateDetail = { "surname": userUpdate.surname };
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, userUUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new surname", function () {
                    expect(updatedInfo.surname).to.equal(userUpdate.surname);
                })
            })
            describe("the user property 'password'", function () {
                let user = userHelpers.randomUserCredentials();
                let userUpdate = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    let updateDetail = { "password": userUpdate.password };
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, userUUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new encrypted password", function (){
                    expect(bcrypt.compareSync(userUpdate.password, updatedInfo.password)).be.true;
                })
            })
            describe("the user property 'firstName' to that of another registered user", function () {
                let user = userHelpers.randomUserCredentials();
                let user2 = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let user1UUID = await sqlHelpers.addUser(pool, user);
                    await sqlHelpers.addUser(pool, user2);
                    let token = tokenHelpers.generateAccessToken(user1UUID);
                    let updateDetail = { "firstName": user2.firstName }
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, user1UUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new password", function () {
                    expect(updatedInfo.first_name).to.equal(user2.firstName);
                })
            })
            describe("the user property 'surname' to that of another registered user", function () {
                let user = userHelpers.randomUserCredentials();
                let user2 = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let user1UUID = await sqlHelpers.addUser(pool, user);
                    await sqlHelpers.addUser(pool, user2);
                    let token = tokenHelpers.generateAccessToken(user1UUID);
                    let updateDetail = { "surname": user2.surname }
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, user1UUID);
                })
                it("request should return a 200", function () {
                    expect(updateResult.statusCode).to.equal(200);
                })
                it("response body should be empty", function () {
                    expect(updateResult.body).to.be.empty;
                })
                it("after the attempted update, retreival of user info should show the new password", function () {
                    expect(updatedInfo.surname).to.equal(user2.surname);
                })
            })
        })
        describe.skip("should not allow a user to update", function () {
            //Failed test - BUG reported as GBA-516
            describe("the user property 'id'", function () {
                let user = userHelpers.randomUserCredentials();
                let updateResult;
                let userUUID;
                let updatedInfo;
                before(async function () {
                    userUUID = await sqlHelpers.addUser(pool, user);
                    let token = tokenHelpers.generateAccessToken(userUUID);
                    let updateDetail = { "id": "New ID" };
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, userUUID);
                })
                it("update should return a 400", function () {
                    expect(updateResult.statusCode).to.equal(400);
                })
                it("response body error should equal 'Bad Request'", function () {
                    expect(updateResult.body.error).to.equal("Bad Request")
                })
                it("after the attempted update, retreival of user info should show the original id", function () {
                    expect(updatedInfo.id).to.equal(userUUID);
                })
            })
            //Failed test - BUG reported as GBA-314
            describe("the user property 'username' to that of another registered user", function () {
                let user = userHelpers.randomUserCredentials();
                let user2 = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let user1UUID = await sqlHelpers.addUser(pool, user);
                    await sqlHelpers.addUser(pool, user2);
                    let token = tokenHelpers.generateAccessToken(user1UUID);
                    let updateDetail = { "username": user2.username }
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, user1UUID);
                })
                it("request should return a 409", function () {
                    expect(updateResult.statusCode).to.equal(409);
                })
                it("response body error should equal 'Conflict'", function () {
                    expect(updateResult.body.error).to.equal("Conflict")
                })
                it("after the attempted update, retreival of user info should show the original username", function () {
                    expect(updatedInfo.username).to.equal(user.username);
                })
            })
            //Failed test - BUG reported as GBA-314 
            describe("the user property 'email' to that of another registered user", function () {
                let user = userHelpers.randomUserCredentials();
                let user2 = userHelpers.randomUserCredentials();
                let updateResult;
                let updatedInfo;
                before(async function () {
                    let user1UUID = await sqlHelpers.addUser(pool, user);
                    await sqlHelpers.addUser(pool, user2);
                    let token = tokenHelpers.generateAccessToken(user1UUID);
                    let updateDetail = { "email": user2.email }
                    updateResult = await chai.request(API).patch("/user/current").set("Authorization", token).send(updateDetail);
                    updatedInfo = await sqlHelpers.getUserInfo(pool, user1UUID);
                })
                it("request should return a 409", function () {
                    expect(updateResult.statusCode).to.equal(409);
                })
                it("response body error should equal 'Conflict'", function () {
                    expect(updateResult.body.error).to.equal("Conflict")
                })
                it("after the attempted update, retreival of user info should show the original email", function () {
                    expect(updatedInfo.email).to.equal(user.email);
                })
            })            
        })
    })
})
