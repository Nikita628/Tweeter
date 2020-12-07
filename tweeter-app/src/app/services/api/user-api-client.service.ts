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

    public get(userId: number): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(`${environment.apiUrl}${this.endpoint}get/${userId}`);
    }

    public update(user: User): Observable<ApiResponse<boolean>> {
        const form = new FormData();
        form.append("cover", user.cover);
        form.append("avatar", user.avatar);
        user.avatar = null;
        user.cover = null;
        form.append("userJson", JSON.stringify(user));

        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}update`, form);
    }
}
