import { useState } from 'react';
import { PlusIcon } from './AppIcons';

const faqs = [
  {
    id: '01',
    question: 'How do I determine the right size for my sportswear?',
    answer:
      'We provide a detailed size guide on each product page to help you find the perfect fit. You can refer to the measurements and follow our video sizing recommendations. If you have any specific questions about sizing, feel free to reach out to our customer support team for assistance.',
  },
  {
    id: '02',
    question: 'How long does shipping for my order take?',
    answer:
      'Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery.',
  },
  {
    id: '03',
    question: 'Do you offer international shipping to my country?',
    answer:
      'Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location.',
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState('01');

  return (
    <section className="bg-[#f8f9fa] py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 font-serif">Questions</h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`transition-all duration-300 rounded-xl ${
                openId === faq.id ? 'bg-white shadow-lg p-8' : 'bg-transparent p-4 border-b border-gray-200'
              }`}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? '' : faq.id)}
                className="w-full flex items-start gap-8 text-left group"
              >
                <span
                  className={`text-3xl font-bold transition-colors duration-300 ${
                    openId === faq.id ? 'text-[#C41E3A]' : 'text-gray-200 group-hover:text-gray-300'
                  }`}
                >
                  {faq.id}
                </span>
                <div className="flex-1 pt-1">
                  <h3
                    className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      openId === faq.id ? 'text-black' : 'text-gray-600 group-hover:text-black'
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openId === faq.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
                {/* Optional: Add an icon if desired, or keep it clean with just the number */}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
