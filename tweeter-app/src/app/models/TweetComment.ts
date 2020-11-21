import { ApiPageRequest } from './Api';
import { User } from './User';

export class TweetComment {
    public id: number;
    public text: string;
    public imgUrl: string;
    public tweetId: number;
    public likeCount: number;
    public isLikedByCurrentUser: boolean;
    public createdAt: Date;
    public createdBy: User;
    public img: File;
}

export class TweetCommentSearchParam extends ApiPageRequest {
    public tweetId: number;
    public idLessThan: number;
}
