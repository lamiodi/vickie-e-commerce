import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/AppHeader';
import { Footer } from '@/components/AppFooter';
import { StarIcon } from '@/components/AppIcons';

const testimonials = [
  {
    content: "The quality of the clothes is absolutely amazing. I've never felt more comfortable while working out!",
    author: "Sarah Johnson",
    role: "Fitness Enthusiast",
    rating: 5
  },
  {
    content: "Customer service was incredibly helpful when I needed to exchange a size. Fast shipping too!",
    author: "Michael Chen",
    role: "Verified Buyer",
    rating: 5
  },
  {
    content: "I love the sustainable materials used. It feels good to support a brand that cares about the planet.",
    author: "Emma Wilson",
    role: "Yoga Instructor",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <main className="min-h-screen bg-white font-quicksand font-semibold [&_h1]:font-poiret [&_h2]:font-poiret [&_h3]:font-poiret [&_h4]:font-poiret [&_h5]:font-poiret [&_h6]:font-poiret">
      <TopBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-[#C41E3A] tracking-wide uppercase">Testimonials</h2>
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl font-poiret">
            What our customers say
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-[#C41E3A]">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
