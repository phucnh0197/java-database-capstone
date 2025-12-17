// render.js

function selectRole(role) {
  setRole(role);
  const token = localStorage.getItem('token');
  if (role === "admin") {
    if (token) {
      window.location.href = `/adminDashboard/${token}`;
    } else {
      if (window.openModal) window.openModal('adminLogin');
    }
  } if (role === "patient") {
    if (window.openModal) window.openModal('patientLogin');
  } else if (role === "doctor") {
    if (token) {
      window.location.href = `/doctorDashboard/${token}`;
    } else {
      if (window.openModal) window.openModal('doctorLogin');
    }
  }
}


function renderContent() {
  const role = getRole();
  if (!role) {
    window.location.href = "/"; // if no role, send to role selection page
    return;
  }
}
