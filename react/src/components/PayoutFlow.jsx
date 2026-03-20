function PayoutFlow() {
  const steps = [
    { number: 1, title: "Register Crop", description: "Upload your crop details and location information", icon: "🌾" },
    { number: 2, title: "Choose Coverage", description: "Select insurance coverage based on weather risks", icon: "☔" },
    { number: 3, title: "Pay Premium", description: "Complete payment securely via blockchain", icon: "💳" },
    { number: 4, title: "Auto Payout", description: "Receive instant compensation when conditions trigger", icon: "✅" },
  ];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        {steps.map((step, index) => (
          <div key={index} style={{ position: "relative" }}>
            <div style={{ position: "relative", backgroundColor: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center", height: "100%", transition: "box-shadow 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#2E7D6B", color: "white", fontWeight: "bold", fontSize: "20px", marginBottom: "1rem", margin: "0 auto 1rem" }}>
                {step.number}
              </div>
              <div style={{ fontSize: "32px", marginBottom: "1rem" }}>{step.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>{step.title}</h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.4" }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits section */}
      <div style={{ marginTop: "3rem", paddingTop: "3rem", borderTop: "1px solid #e5e7eb" }}>
        <h3 style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", color: "#1f2937", marginBottom: "2rem" }}>
          Why Farmers Choose InsuChain
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ fontSize: "32px", flexShrink: 0 }}>🚀</div>
            <div>
              <h4 style={{ fontWeight: "bold", color: "#1f2937", marginBottom: "0.25rem" }}>Fast & Efficient</h4>
              <p style={{ color: "#666", fontSize: "14px" }}>Claims processed within 24 hours with no paperwork hassle</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ fontSize: "32px", flexShrink: 0 }}>🔒</div>
            <div>
              <h4 style={{ fontWeight: "bold", color: "#1f2937", marginBottom: "0.25rem" }}>Secure & Transparent</h4>
              <p style={{ color: "#666", fontSize: "14px" }}>All transactions on blockchain with complete transparency</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ fontSize: "32px", flexShrink: 0 }}>💰</div>
            <div>
              <h4 style={{ fontWeight: "bold", color: "#1f2937", marginBottom: "0.25rem" }}>Fair Pricing</h4>
              <p style={{ color: "#666", fontSize: "14px" }}>Competitive rates based on actual risk assessment</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ fontSize: "32px", flexShrink: 0 }}>🌍</div>
            <div>
              <h4 style={{ fontWeight: "bold", color: "#1f2937", marginBottom: "0.25rem" }}>Global Coverage</h4>
              <p style={{ color: "#666", fontSize: "14px" }}>Available in multiple countries with local weather APIs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayoutFlow;