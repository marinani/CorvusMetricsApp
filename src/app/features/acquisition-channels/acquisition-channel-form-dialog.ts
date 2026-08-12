import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, form, maxLength, pattern, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { resolveApiErrorMessage } from '../../core/utils/http-error.util';
import { AcquisitionChannel } from '../../models/acquisition-channel.model';
import { AcquisitionChannelService } from '../../services/acquisition-channel.service';
import {
  ColorPickerDialog,
  DEFAULT_COLOR,
} from '../../shared/components/color-picker/color-picker-dialog';



export interface AcquisitionChannelFormData {
  channel: AcquisitionChannel | null;
}

export interface AcquisitionChannelFormModel {
  name: string;
  color: string;
}

@Component({
  selector: 'app-acquisition-channel-form-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './acquisition-channel-form-dialog.html',
  styleUrl: './acquisition-channel-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcquisitionChannelFormDialog {
  private readonly dialogRef = inject(MatDialogRef<AcquisitionChannelFormDialog>);
  private readonly dialog = inject(MatDialog);
  private readonly data = inject<AcquisitionChannelFormData>(MAT_DIALOG_DATA);
  private readonly channelService = inject(AcquisitionChannelService);

  protected readonly isEditing = this.data.channel !== null;
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly model = signal<AcquisitionChannelFormModel>({
    name: this.data.channel?.name ?? '',
    color: this.data.channel?.color || DEFAULT_COLOR,
  });

  protected readonly channelForm = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    maxLength(schemaPath.name, 100, { message: 'Name must be at most 100 characters' });

    required(schemaPath.color, { message: 'Color is required' });
    pattern(schemaPath.color, /^#[0-9a-f]{6}$/i, {
      message: 'Enter a valid hex color (e.g. #00E5FF)',
    });
  });

  protected async pickColor(): Promise<void> {
    const dialogRef = this.dialog.open(ColorPickerDialog, {
      data: { color: this.model().color },
      width: '420px',
      disableClose: true,
    });
    const color = await firstValueFrom(dialogRef.afterClosed());

    if (typeof color === 'string') {
      this.model.update((current) => ({ ...current, color }));
    }
  }

  protected onSubmit(): void {
    submit(this.channelForm, async () => {
      this.isSubmitting.set(true);
      this.errorMessage.set('');

      const value = this.model();

      try {
        if (this.isEditing && this.data.channel) {
          await firstValueFrom(
            this.channelService.update({
              id: this.data.channel.id,
              name: value.name,
              color: value.color,
            })
          );
        } else {
          await firstValueFrom(
            this.channelService.create({
              name: value.name,
              color: value.color,
            })
          );
        }

        this.dialogRef.close(true);
      } catch (error) {
        this.errorMessage.set(
          resolveApiErrorMessage(error, 'Unable to save the acquisition channel.')
        );
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}