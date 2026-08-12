import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ToastComponent, ToastType } from '../../../shared/components/toast/toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackbar = inject(MatSnackBar);

  success(message: string): void {
    this.open(message, 'success');
  }

  warning(message: string): void {
    this.open(message, 'warning');
  }

  error(message: string): void {
    this.open(message, 'error');
  }

  private open(message: string, type: ToastType): void {
    this.snackbar.openFromComponent(ToastComponent, {
      data: { message, type },
      duration: type === 'error' ? 6000 : 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'corvus-toast',
    });
  }
}
