
import { openModal } from '../components/modals.js';
window.openModal = openModal;
import { API_BASE_URL } from '../config/config.js';

const ADMIN_API = API_BASE_URL + '/admin';
const DOCTOR_API = API_BASE_URL + '/doctor/login';

window.onload = function () {
  const adminBtn = document.getElementById('adminLogin');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      openModal('adminLogin');
    });
  }

  const doctorBtn = document.getElementById('doctorLogin');
  if (doctorBtn) {
    doctorBtn.addEventListener('click', () => {
      openModal('doctorLogin');
    });
  }
};

window.adminLoginHandler = async function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const admin = { username, password };

  try {
    const response = await fetch(ADMIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admin)
    });

    if (response.ok) {
      const data = await response.json();
      // Assuming the token is returned in a property named 'token' or similar, 
      // or the whole body is the token. The prompt says "Store the received token".
      // Common pattern is { token: "..." }.
      if (data.token) {
        localStorage.setItem('token', data.token);
      } else {
        // Fallback if the response IS the token or strict string
        localStorage.setItem('token', JSON.stringify(data));
      }

      // Call helper selectRole
      if (typeof selectRole === 'function') {
        selectRole('admin');
      } else {
        console.warn('selectRole function is not defined globally.');
      }
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
};

window.doctorLoginHandler = async function () {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const doctor = { email, password };

  try {
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      } else {
        localStorage.setItem('token', JSON.stringify(data));
      }

      if (typeof selectRole === 'function') {
        selectRole('doctor');
      } else {
        console.warn('selectRole function is not defined globally.');
      }
    } else {
      alert("Invalid credentials!");
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
};
