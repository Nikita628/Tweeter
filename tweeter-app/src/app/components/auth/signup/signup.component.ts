import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private readonly emailRegex = /.*@.*\.[A-Za-z]{2,10}/;

  public isSubmitDisabled = false;
  public isAlreadySubmitted = false;
  public name = "";
  public email = "";
  public password = "";
  public confirmation = "";

  public nameError = null;
  public emailError = null;
  public passwordError = null;
  public confirmationError = null;

  public onNameChange(name: string): void {
    this.name = name;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onEmailChange(email: string): void {
    this.email = email;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onPasswordChange(password: string): void {
    this.password = password;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onConfirmationChange(confirmation: string): void {
    this.confirmation = confirmation;
    if (this.isAlreadySubmitted) {
      this.validate();
    }
  }

  public onSubmit(): void {
    this.isAlreadySubmitted = true;
    this.validate();
    if (!this.isSubmitDisabled) {
      console.log("signup");
      // this.isSubmitDisabled = true;
      // TODO dispatch action to signup
    }
  }

  private validate(): void {
    if (this.name && this.name.length >= 4) {
      this.nameError = null;
    } else {
      this.nameError = "Name should be at least 4 characters long";
    }

    if (this.email && this.emailRegex.test(this.email)) {
      this.emailError = null;
    } else {
      this.emailError = "Please input a valid email";
    }

    if (this.password && this.password.length >= 4) {
      this.passwordError = null;
    } else {
      this.passwordError = "Password should be at least 4 characters long";
    }

    if (this.confirmation && this.confirmation === this.password) {
      this.confirmationError = null;
    } else {
      this.confirmationError = "Confirmation does not match the password";
    }

    this.setIsSubmitDisabled();
  }

  private setIsSubmitDisabled(): void {
    this.isSubmitDisabled = this.nameError
      || this.emailError
      || this.passwordError
      || this.confirmationError;
  }
}
