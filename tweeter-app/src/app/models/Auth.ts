import { User } from './User';

export class SignUpData {
    public name: string;
    public email: string;
    public password: string;
}

export class SigninResult {
    public user: User;
    public token: string;
}
