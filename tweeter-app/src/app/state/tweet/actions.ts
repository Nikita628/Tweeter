import { Action } from '@ngrx/store';
import { ApiPageResponse } from 'src/app/models/Api';
import { IPayloadedAction } from 'src/app/models/Common';
import { HashTag } from 'src/app/models/HashTag';
import { Tweet, TweetSearchParam } from 'src/app/models/Tweet';

export const actionTypes = {
    search: "Tweet/Search",
    searchSuccess: "Tweet/SearchSuccess",
    searchError: "Tweet/SearchError",

    create: "Tweet/Create",
    createSuccess: "Tweet/CreateSuccess",
    createError: "Tweet/CreateError",

    retweet: "Tweet/Retweet",
    retweetSuccess: "Tweet/RetweetSuccess",
    retweetError: "Tweet/RetweetError",

    like: "Tweet/Like",
    likeSuccess: "Tweet/LikeSuccess",
    likeError: "Tweet/LikeError",

    bookmark: "Tweet/Bookmark",
    bookmarkSuccess: "Tweet/BookmarkSuccess",
    bookmarkError: "Tweet/BookmarkError",

    searchHashtags: "Tweet/SearchHashtags",
    searchHashtagsSuccess: "Tweet/SearchHashtagsSuccess",
    searchHashtagsError: "Tweet/SearchHashtagsError",
};

export const actionCreators = {
    search: (param: TweetSearchParam, feedKey: string)
        : Action & IPayloadedAction<{ param: TweetSearchParam, feedKey: string }> => ({
            type: actionTypes.search,
            payload: { param, feedKey },
        }),
    searchSuccess: (res: ApiPageResponse<Tweet>, feedKey: string, append: boolean)
        : Action & IPayloadedAction<{ res: ApiPageResponse<Tweet>, feedKey: string, append: boolean }> => ({
            type: actionTypes.searchSuccess,
            payload: { res, feedKey, append }
        }),
    searchError: (feedKey: string): Action & IPayloadedAction<string> => ({
        type: actionTypes.searchError,
        payload: feedKey,
    }),

    create: (tweet: Tweet): Action & IPayloadedAction<Tweet> => ({
        type: actionTypes.create,
        payload: tweet,
    }),
    createSuccess: (tweet: Tweet): Action & IPayloadedAction<Tweet> => ({
        type: actionTypes.createSuccess,
        payload: tweet,
    }),
    createError: (): Action => ({
        type: actionTypes.createError,
    }),

    retweet: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.retweet,
        payload: { tweetId, feedKey },
    }),
    retweetSuccess: (tweet: Tweet, feedKey: string): Action & IPayloadedAction<{ tweet: Tweet, feedKey: string }> => ({
        type: actionTypes.retweetSuccess,
        payload: { tweet, feedKey },
    }),
    retweetError: (): Action => ({
        type: actionTypes.retweetError,
    }),

    like: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.like,
        payload: { tweetId, feedKey },
    }),
    likeSuccess: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.likeSuccess,
        payload: { tweetId, feedKey },
    }),
    likeError: (): Action => ({
        type: actionTypes.likeError,
    }),

    bookmark: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.bookmark,
        payload: { tweetId, feedKey },
    }),
    bookmarkSuccess: (tweetId: number, feedKey: string): Action & IPayloadedAction<{ tweetId: number, feedKey: string }> => ({
        type: actionTypes.bookmarkSuccess,
        payload: { tweetId, feedKey },
    }),
    bookmarkError: (): Action => ({
        type: actionTypes.bookmarkError,
    }),

    searchHashtags: (): Action => ({
        type: actionTypes.searchHashtags,
    }),
    searchHashtagsSuccess: (res: ApiPageResponse<HashTag>)
        : Action & IPayloadedAction<ApiPageResponse<HashTag>> => ({
            type: actionTypes.searchHashtagsSuccess,
            payload: res
        }),
    searchHashtagsError: (): Action => ({
        type: actionTypes.searchHashtagsError,
    }),
};
