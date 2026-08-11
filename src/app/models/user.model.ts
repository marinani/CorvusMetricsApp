export type UserRole = 'Member' | 'Admin' | 'Manager' | 'Seller';

export type UserStatus = 'Active' | 'Inactive';

export type UserStatusFilter = 'All' | 'Active' | 'Inactive';

export const USER_ROLES: UserRole[] = ['Member', 'Admin', 'Manager', 'Seller'];

export const USER_STATUS_FILTERS: UserStatusFilter[] = ['All', 'Active', 'Inactive'];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UserListQuery {
  pageNumber: number;
  pageSize: number;
  firstName: string;
  lastName: string;
  role: UserRole | '';
  status: UserStatusFilter;
}