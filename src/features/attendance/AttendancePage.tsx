import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export const AttendancePage = () => {
  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Mark and view student attendance"
      />
      
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Attendance marking module coming soon</p>
            <p className="text-sm">You'll be able to mark attendance class-wise and view history</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
