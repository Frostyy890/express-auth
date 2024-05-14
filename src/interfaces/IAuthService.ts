export default interface IAuthService {
  login(): Promise<void>;
  register(): Promise<void>;
}
