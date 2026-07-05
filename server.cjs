const express = require('express');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const config = require('./sgpsychiatry/lib/openemr');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('.'));
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));

// API Routes
const oauth = require('./sgpsychiatry/api/oauth');
const callback = require('./sgpsychiatry/api/callback');
const { performLogin } = require('./sgpsychiatry/api/login');
const { getDoctors } = require('./sgpsychiatry/api/doctors');
const { getPatient, createPatient } = require('./sgpsychiatry/api/patient');
const { getAppointments, createAppointment } = require('./sgpsychiatry/api/appointment');
const dashboard = require('./sgpsychiatry/api/dashboard');
const health = require('./sgpsychiatry/api/health');

app.get('/api/oauth', oauth);
app.get('/api/callback', callback);
app.post('/api/login', async (req, res) => {
  try {
    const result = await performLogin(req, res);
    return result;
  } catch (err) {
    console.error('Login handler error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.get('/api/doctors', (req, res) => {
  res.status(200).json({ success: true, message: "Doctors endpoint ready" });
});
app.get('/api/patient', (req, res) => {
  res.status(200).json({ success: true, message: "Patient endpoint ready" });
});
app.get('/api/dashboard/summary', dashboard.getDashboardSummary);
app.get('/api/dashboard/messages', dashboard.getMessages);
app.get('/api/dashboard/records', dashboard.getMedicalRecords);
app.get('/api/dashboard/prescriptions', dashboard.getPrescriptions);
app.get('/api/dashboard/billing', dashboard.getBilling);
app.get('/api/dashboard/appointments', dashboard.getAppointments);
app.get('/api/profile', async (req, res) => {
  try {
    if (req.session?.profile) {
      return res.status(200).json({ success: true, profile: req.session.profile });
    }

    const accessToken = req.session?.auth?.access_token;
    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'unauthenticated' });
    }

    const profileResponse = await fetch(`${config.baseUrl}/oauth2/default/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const profile = await profileResponse.json().catch(() => null);
    if (!profileResponse.ok || !profile) {
      return res.status(502).json({ success: false, error: 'userinfo_fetch_failed', detail: profile });
    }

    req.session.profile = profile;
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Profile fetch error', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
app.post('/api/appointment', (req, res) => {
  res.status(200).json({ success: true, message: "Appointment endpoint ready" });
});
app.get('/api/health', health);

// JSON parse error handler for invalid request bodies
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received', err.message);
    return res.status(400).json({ success: false, error: 'invalid_json', message: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
