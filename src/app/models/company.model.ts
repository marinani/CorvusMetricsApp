export interface Company {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  cnpj: string;
  email: string;
  phone: string;
  website: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}