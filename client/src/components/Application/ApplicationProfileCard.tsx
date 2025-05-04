import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Briefcase } from 'lucide-react';

interface ApplicantProfileProps {
  name: string;
  email: string;
  phone: string;
  position: string;
  timeline: number;
}

export function ApplicantProfileCard({
  name,
  email,
  phone,
  position,
  timeline,
}: ApplicantProfileProps) {
  // Map timeline number to status text
  const getStatusText = () => {
    switch (timeline) {
      case 1:
        return 'Application Submitted';
      case 2:
        return 'Under Review';
      case 3:
        return 'Interview Stage';
      case 4:
        return 'Assessment Stage';
      case 5:
        return 'Final Decision';
      case 6:
        return 'Onboarding';
      default:
        return 'In Progress';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="from-primary/80 to-primary h-24 bg-gradient-to-r" />
      <CardContent className="relative pt-0">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <Avatar className="border-background -mt-12 h-24 w-24 border-4">
              <AvatarFallback className="bg-primary/10 text-2xl">
                {name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h2 className="text-2xl font-bold">{name || 'N/A'}</h2>
              <p className="text-muted-foreground">{position || 'N/A'}</p>
              <Badge variant="outline" className="mt-2">
                {getStatusText()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">{phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Briefcase className="text-muted-foreground h-4 w-4" />
            <span className="text-sm">Applied for: {position || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
