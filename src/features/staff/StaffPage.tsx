import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const StaffPage = () => {
  return (
    <div>
      <PageHeader
        title="Staff"
        description="Manage all non-teaching staff members"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        }
      />
      
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">Staff management module coming soon</p>
            <p className="text-sm">You'll be able to manage roles like Fee Manager, Peon, Gatekeeper, etc.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
