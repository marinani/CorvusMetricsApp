import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { Metric, MetricHistory, MetricPeriod } from '../models/metric.model';

@Injectable({ providedIn: 'root' })
export class MetricService {
  private readonly api = inject(ApiService);

  getAll(companyId?: string): Observable<Metric[]> {
    return this.api.get<Metric[]>('/metrics', companyId ? { params: { companyId } } : undefined);
  }

  getById(id: string): Observable<Metric> {
    return this.api.get<Metric>(`/metrics/${id}`);
  }

  getHistory(id: string, period?: MetricPeriod): Observable<MetricHistory> {
    return this.api.get<MetricHistory>(`/metrics/${id}/history`, period ? { params: { period } } : undefined);
  }

  create(metric: Partial<Metric>): Observable<Metric> {
    return this.api.post<Metric>('/metrics', metric);
  }

  update(id: string, metric: Partial<Metric>): Observable<Metric> {
    return this.api.put<Metric>(`/metrics/${id}`, metric);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/metrics/${id}`);
  }
}
