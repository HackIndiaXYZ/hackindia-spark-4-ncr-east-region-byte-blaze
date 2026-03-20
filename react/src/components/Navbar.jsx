import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: "32px", height: "32px", backgroundColor: "#2E7D6B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>🌾</span>
            </div>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#2E7D6B" }}>InsuChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link to="/" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }} onMouseEnter={(e) => e.target.style.color = "#2E7D6B"} onMouseLeave={(e) => e.target.style.color = "#374151"}>Home</Link>
            <Link to="/about" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }} onMouseEnter={(e) => e.target.style.color = "#2E7D6B"} onMouseLeave={(e) => e.target.style.color = "#374151"}>About Us</Link>
            <Link to="/contact" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }} onMouseEnter={(e) => e.target.style.color = "#2E7D6B"} onMouseLeave={(e) => e.target.style.color = "#374151"}>Contact</Link>
            <Link to="/reviews" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }} onMouseEnter={(e) => e.target.style.color = "#2E7D6B"} onMouseLeave={(e) => e.target.style.color = "#374151"}>Reviews</Link>
            <Link to="/faq" style={{ color: "#374151", textDecoration: "none", fontWeight: "500" }} onMouseEnter={(e) => e.target.style.color = "#2E7D6B"} onMouseLeave={(e) => e.target.style.color = "#374151"}>FAQ</Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "transparent", border: "none", cursor: "pointer", fontSize: "24px" }}>
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
            <Link to="/" style={{ padding: "0.5rem 1rem", color: "#374151", textDecoration: "none", borderRadius: "8px" }} onClick={() => setIsOpen(false)} onMouseEnter={(e) => e.target.style.backgroundColor = "#FEF3C7"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>Home</Link>
            <Link to="/about" style={{ padding: "0.5rem 1rem", color: "#374151", textDecoration: "none", borderRadius: "8px" }} onClick={() => setIsOpen(false)} onMouseEnter={(e) => e.target.style.backgroundColor = "#FEF3C7"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>About Us</Link>
            <Link to="/contact" style={{ padding: "0.5rem 1rem", color: "#374151", textDecoration: "none", borderRadius: "8px" }} onClick={() => setIsOpen(false)} onMouseEnter={(e) => e.target.style.backgroundColor = "#FEF3C7"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>Contact</Link>
            <Link to="/reviews" style={{ padding: "0.5rem 1rem", color: "#374151", textDecoration: "none", borderRadius: "8px" }} onClick={() => setIsOpen(false)} onMouseEnter={(e) => e.target.style.backgroundColor = "#FEF3C7"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>Reviews</Link>
            <Link to="/faq" style={{ padding: "0.5rem 1rem", color: "#374151", textDecoration: "none", borderRadius: "8px" }} onClick={() => setIsOpen(false)} onMouseEnter={(e) => e.target.style.backgroundColor = "#FEF3C7"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>FAQ</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;