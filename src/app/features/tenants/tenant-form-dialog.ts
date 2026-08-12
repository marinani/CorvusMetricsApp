import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormField,
  email,
  form,
  maxLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { Tenant } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { FormatterUtil, ValidatorUtil } from '../../shared/utils';

export interface TenantFormData {
  tenant: Tenant | null;
}

export interface TenantFormModel {
  name: string;
  cnpj: string;
  email: string;
}

@Component({
  selector: 'app-tenant-form-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tenant-form-dialog.html',
  styleUrl: './tenant-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantFormDialog {
  private readonly dialogRef = inject(MatDialogRef<TenantFormDialog>);
  private readonly data = inject<TenantFormData>(MAT_DIALOG_DATA);
  private readonly tenantService = inject(TenantService);

  protected readonly isEditing = this.data.tenant !== null;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  private readonly model = signal<TenantFormModel>({
    name: this.data.tenant?.name ?? '',
    cnpj: FormatterUtil.formatarCnpj(this.data.tenant?.cnpj ?? ''),
    email: this.data.tenant?.email ?? '',
  });

  protected readonly tenantForm = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    maxLength(schemaPath.name, 120, { message: 'Name must be at most 120 characters' });
    validate(schemaPath.name, ({ value }) =>
      value().trim().length === 0 && value().length > 0
        ? { kind: 'whitespace', message: 'Name cannot be only whitespace' }
        : undefined
    );

    required(schemaPath.cnpj, { message: 'CNPJ is required' });
    maxLength(schemaPath.cnpj, 18, { message: 'CNPJ must be at most 18 characters' });
    validate(schemaPath.cnpj, ({ value }) => {
      const cnpj = FormatterUtil.limparCnpj(value());
      if (!cnpj) {
        return undefined;
      }
      return ValidatorUtil.isValidCnpj(cnpj)
        ? undefined
        : { kind: 'cnpj', message: 'Enter a valid CNPJ' };
    });

    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    maxLength(schemaPath.email, 120, { message: 'Email must be at most 120 characters' });
  });

  protected applyCnpjMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    const masked = FormatterUtil.applyCnpjMask(input.value.replace(/\D/g, '').slice(0, 14));
    input.value = masked;
    this.tenantForm.cnpj().value.set(masked);
  }

  protected onSubmit(): void {
    submit(this.tenantForm, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      const value = this.model();

      try {
        if (this.isEditing && this.data.tenant) {
          await firstValueFrom(
            this.tenantService.update({
              id: this.data.tenant.id,
              name: value.name.trim(),
              cnpj: FormatterUtil.limparCnpj(value.cnpj),
              email: value.email.trim(),
            })
          );
        } else {
          await firstValueFrom(
            this.tenantService.create({
              name: value.name.trim(),
              cnpj: FormatterUtil.limparCnpj(value.cnpj),
              email: value.email.trim(),
            })
          );
        }

        this.dialogRef.close(true);
      } catch (error) {
        this.errorMessage.set(resolveApiErrorMessage(error, 'Unable to save the tenant.'));
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
