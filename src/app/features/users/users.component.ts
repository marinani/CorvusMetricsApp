import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, firstValueFrom, of } from 'rxjs';

import { ToastService } from '../../core/services/toast/toast.service';
import { isUnauthorizedError, resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { PagedResult } from '../../models/pagination.model';
import {
  USER_ROLES,
  USER_STATUS_FILTERS,
  User,
  UserListQuery,
  UserRole,
  UserStatus,
  UserStatusFilter,
} from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { UserDeleteDialog } from './user-delete-dialog';
import { UserFormDialog } from './user-form-dialog';

@Component({
  selector: 'app-users',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    PageHeaderComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  protected readonly columns = ['name', 'email', 'role', 'tenantStr', 'status', 'createdAt', 'updatedAt', 'actions'];
  protected readonly roles = USER_ROLES;
  protected readonly statusFilters = USER_STATUS_FILTERS;

  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);

  protected readonly searchName = signal('');
  protected readonly searchRole = signal<UserRole | ''>('');
  protected readonly searchStatus = signal<UserStatusFilter>('All');

  protected readonly filters = signal<UserListQuery>({
    pageNumber: 1,
    pageSize: 10,
    firstName: '',
    lastName: '',
    role: '',
    status: 'All',
  });

  protected readonly results = resource<PagedResult<User> | null, UserListQuery>({
    params: () => this.filters(),
    loader: ({ params }) =>
      firstValueFrom(
        this.userService.getPage(params).pipe(
          catchError((error: unknown) => {
            if (!isUnauthorizedError(error)) {
              this.toast.error(resolveApiErrorMessage(error, 'Unable to load users.'));
            }
            return of(null);
          })
        )
      ),
  });

  protected fullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  protected getStatusLabel(status: UserStatus): string {
    return status;
  }

  protected applyFilters(): void {
    this.filters.update((current) => ({
      ...current,
      pageNumber: 1,
      firstName: this.searchName(),
      lastName: '',
      role: this.searchRole(),
      status: this.searchStatus(),
    }));
  }

  protected resetFilters(): void {
    this.searchName.set('');
    this.searchRole.set('');
    this.searchStatus.set('All');
    this.filters.update((current) => ({
      ...current,
      pageNumber: 1,
      firstName: '',
      lastName: '',
      role: '',
      status: 'All',
    }));
  }

  protected onPageChange(event: PageEvent): void {
    this.filters.update((current) => ({
      ...current,
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,
    }));
  }

  protected async createUser(): Promise<void> {
    const dialogRef = this.dialog.open(UserFormDialog, {
      data: { user: null },
      width: '520px',
      disableClose: true,
    });
    const created = await firstValueFrom(dialogRef.afterClosed());

    if (created === true) {
      this.results.reload();
      this.toast.success('User created successfully.');
    }
  }

  protected async editUser(user: User): Promise<void> {
    const dialogRef = this.dialog.open(UserFormDialog, {
      data: { user },
      width: '520px',
      disableClose: true,
    });
    const updated = await firstValueFrom(dialogRef.afterClosed());

    if (updated === true) {
      this.results.reload();
      this.toast.success('User updated successfully.');
    }
  }

  protected async deleteUser(user: User): Promise<void> {
    const dialogRef = this.dialog.open(UserDeleteDialog, {
      data: { user },
      width: '440px',
      disableClose: true,
    });
    const deleted = await firstValueFrom(dialogRef.afterClosed());

    if (deleted === true) {
      this.results.reload();
      this.toast.success('User deleted successfully.');
    }
  }
}