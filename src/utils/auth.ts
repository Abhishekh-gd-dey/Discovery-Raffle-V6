import authData from '../data/auth.json';
import type { AuthData } from '../types';

export const validateCredentials = (username: string, password: string): boolean => {
  const auth = authData as AuthData;
  return auth.username === username && auth.password === password;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const login = (username: string, password: string): boolean => {
  if (validateCredentials(username, password)) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('loginTime', new Date().toISOString());
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('loginTime');
};