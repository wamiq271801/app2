import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCircle,
  ClipboardCheck,
  DollarSign,
  BarChart3,
  ClipboardList,
  Activity,
  Upload,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Students', href: '/students', icon: GraduationCap },
  { name: 'Teachers', href: '/teachers', icon: Users },
  { name: 'Staff', href: '/staff', icon: UserCircle },
  { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { name: 'Exams', href: '/exams', icon: ClipboardList },
  { name: 'Fees', href: '/fees', icon: DollarSign },
  { name: 'Activity Log', href: '/activity-log', icon: Activity },
  { name: 'File Migration', href: '/file-migration', icon: Upload },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">School Admin</h1>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
