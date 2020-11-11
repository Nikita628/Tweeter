import { Injectable } from '@angular/core';

import { SignUpData } from '../models/Common';

@Injectable()
export class AuthApiClient {
    private readonly endpoint = "/auth/";

    public signIn(email: string, password: string): void {

    }

    public signUp(signUpData: SignUpData): void {

    }
}
