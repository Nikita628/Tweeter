import { Action } from "@ngrx/store";
import { SigninResult, SignUpData } from '../models/Auth';
import { IPayloadedAction } from '../models/Common';
import { User } from '../models/User';

export interface IAuthState {
    user: User;
    token: string;
}

const initialState = {
    user: null,
    token: null
};

export const actionTypes = {
    signin: "Auth/Signin",
    signinSuccess: "Auth/SigninSuccess",
    signinError: "Auth/SigninError",
    signout: "Auth/Signout",
    autoSignout: "Auth/AutoSignout",
    autoSignin: "Auth/AutoSignin",
    signup: "Auth/Signup",
    signupSuccess: "Auth/SignupSuccess",
    signupError: "Auth/SignupError",
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
        type: actionTypes.signinError
    }),
    signout: (): Action => ({
        type: actionTypes.signout
    }),
    autoSignout: (timeout: number): Action & IPayloadedAction<number> => ({
        type: actionTypes.autoSignout,
        payload: timeout
    }),
    autoSignin: (): Action => ({
        type: actionTypes.autoSignin
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
    })
};

const reducerMap = {
    [actionTypes.signinSuccess]: (state: IAuthState, action: Action & IPayloadedAction<SigninResult>): IAuthState => {
        return { ...state, user: action.payload.user, token: action.payload.token };
    },
};

export function authReducer(state: IAuthState = initialState, action: any): IAuthState {
    if (reducerMap[action.type]) {
        return reducerMap[action.type](state, action);
    }
    return state;
}
