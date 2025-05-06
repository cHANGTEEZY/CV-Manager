import { Card, CardContent } from './ui/card';
import { Check } from 'lucide-react';

const PendingCard = ({ icon: Icon = Check }) => {
  return (
    <Card className="bg-muted/20">
      <CardContent className="py-16">
        <div className="text-center">
          <div className="bg-primary/10 mb-4 inline-flex rounded-full p-3">
            <Icon className="text-primary h-8 w-8" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">All caught up!</h3>
          <p className="text-muted-foreground mx-auto max-w-md">
            There are no pending assessments for the selected date. Try
            selecting a different date or check back later.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingCard;
