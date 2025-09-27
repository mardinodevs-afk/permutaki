import StarRating from '../StarRating';
import { useState } from 'react';

export default function StarRatingExample() {
  const [rating, setRating] = useState(0);
  
  return (
    <div className="space-y-4 p-4">
      <div>
        <p className="mb-2">Read-only rating (4.5 stars):</p>
        <StarRating rating={4.5} />
      </div>
      
      <div>
        <p className="mb-2">Interactive rating (current: {rating} stars):</p>
        <StarRating 
          rating={rating} 
          interactive={true} 
          onRatingChange={setRating}
        />
      </div>
      
      <div>
        <p className="mb-2">Small size rating:</p>
        <StarRating rating={3} size="sm" />
      </div>
    </div>
  );
}