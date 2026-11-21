import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const signup = mode === 'signup';
  const [form,setForm] = useState({name:'',email:'',password:'',confirm:''});
  const [show,setShow] = useState(false);
  const [loading,setLoading] = useState(false);
  const { login,register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const update = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = async e => {
    e.preventDefault();
    if (!form.email || !form.password || (signup && !form.name)) return toast.error('Please complete all required fields');
    if (signup && form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (signup && form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      if (signup) await register(form.name,form.email,form.password); else await login(form.email,form.password);
      toast.success(signup?'Account created':'Welcome back');
      navigate(location.state?.url ? '/create' : '/dashboard', location.state?.url ? { state: { url: location.state.url } } : undefined);
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to authenticate'); }
    finally { setLoading(false); }
  };
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-slate-950 p-10 text-white lg:flex"><Link to="/" className="flex items-center gap-2 text-xl font-bold"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500"><Link2 size={18}/></span>Shortly</Link><div><blockquote className="max-w-md text-3xl font-semibold leading-tight">Simple links.<br/>Clear decisions.</blockquote><p className="mt-5 text-sm text-slate-400">Built for teams that care about every connection.</p></div><p className="text-xs text-slate-500">© 2026 Shortly</p></div>
      <div className="flex items-center justify-center p-5"><form onSubmit={submit} className="w-full max-w-[390px] rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-7"><h1 className="text-2xl font-bold">{signup?'Create your account':'Welcome back'}</h1><p className="mt-2 text-sm text-slate-500">{signup?'Start shortening and analyzing links':'Sign in to your dashboard'}</p></div>
        {signup && <label className="mb-4 block text-sm font-medium">Full name<input name="name" value={form.name} onChange={update} className="field mt-1.5" placeholder="Alex Morgan"/></label>}
        <label className="mb-4 block text-sm font-medium">Email<input name="email" type="email" value={form.email} onChange={update} className="field mt-1.5" placeholder="you@example.com"/></label>
        <label className="mb-4 block text-sm font-medium">Password<div className="relative mt-1.5"><input name="password" type={show?'text':'password'} value={form.password} onChange={update} className="field pr-10" placeholder="Minimum 8 characters"/><button type="button" aria-label="Toggle password" onClick={()=>setShow(!show)} className="absolute right-3 top-2.5 text-slate-400">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {signup && <label className="mb-5 block text-sm font-medium">Confirm password<input name="confirm" type={show?'text':'password'} value={form.confirm} onChange={update} className="field mt-1.5" placeholder="Repeat password"/></label>}
        <button disabled={loading} className="btn-primary w-full">{loading?'Please wait':signup?'Create account':'Log in'}</button>
        <p className="mt-5 text-center text-sm text-slate-500">{signup?'Already have an account? ':'New to Shortly? '}<Link className="font-semibold text-indigo-600" to={signup?'/login':'/signup'}>{signup?'Log in':'Create account'}</Link></p>
      </form></div>
    </div>
  );
}
