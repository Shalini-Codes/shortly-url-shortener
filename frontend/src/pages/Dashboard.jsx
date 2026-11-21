import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Link2, MousePointerClick, Plus, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(()=>{ api.get('/analytics/overview').then(r=>setData(r.data)).finally(()=>setLoading(false)); },[]);
  const base=(import.meta.env.VITE_PUBLIC_BASE_URL||'http://localhost:5000');
  if(loading) return <div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="skeleton h-28"/>)}</div>;
  const s=data?.stats||{};
  const cards=[['Total links',s.totalLinks||0,Link2,'indigo'],['Total clicks',s.totalClicks||0,MousePointerClick,'emerald'],['Last 7 days',s.clicks7d||0,TrendingUp,'amber'],['Active links',s.activeLinks||0,Activity,'sky']];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Here is how your links are performing.</p></div><button onClick={()=>navigate('/create')} className="btn-primary"><Plus size={17}/>Create link</button></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon,color])=>{const colors={indigo:'bg-indigo-50 text-indigo-600',emerald:'bg-emerald-50 text-emerald-600',amber:'bg-amber-50 text-amber-600',sky:'bg-sky-50 text-sky-600'};return <div key={label} className="card p-5"><div className="flex justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div><span className={`grid h-9 w-9 place-items-center rounded-lg ${colors[color]}`}><Icon size={18}/></span></div></div>})}</div>
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <section className="card p-5"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Click activity</h2><p className="mt-1 text-xs text-slate-500">Last 7 days</p></div></div><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={data?.daily||[]}><CartesianGrid stroke="#edf0f4" vertical={false}/><XAxis dataKey="_id" tick={{fontSize:12,fill:'#94a3b8'}}/><YAxis allowDecimals={false} tick={{fontSize:12,fill:'#94a3b8'}}/><Tooltip/><Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={2.5} dot={false} activeDot={{r:4}}/></LineChart></ResponsiveContainer></div></section>
        <section className="card p-5"><h2 className="font-semibold">Top performing links</h2><div className="mt-4 space-y-3">{data?.topLinks?.length?data.topLinks.map(l=><button key={l._id} onClick={()=>navigate(`/analytics/${l._id}`)} className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-slate-50"><div className="min-w-0"><p className="truncate text-sm font-semibold">{l.title||l.shortCode}</p><p className="truncate text-xs text-slate-400">{base}/{l.shortCode}</p></div><span className="ml-3 text-sm font-bold text-slate-700">{l.clicks}</span></button>):<p className="py-12 text-center text-sm text-slate-400">No link activity yet</p>}</div></section>
      </div>
      <section className="card overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-semibold">Recent links</h2><button onClick={()=>navigate('/links')} className="flex items-center gap-1 text-sm font-semibold text-indigo-600">View all <ArrowUpRight size={14}/></button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="px-5 py-3">Title</th><th className="px-5 py-3">Short URL</th><th className="px-5 py-3">Clicks</th><th className="px-5 py-3">Status</th></tr></thead><tbody>{data?.recentLinks?.length?data.recentLinks.map(l=><tr key={l._id} className="border-t border-slate-100"><td className="px-5 py-4 font-medium">{l.title||l.originalUrl}</td><td className="px-5 py-4 text-indigo-600">{base}/{l.shortCode}</td><td className="px-5 py-4">{l.clicks}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs ${l.isActive?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-600'}`}>{l.isActive?'Active':'Inactive'}</span></td></tr>):<tr><td colSpan="4" className="py-12 text-center text-slate-400">No links created yet</td></tr>}</tbody></table></div></section>
    </div>
  );
}
