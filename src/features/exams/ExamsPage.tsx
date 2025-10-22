import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, Lock, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Exam } from '@/types';
import { examService } from '@/services/examService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const ExamsPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await examService.getAllExams();
      setExams(data);
    } catch (error) {
      console.error('Error loading exams:', error);
      toast.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exams & Results</h1>
        <Button onClick={() => navigate('/exams/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading exams...</div>
      ) : exams.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No exams found. Create your first exam to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{exam.name}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={exam.published ? 'default' : 'secondary'}>
                        {exam.published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant={exam.locked ? 'destructive' : 'outline'}>
                        {exam.locked ? <Lock className="h-3 w-3 mr-1" /> : <Unlock className="h-3 w-3 mr-1" />}
                        {exam.locked ? 'Locked' : 'Unlocked'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/exams/${exam.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!exam.locked && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/exams/${exam.id}/edit`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{exam.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Academic Year</p>
                    <p className="font-medium">{exam.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(exam.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(exam.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Classes</p>
                    <p className="font-medium">{exam.classes.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subjects</p>
                    <p className="font-medium">{exam.subjects.length} subjects</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => navigate(`/exams/${exam.id}/marks`)}>
                    Enter Marks
                  </Button>
                  {exam.published && (
                    <Button onClick={() => navigate(`/exams/${exam.id}/results`)}>View Results</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
