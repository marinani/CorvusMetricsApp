import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { AcquisitionChannel } from '../../models/acquisition-channel.model';
import { AcquisitionChannelService } from '../../services/acquisition-channel.service';

export interface AcquisitionChannelDeleteData {
  channel: AcquisitionChannel;
}

@Component({
  selector: 'app-acquisition-channel-delete-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './acquisition-channel-delete-dialog.html',
  styleUrl: './acquisition-channel-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcquisitionChannelDeleteDialog {
  private readonly dialogRef = inject(MatDialogRef<AcquisitionChannelDeleteDialog>);
  private readonly data = inject<AcquisitionChannelDeleteData>(MAT_DIALOG_DATA);
  private readonly channelService = inject(AcquisitionChannelService);

  protected readonly channel = this.data.channel;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected confirm(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.channelService.remove(this.channel.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (error: unknown) => {
        this.errorMessage.set(
          resolveApiErrorMessage(error, 'Unable to delete the acquisition channel.')
        );
        this.isSubmitting.set(false);
      },
    });
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}