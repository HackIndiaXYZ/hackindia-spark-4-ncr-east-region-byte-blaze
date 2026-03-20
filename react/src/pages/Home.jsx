import { Link } from "react-router-dom";
import FarmingIllustration from "../components/FarmingIllustration";
import PayoutFlow from "../components/PayoutFlow";

function Home() {
  return (
    <div style={{ backgroundColor: "#F5F3EF", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
          {/* Left Side - Content */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", width: "fit-content" }}>
              <span style={{ backgroundColor: "#DBEAFE", color: "#166534", padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "14px", fontWeight: "500" }}>
                🌱 Smart Agriculture Insurance
              </span>
            </div>

            {/* Main Heading */}
            <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "1.5rem", lineHeight: "1.2" }}>
              Protect Your Crops During Every Season
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: "18px", color: "#4b5563", marginBottom: "1rem", lineHeight: "1.6" }}>
              Decentralized crop insurance powered by blockchain technology. Get instant payouts based on real-time weather conditions.
            </p>

            <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "2rem", lineHeight: "1.6" }}>
              Join thousands of farmers securing their harvest with transparent, fair, and automated insurance.
            </p>

            {/* CTA Button */}
            <div style={{ display: "flex", flexDirection: "row", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <button style={{ backgroundColor: "#2E7D6B", color: "white", fontWeight: "bold", padding: "1rem 2.5rem", borderRadius: "9999px", fontSize: "18px", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#1B5E20"} onMouseLeave={(e) => e.target.style.backgroundColor = "#2E7D6B"}>
                Get Started
              </button>
              <button style={{ backgroundColor: "transparent", color: "#2E7D6B", fontWeight: "bold", padding: "1rem 2.5rem", borderRadius: "9999px", fontSize: "18px", border: "2px solid #2E7D6B", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#F0FDF4"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
                Learn More
              </button>
            </div>

            {/* Trust indicators */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "24px" }}>✓</span>
                <p style={{ color: "#1f2937" }}><strong>100% Transparent</strong> Smart Contracts</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "24px" }}>⚡</span>
                <p style={{ color: "#1f2937" }}><strong>Instant Payouts</strong> within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "100%", maxWidth: "320px" }}>
              <FarmingIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div style={{ height: "4px", background: "linear-color(to right, transparent, #4CAF50, transparent)" }}></div>

      {/* Features Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem" }}>
            Why Choose InsuChain?
          </h2>
          <p style={{ fontSize: "18px", color: "#4b5563", maxWidth: "640px", margin: "0 auto" }}>
            We combine modern technology with agricultural expertise to deliver the best insurance experience for farmers
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {/* Feature 1 */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}>
            <div style={{ fontSize: "32px", marginBottom: "1rem" }}>🔐</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.75rem" }}>Blockchain Secured</h3>
            <p style={{ color: "#4b5563" }}>
              All transactions are secured on the blockchain, ensuring transparency and immutability of your insurance claims.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}>
            <div style={{ fontSize: "32px", marginBottom: "1rem" }}>⚡</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.75rem" }}>Instant Payouts</h3>
            <p style={{ color: "#4b5563" }}>
              Weather-based automatic triggers ensure you get paid instantly when conditions are met, no paperwork needed.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}>
            <div style={{ fontSize: "32px", marginBottom: "1rem" }}>💰</div>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937", marginBottom: "0.75rem" }}>Affordable Premiums</h3>
            <p style={{ color: "#4b5563" }}>
              Smart pricing based on crop type and location. No hidden fees, completely transparent pricing model.
            </p>
          </div>
        </div>
      </section>

      {/* Payout Flow Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem", backgroundColor: "white", borderRadius: "24px", marginBottom: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem" }}>
            How It Works
          </h2>
        </div>
        <PayoutFlow />
      </section>

      {/* CTA Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem", marginBottom: "2rem" }}>
        <div style={{ backgroundColor: "#2E7D6B", borderRadius: "24px", padding: "3rem", textAlign: "center", color: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "1.5rem" }}>
            Ready to Secure Your Harvest?
          </h2>
          <p style={{ fontSize: "18px", marginBottom: "2rem", opacity: 0.9, maxWidth: "640px", margin: "0 auto 2rem" }}>
            Join our community of farmers who trust InsuChain for their crop insurance needs.
          </p>
          <button style={{ backgroundColor: "white", color: "#2E7D6B", fontWeight: "bold", padding: "1rem 3rem", borderRadius: "9999px", fontSize: "18px", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"} onMouseLeave={(e) => e.target.style.backgroundColor = "white"}>
            Start Your Journey →
          </button>
        </div>
      </section>

      {/* Footer spacing */}
      <div style={{ height: "32px" }}></div>
    </div>
  );
}

export default Home;
