const { openEmrJson, getPatientId } = require('../lib/openemr-session');
const config = require('../lib/openemr');

async function getDashboardSummary(req, res) {
  try {
    const patientId = getPatientId(req);
    const summary = {};

    if (patientId) {
      const patient = await openEmrJson(req, `/apis/default/fhir/Patient/${patientId}`);
      summary.patient = patient;
    }

    const appointments = await openEmrJson(req, '/api/appointments');
    const doctors = await openEmrJson(req, '/api/doctors');

    summary.appointments = appointments || [];
    summary.providers = doctors || [];
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error('Dashboard summary error', error);
    return res.status(error.status || 500).json({ success: false, error: error.message });
  }
}

async function getMessages(req, res) {
  try {
    const messages = await openEmrJson(req, '/api/messages');
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Messages error', error);
    return res.status(error.status || 500).json({ success: false, error: error.message });
  }
}

async function getMedicalRecords(req, res) {
  try {
    const patientId = getPatientId(req);
    if (!patientId) {
      return res.status(400).json({ success: false, error: 'patient_id_missing' });
    }

    const summary = await openEmrJson(req, `/apis/default/fhir/Patient/${patientId}`);
    const observations = await openEmrJson(req, `/apis/default/fhir/Observation?patient=${patientId}&_count=10`);
    const documents = await openEmrJson(req, `/apis/default/fhir/DocumentReference?patient=${patientId}&_count=10`);

    return res.status(200).json({ success: true, records: { summary, observations, documents } });
  } catch (error) {
    console.error('Medical records error', error);
    return res.status(error.status || 500).json({ success: false, error: error.message });
  }
}

async function getPrescriptions(req, res) {
  try {
    const patientId = getPatientId(req);
    if (!patientId) {
      return res.status(400).json({ success: false, error: 'patient_id_missing' });
    }

    const meds = await openEmrJson(req, `/apis/default/fhir/MedicationRequest?patient=${patientId}&_count=20`);
    return res.status(200).json({ success: true, prescriptions: meds });
  } catch (error) {
    console.error('Prescriptions error', error);
    return res.status(error.status || 500).json({ success: false, error: error.message });
  }
}

async function getBilling(req, res) {
  try {
    const patientId = getPatientId(req);
    const claims = await openEmrJson(req, `/apis/default/fhir/Claim?patient=${patientId}&_count=10`);
    return res.status(200).json({ success: true, billing: claims });
  } catch (error) {
    console.error('Billing error', error);
    return res.status(error.status || 500).json({ success: false, error: error.message });
  }
}

async function getAppointments(req, res) {
  try {
    const appointments = await openEmrJson(req, '/api/appointments');
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Appointments error', error);
    return res.status(error.status || 500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getDashboardSummary,
  getMessages,
  getMedicalRecords,
  getPrescriptions,
  getBilling,
  getAppointments,
};
