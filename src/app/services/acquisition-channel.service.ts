import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import {
  AcquisitionChannel,
  AcquisitionChannelListQuery,
  CreateAcquisitionChannelRequest,
  UpdateAcquisitionChannelRequest,
} from '../models/acquisition-channel.model';
import { PagedResult } from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class AcquisitionChannelService {
  private readonly api = inject(ApiService);

  getPage(query: AcquisitionChannelListQuery): Observable<PagedResult<AcquisitionChannel>> {
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

    return this.api.get<PagedResult<AcquisitionChannel>>('/acquisition-channels', { params });
  }

  create(body: CreateAcquisitionChannelRequest): Observable<AcquisitionChannel> {
    return this.api.post<AcquisitionChannel>('/acquisition-channels', body);
  }

  update(body: UpdateAcquisitionChannelRequest): Observable<AcquisitionChannel> {
    return this.api.put<AcquisitionChannel>(`/acquisition-channels/${body.id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/acquisition-channels/${id}`);
  }
}