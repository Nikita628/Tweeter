export interface IPayloadedAction<T> {
    payload: T;
}

export interface IActionStatuses {
    [actionType: string]: "progress" | "success" | "error" | null;
}

export function cloneAndReplace(
    obj: IActionStatuses,
    actionType: string,
    status: "progress" | "success" | "error" | null
): IActionStatuses {
    return {
        ...obj,
        [actionType]: status,
    };
}

export class Notifier {
    notifyListener: (data?: any) => void = () =>  this.onEmit();
    onEmit: (data?: any) => void = () => { };
}
