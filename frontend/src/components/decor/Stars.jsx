import React from 'react';
import { Star } from 'lucide-react';

const Stars = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < count ? "fill-rose text-rose" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

export default Stars;
