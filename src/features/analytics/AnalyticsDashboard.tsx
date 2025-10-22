import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, UserCheck, UserX, TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { analyticsService, KPIData, AnalyticsFilter } from '@/services/analyticsService';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const AnalyticsDashboard = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnalyticsFilter>({});
  const [enrollmentTrend, setEnrollmentTrend] = useState<any[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<any[]>([]);
  const [feeCollectionTrend, setFeeCollectionTrend] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [kpis, enrollment, attendance, feeCollection] = await Promise.all([
        analyticsService.calculateKPIs(filter),
        analyticsService.getEnrollmentTrend(6),
        analyticsService.getAttendanceTrend(30),
        analyticsService.getFeeCollectionTrend(6),
      ]);

      setKpiData(kpis);
      setEnrollmentTrend(enrollment);
      setAttendanceTrend(attendance);
      setFeeCollectionTrend(feeCollection);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    loadAnalytics();
  };

  const clearFilters = () => {
    setFilter({});
    setTimeout(() => loadAnalytics(), 100);
  };

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  const feeStatusData = kpiData
    ? [
        { name: 'Paid', value: kpiData.feesByStatus.paid },
        { name: 'Partial', value: kpiData.feesByStatus.partial },
        { name: 'Pending', value: kpiData.feesByStatus.pending },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filter.startDate || ''}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={filter.endDate || ''}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Class</Label>
              <Input
                value={filter.class || ''}
                onChange={(e) => setFilter({ ...filter, class: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label>Section</Label>
              <Input
                value={filter.section || ''}
                onChange={(e) => setFilter({ ...filter, section: e.target.value })}
                placeholder="e.g., A"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">Loading analytics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Users className="h-7 w-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                    <p className="text-3xl font-bold">{kpiData?.totalStudents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
                    <UserCheck className="h-7 w-7 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Students</p>
                    <p className="text-3xl font-bold">{kpiData?.activeStudents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-teal-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">New Admissions</p>
                    <p className="text-3xl font-bold">{kpiData?.newAdmissions || 0}</p>
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
                    <p className="text-sm text-muted-foreground mb-1">Attendance %</p>
                    <p className="text-3xl font-bold">
                      {kpiData?.attendancePercentage.toFixed(1) || 0}%
                    </p>
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
                    <p className="text-3xl font-bold">${kpiData?.feeCollected.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <AlertCircle className="h-7 w-7 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Outstanding Fees</p>
                    <p className="text-3xl font-bold">
                      ${kpiData?.outstandingFees.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Trend (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fee Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feeStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {feeStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Attendance %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Trend (6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={feeCollectionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="collected" fill="#10b981" name="Collected" />
                    <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
