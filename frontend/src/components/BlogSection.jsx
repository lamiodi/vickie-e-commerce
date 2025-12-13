import { ArrowRightIcon, CalendarIcon, ChatBubbleIcon } from './AppIcons';

const articles = [
  {
    id: 1,
    date: 'June 2, 2024',
    comments: 204,
    title: 'The Ultimate Guide to Choosing the Right Sportswear for Your Workout',
    author: 'Michael Davis',
    image: '/woman-in-black-gym-leggings-fitness-pose.jpg',
  },
  {
    id: 2,
    date: 'May 15, 2024',
    comments: 142,
    title: 'Mastering Your Sports Nutrition: Essential Tips for Optimal Performance',
    author: 'Sarah Thompson',
    image: '/woman-wearing-gray-crop-top-fitness.jpg',
  },
  {
    id: 3,
    date: 'May 8, 2024',
    comments: 89,
    title: 'Staying Motivated: Strategies to Overcome Challenges in Fitness Journey',
    author: 'Emily Wilson',
    image: '/athletic-woman-in-dark-seamless-workout-outfit-pos.jpg',
  },
];

export function BlogSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Latest Updates</h2>
        <a href="#" className="flex items-center gap-2 text-sm text-[#C41E3A] hover:underline">
          See All Articles <ArrowRightIcon className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="group">
            <div className="rounded-lg overflow-hidden mb-4 h-[200px]">
              <img
                src={article.image || '/placeholder.svg'}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <ChatBubbleIcon className="w-3.5 h-3.5" />
                {article.comments}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-2 group-hover:text-[#C41E3A] transition-colors leading-tight">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500">{article.author}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
