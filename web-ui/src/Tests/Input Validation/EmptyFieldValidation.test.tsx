import * as LoginRegisterService from '../../Services/CredentialInputService';
describe('Empty Field Validation', () => {
  it('should detect an empty field', () => {
    expect(LoginRegisterService.emptyFields('')).toBeTruthy();
  });
  it('should detect multiple empty fields', () => {
    expect(LoginRegisterService.emptyFields('', '')).toBeTruthy();
  });
  it('should detect an empty field amongst a pool of filled-in fields', () => {
    expect(LoginRegisterService.emptyFields('firstName', '', 'firstName')).toBeTruthy();
  });
  it('should detect multiple empty fields amongst a pool of filled-in fields', () => {
    expect(
      LoginRegisterService.emptyFields('firstName', '', 'fir', 'name', '', 'mars', '')
    ).toBeTruthy();
  });
  it('should not detect an empty field if all fields are filled in', () => {
    expect(LoginRegisterService.emptyFields('hello', 'my', 'name', 'is', 'spongebob')).toBeFalsy();
  });
});
