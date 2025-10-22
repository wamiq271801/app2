import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Teacher } from '@/types';
import { firestoreService } from '@/services/firestoreService';
import { toast } from 'sonner';
import { TeacherCard } from './TeacherCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await firestoreService.getAll<Teacher>('teachers');
      setTeachers(data);
    } catch (error) {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = departmentFilter === 'all' 
    ? teachers 
    : teachers.filter(t => t.subject === departmentFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Teachers</h1>
        <div className="flex items-center gap-4">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="History">History</SelectItem>
            </SelectContent>
          </Select>
          
          <Link to="/teachers/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading teachers...</div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No teachers found.</p>
          <Link to="/teachers/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Teacher
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
};
