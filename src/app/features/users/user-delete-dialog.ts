import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

export interface UserDeleteData {
  user: User;
}

@Component({
  selector: 'app-user-delete-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './user-delete-dialog.html',
  styleUrl: './user-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeleteDialog {
  private readonly dialogRef = inject(MatDialogRef<UserDeleteDialog>);
  private readonly data = inject<UserDeleteData>(MAT_DIALOG_DATA);
  private readonly userService = inject(UserService);

  protected readonly user = this.data.user;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected confirm(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.userService.remove(this.user.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.errorMessage.set(resolveApiErrorMessage(error, 'Unable to delete the user.'));
        this.isSubmitting.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}