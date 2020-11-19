import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';

import { environment } from 'src/environments/environment';
import { ApiPageResponse } from '../../models/Api';
import { ApiClient } from './api-client.service';

@Injectable()
export class TweetApiClient extends ApiClient {
    private readonly endpoint = "/tweet/";

    public search(param: TweetSearchParam): Observable<ApiPageResponse<Tweet>> {
        return this.http.post<ApiPageResponse<Tweet>>(`${environment.apiUrl}${this.endpoint}search`, param);
    }
}
