function renderHeader() {
    const headerDiv = document.getElementById("header");
    if (!headerDiv) return;

    // 1. Check if we are on the homepage to clear session
    // Note: window.location.pathname might be "/" or "/index.html"
    const path = window.location.pathname;
    if (path.endsWith("/") || path.endsWith("/index.html")) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
    }

    // 2. Get credentials
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    // 3. Security check: if role implies login but no token, force logout
    //    'patient' role is used for the public patient dashboard (no login required for viewing), 
    //    'loggedPatient' implies authenticated state. 'admin' and 'doctor' require login.
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "/";
        return;
    }

    // 4. Build HTML based on role
    let headerContent = "";
    
    // Header Logo/Title Section
    const logoSection = `
        <div class="logo">
            <a href="/" style="text-decoration: none; color: inherit;">
                <h1>Clinic Management</h1>
            </a>
        </div>`;

    let navLinks = "";

    if (role === "admin") {
        navLinks = `
            <nav>
                <button id="addDocBtn" class="adminBtn">Add Doctor</button>
                <a href="#" id="logoutBtn">Logout</a>
            </nav>`;
    } else if (role === "doctor") {
        navLinks = `
            <nav>
                <a href="/doctor/dashboard">Home</a>
                <a href="#" id="logoutBtn">Logout</a>
            </nav>`;
    } else if (role === "loggedPatient") {
        navLinks = `
            <nav>
                <a href="/patient/dashboard">Home</a>
                <a href="#" id="myApptsBtn">Appointments</a>
                <a href="#" id="logoutBtn">Logout</a>
            </nav>`;
    } else if (role === "patient") {
        // Public viewing mode for patient
        navLinks = `
            <nav>
                <button onclick="window.location.href='/login.html'" class="login-btn">Login</button>
                <button onclick="window.location.href='/signup.html'" class="signup-btn">Sign Up</button>
            </nav>`;
    } else {
        // Default / Guest
        navLinks = `
            <nav>
                <a href="/login.html">Login</a>
                <a href="/signup.html">Sign Up</a>
            </nav>`;
    }

    headerContent = `<header class="main-header">${logoSection}${navLinks}</header>`;
    headerDiv.innerHTML = headerContent;

    // 5. Attach Listeners
    attachHeaderButtonListeners(role);
}

function attachHeaderButtonListeners(role) {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (role === "loggedPatient") {
                logoutPatient();
            } else {
                logout();
            }
        });
    }

    const addDocBtn = document.getElementById("addDocBtn");
    if (addDocBtn) {
        // Determine if openModal is globally available or if we need to dispatch an event
        // For now, assuming openModal is a global function or we dispatch a custom event
        addDocBtn.addEventListener("click", () => {
             if (typeof openModal === "function") {
                 openModal('addDoctor');
             } else {
                 console.warn("openModal function not found");
             }
        });
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
}

function logoutPatient() {
    localStorage.removeItem("token");
    // revert to "patient" role to see public dashboard
    localStorage.setItem("userRole", "patient");
    window.location.href = "/pages/patientDashboard.html";
}

// Initialize
document.addEventListener("DOMContentLoaded", renderHeader);
