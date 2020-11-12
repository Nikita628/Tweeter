import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/Api';
import { SigninResult, SignUpData } from '../models/Auth';
import { ApiClient } from './api-client.service';

@Injectable()
export class AuthApiClient extends ApiClient {
    private readonly endpoint = "/auth/";

    public signIn(email: string, password: string): Observable<ApiResponse<SigninResult>> {
        return this.http.post<ApiResponse<SigninResult>>(`${environment.apiUrl}${this.endpoint}signin`, {
            login: email,
            password
        });
    }

    public signUp(signUpData: SignUpData): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}signup`, signUpData);
    }
}
