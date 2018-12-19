import * as LoginRegisterService from '../../Services/CredentialInputService';

describe('Email Validation', () => {
  it('should detect valid email for all text local part', () => {
    expect(LoginRegisterService.invalidEmail('alltext@gmail.com')).toBeFalsy();
  });

  it('should detect valid email for local part with text and numbers', () => {
    expect(LoginRegisterService.invalidEmail('alltext123@gmail.com')).toBeFalsy();
  });

  it('should detect valid email for local part with text separated by "."', () => {
    expect(LoginRegisterService.invalidEmail('notall.text@gmail.com')).toBeFalsy();
  });

  it('should detect valid email for local part with text separated by multiple "."', () => {
    expect(LoginRegisterService.invalidEmail('not.a.l.l.text@gmail.com')).toBeFalsy();
  });

  it('should detect valid email for all text domain part', () => {
    expect(LoginRegisterService.invalidEmail('johndoe@alltext.com')).toBeFalsy();
  });

  it('should detect valid email for domain part with text and numbers', () => {
    expect(LoginRegisterService.invalidEmail('johndoe@alltext123.com')).toBeFalsy();
  });

  it('should detect valid email for domain part with text separated by "."', () => {
    expect(LoginRegisterService.invalidEmail('johndoe@notall.text.com')).toBeFalsy();
  });

  it('should detect valid email for local part with text separated by multiple "."', () => {
    expect(LoginRegisterService.invalidEmail('johndoe@not.a.l.l.text.com')).toBeFalsy();
  });
  it('should detect when email is missing "@"', () => {
    expect(LoginRegisterService.invalidEmail('john.Doe123scottlogic.co.uk')).toBeTruthy();
  });
});
