import { EntityStatus, EntityStatusFilter } from './entity-status.model';

export interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTenantRequest {
  name: string;
  cnpj: string;
  email: string;
}

export interface UpdateTenantRequest {
  id: string;
  name: string;
  cnpj: string;
  email: string;
}

export interface TenantListQuery {
  pageNumber: number;
  pageSize: number;
  name: string;
  status: EntityStatusFilter;
}