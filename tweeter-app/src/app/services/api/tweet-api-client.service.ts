import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HashTag } from 'src/app/models/HashTag';
import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';

import { environment } from 'src/environments/environment';
import { ApiPageResponse, ApiResponse } from '../../models/Api';
import { ApiClient } from './api-client.service';

@Injectable()
export class TweetApiClient extends ApiClient {
    private readonly endpoint = "/tweet/";

    public search(param: TweetSearchParam): Observable<ApiPageResponse<Tweet>> {
        return this.http.post<ApiPageResponse<Tweet>>(`${environment.apiUrl}${this.endpoint}search`, param);
    }

    public create(tweet: Tweet): Observable<ApiResponse<Tweet>> {
        const form = new FormData();
        form.append("img", tweet.img);
        tweet.img = null;
        form.append("param", JSON.stringify(tweet));

        return this.http.post<ApiResponse<Tweet>>(`${environment.apiUrl}${this.endpoint}create`, form);
    }

    public retweet(tweetId: number): Observable<ApiResponse<Tweet>> {
        return this.http.put<ApiResponse<Tweet>>(`${environment.apiUrl}${this.endpoint}retweet/${tweetId}`, {});
    }

    public like(tweetId: number): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}like/${tweetId}`, {});
    }

    public bookmark(tweetId: number): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}bookmark/${tweetId}`, {});
    }

    public searchHashTags(): Observable<ApiPageResponse<HashTag>> {
        return this.http.post<ApiPageResponse<HashTag>>(`${environment.apiUrl}/hashtag/search`, {});
    }
}
