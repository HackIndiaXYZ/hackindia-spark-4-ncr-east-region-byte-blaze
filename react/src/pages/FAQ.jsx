import { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = [
    { question: "How does the payout work?", answer: "Smart contracts automatically trigger payouts when weather conditions meet your coverage criteria. The blockchain-verified data ensures transparent, instant payments." },
    { question: "What crops are covered?", answer: "We currently cover major crops including wheat, rice, corn, cotton, sugarcane, and vegetables. Coverage varies by region. Check our crop database for your area." },
    { question: "How much does the insurance cost?", answer: "Premiums are calculated based on crop type, location, area size, and historical weather risk. Most farmers see premiums between 2-5% of crop value. Get an instant quote on our platform." },
    { question: "What if weather predictions are wrong?", answer: "We use multiple weather data sources and Chainlink oracles for accuracy. Our models account for historical patterns and are constantly improved with AI/ML technology." },
    { question: "Can I claim multiple times in a year?", answer: "Yes! You can claim whenever the covered weather event occurs. There's no limit on claims as long as your coverage is active and conditions are met." },
    { question: "How long does claim settlement take?", answer: "Claims are typically settled within 24 hours. Most payouts are instant (2-5 minutes) once weather triggers are verified by our oracle network." },
    { question: "Is my data secure on blockchain?", answer: "Yes, blockchain technology ensures your data is encrypted and immutable. You have full transparency over all transactions while maintaining privacy." },
    { question: "What if I want to cancel my policy?", answer: "You can cancel anytime. Unused premium portions will be refunded to your wallet within 48 hours." }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3EF" }}>
      <div style={{ maxWidth: "896px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem", textAlign: "center" }}>Frequently Asked Questions</h1>
        <p style={{ fontSize: "18px", color: "#4b5563", textAlign: "center", marginBottom: "3rem" }}>Find answers to common questions about InsuChain</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "4rem" }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <button onClick={() => setOpenIndex(openIndex === index ? -1 : index)} style={{ width: "100%", padding: "1.5rem 2rem", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "transparent", border: "none", cursor: "pointer", transition: "background-color 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>{faq.question}</h3>
                <span style={{ fontSize: "24px", color: "#2E7D6B", fontWeight: "bold" }}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div style={{ padding: "1.5rem 2rem", backgroundColor: "#F9FAFB", borderTop: "1px solid #e5e7eb" }}>
                  <p style={{ color: "#1f2937", lineHeight: "1.6" }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1f2937", marginBottom: "1rem" }}>Still have questions?</h2>
          <p style={{ fontSize: "16px", color: "#4b5563", marginBottom: "1.5rem" }}>Our support team is here to help</p>
          <a href="/contact" style={{ display: "inline-block", backgroundColor: "#2E7D6B", color: "white", fontWeight: "bold", padding: "0.75rem 2rem", borderRadius: "8px", textDecoration: "none", transition: "background-color 0.3s" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#1B5E20"} onMouseLeave={(e) => e.target.style.backgroundColor = "#2E7D6B"}>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

export default FAQ;