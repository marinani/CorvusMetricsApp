import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export const DEFAULT_COLOR = '#00E5FF';

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

const PALETTE: string[] = [
  '#00E5FF',
  '#4FC3F7',
  '#64B5F6',
  '#7986CB',
  '#9575CD',
  '#BA68C8',
  '#F06292',
  '#E57373',
  '#FF8A65',
  '#FFB74D',
  '#FFF176',
  '#AED581',
  '#81C784',
  '#4DB6AC',
  '#4DD0E1',
];

export interface ColorPickerData {
  color: string;
}

@Component({
  selector: 'app-color-picker-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './color-picker-dialog.html',
  styleUrl: './color-picker-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerDialog {
  private readonly dialogRef = inject(MatDialogRef<ColorPickerDialog>);
  private readonly data = inject<ColorPickerData>(MAT_DIALOG_DATA);

  protected readonly palette = PALETTE;

  protected readonly selectedColor = signal(this.toValidHex(this.data.color));
  protected readonly hexText = signal(this.selectedColor());

  protected readonly isHexValid = computed(() => HEX_PATTERN.test(this.hexText()));

  private toValidHex(value: string | null | undefined): string {
    if (value && HEX_PATTERN.test(value)) {
      return value;
    }
    return DEFAULT_COLOR;
  }

  protected onNativeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedColor.set(value);
    this.hexText.set(value);
  }

  protected onHexInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.trim();
    this.hexText.set(raw);

    if (HEX_PATTERN.test(raw)) {
      this.selectedColor.set(raw);
    }
  }

  protected selectPreset(hex: string): void {
    this.selectedColor.set(hex);
    this.hexText.set(hex);
  }

  protected confirm(): void {
    if (this.isHexValid()) {
      this.dialogRef.close(this.hexText());
    }
  }

  protected cancel(): void {
    this.dialogRef.close(null);
  }
}