import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  iconColor?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, iconColor = 'text-primary' }: StatCardProps) => {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            {trend && (
              <p className={`text-xs ${trend.positive ? 'text-success' : 'text-destructive'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
