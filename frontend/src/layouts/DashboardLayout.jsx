import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, ChevronLeft, LayoutDashboard, Link2, LogOut, Menu, Plus, Search, Settings, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to:'/dashboard', label:'Dashboard', icon:LayoutDashboard },
  { to:'/links', label:'My Links', icon:Link2 },
  { to:'/analytics', label:'Analytics', icon:BarChart3 },
  { to:'/create', label:'Create New Link', icon:Plus },
  { to:'/settings', label:'Settings', icon:Settings }
];

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const title = nav.find(i => location.pathname === i.to || (i.to !== '/dashboard' && location.pathname.startsWith(i.to)))?.label || 'Dashboard';

  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800">
      {mobileOpen && <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/20 md:hidden"/>}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all ${collapsed?'w-[76px]':'w-[230px]'} ${mobileOpen?'translate-x-0':'-translate-x-full'} md:translate-x-0`}>
        <div className="h-[68px] flex items-center px-5 border-b border-slate-100">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white"><Link2 size={17}/></span>
            {!collapsed && <span className="text-lg font-bold tracking-tight">Shortly</span>}
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map(({to,label,icon:Icon}) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({isActive}) => `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${isActive?'bg-indigo-50 text-indigo-700':'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <Icon size={18}/>{!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button onClick={doLogout} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600">
            <LogOut size={18}/>{!collapsed && 'Logout'}
          </button>
          <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            {!collapsed && <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div>}
          </div>
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-[82px] hidden h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm md:grid"><ChevronLeft size={13} className={collapsed?'rotate-180':''}/></button>
      </aside>

      <div className={`${collapsed?'md:ml-[76px]':'md:ml-[230px]'} transition-all`}>
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 md:px-7">
          <div className="flex items-center gap-3">
            <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="md:hidden"><Menu size={20}/></button>
            <h1 className="text-base font-semibold text-slate-900">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/links')} className="hidden h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:flex"><Search size={16}/><span>Search</span></button>
            <button aria-label="View analytics" onClick={() => navigate('/analytics')} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"><Bell size={18}/></button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100"><div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{user?.name?.[0]?.toUpperCase()}</div><ChevronDown size={14}/></button>
              {profileOpen && <div className="absolute right-0 top-11 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"><button onClick={() => {navigate('/settings');setProfileOpen(false)}} className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-50">Profile settings</button><button onClick={doLogout} className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button></div>}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-4 md:p-7"><Outlet/></main>
      </div>
    </div>
  );
}
