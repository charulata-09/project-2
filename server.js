/**
 * Reserva AI - Local Prototype Mock Server
 * Built with Node.js & Express to demonstrate auth, booking creation,
 * dynamic pricing, and resource allocation endpoints.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.json());
// Serve frontend assets
app.use(express.static(__dirname));

// Initialize Database structure
const loadDatabase = () => {
  if (!fs.existsSync(DB_FILE)) {
    const defaultDb = {
      users: [],
      bookings: [],
      resources: [
        { id: 'mri-4', name: 'MRI Suite 4', type: 'room', capacity: 1, currentUtilization: 0.95 },
        { id: 'kitchen-b', name: 'Kitchen Suite B', type: 'room', capacity: 1, currentUtilization: 0.60 },
        { id: 'fleet-4', name: 'Tesla Model Y - Bay 4', type: 'vehicle', capacity: 1, currentUtilization: 0.80 },
        { id: 'virtual-3', name: 'Virtual Conference Zoom 3', type: 'virtual', capacity: 1, currentUtilization: 0.20 }
      ],
      staff: [
        { name: 'Dr. Sarah Jenkins', specialty: 'Radiology', availability: true },
        { name: 'Chef Raymond Blanc', specialty: 'Culinary Arts', availability: true },
        { name: 'Marcus Vance', specialty: 'Vehicle Detailing', availability: true },
        { name: 'Clara Ostling', specialty: 'Corporate Law', availability: true }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
    return defaultDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { users: [], bookings: [], resources: [], staff: [] };
  }
};

const saveDatabase = (db) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// API: Register User
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const db = loadDatabase();
  const userExists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name,
    email: email.toLowerCase(),
    password, // In production, hash this with bcrypt/argon2!
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  res.status(201).json({
    message: 'User registered successfully.',
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

// API: Login User
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // In production, generate a real JWT (jsonwebtoken package) here
  res.json({
    message: 'Login successful.',
    token: 'mock_jwt_token_for_' + user.id,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// API: Get Resources status
app.get('/api/resources', (req, res) => {
  const db = loadDatabase();
  res.json(db.resources);
});

// API: Create Booking with AI Allocation Pipeline
app.post('/api/booking/create', (req, res) => {
  const { serviceType, clientName, preferredTime } = req.body;
  if (!serviceType || !clientName) {
    return res.status(400).json({ error: 'serviceType and clientName are required.' });
  }

  const db = loadDatabase();
  
  // Simulated AI dispatcher decisions
  let allocatedResource = null;
  let allocatedStaff = null;
  let basePrice = 100;
  let demandMultiplier = 1.0;
  let smsContent = '';

  switch (serviceType) {
    case 'service-mri':
      allocatedResource = db.resources.find(r => r.id === 'mri-4');
      allocatedStaff = db.staff.find(s => s.specialty === 'Radiology');
      basePrice = 250;
      demandMultiplier = 1.18; // peak load
      smsContent = `Hi ${clientName}, your Diagnostic MRI Scan is scheduled for Tuesday in ${allocatedResource.name} with ${allocatedStaff.name}.`;
      break;

    case 'service-dining':
      allocatedResource = db.resources.find(r => r.id === 'kitchen-b');
      allocatedStaff = db.staff.find(s => s.specialty === 'Culinary Arts');
      basePrice = 400;
      demandMultiplier = 1.3;
      smsContent = `Hi ${clientName}, your Private Chef reservation in ${allocatedResource.name} with ${allocatedStaff.name} is confirmed.`;
      break;

    case 'service-car':
      allocatedResource = db.resources.find(r => r.id === 'fleet-4');
      allocatedStaff = db.staff.find(s => s.specialty === 'Vehicle Detailing');
      basePrice = 90;
      demandMultiplier = 1.16;
      smsContent = `Reservation Alert: Your Tesla Model Y is verified ready in ${allocatedResource.name}. Keyless entry active.`;
      break;

    case 'service-consulting':
      allocatedResource = db.resources.find(r => r.id === 'virtual-3');
      allocatedStaff = db.staff.find(s => s.specialty === 'Corporate Law');
      basePrice = 350;
      demandMultiplier = 1.0;
      smsContent = `Hi ${clientName}, your M&A legal advisory call with ${allocatedStaff.name} is scheduled on Zoom room 3.`;
      break;

    default:
      allocatedResource = { name: 'Standard Room' };
      allocatedStaff = { name: 'Standard Advisor' };
      smsContent = `Hi ${clientName}, your booking is confirmed.`;
  }

  const finalPrice = basePrice * demandMultiplier;

  const newBooking = {
    id: 'booking_' + Math.random().toString(36).substr(2, 9),
    clientName,
    serviceType,
    resourceAssigned: allocatedResource.name,
    staffAssigned: allocatedStaff.name,
    priceCalculated: finalPrice.toFixed(2),
    scheduledTime: preferredTime || new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString()
  };

  db.bookings.push(newBooking);
  saveDatabase(db);

  // Return full dynamic pipeline logs to show frontend
  res.json({
    message: 'Booking allocated successfully by AI pipeline.',
    booking: newBooking,
    pipelineLogs: {
      step1_resource: `Locked resource ${allocatedResource.name} (current utilization: ${(allocatedResource.currentUtilization * 100).toFixed(0)}%)`,
      step2_staff: `Matched qualified specialist: ${allocatedStaff.name} (${allocatedStaff.specialty})`,
      step3_pricing: `Base rate $${basePrice}. Demand adjustment factor: x${demandMultiplier}. Final price: $${finalPrice.toFixed(2)}`,
      step4_notifications: `Staged SMS payload: "${smsContent}"`
    }
  });
});

// Fallback: Redirect all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Reserva AI mock server running at http://localhost:${PORT}/`);
  console.log(`Database state stored locally in ${DB_FILE}`);
});
