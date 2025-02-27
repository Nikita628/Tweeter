import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/state';
import { BaseComponent } from '../../common/base-component/base-component.component';
import { actionCreators as userAC, actionTypes as userAT } from "../../../state/user/actions";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { selectors as actionStatusSE } from "../../../state/action-statuses/reducer";
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild("coverImg") coverEl: ElementRef<HTMLImageElement>;
  @ViewChild("avatarImg") avatarEl: ElementRef<HTMLImageElement>;
  @ViewChild("aboutText") aboutText: ElementRef<HTMLTextAreaElement>;

  settingsForm: FormGroup;
  coverUrl: string;
  avatarUrl: string;
  coverFile: File;
  avatarFile: File;
  isSaving = false;
  isCoverSet = false;

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

    if (this.currentUser.profileCoverUrl) {
      this.isCoverSet = true;
      this.coverUrl = this.currentUser.profileCoverUrl;
    }

    this.avatarUrl = this.currentUser.avatarUrl
      ? this.currentUser.avatarUrl
      : "assets/user-placeholder.png";

    this.store.select(actionStatusSE.actionStatuses)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(statuses => {
        if (statuses[userAT.update] === "success"
          || statuses[userAT.update] === "error") {
          this.isSaving = false;
          super.clearActionStatus(userAT.update);
        }
      });
  }

  ngAfterViewInit(): void {
    this.aboutText.nativeElement.style.height = "0";
    const currentHeight = this.aboutText.nativeElement.scrollHeight;
    this.aboutText.nativeElement.style.height = currentHeight + "px";
  }

  public onCancel(): void {
    this.router.navigate(["/home"]);
  }

  public onSave(): void {
    this.isSaving = true;

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
    this.isCoverSet = true;
    this.coverEl.nativeElement.src = URL.createObjectURL(file);
  }

  public onAvatarChange(file: File): void {
    this.avatarFile = file;
    // this.avatarUrl = file.name;
    this.avatarEl.nativeElement.src = URL.createObjectURL(file);
  }
}
