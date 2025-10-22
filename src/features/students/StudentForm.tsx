import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/types';
import { firestoreService } from '@/services/firestoreService';
import { toast } from 'sonner';

export const StudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    email: '',
    class: '',
    section: '',
    guardianName: '',
    guardianPhone: '',
    address: '',
    dateOfBirth: '',
    admissionDate: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      loadStudent(id);
    }
  }, [id, isEditing]);

  const loadStudent = async (studentId: string) => {
    try {
      const student = await firestoreService.getById<Student>('students', studentId);
      if (student) {
        setFormData(student);
      }
    } catch (error) {
      toast.error('Failed to load student');
      navigate('/students');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing && id) {
        await firestoreService.update('students', id, formData);
        toast.success('Student updated successfully');
      } else {
        await firestoreService.add('students', formData);
        toast.success('Student added successfully');
      }
      navigate('/students');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update student' : 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Student, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Student' : 'Add New Student'}
        description={isEditing ? 'Update student information' : 'Fill in the details to add a new student'}
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Input
                  id="class"
                  value={formData.class}
                  onChange={(e) => handleChange('class', e.target.value)}
                  placeholder="e.g., 10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => handleChange('section', e.target.value)}
                  placeholder="e.g., A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name *</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => handleChange('guardianName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                <Input
                  id="guardianPhone"
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => handleChange('guardianPhone', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date *</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => handleChange('admissionDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Student' : 'Add Student')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/students')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
