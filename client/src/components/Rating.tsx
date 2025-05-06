import { Star } from 'lucide-react';
import { FC } from 'react';

interface StarRatingProps {
  /**
   * Current rating value (1-5)
   * @default 0
   */
  rating?: number;

  /**
   * Callback function when rating changes
   */
  onRatingChange: (value: number) => void;

  /**
   * Maximum rating value
   * @default 5
   */
  maxRating?: number;

  /**
   * Size of star icons
   * @default 24
   */
  size?: number;

  /**
   * Color of active stars
   * @default 'fill-yellow-400 text-yellow-400'
   */
  activeColor?: string;

  /**
   * Color of inactive stars
   * @default 'text-gray-300'
   */
  inactiveColor?: string;

  /**
   * If true, rating cannot be changed
   * @default false
   */
  readOnly?: boolean;
}

/**
 * A reusable star rating component
 */
const StarRating: FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  maxRating = 5,
  size = 24,
  activeColor = 'fill-yellow-400 text-yellow-400',
  inactiveColor = 'text-gray-300',
  readOnly = false,
}) => {
  const handleClick = (value: number) => {
    if (readOnly) return;
    onRatingChange(value);
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((starValue) => (
        <Star
          key={starValue}
          size={size}
          className={`${readOnly ? '' : 'cursor-pointer'} ${
            starValue <= rating ? activeColor : inactiveColor
          }`}
          onClick={() => handleClick(starValue)}
        />
      ))}
    </div>
  );
};

export default StarRating;
