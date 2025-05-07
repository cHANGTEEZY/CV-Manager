import { Marquee } from '../magicui/marquee';

const reviews = [
  {
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: 'Jack',
    username: '@jack',
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: 'Jill',
    username: '@jill',
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: 'https://avatar.vercel.sh/jill',
  },
];

const Testimonials = () => {
  return (
    <section>
      <h2 className="mb-12 text-center text-4xl font-bold sm:text-5xl">
        What our Customers say{' '}
      </h2>
      <div className="w-full overflow-hidden">
        <Marquee pauseOnHover={true} className="py-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="mx-4 flex min-w-[300px] items-start space-x-4 rounded-lg bg-[oklch(0.18_0.02_260)] p-6 shadow-md"
            >
              <img
                src={review.img || '/placeholder.svg'}
                alt={review.name}
                className="h-12 w-12 rounded-full border-2 border-[oklch(0.65_0.23_25)]"
              />
              <div>
                <p className="font-semibold text-[oklch(0.9_0.01_270)]">
                  {review.name}
                </p>
                <p className="text-sm text-[oklch(0.7_0.01_270)]">
                  {review.username}
                </p>
                <p className="mt-2 text-[oklch(0.85_0.01_270)]">
                  {review.body}
                </p>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;
