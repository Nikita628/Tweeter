import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '.';
import { IActionStatuses } from '../models/Common';

export interface ICommonState {
    actionStatuses: IActionStatuses;
}

const initialState: ICommonState = {
    actionStatuses: {},
};

export const actionTypes = {
};

export const actionCreators = {
};

const reducerMap = {
};

export function commonReducer(state: ICommonState = initialState, action: Action): ICommonState {
    if (action.type) {
        if (!action.type.endsWith("Success") && !action.type.endsWith("Error")) {
            return {
                ...state,
                actionStatuses: {
                    ...state.actionStatuses,
                    [action.type]: "progress"
                },
            };
        } else if (action.type.endsWith("Success")) {
            const actionToComplete = action.type.match(/(.*)Success/)[1];
            const newState: ICommonState = { ...state, actionStatuses: { ...state.actionStatuses } };
            if (newState.actionStatuses[actionToComplete]) {
                newState.actionStatuses[actionToComplete] = "success";
            }
            return newState;
        } else if (action.type.endsWith("Error")) {
            const actionToComplete = action.type.match(/(.*)Error/)[1];
            const newState: ICommonState = { ...state, actionStatuses: { ...state.actionStatuses } };
            if (newState.actionStatuses[actionToComplete]) {
                newState.actionStatuses[actionToComplete] = "error";
            }
            return newState;
        }
    }
    return state;
}

export const selectFeature = (state: IAppState) => state.common;
export const selectors = {
    actionStatuses: createSelector(selectFeature, (state: ICommonState) => state.actionStatuses),
};
