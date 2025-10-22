import { Teacher } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Link to={`/teachers/${teacher.id}`}>
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto flex items-center justify-center">
              <User className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-1">{teacher.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{teacher.subject}</p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{teacher.email}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
