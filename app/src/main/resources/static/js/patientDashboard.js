
// patientDashboard.js
import { getDoctors, filterDoctors } from './services/doctorServices.js'; // Consolidated imports
import { openModal } from './components/modals.js';
import { createDoctorCard } from './components/doctorCard.js';
import { patientSignup, patientLogin } from './services/patientServices.js';

// Load Doctor Cards on Page Load
document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});

// Bind Modal Triggers
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("patientSignup");
  if (btn) btn.addEventListener("click", () => openModal("patientSignup"));
});

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) loginBtn.addEventListener("click", () => openModal("patientLogin"));
});

// Load Doctors Function
async function loadDoctorCards() {
  const contentDiv = document.getElementById("content");
  //  contentDiv.innerHTML = ""; // Clear existing - handled in catch or before append? Prompt says clears inside.

  try {
    const doctors = await getDoctors();
    contentDiv.innerHTML = ""; // Clear existing
    if (doctors && doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      contentDiv.innerHTML = "<p>No doctors available at the moment.</p>";
    }
  } catch (error) {
    console.error("Failed to load doctors:", error);
    contentDiv.innerHTML = "<p>Error loading doctors.</p>";
  }
}

// Search and Filter Logic
const searchBar = document.getElementById("searchBar");
const filterTime = document.getElementById("filterTime");
const filterSpecialty = document.getElementById("filterSpecialty");

if (searchBar) searchBar.addEventListener("input", filterDoctorsOnChange);
if (filterTime) filterTime.addEventListener("change", filterDoctorsOnChange);
if (filterSpecialty) filterSpecialty.addEventListener("change", filterDoctorsOnChange);

async function filterDoctorsOnChange() {
  const searchVal = document.getElementById("searchBar").value.trim();
  const timeVal = document.getElementById("filterTime").value;
  const specialtyVal = document.getElementById("filterSpecialty").value;

  const name = searchVal.length > 0 ? searchVal : null;
  const time = timeVal.length > 0 ? timeVal : null;
  const specialty = specialtyVal.length > 0 ? specialtyVal : null;

  try {
    // filterDoctors now returns the list directly or { doctors: [] }? 
    // Checking my implementation of doctorServices.js: returns data.doctors || data.
    // So likely an array.
    const doctors = await filterDoctors(name, time, specialty);

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    if (doctors && doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
    }
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("An error occurred while filtering doctors.");
  }
}

// Render Utility
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Handle Patient Signup
window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);

    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("An error occurred while signing up.");
  }
};

// Handle Patient Login
window.loginPatient = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = { email, password };

    const response = await patientLogin(data);

    if (response.ok) {
      const result = await response.json();

      localStorage.setItem('token', result.token);
      // Assuming selectRole is global from render.js
      if (typeof selectRole === 'function') {
        selectRole('loggedPatient');
      } else {
        // Fallback if selectRole not found or manual redirect needed
        window.location.href = 'loggedPatientDashboard.html'; // Or /pages/loggedPatientDashboard.html
      }
    } else {
      alert('Invalid credentials!');
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("An error occurred during login.");
  }
};
