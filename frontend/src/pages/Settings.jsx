import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const {user,setUser,logout}=useAuth(); const navigate=useNavigate();
  const [name,setName]=useState(user?.name||''); const [passwords,setPasswords]=useState({currentPassword:'',newPassword:'',confirm:''});
  const updateProfile=async e=>{e.preventDefault();if(!name.trim())return toast.error('Name is required');try{const {data}=await api.put('/auth/profile',{name});setUser(data.user);localStorage.setItem('shortly_user',JSON.stringify(data.user));toast.success('Profile updated')}catch(e){toast.error(e.response?.data?.message||'Unable to update profile')}};
  const changePassword=async e=>{e.preventDefault();if(passwords.newPassword.length<8)return toast.error('New password must be at least 8 characters');if(passwords.newPassword!==passwords.confirm)return toast.error('Passwords do not match');try{await api.put('/auth/change-password',{currentPassword:passwords.currentPassword,newPassword:passwords.newPassword});toast.success('Password changed');setPasswords({currentPassword:'',newPassword:'',confirm:''})}catch(e){toast.error(e.response?.data?.message||'Unable to change password')}};
  const doLogout=()=>{logout();navigate('/login')};
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="card p-5 md:p-7"><h2 className="font-semibold">Profile</h2><p className="mt-1 text-sm text-slate-500">Manage your personal account information.</p><form onSubmit={updateProfile} className="mt-6 max-w-lg space-y-4"><label className="block text-sm font-medium">Full name<input value={name} onChange={e=>setName(e.target.value)} className="field mt-1.5"/></label><label className="block text-sm font-medium">Email<input value={user?.email||''} disabled className="field mt-1.5 bg-slate-50 text-slate-500"/></label><button className="btn-primary">Save profile</button></form></section>
      <section className="card p-5 md:p-7"><h2 className="font-semibold">Change password</h2><form onSubmit={changePassword} className="mt-6 max-w-lg space-y-4"><label className="block text-sm font-medium">Current password<input type="password" value={passwords.currentPassword} onChange={e=>setPasswords({...passwords,currentPassword:e.target.value})} className="field mt-1.5"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">New password<input type="password" value={passwords.newPassword} onChange={e=>setPasswords({...passwords,newPassword:e.target.value})} className="field mt-1.5"/></label><label className="block text-sm font-medium">Confirm password<input type="password" value={passwords.confirm} onChange={e=>setPasswords({...passwords,confirm:e.target.value})} className="field mt-1.5"/></label></div><button className="btn-primary">Update password</button></form></section>
      <section className="card flex items-center justify-between p-5 md:p-7"><div><h2 className="font-semibold">Account session</h2><p className="mt-1 text-sm text-slate-500">Sign out from this device.</p></div><button onClick={doLogout} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Logout</button></section>
    </div>
  );
}
