import { PageHeader } from '@/components/common/PageHeader';
import { GraduationCap, Users, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DashboardPage = () => {
  const stats = {
    totalStudents: 1234,
    totalTeachers: 56,
    feeCollection: '$50,000',
    upcomingEvents: 5,
  };

  const notifications = [
    { id: 1, type: 'success', message: 'Fee payment for John Doe is successful.', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'New student application requires approval.', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Server maintenance scheduled for tomorrow.', time: '1 day ago' },
  ];

  const reminders = [
    { id: 1, title: 'Staff Meeting', time: 'Today, 4:00 PM', icon: Calendar },
    { id: 2, title: 'Parent-Teacher Conference', time: 'March 25, 2024', icon: Users },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Admin!</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <p className="text-3xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                <Users className="h-7 w-7 text-teal-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Teachers</p>
                <p className="text-3xl font-bold">{stats.totalTeachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fee Collected</p>
                <p className="text-3xl font-bold">{stats.feeCollection}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold">{stats.upcomingEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Fee Collection</CardTitle>
              <p className="text-sm text-muted-foreground">This Year</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Chart visualization coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Today</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">95%</div>
                  <p className="text-muted-foreground">Present</p>
                  <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span>On Leave</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.type === 'success' ? 'bg-green-100' :
                      notif.type === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${
                        notif.type === 'success' ? 'bg-green-500' :
                        notif.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <reminder.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{reminder.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
