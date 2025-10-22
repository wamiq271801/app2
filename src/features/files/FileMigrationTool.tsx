import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { FileMeta } from '@/types';
import { fileMigrationService, MigrationProgress } from '@/services/fileMigrationService';
import { firestoreService } from '@/services/firestoreService';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

export const FileMigrationTool = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState<Record<string, MigrationProgress>>({});

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const allFiles = await firestoreService.getAll<FileMeta>('fileMeta');
      const indexedDBFiles = allFiles.filter(f => f.storageType === 'indexeddb');
      setFiles(indexedDBFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const selectAll = () => {
    setSelectedFiles(new Set(files.map(f => f.id)));
  };

  const deselectAll = () => {
    setSelectedFiles(new Set());
  };

  const startMigration = async () => {
    if (selectedFiles.size === 0) {
      toast.error('Please select at least one file to migrate');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to migrate ${selectedFiles.size} file(s) to Firebase Storage? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setMigrating(true);
      const filesToMigrate = files.filter(f => selectedFiles.has(f.id));

      const result = await fileMigrationService.migrateFilesInBatch(
        filesToMigrate,
        (fileId, prog) => {
          setProgress(prev => ({ ...prev, [fileId]: prog }));
        }
      );

      toast.success(
        `Migration completed: ${result.successful} successful, ${result.failed} failed`
      );

      await loadFiles();
      setSelectedFiles(new Set());
      setProgress({});
    } catch (error) {
      console.error('Error during migration:', error);
      toast.error('Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  const getTotalSize = () => {
    return files
      .filter(f => selectedFiles.has(f.id))
      .reduce((sum, f) => sum + f.size, 0);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">File Migration Tool</h1>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">About File Migration</h3>
              <p className="text-sm text-muted-foreground">
                This tool migrates files from local IndexedDB storage to Firebase Cloud Storage.
                Once migrated, files will be accessible from any device and will be backed up in the cloud.
                The migration process is one-way and cannot be undone.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">Loading files...</div>
      ) : files.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No files in IndexedDB to migrate</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Migration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{files.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected</p>
                  <p className="text-2xl font-bold">{selectedFiles.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold">{formatBytes(getTotalSize())}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={selectAll} variant="outline" disabled={migrating}>
                  Select All
                </Button>
                <Button onClick={deselectAll} variant="outline" disabled={migrating}>
                  Deselect All
                </Button>
                <Button
                  onClick={startMigration}
                  disabled={selectedFiles.size === 0 || migrating}
                  className="ml-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {migrating ? 'Migrating...' : 'Start Migration'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files to Migrate</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {files.map((file) => {
                    const fileProgress = progress[file.id];
                    const isSelected = selectedFiles.has(file.id);

                    return (
                      <Card key={file.id} className={isSelected ? 'border-primary' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleFileSelection(file.id)}
                              disabled={migrating}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium">{file.filename}</p>
                                {fileProgress && (
                                  <Badge
                                    variant={
                                      fileProgress.status === 'completed'
                                        ? 'default'
                                        : fileProgress.status === 'failed'
                                        ? 'destructive'
                                        : 'secondary'
                                    }
                                  >
                                    {fileProgress.status === 'completed' && (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {fileProgress.status === 'failed' && (
                                      <XCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {fileProgress.status}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{formatBytes(file.size)}</span>
                                <span>{file.mimeType}</span>
                                <span>
                                  {file.ownerType}: {file.ownerId}
                                </span>
                              </div>
                              {fileProgress && fileProgress.status === 'uploading' && (
                                <Progress
                                  value={fileProgress.progress || 0}
                                  className="mt-2"
                                />
                              )}
                              {fileProgress && fileProgress.status === 'failed' && (
                                <p className="text-sm text-red-600 mt-1">
                                  Error: {fileProgress.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
