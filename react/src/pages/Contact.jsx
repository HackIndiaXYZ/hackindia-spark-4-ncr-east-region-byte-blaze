import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to a backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>📧 Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with our team!</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            {/* Contact Form */}
            <div>
              <h2>Send us a Message</h2>
              {submitted && (
                <div className="alert alert-success">
                  Thank you! Your message has been sent. We'll get back to you soon.
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2>Get in Touch</h2>
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h4>📍 Office Address</h4>
                <p>
                  InsuChain Headquarters<br />
                  123 BlockchaiAvenue<br />
                  Tech City, TC 12345<br />
                  India
                </p>
              </div>

              <div className="card">
                <h4>📞 Phone</h4>
                <p>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
              </div>

              <div className="card">
                <h4>📧 Email</h4>
                <p>
                  <a href="mailto:support@insuchainmai.com">support@insuchainmai.com</a><br />
                  <a href="mailto:info@insuchainmai.com">info@insuchainmai.com</a>
                </p>
              </div>

              <div className="card">
                <h4>🕐 Business Hours</h4>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                  Saturday: 10:00 AM - 4:00 PM IST<br />
                  Sunday: Closed<br />
                  <br />
                  <em>24/7 Support available via email</em>
                </p>
              </div>

              <div className="card">
                <h4>🌐 Follow Us</h4>
                <p>
                  <a href="#">Twitter</a> | <a href="#">LinkedIn</a> | <a href="#">GitHub</a> | <a href="#">Discord</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs CTA */}
      <section className="section" style={{ background: '#f3f4f6' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Have Questions?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            Check out our FAQ page for quick answers to common questions
          </p>
          <a href="/faq" className="btn btn-primary">
            Visit FAQ
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
