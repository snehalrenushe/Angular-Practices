import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-component',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './confirmation-component.component.html',
})
export class ConfirmationComponentComponent {
  heading = 'Are you sure?';
  content = "This operation can't be reverted";

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.heading) {
      this.heading = data.heading;
    }

    if (data && data.content) {
      this.content = data.content;
    }
  }
}
