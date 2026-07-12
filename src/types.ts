export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  duration: number; // in minutes
  category: 'massage' | 'pregnancy' | 'cranio' | 'scars' | 'birth' | 'other';
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  clientName: string;
  clientSurname: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
  createdAt: string;
}

export interface PresetSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean; // Managed by admin, or auto-generated
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

