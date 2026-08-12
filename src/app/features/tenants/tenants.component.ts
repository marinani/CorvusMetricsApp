import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { resource } from '@angular/core';
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
import { ENTITY_STATUS_FILTERS, EntityStatusFilter } from '../../models/entity-status.model';
import { PagedResult } from '../../models/pagination.model';
import { Tenant, TenantListQuery } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { FormatterUtil } from '../../shared/utils';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TenantDeleteDialog } from './tenant-delete-dialog';
import { TenantFormDialog } from './tenant-form-dialog';

@Component({
  selector: 'app-tenants',
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
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantsComponent {
  protected readonly columns = ['name', 'cnpj', 'email', 'status', 'createdAt', 'updatedAt', 'actions'];
  protected readonly statusFilters = ENTITY_STATUS_FILTERS;

  protected formatCnpj(cnpj: string | null | undefined): string {
    return FormatterUtil.formatarCnpj(cnpj);
  }

  private readonly tenantService = inject(TenantService);
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);

  protected readonly searchName = signal('');
  protected readonly searchStatus = signal<EntityStatusFilter>('All');

  protected readonly filters = signal<TenantListQuery>({
    pageNumber: 1,
    pageSize: 10,
    name: '',
    status: 'All',
  });

  protected readonly results = resource<PagedResult<Tenant> | null, TenantListQuery>({
    params: () => this.filters(),
    loader: ({ params }) =>
      firstValueFrom(
        this.tenantService.getPage(params).pipe(
          catchError((error: unknown) => {
            if (!isUnauthorizedError(error)) {
              this.toast.error(resolveApiErrorMessage(error, 'Unable to load tenants.'));
            }
            return of(null);
          })
        )
      ),
  });

  protected applyFilters(): void {
    this.filters.update((current) => ({
      ...current,
      pageNumber: 1,
      name: this.searchName(),
      status: this.searchStatus(),
    }));
  }

  protected resetFilters(): void {
    this.searchName.set('');
    this.searchStatus.set('All');
    this.filters.update((current) => ({
      ...current,
      pageNumber: 1,
      name: '',
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

  protected async createTenant(): Promise<void> {
    const dialogRef = this.dialog.open(TenantFormDialog, {
      data: { tenant: null },
      width: '520px',
      disableClose: true,
    });
    const created = await firstValueFrom(dialogRef.afterClosed());

    if (created === true) {
      this.results.reload();
      this.toast.success('Tenant created successfully.');
    }
  }

  protected async editTenant(tenant: Tenant): Promise<void> {
    const dialogRef = this.dialog.open(TenantFormDialog, {
      data: { tenant },
      width: '520px',
      disableClose: true,
    });
    const updated = await firstValueFrom(dialogRef.afterClosed());

    if (updated === true) {
      this.results.reload();
      this.toast.success('Tenant updated successfully.');
    }
  }

  protected async deleteTenant(tenant: Tenant): Promise<void> {
    const dialogRef = this.dialog.open(TenantDeleteDialog, {
      data: { tenant },
      width: '440px',
      disableClose: true,
    });
    const deleted = await firstValueFrom(dialogRef.afterClosed());

    if (deleted === true) {
      this.results.reload();
      this.toast.success('Tenant deleted successfully.');
    }
  }
}