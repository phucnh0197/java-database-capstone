function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  footer.innerHTML = `
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-logo">
                <h3>Clinic CMS</h3>
                <p>&copy; ${new Date().getFullYear()} Clinic Management System. All rights reserved.</p>
            </div>
            
            <div class="footer-links">
                <div class="footer-column">
                    <h4>Company</h4>
                    <a href="#">About Us</a>
                    <a href="#">Careers</a>
                    <a href="#">Press</a>
                </div>
                <div class="footer-column">
                    <h4>Support</h4>
                    <a href="#">Account</a>
                    <a href="#">Help Center</a>
                    <a href="#">Contact Us</a>
                </div>
                <div class="footer-column">
                    <h4>Legal</h4>
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Licensing</a>
                </div>
            </div>
        </div>
    </footer>
    `;
}

// Call immediately to render if the script is deferred and DOM is parsing
// or wait for DOMContentLoaded if preferred. Since it's deferred in HTML:
renderFooter();
