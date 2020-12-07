import { Action } from "@ngrx/store";
import { createSelector } from '@ngrx/store';

import { IAppState } from '..';
import { IActionStatuses, IPayloadedAction } from '../../models/Common';
import { actionTypes } from './actions';

export interface IActionStatusesState {
    statuses: IActionStatuses;
}

const initialState: IActionStatusesState = {
    statuses: {},
};

export function actionStatusesReducer(state: IActionStatusesState = initialState, action: Action): IActionStatusesState {
    if (action.type) {
        if (action.type === actionTypes.clearActionStatus) {
            const actionType = (action as Action & IPayloadedAction<string>).payload;
            return {
                ...state,
                [actionType]: null,
            };
        }

        if (!action.type.endsWith("Success") && !action.type.endsWith("Error")) {
            return {
                ...state,
                statuses: {
                    ...state.statuses,
                    [action.type]: "progress"
                },
            };
        }

        if (action.type.endsWith("Success")) {
            const actionToComplete = action.type.match(/(.*)Success/)[1];
            const newState: IActionStatusesState = { ...state, statuses: { ...state.statuses } };
            if (newState.statuses[actionToComplete]) {
                newState.statuses[actionToComplete] = "success";
            }
            return newState;
        }

        if (action.type.endsWith("Error")) {
            const actionToComplete = action.type.match(/(.*)Error/)[1];
            const newState: IActionStatusesState = { ...state, statuses: { ...state.statuses } };
            if (newState.statuses[actionToComplete]) {
                newState.statuses[actionToComplete] = "error";
            }
            return newState;
        }
    }

    return state;
}

export const selectFeature = (state: IAppState) => state.actionStatuses;
export const selectors = {
    actionStatuses: createSelector(selectFeature, (state: IActionStatusesState) => state.statuses),
};
