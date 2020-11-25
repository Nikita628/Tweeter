import { Action, createSelector } from "@ngrx/store";
import { IAppState } from '..';
import { SigninResult, SignUpData } from '../../models/Auth';
import { IPayloadedAction } from '../../models/Common';
import { User } from '../../models/User';
import { actionTypes } from "./actions";

export interface IAuthState {
    user: User;
    token: string;
    signinStatus: "loading" | "successLocal" | "successNetwork" | "errorLocal" | "errorNetwork" | null;
    signupStatus: "loading" | "success" | "error" | null;
}

const initialState: IAuthState = {
    user: null,
    token: null,
    signinStatus: null,
    signupStatus: null,
};

const reducerMap = {
    [actionTypes.signin]: (state: IAuthState): IAuthState => {
        return { ...state, signinStatus: "loading" };
    },
    [actionTypes.signinSuccess]: (
        state: IAuthState,
        action: Action & IPayloadedAction<SigninResult>
    ): IAuthState => {
        return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            signinStatus: "successNetwork"
        };
    },
    [actionTypes.signinError]: (state: IAuthState): IAuthState => {
        return { ...state, signinStatus: "errorNetwork" };
    },

    [actionTypes.signup]: (state: IAuthState): IAuthState => {
        return { ...state, signupStatus: "loading" };
    },
    [actionTypes.signupSuccess]: (state: IAuthState): IAuthState => {
        return { ...state, signupStatus: "success" };
    },
    [actionTypes.signupError]: (state: IAuthState): IAuthState => {
        return { ...state, signupStatus: "error" };
    },

    [actionTypes.autoSigninSuccess]: (state: IAuthState, action: Action & IPayloadedAction<SigninResult>): IAuthState => {
        return { ...state, user: action.payload.user, token: action.payload.token,  signinStatus: "successLocal" };
    },
    [actionTypes.autoSigninError]: (state: IAuthState): IAuthState => {
        return { ...state, signinStatus: "errorLocal" };
    },

    [actionTypes.clearSigninStatus]: (state: IAuthState): IAuthState => {
        return { ...state, signinStatus: null };
    },
    [actionTypes.clearSignupStatus]: (state: IAuthState): IAuthState => {
        return { ...state, signupStatus: null };
    },
};

export function authReducer(state: IAuthState = initialState, action: any): IAuthState {
    if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action);
    }
    return state;
}

export const selectFeature = (state: IAppState) => state.auth;
export const selectors = {
    currentUser: createSelector(selectFeature, (state: IAuthState) => state.user),
};
