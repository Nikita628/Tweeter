import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { actionCreators as userAC, actionTypes as userAT } from "../../../state/user/actions";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { selectors as actionStatusesSE } from "../../../state/action-statuses/reducer";
import { actionCreators as actionStatusesAC } from "../../../state/action-statuses/actions";
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseComponent implements OnInit {
  @ViewChild("coverImg") coverEl: ElementRef<HTMLImageElement>;
  @ViewChild("avatarImg") avatarEl: ElementRef<HTMLImageElement>;

  settingsForm: FormGroup;
  coverUrl: string;
  avatarUrl: string;
  coverFile: File;
  avatarFile: File;

  constructor(
    protected store: Store<IAppState>,
    private fb: FormBuilder,
    private router: Router,
  ) {
    super(store);
    this.settingsForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      about: new FormControl(null),
      cover: new FormControl(null),
      avatar: new FormControl(null),
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.settingsForm.patchValue({
      username: this.currentUser.name,
      about: this.currentUser.about,
    });

    // this.store.select(actionStatusesSE.actionStatuses)
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe(statuses => {
    //     if (statuses[userAT.update] === "success") {
    //       this.store.dispatch(actionStatusesAC.clearActionStatus(userAT.update));
    //       this.router.navigate(["/home"]);
    //     }
    //   });

    if (this.currentUser.profileCoverUrl) {
      this.coverUrl = this.currentUser.profileCoverUrl;
    }

    this.avatarUrl = this.currentUser.avatarUrl
      ? this.currentUser.avatarUrl
      : "assets/user-placeholder.png";
  }

  public onCancel(): void {
    this.router.navigate(["/home"]);
  }

  public onSave(): void {
    const updatedUser: User = { ...this.currentUser };

    if (this.avatarFile) {
      updatedUser.avatar = this.avatarFile;
    }

    if (this.coverFile) {
      updatedUser.cover = this.coverFile;
    }

    updatedUser.name = this.settingsForm.get("username").value;
    updatedUser.about = this.settingsForm.get("about").value;

    this.store.dispatch(userAC.update(updatedUser));
  }

  public onCoverChange(file: File): void {
    this.coverFile = file;
    this.coverEl.nativeElement.src = URL.createObjectURL(file);
  }

  public onAvatarChange(file: File): void {
    this.avatarFile = file;
    this.avatarEl.nativeElement.src = URL.createObjectURL(file);
  }
}
