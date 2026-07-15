import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { Booking, ContactMessage } from '../types';

const CANDIDATE_TIMES = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
  '16:00', '16:15', '16:30', '16:45',
  '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15'
];

// Helper to generate default slots for a day
export const getDefaultTimesForDay = (dateStr: string) => {
  const d = new Date(dateStr);
  if (d.getDay() === 0) return []; // Sunday is closed
  return [...CANDIDATE_TIMES];
};

// Fetch all bookings
export async function getBookings(): Promise<Booking[]> {
  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  if (list.length === 0) {
    // Return mock bookings if database is empty so there's initial data
    return [
      {
        id: 'mock-1',
        serviceId: 'pece-o-jizvu',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:15',
        clientName: 'Anna',
        clientSurname: 'Nováková',
        clientPhone: '+420 777 123 456',
        clientEmail: 'anna.novakova@gmail.com',
        notes: 'Péče o jizvu po císařském řezu (skoro rok stará).',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-2',
        serviceId: 'kraniosakralni-terapie',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        startTime: '13:00',
        endTime: '14:30',
        clientName: 'Lucie',
        clientSurname: 'Dvořáková',
        clientPhone: '+420 608 987 654',
        clientEmail: 'lucie.dvorakova@seznam.cz',
        notes: 'Uvolnění chronického stresu a vyhoření.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-3',
        serviceId: 'block-personal',
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        startTime: '12:00',
        endTime: '15:00',
        clientName: 'Osobní volno',
        clientSurname: '(Administrátor)',
        clientPhone: '-',
        clientEmail: 'magnetic.memories.cz@gmail.com',
        notes: 'Osobní pauza, vzdělávání a příprava pomůcek',
        createdAt: new Date().toISOString()
      }
    ];
  }
  return list;
}

// Add a booking
export async function createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  const bookingsCol = collection(db, 'bookings');
  const payload = {
    ...booking,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(bookingsCol, payload);
  return {
    id: docRef.id,
    ...payload
  };
}

// Delete a booking
export async function deleteBooking(id: string): Promise<void> {
  const docRef = doc(db, 'bookings', id);
  await deleteDoc(docRef);
}

// Get custom available slots
export async function getAvailableSlots(): Promise<{ date: string; time: string }[]> {
  const daysCol = collection(db, 'available_days');
  const snapshot = await getDocs(daysCol);
  
  const customizedDays: Record<string, string[]> = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    customizedDays[doc.id] = data.activeTimes || [];
  });

  const slots: { date: string; time: string }[] = [];
  
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0) continue; // Skip Sunday
    const dateStr = d.toISOString().split('T')[0];
    
    if (customizedDays[dateStr] !== undefined) {
      // This day is explicitly customized in Firestore
      const activeTimes = customizedDays[dateStr];
      for (const t of activeTimes) {
        slots.push({ date: dateStr, time: t });
      }
    } else {
      // Not customized, use all candidate times
      for (const t of CANDIDATE_TIMES) {
        slots.push({ date: dateStr, time: t });
      }
    }
  }
  return slots;
}

// Save available slots for a specific date
export async function saveAvailableSlots(dateStr: string, times: string[]): Promise<void> {
  const docRef = doc(db, 'available_days', dateStr);
  await setDoc(docRef, {
    date: dateStr,
    activeTimes: times,
    updatedAt: new Date().toISOString()
  });
}

// Submit a contact message
export async function submitContactMessage(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<ContactMessage> {
  const messagesCol = collection(db, 'messages');
  const payload = {
    ...message,
    createdAt: new Date().toISOString()
  };
  const docRef = await addDoc(messagesCol, payload);
  return {
    id: docRef.id,
    ...payload
  };
}

