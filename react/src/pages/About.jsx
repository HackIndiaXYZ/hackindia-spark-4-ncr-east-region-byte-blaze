function About() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3EF" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "2rem" }}>About InsuChain</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
          <div>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem" }}>Our Mission</h2>
            <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "1rem", lineHeight: "1.6" }}>
              InsuChain is a blockchain-based crop insurance system using Chainlink oracles to automate payouts. We're revolutionizing agriculture insurance by making it transparent, fair, and instantly accessible to farmers worldwide.
            </p>
            <p style={{ fontSize: "18px", color: "#4b5563", lineHeight: "1.6" }}>
              Our platform uses weather data, satellite imagery, and smart contracts to ensure farmers get paid instantly when conditions trigger coverage.
            </p>
          </div>
          
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem" }}>Why We Started</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#2E7D6B", fontWeight: "bold", fontSize: "20px" }}>✓</span>
                <p style={{ color: "#1f2937" }}>Farmers face unpredictable weather risks with traditional insurance delays</p>
              </li>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#2E7D6B", fontWeight: "bold", fontSize: "20px" }}>✓</span>
                <p style={{ color: "#1f2937" }}>Manual claims processing takes weeks or months</p>
              </li>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#2E7D6B", fontWeight: "bold", fontSize: "20px" }}>✓</span>
                <p style={{ color: "#1f2937" }}>Lack of transparency in premium calculations</p>
              </li>
              <li style={{ display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#2E7D6B", fontWeight: "bold", fontSize: "20px" }}>✓</span>
                <p style={{ color: "#1f2937" }}>We're solving this with blockchain technology</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;