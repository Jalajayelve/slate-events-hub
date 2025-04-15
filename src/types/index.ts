
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  category: EventCategory;
  organizer: string;
  imageUrl?: string;
  attendees?: number;
}

export type EventCategory = 
  | 'academic' 
  | 'cultural' 
  | 'sports' 
  | 'tech' 
  | 'workshop' 
  | 'seminar' 
  | 'social' 
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  savedEvents?: string[]; // Event IDs
}

// Database interfaces for PostgreSQL integration
export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  apiUrl: string; // API URL for the Express server
}

export interface DbResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
