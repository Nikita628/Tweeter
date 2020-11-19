import { ApiPageRequest } from './Api';
import { User } from './User';

export class Tweet {
    public id: number;
    public imgUrl: string;
    public text: string;
    public retweetedFromId: number;
    public likeCount: number;
    public retweetCount: number;
    public bookmarkCount: number;
    public commentCount: number;
    public onlyFollowedCanReply: boolean;
    public createdById: number;
    public isLikedByCurrentUser: boolean;
    public isBookmarkedByCurrentUser: boolean;
    public isCommentedByCurrentUser: boolean;
    public isRetweetedByCurrentUser: boolean;
    public createdAt: Date;
    public createdBy: User;
    public originalTweet: Tweet;
    public tweetComments: any[];
}

export class TweetSearchParam extends ApiPageRequest {
    public textContains: string;
    public createdById: number;
    public onlyWithComments: boolean;
    public onlyWithMedia: boolean;
    public onlyLikedByUserId: number;
    public followerId: number; // tweets of people whom this user follows
    public appendToExistingStorePage: boolean;
}
