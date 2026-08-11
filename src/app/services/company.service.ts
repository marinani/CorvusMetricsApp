import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { Company } from '../models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService extends ApiService {
  protected readonly resourcePath = 'companies';

  getAll(): Observable<Company[]> {
    return this.get<Company[]>('');
  }

  getById(id: string): Observable<Company> {
    return this.get<Company>(`/${id}`);
  }

  create(company: Partial<Company>): Observable<Company> {
    return this.post<Company>('', company);
  }

  update(id: string, company: Partial<Company>): Observable<Company> {
    return this.put<Company>(`/${id}`, company);
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/${id}`);
  }
}