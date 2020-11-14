import { Injectable } from "@angular/core";
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class NotificationService {
    private readonly err = "Error";
    private readonly suc = "Success";

    constructor(private notification: NotificationsService) {

    }

    public error(messages = ["Something went wrong"]): void {
        for (const i of messages) {
            this.notification.error(this.err, i);
        }
    }

    public success(messages = ["Action has been completed"]): void {
        for (const i of messages) {
            this.notification.success(this.suc, i);
        }
    }
}
