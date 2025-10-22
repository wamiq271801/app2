import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';
import { Student } from '@/types';
import { firestoreService } from '@/services/firestoreService';
import { toast } from 'sonner';

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStudent(id);
    }
  }, [id]);

  const loadStudent = async (studentId: string) => {
    try {
      const data = await firestoreService.getById<Student>('students', studentId);
      setStudent(data);
    } catch (error) {
      toast.error('Failed to load student');
      navigate('/students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading student...</div>;
  }

  if (!student) {
    return <div className="text-center py-8">Student not found</div>;
  }

  return (
    <div>
      <PageHeader
        title={student.name}
        description={`Class ${student.class}-${student.section}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/students')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Link to={`/students/${id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{student.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Class</p>
                <p className="font-medium">{student.class}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Section</p>
                <p className="font-medium">{student.section}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-medium">{student.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Admission Date</p>
                <p className="font-medium">{student.admissionDate}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Address</p>
                <p className="font-medium">{student.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Guardian Name</p>
                <p className="font-medium">{student.guardianName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Guardian Phone</p>
                <p className="font-medium">{student.guardianPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusBadge status={student.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
