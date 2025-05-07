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
  // ... other reviews
];

const Testimonials = () => {
  return (
    <div>
      <Marquee pauseOnHover={true}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className="mx-4 flex items-center space-x-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
          >
            <img
              src={review.img}
              alt={review.name}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{review.name}</p>
              <p className="text-sm text-gray-500">{review.username}</p>
              <p className="mt-1 text-sm">{review.body}</p>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Testimonials;
