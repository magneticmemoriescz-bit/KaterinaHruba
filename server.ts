import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { Booking, ContactMessage } from './src/types';

// Establish __dirname equivalents safely for both ESM (dev) and CJS (prod)
const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  const metaUrl = (import.meta as any)?.url;
  if (metaUrl) {
    return path.dirname(fileURLToPath(metaUrl));
  }
  return process.cwd();
};

const DB_DIR = path.join(getDirname(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure db directory and file exist with initial structures
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

interface DBStructure {
  bookings: Booking[];
  messages: ContactMessage[];
  availableSlots: { date: string; time: string }[];
}

function generateDefaultAvailableSlots() {
  const slots: { date: string; time: string }[] = [];
  const candidateTimes = [
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
  for (let i = 1; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0) continue; // Skip Sunday
    const dateStr = d.toISOString().split('T')[0];
    for (const t of candidateTimes) {
      slots.push({ date: dateStr, time: t });
    }
  }
  return slots;
}

const initialDB: DBStructure = {
  bookings: [
    // Pre-populate with a few aesthetic mockup bookings for demonstration and admin review
    {
      id: 'mock-1',
      serviceId: 'pece-o-jizvu',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Day after tomorrow
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
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Day after tomorrow
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
      date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Next days
      startTime: '12:00',
      endTime: '15:00',
      clientName: 'Osobní volno',
      clientSurname: '(Administrátor)',
      clientPhone: '-',
      clientEmail: 'magnetic.memories.cz@gmail.com',
      notes: 'Osobní pauza, vzdělávání a příprava pomůcek',
      createdAt: new Date().toISOString()
    }
  ],
  messages: [],
  availableSlots: []
};

function readDB(): DBStructure {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const db = { ...initialDB, availableSlots: generateDefaultAvailableSlots() };
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
      return db;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(data);
    if (!db.availableSlots) {
      db.availableSlots = generateDefaultAvailableSlots();
      writeDB(db);
    }
    return db;
  } catch (error) {
    console.error('Error reading DB:', error);
    return { ...initialDB, availableSlots: generateDefaultAvailableSlots() };
  }
}

function writeDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing DB:', error);
  }
}

// Convert time "HH:MM" to minutes for easier math
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to "HH:MM"
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Check if two time intervals overlap (including a 15-minute buffer between slots)
function isOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
  bufferMin: number = 15
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  // Interval 1 with buffer: [s1, e1 + buffer] (wait, buffer belongs between clients)
  // Let's check overlap: two intervals overlap if:
  // (s1 < e2 + buffer) and (s2 < e1 + buffer)
  // That means we need at least bufferMin minutes between them.
  // Actually, more precisely, the time between e1 and s2 must be >= bufferMin, OR the time between e2 and s1 must be >= bufferMin
  // If s2 >= e1 + bufferMin, they do not overlap. If s1 >= e2 + bufferMin, they do not overlap.
  // Otherwise, they overlap!
  return !(s2 >= e1 + bufferMin || s1 >= e2 + bufferMin);
}

// API: Get all services
app.get('/api/services', (req, res) => {
  // Static services can be returned, we import them from the client package
  res.json({ success: true });
});

// API: Get all bookings
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.bookings.length, data: db.bookings });
});

// API: Get all available slots defined by admin
app.get('/api/available-slots', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.availableSlots || [] });
});

// API: Set available slots for a specific date
app.post('/api/available-slots', (req, res) => {
  const { date, times } = req.body;
  if (!date || !Array.isArray(times)) {
    return res.status(400).json({ success: false, error: 'Chybí datum nebo seznam časů.' });
  }

  const db = readDB();
  // Filter out any existing slots for this date
  db.availableSlots = (db.availableSlots || []).filter(slot => slot.date !== date);
  // Add new slots
  for (const t of times) {
    db.availableSlots.push({ date, time: t });
  }

  writeDB(db);
  res.json({ success: true, message: `Termíny pro datum ${date} byly úspěšně aktualizovány.`, data: db.availableSlots });
});

// API: Create a new booking (checks for buffer-based conflicts)
app.post('/api/bookings', (req, res) => {
  const { serviceId, date, startTime, endTime, clientName, clientSurname, clientPhone, clientEmail, notes } = req.body;

  if (!serviceId || !date || !startTime || !endTime || !clientName || !clientSurname || !clientPhone || !clientEmail) {
    return res.status(400).json({ success: false, error: 'Chybí povinné údaje pro rezervaci.' });
  }

  const db = readDB();

  // Find conflicts on the same date
  const conflictingBooking = db.bookings.find(booking => {
    if (booking.date !== date) return false;
    return isOverlapping(startTime, endTime, booking.startTime, booking.endTime, 15);
  });

  if (conflictingBooking) {
    return res.status(409).json({
      success: false,
      error: `Vybraný čas koliduje s jinou rezervační uzávěrkou (včetně povinné 15minutové pauzy). Kolize s: ${conflictingBooking.startTime} - ${conflictingBooking.endTime}`
    });
  }

  const newBooking: Booking = {
    id: `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    serviceId,
    date,
    startTime,
    endTime,
    clientName,
    clientSurname,
    clientPhone,
    clientEmail,
    notes,
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  writeDB(db);

  // Email Notification Simulation
  console.log('---------------------------------------------------------');
  console.log(`E-MAIL SENT TO: magnetic.memories.cz@gmail.com`);
  console.log(`SUBJECT: Nová rezervace - Celostní péče Kateřina Hrubá`);
  console.log(`Zákazník: ${clientName} ${clientSurname} (${clientEmail}, ${clientPhone})`);
  console.log(`Služba: ${serviceId}`);
  console.log(`Termín: ${date} v čase ${startTime} - ${endTime}`);
  console.log(`Poznámka: ${notes || 'Bez poznámky'}`);
  console.log('---------------------------------------------------------');

  res.json({ success: true, data: newBooking, message: 'Rezervace byla úspěšně vytvořena a emailová notifikace byla odeslána.' });
});

// API: Delete a booking (Cancel)
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  const index = db.bookings.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Rezervace nebyla nalezena.' });
  }

  const removed = db.bookings.splice(index, 1)[0];
  writeDB(db);

  console.log('------- EMAIL CANCEL LOG -------');
  console.log(`Storno oznámení zasláno na: magnetic.memories.cz@gmail.com a ${removed.clientEmail}`);
  console.log(`Zrušeno: ${removed.clientName} ${removed.clientSurname} - ${removed.date} (${removed.startTime} - ${removed.endTime})`);
  console.log('--------------------------------');

  res.json({ success: true, message: 'Rezervace byla úspěšně zrušena.' });
});

// API: Contact message submission simulating Netlify form handler
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Chybí jméno, e-mail nebo text zprávy.' });
  }

  const db = readDB();
  const newMessage: ContactMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMessage);
  writeDB(db);

  // Email simulation to magnetic.memories.cz@gmail.com
  console.log('---------------------------------------------------------');
  console.log(`E-MAIL MESSAGE SUBMITTED VIA NETLIFY FORM TO: magnetic.memories.cz@gmail.com`);
  console.log(`Odesílatel: ${name} (${email}${phone ? ', Tel: ' + phone : ''})`);
  console.log(`Zpráva:\n${message}`);
  console.log('---------------------------------------------------------');

  res.json({
    success: true,
    data: newMessage,
    message: 'Formulář odeslán přes simulátor Netlify. Zpráva doručena na magnetic.memories.cz@gmail.com.'
  });
});

// API: Get contact messages
app.get('/api/contact', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.messages.length, data: db.messages });
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
