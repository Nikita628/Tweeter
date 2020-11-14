import { Action } from "@ngrx/store";
import { SigninResult, SignUpData } from '../models/Auth';
import { IPayloadedAction } from '../models/Common';
import { User } from '../models/User';

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

export const actionTypes = {
    signin: "Auth/Signin",
    signinSuccess: "Auth/SigninSuccess",
    signinError: "Auth/SigninError",

    signup: "Auth/Signup",
    signupSuccess: "Auth/SignupSuccess",
    signupError: "Auth/SignupError",

    autoSignin: "Auth/AutoSignin",
    autoSigninSuccess: "Auth/AutoSigninSuccess",
    autoSigninError: "Auth/AutoSigninError",

    signout: "Auth/Signout",
    autoSignout: "Auth/AutoSignout",

    clearSignupStatus: "Auth/ClearSignupStatus",
    clearSigninStatus: "Auth/ClearSigninStatus",
};

export const actionCreators = {
    signin: (email: string, password: string): Action & IPayloadedAction<{ email: string, password: string }> => ({
        type: actionTypes.signin,
        payload: { email, password }
    }),
    signinSuccess: (res: SigninResult): Action & IPayloadedAction<SigninResult> => ({
        type: actionTypes.signinSuccess,
        payload: res
    }),
    signinError: (): Action => ({
        type: actionTypes.signinError,
    }),

    signup: (data: SignUpData): Action & IPayloadedAction<SignUpData> => ({
        type: actionTypes.signup,
        payload: data
    }),
    signupSuccess: (): Action => ({
        type: actionTypes.signupSuccess
    }),
    signupError: (): Action => ({
        type: actionTypes.signupError
    }),

    autoSignin: (): Action => ({
        type: actionTypes.autoSignin
    }),
    autoSigninSuccess: (res: SigninResult): Action & IPayloadedAction<SigninResult> => ({
        type: actionTypes.autoSigninSuccess,
        payload: res
    }),
    autoSigninError: (): Action => ({
        type: actionTypes.autoSigninError,
    }),

    signout: (): Action => ({
        type: actionTypes.signout
    }),
    autoSignout: (timeout: number): Action & IPayloadedAction<number> => ({
        type: actionTypes.autoSignout,
        payload: timeout
    }),

    clearSigninStatus: (): Action => ({
        type: actionTypes.clearSigninStatus
    }),
    clearSignupStatus: (): Action => ({
        type: actionTypes.clearSignupStatus
    }),
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
