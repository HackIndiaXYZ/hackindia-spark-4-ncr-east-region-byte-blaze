function Reviews() {
  const testimonials = [
    { name: "Rajesh Kumar", farm: "Punjab Farm", rating: 5, text: "Got payout in just 2 minutes! InsuChain saved my harvest.", image: "👨‍🌾" },
    { name: "Priya Singh", farm: "Haryana Fields", rating: 5, text: "The transparency and speed are incredible. Best insurance I've ever used.", image: "👩‍🌾" },
    { name: "Amit Patel", farm: "Delhi Region", rating: 5, text: "No more wait for claims. Automatic payouts based on weather. Brilliant!", image: "👨‍🌾" },
    { name: "Meera Sharma", farm: "NCR Agriculture", rating: 5, text: "Finally, an insurance platform I can trust. Highly recommended!", image: "👩‍🌾" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3EF" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem", textAlign: "center" }}>Farmer Reviews</h1>
        <p style={{ fontSize: "18px", color: "#4b5563", textAlign: "center", maxWidth: "640px", margin: "0 auto 3rem" }}>Hear from farmers who've already transformed their crop insurance experience</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transition: "box-shadow 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)"} onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "48px" }}>{testimonial.image}</div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>{testimonial.name}</h3>
                  <p style={{ fontSize: "14px", color: "#4b5563" }}>{testimonial.farm}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ fontSize: "18px" }}>⭐</span>
                ))}
              </div>
              <p style={{ color: "#1f2937", fontStyle: "italic" }}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
        
        <div style={{ backgroundColor: "#2E7D6B", borderRadius: "16px", padding: "3rem", textAlign: "center", color: "white" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "1rem" }}>Join Thousands of Happy Farmers</h2>
          <p style={{ fontSize: "18px", marginBottom: "2rem", opacity: 0.9 }}>Experience the future of crop insurance today</p>
          <button style={{ backgroundColor: "white", color: "#2E7D6B", fontWeight: "bold", padding: "0.75rem 2rem", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "16px" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"} onMouseLeave={(e) => e.target.style.backgroundColor = "white"}>
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reviews;