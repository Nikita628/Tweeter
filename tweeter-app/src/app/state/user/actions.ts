import { Action } from '@ngrx/store';
import { ApiPageResponse } from 'src/app/models/Api';
import { IPayloadedAction } from 'src/app/models/Common';
import { User, UserSearchParam } from 'src/app/models/User';

export const actionTypes = {
    search: "User/Search",
    searchSuccess: "User/SearchSuccess",
    searchError: "User/SearchError",

    follow: "User/Follow",
    followSuccess: "User/FollowSuccess",
    followError: "User/FollowError",

    unfollow: "User/Unfollow",
    unfollowSuccess: "User/UnfollowSuccess",
    unfollowError: "User/UnfollowError",

    get: "User/Get",
    getSuccess: "User/GetSuccess",
    getError: "User/GetError",

    update: "User/Update",
    updateSuccess: "User/UpdateSuccess",
    updateError: "User/UpdateError",
};

export const actionCreators = {
    search: (param: UserSearchParam, listKey: string)
        : Action & IPayloadedAction<{ param: UserSearchParam, listKey: string }> => ({
            type: actionTypes.search,
            payload: { param, listKey },
        }),
    searchSuccess: (res: ApiPageResponse<User>, listKey: string, append: boolean)
        : Action & IPayloadedAction<{ res: ApiPageResponse<User>, listKey: string, append: boolean }> => ({
            type: actionTypes.searchSuccess,
            payload: { res, listKey, append }
        }),
    searchError: (): Action => ({
        type: actionTypes.searchError,
    }),

    follow: (userId: number, listKey: string): Action & IPayloadedAction<{ userId: number, listKey: string }> => ({
        type: actionTypes.follow,
        payload: { userId, listKey },
    }),
    followSuccess: (userId: number, listKey: string): Action & IPayloadedAction<{ userId: number, listKey: string }> => ({
        type: actionTypes.followSuccess,
        payload: { userId, listKey },
    }),
    followError: (): Action => ({
        type: actionTypes.followError,
    }),

    unfollow: (userId: number, listKey: string): Action & IPayloadedAction<{ userId: number, listKey: string }> => ({
        type: actionTypes.unfollow,
        payload: { userId, listKey },
    }),
    unfollowSuccess: (userId: number, listKey: string): Action & IPayloadedAction<{ userId: number, listKey: string }> => ({
        type: actionTypes.unfollowSuccess,
        payload: { userId, listKey },
    }),
    unfollowError: (): Action => ({
        type: actionTypes.unfollowError,
    }),

    get: (userId: number): Action & IPayloadedAction<number> => ({
        type: actionTypes.get,
        payload: userId,
    }),
    getSuccess: (user: User): Action & IPayloadedAction<User> => ({
        type: actionTypes.getSuccess,
        payload: user,
    }),
    getError: (): Action => ({
        type: actionTypes.getError,
    }),

    update: (user: User): Action & IPayloadedAction<User> => ({
        type: actionTypes.update,
        payload: user,
    }),
    updateSuccess: (user: User): Action & IPayloadedAction<User> => ({
        type: actionTypes.updateSuccess,
        payload: user,
    }),
    updateError: (): Action => ({
        type: actionTypes.updateError,
    }),
};
