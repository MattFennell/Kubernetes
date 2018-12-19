import * as LoginRegisterService from '../../Services/CredentialInputService';
describe('Passcode Validation', () => {
  it('should detect valid passcode', () => {
    expect(LoginRegisterService.invalidPasscode('123456')).toBeFalsy();
  });

  it('should detect invalid characters (letters) in passcode field', () => {
    expect(LoginRegisterService.invalidPasscode('passcode')).toBeTruthy();
  });
  it('should detect invalid characters (e.g. *) in passcode field', () => {
    expect(LoginRegisterService.invalidPasscode('123465*/-')).toBeTruthy();
  });

  it('should detect when passcode is too short', () => {
    expect(LoginRegisterService.passcodeTooShort('123')).toBeTruthy();
  });

  it('should detects when passcode is not too short', () => {
    expect(LoginRegisterService.passcodeTooShort('123456')).toBeFalsy();
  });
});
