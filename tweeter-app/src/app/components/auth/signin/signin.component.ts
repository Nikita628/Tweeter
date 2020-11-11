import { Component } from "@angular/core";

@Component({
    selector: "app-signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.css"]
})
export class SigninComponent {
    public email = "";
    public password = "";

    public onSubmit(): void {
        // disable button and display spinner in button
        // dispatch action
    }
}
