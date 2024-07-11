import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ConfirmationComponentComponent } from '../confirmation-component/confirmation-component.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    AddUserComponent,
    MatTooltipModule,
    FlexLayoutServerModule,
    MatCheckboxModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'email',
    'age',
    'address',
    'password',
    'actions',
  ];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<User>(true, []);

  userList: User[] = [];

  constructor(
    private userService: UserService,
    private matDialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res) => {
      // Sort users by _id in descending order
      this.userList = res.sort((a, b) => {
        if (!a._id || !b._id) {
          return 0; // If either _id is null or undefined, consider them equal
        }
        return b._id.localeCompare(a._id);
      });
      this.dataSource = new MatTableDataSource(this.userList);
      if (this.paginator && this.sort) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row._id + 1
    }`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAddUser() {
    this.matDialog
      .open(AddUserComponent, {
        width: '500px',
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result === true) {
          this.loadUsers();
        }
      });
  }

  onEditUser(userOb: User) {
    this.matDialog
      .open(EditUserComponent, {
        data: userOb,
        width: '500px',
      })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result === true) {
          this.loadUsers();
        }
      });
  }

  onDeleteUser(userOb: User) {
    const dialogRef = this.matDialog.open(ConfirmationComponentComponent, {
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result == true) {
        this.userService.deleteUser(userOb._id).subscribe({
          next: (res) => {
            this.snackbar.open('User Deleted', 'X', {
              duration: 2000,
            });
            this.loadUsers();
          },
          error: (err) => {
            this.snackbar.open(err, 'X', { duration: 2000 });
            this.loadUsers();
          },
        });
      }
    });
  }
}
