import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Profile() {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '', avatar: user?.avatar || '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });

  function handleProfileChange(e) {
    setProfileForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handlePwChange(e) {
    setPwForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submitProfile(e) {
    e.preventDefault();
    await updateProfile(profileForm);
  }

  async function submitPassword(e) {
    e.preventDefault();
    if (!pwForm.oldPassword || !pwForm.newPassword) return;
    await changePassword(pwForm);
    setPwForm({ oldPassword: '', newPassword: '' });
  }

  if (!user) return <p className="text-slate">No user loaded.</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <div className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">Profile</h2>
        <form onSubmit={submitProfile} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input name="name" value={profileForm.name} onChange={handleProfileChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone</label>
            <input name="phone" value={profileForm.phone} onChange={handleProfileChange} className="w-full border rounded px-3 py-2 focus:outline-primary" />
          </div>
          <div>
            <label className="block text-sm mb-1">Avatar URL</label>
            <input name="avatar" value={profileForm.avatar} onChange={handleProfileChange} className="w-full border rounded px-3 py-2 focus:outline-primary" />
          </div>
          <button disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-primary mb-4">Change Password</h2>
        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Old Password</label>
            <input name="oldPassword" type="password" value={pwForm.oldPassword} onChange={handlePwChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
          </div>
          <button disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}
