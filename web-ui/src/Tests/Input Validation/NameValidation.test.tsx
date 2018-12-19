import * as LoginRegisterService from '../../Services/CredentialInputService';
describe('Name Validation', () => {
  it('should detect a simple valid name', () => {
    expect(LoginRegisterService.invalidName('John')).toBeFalsy();
  });
  it('should detect a valid name with a space', () => {
    expect(LoginRegisterService.invalidName('John Doe')).toBeFalsy();
  });
  it('should detect a valid name with brackets', () => {
    expect(LoginRegisterService.invalidName('Caíque (Carlos Henrique)')).toBeFalsy();
  });
  it('should detect a valid name with a dash', () => {
    expect(LoginRegisterService.invalidName('Kyle McGean-Jonathan-The-Second')).toBeFalsy();
  });
  it('should detect a valid Japanese name', () => {
    expect(LoginRegisterService.invalidName('愛莉, 愛梨')).toBeFalsy();
  });
  it('should detect a valid Lithuanian name', () => {
    expect(LoginRegisterService.invalidName('Vytautė Vinciūnaitė')).toBeFalsy();
  });
  it('should detect a valid name with an apostrophe', () => {
    expect(LoginRegisterService.invalidName("Kyle O'Brien")).toBeFalsy();
  });
  it('should detect an invalid name containing only digits', () => {
    expect(LoginRegisterService.invalidName('123')).toBeTruthy();
  });
  it('should detect an invalid name containing digits', () => {
    expect(LoginRegisterService.invalidName('123')).toBeTruthy();
    expect(LoginRegisterService.invalidName('Matt123')).toBeTruthy();
  });
});
