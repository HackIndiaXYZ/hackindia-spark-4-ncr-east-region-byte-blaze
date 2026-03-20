function Contact() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3EF" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem", textAlign: "center" }}>Contact Us</h1>
        <p style={{ fontSize: "18px", color: "#4b5563", textAlign: "center", maxWidth: "640px", margin: "0 auto 3rem" }}>We'd love to hear from you. Get in touch with our team anytime.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "1rem" }}>📧</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>Email</h3>
            <p style={{ color: "#4b5563", marginBottom: "1rem" }}>support@insuchain.com</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Response within 24 hours</p>
          </div>
          
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "1rem" }}>📱</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>Phone</h3>
            <p style={{ color: "#4b5563", marginBottom: "1rem" }}>+91 (###) ###-####</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Mon-Fri, 9 AM - 6 PM</p>
          </div>
          
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "1rem" }}>📍</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>Location</h3>
            <p style={{ color: "#4b5563", marginBottom: "1rem" }}>NCR East Region, India</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Visit anytime</p>
          </div>
        </div>
        
        <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "2rem", textAlign: "center" }}>Send us a Message</h2>
          <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <input type="text" placeholder="Your Name" style={{ width: "100%", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", fontFamily: "Poppins" }} />
            <input type="email" placeholder="Your Email" style={{ width: "100%", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", fontFamily: "Poppins" }} />
            <textarea placeholder="Your Message" rows="5" style={{ width: "100%", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", fontFamily: "Poppins", resize: "vertical" }}></textarea>
            <button type="submit" style={{ width: "100%", backgroundColor: "#2E7D6B", color: "white", fontWeight: "bold", padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#1B5E20"} onMouseLeave={(e) => e.target.style.backgroundColor = "#2E7D6B"}>
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;