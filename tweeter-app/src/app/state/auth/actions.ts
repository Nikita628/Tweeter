import { Action } from '@ngrx/store';
import { SigninResult, SignUpData } from 'src/app/models/Auth';
import { IPayloadedAction } from 'src/app/models/Common';

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
