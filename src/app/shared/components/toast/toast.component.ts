import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'warning' | 'error';

export interface ToastData {
  message: string;
  type: ToastType;
}

const TOAST_ICONS: Record<ToastType, string> = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

@Component({
  selector: 'app-toast',
  imports: [MatIconModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  protected readonly data = inject<ToastData>(MAT_SNACK_BAR_DATA);
  protected readonly snackBarRef = inject(MatSnackBarRef<ToastComponent>);
  protected readonly icon = TOAST_ICONS[this.data.type];
}
