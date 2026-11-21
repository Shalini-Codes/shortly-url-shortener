import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Link2, ShieldCheck, Zap } from 'lucide-react';

export default function Landing() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const continueCreate = (e) => {
    e.preventDefault();
    navigate(url ? '/signup' : '/signup', { state: { url } });
  };
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl"><span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white"><Link2 size={18}/></span>Shortly</Link>
        <nav className="flex items-center gap-3"><Link to="/login" className="px-3 py-2 text-sm font-semibold text-slate-600">Log in</Link><Link to="/signup" className="btn-primary">Get started</Link></nav>
      </header>
      <main>
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 text-center md:pt-24">
          <div className="mx-auto mb-5 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">A smarter way to share links</div>
          <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">Short links.<br/><span className="text-indigo-600">Smarter insights.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">Create memorable short URLs and understand every click with clear, actionable analytics.</p>
          <form onSubmit={continueCreate} className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,.08)] sm:flex-row">
            <input className="field border-0 shadow-none" type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste a long URL to shorten"/>
            <button className="btn-primary shrink-0">Shorten link <ArrowRight size={16}/></button>
          </form>
        </section>
        <section className="border-y border-slate-100 bg-slate-50 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="mb-10 max-w-lg"><p className="text-sm font-bold text-indigo-600">PLATFORM</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Everything you need to manage links</h2></div>
            <div className="grid gap-5 md:grid-cols-3">
              {[['Create in seconds',Link2,'Generate clean, branded short links in just a few clicks.'],['Measure what matters',BarChart3,'Track clicks, devices, browsers and traffic sources.'],['Stay in control',ShieldCheck,'Manage active links, expiration dates and destinations.']].map(([title,Icon,text]) => <article key={title} className="card p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><Icon size={20}/></span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="card overflow-hidden grid md:grid-cols-2">
            <div className="p-8 md:p-12"><p className="text-sm font-bold text-indigo-600">ANALYTICS</p><h2 className="mt-3 text-3xl font-bold">Turn every click into insight</h2><p className="mt-4 leading-7 text-slate-600">Follow link performance over time and discover where your audience comes from.</p></div>
            <div className="border-t border-slate-100 bg-slate-50 p-8 md:border-l md:border-t-0"><div className="card p-5"><div className="flex justify-between text-sm"><span className="font-semibold">Click activity</span><span className="text-slate-400">Last 7 days</span></div><div className="mt-8 flex h-36 items-end gap-3">{[35,52,42,68,55,82,72].map((h,i)=><div key={i} className="flex-1 rounded-t bg-indigo-500" style={{height:`${h}%`,opacity:.45+i*.08}}/>)}</div></div></div>
          </div>
        </section>
        <section className="bg-slate-900 py-16 text-center text-white"><h2 className="text-3xl font-bold">Ready to share smarter?</h2><p className="mt-3 text-slate-300">Create your free account and start building.</p><Link to="/signup" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-slate-900">Get started free <Zap size={16}/></Link></section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-5 py-8 text-sm text-slate-500"><span>© 2026 Shortly</span><div className="flex gap-5"><span>Privacy</span><span>Terms</span></div></footer>
    </div>
  );
}
