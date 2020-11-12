import { authReducer, IAuthState } from './auth';

export interface IAppState {
    auth: IAuthState;
}

export const reducers = {
    auth: authReducer
};
