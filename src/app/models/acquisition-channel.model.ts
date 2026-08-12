import { EntityStatus, EntityStatusFilter } from './entity-status.model';

export interface AcquisitionChannel {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  createdAtUtc: Date;
  updatedAtUtc?: Date;
}

export interface CreateAcquisitionChannelRequest {
  name: string;
  color: string;
}

export interface UpdateAcquisitionChannelRequest {
  id: string;
  name: string;
  color: string;
}

export interface AcquisitionChannelListQuery {
  pageNumber: number;
  pageSize: number;
  name: string;
  status: EntityStatusFilter;
}