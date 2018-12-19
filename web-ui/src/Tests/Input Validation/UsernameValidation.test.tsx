import * as LoginRegisterService from '../../Services/CredentialInputService';
describe('Username Validation', () => {
  it('should detect valid username', () => {
    expect(LoginRegisterService.invalidUsername('user123')).toBeFalsy();
  });

  it('should detect invalid characters (e.g. *) in username field', () => {
    expect(LoginRegisterService.invalidUsername("user123*4/'56")).toBeTruthy();
  });
});
