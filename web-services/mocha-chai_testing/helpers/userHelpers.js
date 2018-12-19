import randomstring from "randomstring";

export function randomUserCredentials(prefix = "TEST", nameRandomLength = 30, nameRandomCharset = "alphanumeric", passwordLength = 6, passwordCharSet = "numeric") {
    let user = randomstring.generate({
        length: nameRandomLength,
        charset: nameRandomCharset
    })
    let name = randomstring.generate({
        length: nameRandomLength,
        charset: "alphabetic"
    })
    return {
        username: prefix + user,
        password: randomstring.generate({
            length: passwordLength,
            charset: passwordCharSet
        }),
        firstName: "FIRST" + name,
        surname: "LAST" + name,
        email: `${user}@${user}.com`
    }
}
