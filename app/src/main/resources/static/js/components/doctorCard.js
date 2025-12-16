// Imports assuming standard structure based on project description
// These files would need to exist for the module to load without error.
import { getPatientData } from '../services/patientServices.js';
import { showBookingOverlay } from './modals.js';

export function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.classList.add("doctor-card");

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // Doctor Info Section
  const infoDiv = document.createElement("div");
  infoDiv.classList.add("doctor-info");

  const name = document.createElement("h3");
  name.textContent = doctor.name; // Assumes doctor object has 'name'

  const specialization = document.createElement("p");
  specialization.innerHTML = `<strong>Specialty:</strong> ${doctor.specialty}`;

  const email = document.createElement("p");
  email.innerHTML = `<strong>Email:</strong> ${doctor.email}`;

  const availability = document.createElement("p");
  // Assumes availability is an array or string
  const availText = Array.isArray(doctor.availability) ? doctor.availability.join(", ") : doctor.availability;
  availability.innerHTML = `<strong>Availability:</strong> ${availText || 'N/A'}`;

  infoDiv.appendChild(name);
  infoDiv.appendChild(specialization);
  infoDiv.appendChild(email);
  infoDiv.appendChild(availability);

  // Actions Section
  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("card-actions");

  if (role === "admin") {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Delete";
    removeBtn.className = "delete-btn"; // Add class for styling
    removeBtn.addEventListener("click", async () => {
      if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
        try {
          const response = await fetch(`/api/doctors/${doctor.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            alert("Doctor deleted successfully.");
            card.remove(); // Remove from DOM
          } else {
            alert("Failed to delete doctor.");
          }
        } catch (error) {
          console.error("Error deleting doctor:", error);
          alert("An error occurred while deleting.");
        }
      }
    });
    actionsDiv.appendChild(removeBtn);

  } else if (role === "patient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.className = "book-btn";
    bookNow.addEventListener("click", () => {
      alert("Patient needs to login first.");
      // Optional: redirect to login
      // window.location.href = "/login.html";
    });
    actionsDiv.appendChild(bookNow);

  } else if (role === "loggedPatient") {
    const bookNow = document.createElement("button");
    bookNow.textContent = "Book Now";
    bookNow.className = "book-btn";
    bookNow.addEventListener("click", async (e) => {
      try {
        if (!token) {
          alert("You must be logged in to book.");
          return;
        }
        const patientData = await getPatientData(token);
        if (patientData) {
          showBookingOverlay(e, doctor, patientData);
        } else {
          alert("Could not retrieve patient data.");
        }
      } catch (err) {
        console.error("Error initiating booking:", err);
      }
    });
    actionsDiv.appendChild(bookNow);
  }

  card.appendChild(infoDiv);
  // Only append actions if the user role warrants it (e.g. might be empty for guest)
  if (actionsDiv.hasChildNodes()) {
    card.appendChild(actionsDiv);
  }

  return card;
}
