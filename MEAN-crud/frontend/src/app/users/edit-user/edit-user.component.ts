import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css',
  providers: [UserService],
})
export class EditUserComponent {
  form!: FormGroup;
  inProcess: boolean = false;
  formValueChanged: boolean = false;
  initialFormValue: any;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.data.name, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
      age: new FormControl(this.data.age, [
        Validators.required,
        Validators.min(1),
        Validators.max(80),
      ]),
      password: new FormControl(this.data.password, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
      ]),
      email: new FormControl(this.data.email, [
        Validators.required,
        Validators.email,
      ]),
      address: new FormControl(this.data.address, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(60),
      ]),
    });
    this.initialFormValue = this.form.value;
    this.form.valueChanges.subscribe(() => {
      this.formValueChanged = !(
        JSON.stringify(this.form.value) ===
        JSON.stringify(this.initialFormValue)
      );
    });
  }

  onSubmit() {
    this.inProcess = true;

    // Applying trimming
    this.form.setValue({
      ...this.form.value,
    });

    //Validation
    if (this.form.invalid) {
      return;
    }

    this.userService
      .editUser(
        this.data._id,
        this.form.value.name,
        this.form.value.age,
        this.form.value.password,
        this.form.value.email,
        this.form.value.address
      )
      .subscribe({
        next: (res) => {
          this.snackbar.open('User edited successfully !!!', 'X', {
            duration: 2000,
          });
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error:', err);
          this.snackbar.open(err.message || 'Error editing user', 'X', {
            duration: 2000,
          });
          this.dialogRef.close(false);
        },
      });
  }
}
