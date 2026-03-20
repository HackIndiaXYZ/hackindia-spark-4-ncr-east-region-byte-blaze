import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    // Your faqs array unchanged...
    {
      question: 'How does InsuChain work?',
      answer: 'InsuChain is a decentralized weather-based insurance platform. Farmers purchase insurance policies against specific weather conditions (rainfall, temperature). When real-time weather data from OpenWeatherMap API matches the policy triggers, automatic payouts are initiated through smart contracts.',
    },
    // ... (keep all 14 items as-is)
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          ❓ Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          Find answers to common questions about InsuChain
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={index}
              className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              role="button"
              tabIndex={0}
              aria-expanded={activeIndex === index}
              aria-label={`${faq.question} ${activeIndex === index ? '(expanded)' : '(collapsed)'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFAQ(index);
                }
              }}
            >
              <div
                className="flex items-center justify-between p-6 cursor-pointer select-none"
                onClick={() => toggleFAQ(index)}
              >
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors pr-4 flex-1">
                  {faq.question}
                </h4>
                <span className="text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  activeIndex === index ? 'max-h-96 opacity-100 p-6 pt-0 border-t border-gray-200 bg-gray-50' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
