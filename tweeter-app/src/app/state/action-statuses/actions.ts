import { Action } from "@ngrx/store";
import { IPayloadedAction } from 'src/app/models/Common';

export const actionTypes = {
    clearActionStatus: "ActionStatuses/ClearActionStatus",
};

export const actionCreators = {
    clearActionStatus: (actionType: string): Action & IPayloadedAction<string> => {
        return {
            type: actionTypes.clearActionStatus,
            payload: actionType,
        };
    },
};
