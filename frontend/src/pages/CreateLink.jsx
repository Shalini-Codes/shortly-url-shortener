import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Copy, Dices, ExternalLink, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function CreateLink() {
  const location=useLocation();
  const [form,setForm]=useState({originalUrl:'',customAlias:'',title:'',expiresAt:''});
  const [created,setCreated]=useState(null);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{if(location.state?.url)setForm(f=>({...f,originalUrl:location.state.url}))},[location.state]);
  const update=e=>setForm({...form,[e.target.name]:e.target.value});
  const random=()=>setForm({...form,customAlias:Math.random().toString(36).slice(2,9)});
  const submit=async e=>{
    e.preventDefault();
    if(!form.originalUrl) return toast.error('Enter a destination URL');
    setLoading(true);
    try { const {data}=await api.post('/links',form); setCreated(data.link); toast.success('Short link created'); }
    catch(error){toast.error(error.response?.data?.message||'Unable to create link')}
    finally{setLoading(false)}
  };
  const base=(import.meta.env.VITE_PUBLIC_BASE_URL||'http://localhost:5000');
  const shortUrl=created?`${base}/${created.shortCode}`:'';
  const copy=async()=>{await navigator.clipboard.writeText(shortUrl);toast.success('Copied to clipboard')};
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
      <form onSubmit={submit} className="card p-5 md:p-7"><h2 className="text-lg font-semibold">Create a short link</h2><p className="mt-1 text-sm text-slate-500">Add a destination and customize how it appears.</p><div className="mt-6 space-y-5">
        <label className="block text-sm font-medium">Destination URL <span className="text-red-500">*</span><input name="originalUrl" type="url" value={form.originalUrl} onChange={update} className="field mt-1.5" placeholder="https://example.com/very/long/url"/></label>
        <label className="block text-sm font-medium">Custom alias <span className="text-slate-400">(optional)</span><div className="mt-1.5 flex gap-2"><input name="customAlias" value={form.customAlias} onChange={update} className="field" placeholder="my-campaign"/><button type="button" onClick={random} className="btn-secondary shrink-0"><Dices size={17}/><span className="hidden sm:inline">Generate</span></button></div></label>
        <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium">Link title <span className="text-slate-400">(optional)</span><input name="title" value={form.title} onChange={update} className="field mt-1.5" placeholder="Spring campaign"/></label><label className="block text-sm font-medium">Expiration <span className="text-slate-400">(optional)</span><input name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={update} className="field mt-1.5"/></label></div>
      </div><button disabled={loading} className="btn-primary mt-7">{loading?'Creating...':'Create short link'}</button></form>
      {created?<div className="card h-fit p-5"><h2 className="font-semibold">Your short link</h2><div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3"><a href={shortUrl} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-semibold text-indigo-600">{shortUrl}</a><button onClick={copy} className="text-slate-500" aria-label="Copy short link"><Copy size={17}/></button></div><div className="mt-5 grid place-items-center rounded-lg border border-slate-100 p-5"><QRCodeSVG value={shortUrl} size={160}/></div><a href={shortUrl} target="_blank" rel="noreferrer" className="btn-secondary mt-4 w-full">Open link <ExternalLink size={15}/></a></div>:<div className="card h-fit p-8 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-slate-400"><QrCode size={22}/></span><p className="mt-4 text-sm font-semibold">QR code preview</p><p className="mt-1 text-xs text-slate-500">Your QR code will appear after creation.</p></div>}
    </div>
  );
}
