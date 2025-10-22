import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { GraduationCap, Users, UserCircle, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardPage = () => {
  // These would normally come from Firestore
  const stats = {
    totalStudents: 1247,
    totalTeachers: 85,
    totalStaff: 32,
    totalClasses: 42,
  };

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your school."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={GraduationCap}
          iconColor="text-primary"
          trend={{ value: '+12 this month', positive: true }}
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          iconColor="text-accent"
          trend={{ value: '+3 this month', positive: true }}
        />
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={UserCircle}
          iconColor="text-info"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={School}
          iconColor="text-success"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-2 w-2 rounded-full bg-success mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student admission</p>
                  <p className="text-xs text-muted-foreground">John Doe admitted to Class 10-A</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-2 w-2 rounded-full bg-info mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Fee payment received</p>
                  <p className="text-xs text-muted-foreground">Sarah Smith - $500 paid</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-warning mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Teacher assigned</p>
                  <p className="text-xs text-muted-foreground">Mr. Johnson assigned to Mathematics</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="text-center">
                  <div className="text-lg font-bold">15</div>
                  <div className="text-xs text-muted-foreground">NOV</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Parent-Teacher Meeting</p>
                  <p className="text-xs text-muted-foreground">All classes - 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="text-center">
                  <div className="text-lg font-bold">20</div>
                  <div className="text-xs text-muted-foreground">NOV</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Mid-term Examinations</p>
                  <p className="text-xs text-muted-foreground">Classes 6-12</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold">25</div>
                  <div className="text-xs text-muted-foreground">NOV</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Annual Sports Day</p>
                  <p className="text-xs text-muted-foreground">All students - Full day</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
