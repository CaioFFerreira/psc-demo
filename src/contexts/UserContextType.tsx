export interface UserContextType {
  userLogin(username: string, password: string): void;
  userLogout(): void;
  loading: boolean;
  login: boolean;
  data: any;
}
