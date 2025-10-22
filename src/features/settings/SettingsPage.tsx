import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const SettingsPage = () => {
  const [formData, setFormData] = useState({
    schoolName: 'Northwood High School',
    contactEmail: 'contact@northwood.edu',
    address: '123 Education Lane, Learningtion, USA',
    enableParentPortal: true,
    maintenanceMode: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="permissions">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="theme">Theme Customization</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Update your school's profile and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={formData.schoolName}
                      onChange={(e) => handleChange('schoolName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide behaviors and features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="parentPortal">Enable Parent Portal</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow parents to log in and view student progress.
                  </p>
                </div>
                <Switch
                  id="parentPortal"
                  checked={formData.enableParentPortal}
                  onCheckedChange={(checked) => handleChange('enableParentPortal', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable access for non-admin users.
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="mb-4">Roles & Permissions management coming soon</p>
                <p className="text-sm">Configure user roles and access levels</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="mb-4">Theme customization coming soon</p>
                <p className="text-sm">Customize colors, logos, and branding</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
