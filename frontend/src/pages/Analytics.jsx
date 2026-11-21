import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

const COLORS=['#4f46e5','#818cf8','#a5b4fc','#c7d2fe','#dbeafe'];

export default function Analytics() {
  const {id}=useParams(); const [days,setDays]=useState(30); const [data,setData]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);const req=id?api.get(`/analytics/links/${id}`,{params:{days}}):api.get('/analytics/clicks',{params:{days}});req.then(r=>setData(r.data)).finally(()=>setLoading(false))},[id,days]);
  if(loading)return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="skeleton h-28"/>)}</div>;
  const s=data?.stats||{totalClicks:0,clicksToday:0,clicksWeek:0,uniqueClicks:0};
  const cards=id?[['Total clicks',s.totalClicks||0],['Unique clicks',s.uniqueClicks||0],['Clicks today',s.clicksToday||0],['Clicks this week',s.clicksWeek||0]]:[['Total clicks',data?.recent?.length||0],['Top devices',data?.devices?.length||0],['Traffic sources',data?.referrers?.length||0],['Tracked period',`${days} days`]];
  const donut=(data?.devices||[]).map(d=>({_id:d._id||'Unknown',clicks:d.clicks}));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end gap-2"><span className="text-sm text-slate-500">Period</span><select value={days} onChange={e=>setDays(Number(e.target.value))} className="field w-32"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></div>
      {id&&data?.link&&<div className="card p-5"><p className="text-xs text-slate-500">LINK ANALYTICS</p><h2 className="mt-1 font-semibold">{data.link.title||data.link.shortCode}</h2><p className="mt-1 truncate text-sm text-indigo-600">{data.link.originalUrl}</p></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value])=><div key={label} className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>)}</div>
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]"><section className="card p-5"><h2 className="font-semibold">Clicks over time</h2><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={data?.daily||[]}><CartesianGrid stroke="#edf0f4" vertical={false}/><XAxis dataKey="_id" tick={{fontSize:11,fill:'#94a3b8'}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:'#94a3b8'}}/><Tooltip/><Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={2.5} dot={false}/></LineChart></ResponsiveContainer></div></section>
      <section className="card p-5"><h2 className="font-semibold">Devices</h2><div className="mt-3 h-60">{donut.length?<ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donut} dataKey="clicks" nameKey="_id" innerRadius={55} outerRadius={82} paddingAngle={2}>{donut.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>:<div className="grid h-full place-items-center text-sm text-slate-400">No device data</div>}</div></section></div>
      <div className="grid gap-5 md:grid-cols-2"><section className="card p-5"><h2 className="font-semibold">Browsers</h2><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={(data?.browsers||[]).map(d=>({_id:d._id||'Unknown',clicks:d.clicks}))}><CartesianGrid stroke="#edf0f4" vertical={false}/><XAxis dataKey="_id" tick={{fontSize:11,fill:'#94a3b8'}}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="clicks" fill="#6366f1" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></section><section className="card p-5"><h2 className="font-semibold">Referrer sources</h2><div className="mt-4 space-y-3">{data?.referrers?.length?data.referrers.map(r=><div key={r._id||'Direct'} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 text-sm"><span className="truncate">{r._id||'Direct'}</span><span className="ml-3 font-semibold">{r.clicks}</span></div>):<p className="py-10 text-center text-sm text-slate-400">No referrer data</p>}</div></section></div>
      <section className="card p-5"><h2 className="font-semibold">Recent click events</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th className="py-2">Time</th><th>Link</th><th>Referrer</th><th>Device</th><th>Browser</th></tr></thead><tbody>{data?.recent?.length?data.recent.map((r,i)=><tr key={i} className="border-t border-slate-100"><td className="py-3">{new Date(r.clickedAt).toLocaleString()}</td><td>{r.linkId?.title||r.linkId?.shortCode||data.link?.shortCode||'—'}</td><td>{r.referrer||'Direct'}</td><td>{r.device||'Unknown'}</td><td>{r.browser||'Unknown'}</td></tr>):<tr><td colSpan="5" className="py-10 text-center text-slate-400">No click events yet</td></tr>}</tbody></table></div></section>
    </div>
  );
}
