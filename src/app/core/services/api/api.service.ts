import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = this.getApiBaseUrl();

  private readonly defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });

  private getApiBaseUrl(): string {
    const url = environment.apiBaseUrl;

    if (!url) {
      throw new Error(
        'API base URL is not configured. Edit the .env file (API_URL) and run `npm start` or `npm run build`.'
      );
    }

    return url;
  }

  private buildUrl(endpoint: string): string {
    const base = this.baseUrl.replace(/\/+$/, '');
    const suffix = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${suffix}`;
  }

  get<T>(endpoint: string, options?: { params?: Record<string, string | number | boolean> }): Observable<T> {
    let httpParams: HttpParams | undefined;

    if (options?.params) {
      httpParams = new HttpParams({ fromObject: options.params });
    }

    return this.http.get<T>(this.buildUrl(endpoint), {
      responseType: 'json',
      headers: this.defaultHeaders,
      params: httpParams,
    });
  }

  getBlob(endpoint: string, options?: { params?: Record<string, string | number | boolean> }): Observable<Blob> {
    let httpParams: HttpParams | undefined;

    if (options?.params) {
      httpParams = new HttpParams({ fromObject: options.params });
    }

    return this.http.get(this.buildUrl(endpoint), {
      responseType: 'blob',
      params: httpParams,
    });
  }

  post<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), data, {
      responseType: 'json',
      headers: this.defaultHeaders,
    });
  }

  postFormDataText(endpoint: string, formData: FormData): Observable<string> {
    return this.http.post(this.buildUrl(endpoint), formData, {
      responseType: 'text',
    });
  }

  postFormDataJson<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), formData, {
      responseType: 'json',
    });
  }

  put<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), data, {
      responseType: 'json',
      headers: this.defaultHeaders,
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      responseType: 'json',
      headers: this.defaultHeaders,
    });
  }

  patch<T>(endpoint: string, data?: unknown): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), data ?? null, {
      responseType: 'json',
      headers: this.defaultHeaders,
    });
  }
}
