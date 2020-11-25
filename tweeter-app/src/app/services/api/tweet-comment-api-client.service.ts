import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TweetComment, TweetCommentSearchParam } from 'src/app/models/TweetComment';

import { environment } from 'src/environments/environment';
import { ApiPageResponse, ApiResponse } from '../../models/Api';
import { ApiClient } from './api-client.service';

@Injectable()
export class TweetCommentApiClient extends ApiClient {
    private readonly endpoint = "/tweetComment/";

    public search(param: TweetCommentSearchParam): Observable<ApiPageResponse<TweetComment>> {
        return this.http.post<ApiPageResponse<TweetComment>>(`${environment.apiUrl}${this.endpoint}search`, param);
    }

    public create(comment: TweetComment): Observable<ApiResponse<TweetComment>> {
        const form = new FormData();
        form.append("img", comment.img);
        comment.img = null;
        form.append("commentJson", JSON.stringify(comment));

        return this.http.post<ApiResponse<TweetComment>>(`${environment.apiUrl}${this.endpoint}create`, form);
    }

    public like(commentId: number): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}${this.endpoint}like/${commentId}`, {});
    }
}
