import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { catchError, firstValueFrom, of } from 'rxjs';

import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

const SAMPLE_COMPANIES: Company[] = [
  {
    id: 'cmp-1',
    name: 'Quantum Labs',
    legalName: 'Quantum Labs LTDA',
    industry: 'Technology',
    cnpj: '12.345.678/0001-90',
    email: 'contact@quantumlabs.com',
    phone: '+1 555 0101',
    website: 'quantumlabs.com',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2026-08-01'),
  },
  {
    id: 'cmp-2',
    name: 'Aurora Retail',
    legalName: 'Aurora Retail S.A.',
    industry: 'Retail',
    cnpj: '98.765.432/0001-10',
    email: 'hello@auroraretail.io',
    phone: '+1 555 0202',
    website: 'auroraretail.io',
    active: true,
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2026-07-28'),
  },
  {
    id: 'cmp-3',
    name: 'Helix Health',
    legalName: 'Helix Health Ltda',
    industry: 'Healthcare',
    cnpj: '11.222.333/0001-44',
    email: 'info@helixhealth.co',
    phone: '+1 555 0303',
    website: 'helixhealth.co',
    active: false,
    createdAt: new Date('2025-02-02'),
    updatedAt: new Date('2026-06-10'),
  },
];

@Component({
  selector: 'app-companies',
  imports: [MatCardModule, MatTableModule, MatProgressSpinnerModule, PageHeaderComponent, DatePipe],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniesComponent {
  protected readonly columns = ['name', 'industry', 'cnpj', 'active', 'createdAt', 'updatedAt'];

  private readonly companyService = inject(CompanyService);

  protected readonly companiesResource = resource<Company[], unknown>({
    loader: () => firstValueFrom(this.companyService.getAll().pipe(catchError(() => of(SAMPLE_COMPANIES)))),
  });

  protected getStatusLabel(active: boolean): string {
    return active ? 'Active' : 'Inactive';
  }
}