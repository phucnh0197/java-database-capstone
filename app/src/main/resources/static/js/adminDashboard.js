
/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form
*/

import { openModal } from './components/modals.js';
import { getDoctors, filterDoctors, saveDoctor } from './services/doctorServices.js';
import { createDoctorCard } from './components/doctorCard.js';

// Attach a click listener to the "Add Doctor" button
document.getElementById('addDocBtn').addEventListener('click', () => {
  openModal('addDoctor');
});


// When the DOM is fully loaded, fetch and display all doctors
document.addEventListener('DOMContentLoaded', () => {
  loadDoctorCards();
});

// Function to fetch all doctors and display them
async function loadDoctorCards() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
  }
}

// Filter listeners
document.getElementById("searchBar").addEventListener("input", filterDoctorsOnChange);
document.getElementById("filterTime").addEventListener("change", filterDoctorsOnChange);
document.getElementById("filterSpecialty").addEventListener("change", filterDoctorsOnChange);


// Function to filter doctors
async function filterDoctorsOnChange() {
  const searchBar = document.getElementById("searchBar").value.trim();
  const filterTime = document.getElementById("filterTime").value;
  const filterSpecialty = document.getElementById("filterSpecialty").value;

  const name = searchBar.length > 0 ? searchBar : null;
  const time = filterTime.length > 0 ? filterTime : null;
  const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

  try {
    const doctors = await filterDoctors(name, time, specialty); // This now returns an array based on previous service update
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

// Utility to render cards
function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  // Clear just in case called directly, though typically handled by caller
  // but the prompt says "It iterates through the list passed doctors and display the cards."
  // It doesn't explicitly say clear, but good practice if reuse.
  // However, the caller (filter/load) does clear. Let's just append.
  // Actually, prompt for filterDoctorsOnChange says "Clears existing content", then used renderDoctorCards.
  // So renderDoctorCards might just be the loop. 
  // BUT prompt for loadDoctorCards says "Iterates... and appends".
  // Let's make renderDoctorCards simply iterate and append to the passed element.

  // Safety check if doctors is not iterable
  if (!doctors || !Array.isArray(doctors)) return;

  doctors.forEach(doctor => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

// Global function for handling Add Doctor form submission within the modal
window.adminAddDoctor = async function () {
  // Collect input values
  const name = document.getElementById('doctorName').value;
  const specialty = document.getElementById('specialization').value; // Check ID in modals.js
  const email = document.getElementById('doctorEmail').value;
  const password = document.getElementById('doctorPassword').value;
  const phone = document.getElementById('doctorPhone').value;

  // Checkboxes for availability
  const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
  const availableTimes = Array.from(availabilityCheckboxes).map(cb => cb.value).join(',');

  const token = localStorage.getItem('token');
  if (!token) {
    alert("You are not authenticated.");
    return;
  }

  const doctor = {
    name,
    speciality: specialty, // Note: Model usually uses 'speciality' or 'specialization'. Prompt says 'specialty'.
    // Looking at previous controller comments it says `speciality` in filter, 
    // but let's assume `speciality` property on object based on standard naming or `specialization`.
    // Let's stick to commonly used 'speciality' matching the filter arg, or 'specialization' from ID.
    // AdminController.java doesn't show model fields. 
    // I will use 'speciality' to match the filter param name mentioned in Prompt 1.
    email,
    password,
    phone,
    availability: availableTimes
  };

  try {
    const result = await saveDoctor(doctor, token);
    if (result.success) {
      alert(result.message);
      // Close modal by hiding it
      document.getElementById('modal').style.display = 'none';
      // Reload list
      loadDoctorCards();
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    alert("An error occurred while adding the doctor.");
    console.error(error);
  }
};
