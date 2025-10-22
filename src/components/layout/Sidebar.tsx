import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  UserCircle, 
  ClipboardCheck, 
  DollarSign, 
  Settings 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: GraduationCap },
  { name: 'Teachers', href: '/teachers', icon: Users },
  { name: 'Staff', href: '/staff', icon: UserCircle },
  { name: 'Attendance', href: '/attendance', icon: ClipboardCheck },
  { name: 'Fees', href: '/fees', icon: DollarSign },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-sidebar-primary" />
          School Admin
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          School Admin Dashboard v1.0
        </p>
      </div>
    </aside>
  );
};
