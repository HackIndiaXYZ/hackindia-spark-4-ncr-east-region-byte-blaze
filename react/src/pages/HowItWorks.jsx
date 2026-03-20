import React from 'react';

const HowItWorks = () => {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>⚙️ How InsuChain Works</h1>
          <p>Revolutionizing crop insurance through blockchain and real-time weather data</p>
        </div>
      </section>

      {/* Step 1 */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <h2>1️⃣ Register & Verify</h2>
                <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                  Create your InsuChain account with just an email and password. Choose your role as a farmer and optionally add your blockchain wallet address for transactions. Instant account activation - no lengthy paperwork!
                </p>
              </div>
            </div>
            <div className="card">
              <h4>What You Need:</h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                <li>Valid email address</li>
                <li>Secure password</li>
                <li>Optional: Wallet address for payouts</li>
                <li>Basic farm information</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2 */}
      <section className="section" style={{ background: '#f3f4f6' }}>
        <div className="container">
          <div className="grid-2">
            <div className="card" style={{ order: 2 }}>
              <h4>How to Choose:</h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                <li>Browse 14+ policy options</li>
                <li>Compare premiums and payouts</li>
                <li>Check rainfall & temperature thresholds</li>
                <li>Choose based on your crop & location</li>
              </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', order: 1 }}>
              <div>
                <h2>2️⃣ Select Policy</h2>
                <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                  Browse our comprehensive collection of insurance policies. Each policy is designed for specific weather conditions and coverage levels. Compare premiums, payouts, and conditions to find the perfect fit for your farm and crops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <h2>3️⃣ Purchase & Confirm</h2>
                <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                  Complete your purchase through our secure blockchain-based payment system. Your transaction is recorded on the blockchain for transparency and security. You immediately own the policy - no waiting period!
                </p>
              </div>
            </div>
            <div className="card">
              <h4>The Process:</h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                <li>Select your desired policy</li>
                <li>Review coverage details</li>
                <li>Confirm purchase amount</li>
                <li>Complete blockchain transaction</li>
                <li>Receive confirmation and TX hash</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4 */}
      <section className="section" style={{ background: '#f3f4f6' }}>
        <div className="container">
          <div className="grid-2">
            <div className="card" style={{ order: 2 }}>
              <h4>Automatic Monitoring:</h4>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                <li>24/7 real-time weather monitoring</li>
                <li>OpenWeatherMap API integration</li>
                <li>Instant threshold detection</li>
                <li>Smart contract automation</li>
                <li>No manual claims needed</li>
              </ul>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', order: 1 }}>
              <div>
                <h2>4️⃣ Monitor & Get Paid</h2>
                <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
                  Our system continuously monitors weather conditions in real-time. When weather reaches your policy thresholds, automatic payouts are triggered instantly through smart contracts. No waiting, no paperwork, completely transparent!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>🔧 Technology Behind InsuChain</h2>
            <p>Built with cutting-edge blockchain and web technologies</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <h3>⛓️ Blockchain</h3>
              <p>Smart contracts ensure transparent, trustless transactions with automatic payouts when conditions are met.</p>
            </div>
            <div className="card">
              <h3>🌦️ Weather Data</h3>
              <p>Real-time integration with OpenWeatherMap API provides accurate, reliable weather metrics for triggering claims.</p>
            </div>
            <div className="card">
              <h3>🔐 Security</h3>
              <p>Cryptographic security with blockchain immutability ensures your data and transactions are always secure.</p>
            </div>
            <div className="card">
              <h3>⚡ Speed</h3>
              <p>Instant payouts powered by smart contracts - no intermediaries, no delays, pure speed.</p>
            </div>
            <div className="card">
              <h3>💯 Transparency</h3>
              <p>All transactions recorded on-chain. You can verify every aspect of your policies and payouts.</p>
            </div>
            <div className="card">
              <h3>🌐 Decentralized</h3>
              <p>No central authority. InsuChain runs on distributed networks ensuring freedom and independence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section" style={{ background: '#f3f4f6' }}>
        <div className="container">
          <div className="section-header">
            <h2>✨ Key Benefits</h2>
            <p>Why farmers choose InsuChain</p>
          </div>
          <div className="grid-2">
            <div className="card">
              <h4>🚀 No Paperwork</h4>
              <p>Everything is digital and automated. No need to file claim forms or wait for manual reviews.</p>
            </div>
            <div className="card">
              <h4>⏱️ Instant Payouts</h4>
              <p>Once weather conditions trigger the policy, payouts happen automatically within minutes.</p>
            </div>
            <div className="card">
              <h4>💰 Lower Costs</h4>
              <p>No intermediaries means lower premiums and direct payments to you.</p>
            </div>
            <div className="card">
              <h4>🌍 Global Access</h4>
              <p>Access insurance from anywhere in the world with just an internet connection.</p>
            </div>
            <div className="card">
              <h4>🔍 Full Transparency</h4>
              <p>All data and transactions are verified on the blockchain. See everything that happens.</p>
            </div>
            <div className="card">
              <h4>🛡️ Fair & Equal</h4>
              <p>Same terms and conditions for all farmers. No discrimination based on location or size.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
