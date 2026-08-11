import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export abstract class ApiService {
  protected readonly http: HttpClient = inject(HttpClient);
  protected readonly baseUrl: string = environment.apiUrl;

  protected abstract readonly resourcePath: string;

  protected get<T>(path: string = '', params?: HttpParams | Record<string, string | number | boolean>): Observable<T> {
    let httpParams: HttpParams | undefined;

    if (params) {
      httpParams = params instanceof HttpParams
        ? params
        : new HttpParams({ fromObject: { ...params } as Record<string, string> });
    }

    return this.http.get<T>(`${this.baseUrl}/${this.resourcePath}${path}`, { params: httpParams });
  }

  protected post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${this.resourcePath}${path}`, body);
  }

  protected put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${this.resourcePath}${path}`, body);
  }

  protected patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${this.resourcePath}${path}`, body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${this.resourcePath}${path}`);
  }
}