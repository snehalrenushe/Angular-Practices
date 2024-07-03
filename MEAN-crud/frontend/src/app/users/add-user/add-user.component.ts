import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-user',
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
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserService],
})
export class AddUserComponent {
  form!: FormGroup;
  inProcess: boolean = false;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(80),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
      ]),
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
      .addUser(
        this.form.value.name,
        this.form.value.age,
        this.form.value.password,
        this.form.value.email,
        this.form.value.address
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          // this.snackbar.open(res, 'X', { duration: 2000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.dialogRef.close(false);
        },
      });
  }
}
