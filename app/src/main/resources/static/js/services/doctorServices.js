
import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + '/doctor';

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    if (!response.ok) {
      throw new Error(`Error fetching doctors: ${response.statusText}`);
    }
    const data = await response.json();
    // Controller comment says: "Returns the list within a response map under the key 'doctors'"
    // So we should return data.doctors if that structure is accurate.
    // However, the prompt says "Extracts and returns the list of doctors from the response JSON."
    // I will return data.doctors if it exists, otherwise data.
    return data.doctors || data;
  } catch (error) {
    console.error("Failed to load doctors:", error);
    return [];
  }
}

export async function deleteDoctor(id, token) {
  try {
    // Controller comment: "Requires both doctor ID and an admin token as path variables."
    // Prompt: "Constructs the full endpoint URL using the ID and token."
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return { success: response.ok, message: data.message || "Operation completed" };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return { success: false, message: error.message };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    // Controller comment didn't specify token location, but usually POST uses headers for auth if not path.
    // However, consistent with other endpoints using path vars, keep an eye out.
    // But prompt says "headers specifying JSON data" and "doctor data in request body". 
    // I will put token in Authorization header as it's the standard way for "Also take in a token".
    // PROMPT UPDATE: "Also take in a token... Send a POST request with headers... Include the doctor data..."
    // It doesn't explicitly mention token in URL.
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(doctor)
    });

    const data = await response.json();
    return { success: response.ok, message: data.message || "Doctor saved successfully" };
  } catch (error) {
    console.error("Error saving doctor:", error);
    return { success: false, message: error.message };
  }
}

export async function filterDoctors(name, time, specialty) {
  try {
    // Controller: "Accepts name, time, and speciality as path variables."
    // Handling null/empty:
    const filterName = name || 'null';
    const filterTime = time || 'null';
    const filterSpecialty = specialty || 'null';

    const response = await fetch(`${DOCTOR_API}/filter/${filterName}/${filterTime}/${filterSpecialty}`);
    if (!response.ok) {
      throw new Error("Failed to filter doctors");
    }
    const data = await response.json();
    return data.doctors || data; // Assuming same structure as getDoctors
  } catch (error) {
    console.error("Error filtering doctors:", error);
    alert("Failed to filter doctors.");
    return [];
  }
}
