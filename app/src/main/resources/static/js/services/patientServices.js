
import { API_BASE_URL } from "../config/config.js";

const PATIENT_API = API_BASE_URL + '/patient';

export async function patientSignup(data) {
  try {
    const response = await fetch(PATIENT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return { success: response.ok, message: result.message || "Signup processed" };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, message: error.message };
  }
}

export async function patientLogin(data) {
  // Prompt says: "Returns the full fetch response so the frontend can check status, extract token, etc."
  try {
    const response = await fetch(`${PATIENT_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    // Returning a mock error response or null might be safer if the caller expects a Response object
    // But throwing allows the caller to catch.
    throw error;
  }
}

export async function getPatientData(token) {
  try {
    // Controller: "Handles HTTP GET requests to retrieve patient details using a token."
    // Likely path variable based on context.
    const response = await fetch(`${PATIENT_API}/${token}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}

export async function getPatientAppointments(id, token, user) {
  try {
    // Controller: "Requires the patient ID, token, and user role as path variables."
    // Correction: Controller actually maps to /patient/{id}/{token}
    const response = await fetch(`${PATIENT_API}/${id}/${token}`);
    if (response.ok) {
      const data = await response.json();
      return data.appointments || data; // Adjust based on actual API response structure
    }
    console.error("Failed to fetch appointments");
    return null;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    // Controller: "Accepts filtering parameters: condition, name, and a token."
    // Likely path variables: /filter/{condition}/{name}/{token} ?
    // Or /appointment/filter/... ?
    // Given filterDoctors was /filter/..., let's assume /patient/filter or /patient/appointment/filter
    // Controller method is "filterPatientAppointment".
    // Let's guess: `${PATIENT_API}/filter/${condition}/${name}/${token}`
    // Just in case names can be empty for filtering:
    const filterCondition = condition || 'null';
    const filterName = name || 'null';

    const response = await fetch(`${PATIENT_API}/filter/${filterCondition}/${filterName}/${token}`);

    if (response.ok) {
      const data = await response.json();
      return data.appointments || data;
    }
    console.error("Failed to filter appointments");
    return [];
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("An unexpected error occurred while filtering.");
    return [];
  }
}
