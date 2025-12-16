
import { getAllAppointments } from './services/appointmentRecordService.js';
import { createPatientRow } from './components/patientRows.js';

const patientTableBody = document.getElementById('patientTableBody');
let selectedDate = new Date().toISOString().split('T')[0]; // Initialized to today's date
const token = localStorage.getItem('token');
let patientName = "null"; // Initialized as "null" string for backend compatibility

// Add input event listener to search bar
const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    patientName = val.length > 0 ? val : "null";
    loadAppointments();
  });
}

// "Today's Appointments" button
const todayButton = document.getElementById("todayButton");
if (todayButton) {
  todayButton.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split('T')[0];
    const datePicker = document.getElementById("datePicker");
    if (datePicker) {
      datePicker.value = selectedDate;
    }
    loadAppointments();
  });
}

// Date picker change listener
const datePicker = document.getElementById("datePicker");
if (datePicker) {
  // Set initial value
  datePicker.value = selectedDate;

  datePicker.addEventListener("change", (e) => {
    if (e.target.value) {
      selectedDate = e.target.value;
      loadAppointments();
    }
  });
}

// Define loadAppointments function
async function loadAppointments() {
  if (!patientTableBody) return;

  // Clear existing content
  patientTableBody.innerHTML = "";

  try {
    const appointments = await getAllAppointments(selectedDate, patientName, token);

    if (!appointments || appointments.length === 0) {
      patientTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No Appointments found for today</td></tr>`;
      return;
    }

    // Loop through appointments and render rows
    // Note: appointment object structure depends on backend. 
    // Typically it has a 'patient' object inside or 'patientName' etc.
    // Prompt says: "extract the patient’s details... construct a 'patient' object... passed to createPatientRow"
    // createPatientRow takes (patient, appointmentId, doctorId)

    appointments.forEach(appt => {
      // Check if appt has nested patient object or flat fields
      // Assuming appt.patient exists based on "extract the patient's details"
      const patientObj = appt.patient || {};
      // If patient details are flat in appt, construct object:
      const patientData = {
        id: patientObj.id || appt.patientId,
        name: patientObj.name || appt.patientName,
        email: patientObj.email || appt.patientEmail,
        phone: patientObj.phone || appt.patientPhone
      };

      // We also need appointmentId and doctorId for the row actions
      const apptId = appt.id;
      const docId = appt.doctorId || appt.doctor?.id; // Assuming structure

      const row = createPatientRow(patientData, apptId, docId);
      patientTableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading appointments:", error);
    patientTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Error loading appointments. Try again later.</td></tr>`;
  }
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  // Call renderContent() if it exists globally (from render.js presumably)
  if (typeof renderContent === 'function') {
    renderContent();
  }
  loadAppointments();
});
