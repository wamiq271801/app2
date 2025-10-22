import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export const FeesPage = () => {
  return (
    <div>
      <PageHeader
        title="Fee Management"
        description="Track and manage student fees"
      />
      
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Fee management module coming soon</p>
            <p className="text-sm">You'll be able to track payments, dues, and generate fee reports</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
