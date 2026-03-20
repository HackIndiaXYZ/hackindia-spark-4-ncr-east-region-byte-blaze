function Footer() {
  return (
    <footer style={{ backgroundColor: "#1B5E20", color: "white", padding: "3rem 0", marginTop: "4rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #2E5E2E" }}>
          {/* Company Info */}
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "32px" }}>🌾</span>InsuChain
            </h3>
            <p style={{ color: "#C8E6C9" }}>
              Decentralized crop insurance powered by blockchain technology
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", color: "#C8E6C9" }}>
              <li><a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>About Us</a></li>
              <li><a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>How It Works</a></li>
              <li><a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>Contact</a></li>
              <li><a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "white"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "1rem" }}>Contact</h4>
            <p style={{ color: "#C8E6C9", marginBottom: "0.5rem" }}>Email: info@insuchain.com</p>
            <p style={{ color: "#C8E6C9", marginBottom: "1rem" }}>Phone: +91 (###) ###-####</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "#FFD700"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>Twitter</a>
              <a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "#FFD700"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>LinkedIn</a>
              <a href="#" style={{ color: "#C8E6C9", textDecoration: "none" }} onMouseEnter={(e) => e.target.style.color = "#FFD700"} onMouseLeave={(e) => e.target.style.color = "#C8E6C9"}>GitHub</a>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div style={{ textAlign: "center", color: "#C8E6C9" }}>
          <p>© 2026 InsuChain. All rights reserved.</p>
          <p style={{ fontSize: "14px", marginTop: "0.5rem" }}>Protecting Harvests with Blockchain Innovation</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;