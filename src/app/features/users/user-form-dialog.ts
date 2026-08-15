import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormField,
  disabled,
  email,
  form,
  hidden,
  maxLength,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';

import { resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { USER_ROLES, User, UserRole } from '../../models/user.model';
import { Tenant } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { UserService } from '../../services/user.service';

export interface UserFormData {
  user: User | null;
}

export interface UserFormModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole | '';
  tenantId: string;
}

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormDialog {
  private readonly dialogRef = inject(MatDialogRef<UserFormDialog>);
  private readonly data = inject<UserFormData>(MAT_DIALOG_DATA);
  private readonly userService = inject(UserService);
  private readonly tenantService = inject(TenantService);

  protected readonly isEditing = this.data.user !== null;
  protected readonly roles = USER_ROLES;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly hidePassword = signal(true);

  protected readonly activeTenants = signal<Tenant[]>([]);
  protected readonly tenantsLoading = signal(false);
  protected readonly selectedTenantIds = signal<string[]>(this.data.user?.tenantIds ?? []);

  protected readonly isSeller = computed(() => this.model().role === 'Seller');
  protected readonly isManager = computed(() => this.model().role === 'Manager');

  private readonly model = signal<UserFormModel>({
    firstName: this.data.user?.firstName ?? '',
    lastName: this.data.user?.lastName ?? '',
    email: this.data.user?.email ?? '',
    password: '',
    role: this.data.user?.role ?? '',
    tenantId: this.data.user?.tenantIds?.[0] ?? '',
  });

  protected readonly userForm = form(this.model, (schemaPath) => {
    required(schemaPath.firstName, { message: 'First name is required' });
    maxLength(schemaPath.firstName, 50, { message: 'First name must be at most 50 characters' });
    required(schemaPath.lastName, { message: 'Last name is required' });
    maxLength(schemaPath.lastName, 50, { message: 'Last name must be at most 50 characters' });

    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    maxLength(schemaPath.email, 120, { message: 'Email must be at most 120 characters' });
    disabled(schemaPath.email, () => this.isEditing);

    if (!this.isEditing) {
      required(schemaPath.password, { message: 'Password is required' });
      minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters' });
      maxLength(schemaPath.password, 72, { message: 'Password must be at most 72 characters' });
    }

    required(schemaPath.role, { message: 'Role is required' });

    hidden(schemaPath.tenantId, () => this.model().role !== 'Seller');
    required(schemaPath.tenantId, { message: 'Select a tenant' });
  });

  constructor() {
    if (this.isSeller() || this.isManager()) {
      void this.loadActiveTenants();
    }
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  protected onRoleChange(role: UserRole | ''): void {
    if (role === 'Seller' || role === 'Manager') {
      void this.loadActiveTenants();
    } else {
      this.model.update((current) => ({ ...current, tenantId: '' }));
      this.selectedTenantIds.set([]);
    }
  }

  private async loadActiveTenants(): Promise<void> {
    if (this.activeTenants().length > 0) {
      return;
    }

    this.tenantsLoading.set(true);

    try {
      const tenants = await firstValueFrom(this.tenantService.getActiveTenants());
      this.activeTenants.set(tenants ?? []);
    } catch (error) {
      this.errorMessage.set(resolveApiErrorMessage(error, 'Unable to load tenants.'));
    } finally {
      this.tenantsLoading.set(false);
    }
  }

  protected onSubmit(): void {
    submit(this.userForm, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      const value = this.model();
      const role = value.role as UserRole;
      let tenantIds: string[] | undefined;
      if (role === 'Seller') {
        tenantIds = value.tenantId ? [value.tenantId] : [];
      } else if (role === 'Manager') {
        tenantIds = this.selectedTenantIds();
      }

      try {
        if (this.isEditing && this.data.user) {
          await firstValueFrom(
            this.userService.update({
              id: this.data.user.id,
              firstName: value.firstName,
              lastName: value.lastName,
              role,
              tenantIds,
            })
          );
        } else {
          await firstValueFrom(
            this.userService.create({
              firstName: value.firstName,
              lastName: value.lastName,
              email: value.email,
              password: value.password,
              role,
              tenantIds,
            })
          );
        }

        this.dialogRef.close(true);
      } catch (error) {
        this.errorMessage.set(resolveApiErrorMessage(error, 'Unable to save the user.'));
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}