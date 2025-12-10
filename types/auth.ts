export type UserRole = 'superAdmin' | 'admin' | 'manager' | 'couturier' | 'livreur';

export interface RegisterData {
  pseudo: string;
  password: string;
  phone: string;
  name: string;
  role: UserRole;
}

export interface LoginData {
  pseudo: string;
  password: string;
}

