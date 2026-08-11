import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { Metric, MetricHistory, MetricPeriod } from '../models/metric.model';

@Injectable({ providedIn: 'root' })
export class MetricService extends ApiService {
  protected readonly resourcePath = 'metrics';

  getAll(companyId?: string): Observable<Metric[]> {
    return this.get<Metric[]>('', companyId ? { companyId } : undefined);
  }

  getById(id: string): Observable<Metric> {
    return this.get<Metric>(`/${id}`);
  }

  getHistory(id: string, period?: MetricPeriod): Observable<MetricHistory> {
    return this.get<MetricHistory>(`/${id}/history`, period ? { period } : undefined);
  }

  create(metric: Partial<Metric>): Observable<Metric> {
    return this.post<Metric>('', metric);
  }

  update(id: string, metric: Partial<Metric>): Observable<Metric> {
    return this.put<Metric>(`/${id}`, metric);
  }

  remove(id: string): Observable<void> {
    return this.delete<void>(`/${id}`);
  }
}