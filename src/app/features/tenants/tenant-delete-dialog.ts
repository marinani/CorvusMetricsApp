import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { Tenant } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';

export interface TenantDeleteData {
  tenant: Tenant;
}

@Component({
  selector: 'app-tenant-delete-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './tenant-delete-dialog.html',
  styleUrl: './tenant-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantDeleteDialog {
  private readonly dialogRef = inject(MatDialogRef<TenantDeleteDialog>);
  private readonly data = inject<TenantDeleteData>(MAT_DIALOG_DATA);
  private readonly tenantService = inject(TenantService);

  protected readonly tenant = this.data.tenant;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected confirm(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.tenantService.remove(this.tenant.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.errorMessage.set(resolveApiErrorMessage(error, 'Unable to delete the tenant.'));
        this.isSubmitting.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}