import { useState } from "react"
import { PlusIcon } from "./icons"

const faqs = [
  {
    id: "01",
    question: "How do I determine the right size for my sportswear?",
    answer:
      "We provide a detailed size guide on each product page to help you find the perfect fit. You can refer to the measurements and follow our video sizing recommendations. If you have any specific questions about sizing, feel free to reach out to our customer support team for assistance.",
  },
  {
    id: "02",
    question: "How long does shipping for my order take?",
    answer:
      "Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery.",
  },
  {
    id: "03",
    question: "Do you offer international shipping to my country?",
    answer: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location.",
  },
]

export function FAQSection() {
  const [openId, setOpenId] = useState("01")

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-center mb-12">Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => setOpenId(openId === faq.id ? "" : faq.id)}
              className="w-full flex items-start gap-4 text-left"
            >
              <span className={`text-2xl font-bold ${openId === faq.id ? "text-[#C41E3A]" : "text-gray-300"}`}>
                {faq.id}
              </span>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{faq.question}</h3>
                {openId === faq.id && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{faq.answer}</p>}
              </div>
              <PlusIcon className={`w-5 h-5 mt-1 transition-transform ${openId === faq.id ? "rotate-45" : ""}`} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
