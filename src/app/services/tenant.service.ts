import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { PagedResult } from '../models/pagination.model';
import {
  CreateTenantRequest,
  Tenant,
  TenantListQuery,
  UpdateTenantRequest,
} from '../models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantService {
  private readonly api = inject(ApiService);

  getPage(query: TenantListQuery): Observable<PagedResult<Tenant>> {
    const params: Record<string, string | number> = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    };

    const name = query.name.trim();

    if (name) {
      params['name'] = name;
    }

    if (query.status !== 'All') {
      params['status'] = query.status;
    }

    return this.api.get<PagedResult<Tenant>>('/tenants', { params });
  }

  create(body: CreateTenantRequest): Observable<Tenant> {
    return this.api.post<Tenant>('/tenants', body);
  }

  update(body: UpdateTenantRequest): Observable<Tenant> {
    return this.api.put<Tenant>(`/tenants/${body.id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/tenants/${id}`);
  }

  getActiveTenants(): Observable<Tenant[]> {
    return this.api.get<Tenant[]>('/tenants/active');
  }
}