import { Action } from '@ngrx/store';
import { ApiPageResponse } from 'src/app/models/Api';
import { IPayloadedAction } from 'src/app/models/Common';
import { TweetComment, TweetCommentSearchParam } from 'src/app/models/TweetComment';

export const actionTypes = {
    search: "TweetComment/Search",
    searchSuccess: "TweetComment/SearchSuccess",
    searchError: "TweetComment/SearchError",

    create: "TweetComment/Create",
    createSuccess: "TweetComment/CreateSuccess",
    createError: "TweetComment/CreateError",

    like: "TweetComment/Like",
    likeSuccess: "TweetComment/LikeSuccess",
    likeError: "TweetComment/LikeError",
};

export const actionCreators = {
    search: (param: TweetCommentSearchParam, feedKey: string)
        : Action & IPayloadedAction<{ param: TweetCommentSearchParam, feedKey: string }> => ({
            type: actionTypes.search,
            payload: { param, feedKey },
        }),
    searchSuccess: (res: ApiPageResponse<TweetComment>, feedKey: string, tweetId: number)
        : Action & IPayloadedAction<{ res: ApiPageResponse<TweetComment>, feedKey: string, tweetId: number }> => ({
            type: actionTypes.searchSuccess,
            payload: { res, feedKey, tweetId }
        }),
    searchError: (feedKey: string): Action & IPayloadedAction<string> => ({
        type: actionTypes.searchError,
        payload: feedKey,
    }),

    create: (comment: TweetComment, feedKey: string): Action & IPayloadedAction<{ comment: TweetComment, feedKey: string }> => ({
        type: actionTypes.create,
        payload: { comment, feedKey },
    }),
    createSuccess: (comment: TweetComment, feedKey: string): Action & IPayloadedAction<{ comment: TweetComment, feedKey: string }> => ({
        type: actionTypes.createSuccess,
        payload: { comment, feedKey },
    }),
    createError: (): Action => ({
        type: actionTypes.createError,
    }),

    like: (
        commentId: number,
        tweetId: number,
        feedKey: string
    ): Action & IPayloadedAction<{ commentId: number, tweetId: number, feedKey: string }> => ({
        type: actionTypes.like,
        payload: { commentId, tweetId, feedKey },
    }),
    likeSuccess: (
        commentId: number,
        tweetId: number,
        feedKey: string
    ): Action & IPayloadedAction<{ commentId: number, feedKey: string, tweetId: number }> => ({
        type: actionTypes.likeSuccess,
        payload: { commentId, feedKey, tweetId },
    }),
    likeError: (): Action => ({
        type: actionTypes.likeError,
    }),
};
