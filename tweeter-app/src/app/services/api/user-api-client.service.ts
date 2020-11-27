import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserSearchParam } from 'src/app/models/User';

import { environment } from 'src/environments/environment';
import { ApiPageResponse, ApiResponse } from '../../models/Api';
import { ApiClient } from './api-client.service';

@Injectable()
export class UserApiClient extends ApiClient {
    private readonly endpoint = "/user/";

    public search(param: UserSearchParam): Observable<ApiPageResponse<User>> {
        return this.http.post<ApiPageResponse<User>>(`${environment.apiUrl}${this.endpoint}search`, param);
    }

    public follow(userId: number): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}follow/${userId}`, {});
    }

    public unfollow(userId: number): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}unfollow/${userId}`, {});
    }
}
