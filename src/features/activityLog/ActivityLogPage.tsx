import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, RotateCcw, Eye } from 'lucide-react';
import { ActivityLog } from '@/types';
import { activityLogService } from '@/services/activityLogService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ActivityLogPage = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [filter, setFilter] = useState({ entityType: '', entityId: '' });

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const logs = await activityLogService.getRecentActivity(undefined, 100);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const loadEntityHistory = async () => {
    if (!filter.entityType || !filter.entityId) {
      toast.error('Please enter both entity type and entity ID');
      return;
    }

    try {
      setLoading(true);
      const logs = await activityLogService.getEntityHistory(filter.entityType, filter.entityId);
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error loading entity history:', error);
      toast.error('Failed to load entity history');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: ActivityLog['action']) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'publish':
        return 'bg-purple-100 text-purple-800';
      case 'unpublish':
        return 'bg-orange-100 text-orange-800';
      case 'revert':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDiff = (diff: Record<string, { old: any; new: any }>) => {
    return Object.entries(diff).map(([field, values]) => (
      <div key={field} className="mb-2">
        <span className="font-medium">{field}:</span>
        <div className="ml-4 text-sm">
          <div className="text-red-600">
            Old: {JSON.stringify(values.old)}
          </div>
          <div className="text-green-600">
            New: {JSON.stringify(values.new)}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activity Log & Audit Trail</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter by Entity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Entity Type</Label>
              <Input
                value={filter.entityType}
                onChange={(e) => setFilter({ ...filter, entityType: e.target.value })}
                placeholder="e.g., students, exams"
              />
            </div>
            <div>
              <Label>Entity ID</Label>
              <Input
                value={filter.entityId}
                onChange={(e) => setFilter({ ...filter, entityId: e.target.value })}
                placeholder="Entity ID"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={loadEntityHistory}>Filter</Button>
              <Button variant="outline" onClick={() => {
                setFilter({ entityType: '', entityId: '' });
                loadActivityLogs();
              }}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">Loading activity logs...</div>
      ) : activityLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No activity logs found</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <div key={log.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      {index < activityLogs.length - 1 && (
                        <div className="w-px h-full bg-border mt-2" />
                      )}
                    </div>
                    <Card className="flex-1 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getActionColor(log.action)}>
                                {log.action.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {log.entityType}
                              </span>
                            </div>
                            <p className="font-medium mb-1">
                              {log.actorName} {log.action}d {log.entityType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Entity ID: {log.entityId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLog(log)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Activity Details</DialogTitle>
                                <DialogDescription>
                                  View detailed information about this activity
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Actor</Label>
                                  <p>{log.actorName} ({log.actorUid})</p>
                                </div>
                                <div>
                                  <Label>Action</Label>
                                  <p className="capitalize">{log.action}</p>
                                </div>
                                <div>
                                  <Label>Entity</Label>
                                  <p>{log.entityType} - {log.entityId}</p>
                                </div>
                                <div>
                                  <Label>Timestamp</Label>
                                  <p>{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                                {log.diff && Object.keys(log.diff).length > 0 && (
                                  <div>
                                    <Label>Changes</Label>
                                    <div className="mt-2 p-4 bg-muted rounded-lg">
                                      {formatDiff(log.diff)}
                                    </div>
                                  </div>
                                )}
                                {log.snapshot && (
                                  <div>
                                    <Label>Snapshot</Label>
                                    <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                                      {JSON.stringify(log.snapshot, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.meta && (
                                  <div>
                                    <Label>Metadata</Label>
                                    <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                                      {JSON.stringify(log.meta, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
