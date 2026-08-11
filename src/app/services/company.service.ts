import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Company[]> {
    return this.api.get<Company[]>('/companies');
  }

  getById(id: string): Observable<Company> {
    return this.api.get<Company>(`/companies/${id}`);
  }

  create(company: Partial<Company>): Observable<Company> {
    return this.api.post<Company>('/companies', company);
  }

  update(id: string, company: Partial<Company>): Observable<Company> {
    return this.api.put<Company>(`/companies/${id}`, company);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/companies/${id}`);
  }
}
