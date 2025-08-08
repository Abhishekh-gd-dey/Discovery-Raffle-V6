export interface Contestant {
  name: string;
  department: string;
  supervisor: string;
  tickets: number;
}

export interface Winner extends Contestant {
  id: string;
  drawDate: Date;
  drawType: 'discovery-70' | 'discovery-80';
}

export interface AuthData {
  username: string;
  password: string;
}

export type Department = 'International Messaging' | 'India Messaging' | 'APAC';

export type DrawType = 'discovery-70' | 'discovery-80';

export interface DrawConfig {
  id: DrawType;
  name: string;
  description: string;
  color: string;
}