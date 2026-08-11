import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../core/services/api/api.service';
import { PagedResult } from '../models/pagination.model';
import { CreateUserRequest, UpdateUserRequest, User, UserListQuery } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getPage(query: UserListQuery): Observable<PagedResult<User>> {
    const params: Record<string, string | number> = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
    };

    const firstName = query.firstName.trim();
    const lastName = query.lastName.trim();

    if (firstName) {
      params['firstName'] = firstName;
    }

    if (lastName) {
      params['lastName'] = lastName;
    }

    if (query.role) {
      params['role'] = query.role;
    }

    if (query.status !== 'All') {
      params['status'] = query.status;
    }

    return this.api.get<PagedResult<User>>('/users', { params });
  }

  create(body: CreateUserRequest): Observable<User> {
    return this.api.post<User>('/users', body);
  }

  update(body: UpdateUserRequest): Observable<User> {
    return this.api.put<User>(`/users/${body.id}`, body);
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }
}
