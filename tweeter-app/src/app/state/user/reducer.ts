import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '..';
import { ApiPageResponse } from '../../models/Api';
import { IPayloadedAction } from '../../models/Common';
import { actionTypes } from "./actions";
import { User } from 'src/app/models/User';

export interface IUserState {
    lists: { [listKey: string]: { users: User[], totalCount: number } };
}

const initialState: IUserState = {
    lists: {
        recommended: { users: [], totalCount: 0 },
    },
};

const reducerMap = {
    [actionTypes.searchSuccess]: (
        state: IUserState,
        action: Action & IPayloadedAction<{ res: ApiPageResponse<User>, listKey: string, append: boolean }>
    ): IUserState => {
        const listKey = action.payload.listKey;
        const users = action.payload.res.items;
        const totalCount = action.payload.res.totalCount;
        return {
            ...state,
            lists: {
                ...state.lists,
                [listKey]: action.payload.append
                    ? { users: [...state.lists[listKey].users, ...users], totalCount }
                    : { users, totalCount }
            }
        };
    },

    [actionTypes.followSuccess]: (
        state: IUserState,
        action: Action & IPayloadedAction<{ userId: number, listKey: string }>
    ): IUserState => {
        const userId = action.payload.userId;
        const listKey = action.payload.listKey;
        const users = state.lists[listKey].users.map((u: User): User => {
            if (u.id === userId) {
                return { ...u, followersCount: u.followersCount + 1, isFolloweeOfCurrentUser: true };
            }
            return u;
        });

        return {
            ...state,
            lists: {
                ...state.lists,
                [listKey]: { ...state.lists[listKey], users }
            },
        };
    },

    [actionTypes.unfollowSuccess]: (
        state: IUserState,
        action: Action & IPayloadedAction<{ userId: number, listKey: string }>
    ): IUserState => {
        const userId = action.payload.userId;
        const listKey = action.payload.listKey;
        const users = state.lists[listKey].users.map((u: User): User => {
            if (u.id === userId) {
                return { ...u, followersCount: u.followersCount - 1, isFolloweeOfCurrentUser: false };
            }
            return u;
        });

        return {
            ...state,
            lists: {
                ...state.lists,
                [listKey]: { ...state.lists[listKey], users }
            },
        };
    },
};

export function userReducer(state: IUserState = initialState, action: any): IUserState {
    if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action);
    }
    return state;
}

export const selectFeature = (state: IAppState) => state.user;
export const selectors = {
    list: createSelector(selectFeature, (state: IUserState, listKey: string) => state.lists[listKey]),
};
