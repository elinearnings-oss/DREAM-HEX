import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User as UserIcon, Mail, Shield, Bell, Key, Check, AlertCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, showToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailAlerts, setEmailAlerts] = useState(user?.notifications.emailAlerts ?? true);
  const [rewardAlerts, setRewardAlerts] = useState(user?.notifications.rewardAlerts ?? true);
  const [securityAlerts, setSecurityAlerts] = useState(user?.notifications.securityAlerts ?? true);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-xs text-slate-400">Please sign in to view your profile settings.</p>
      </div>
    );
  }

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateUserProfile({ name });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('error', 'Password Length', 'Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Mismatch', 'New passwords do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('success', 'Security Updated', 'Your password has been changed successfully.');
  };

  const handleSaveNotifications = () => {
    updateUserProfile({
      notifications: {
        emailAlerts,
        rewardAlerts,
        securityAlerts
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#1b2332]">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
          <span>Account Settings</span>
          <span aria-hidden="true">·</span>
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account information, security credentials, and platform notification preferences.
        </p>
      </div>

      {/* Account Status Card */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xl font-mono">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              Account: {user.accountStatus}
            </span>
          </div>
        </div>

        {/* Unboxed Metadata row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#18202d] text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Member ID:</span>
            <span className="text-slate-200 font-mono">{user.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Registered:</span>
            <span className="text-slate-200">{new Date(user.registeredAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Age Verification:</span>
            <span className="text-emerald-400 font-mono">Verified 18+</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">KYC Requirement:</span>
            <span className="text-slate-300 font-mono">{user.kycStatus}</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Personal Info & Security Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Name Update Form */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-rose-500" />
            <span>Account Details</span>
          </h3>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-[#161c27] border border-[#222b3b] rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Contact customer support to modify email credentials.</span>
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-[#161c28] hover:bg-[#1f283a] border border-[#283449] text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-rose-500" />
            <span>Change Password</span>
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

      </div>

      {/* Notification Preferences */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-500" />
          <span>Notification Preferences</span>
        </h3>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-3.5 bg-[#121620] border border-[#1f2738] rounded-xl cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Reward Cycle Execution Alerts</span>
              <span className="text-[11px] text-slate-400">Receive alerts whenever a 24-hour 5% product reward is credited.</span>
            </div>
            <input
              type="checkbox"
              checked={rewardAlerts}
              onChange={e => {
                setRewardAlerts(e.target.checked);
                setTimeout(handleSaveNotifications, 50);
              }}
              className="w-4 h-4 rounded text-rose-600 bg-[#161c28] border-[#303c50]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#121620] border border-[#1f2738] rounded-xl cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Deposit & Withdrawal Confirmations</span>
              <span className="text-[11px] text-slate-400">Notifies you on blockchain transactions verified via HELEKET.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => {
                setEmailAlerts(e.target.checked);
                setTimeout(handleSaveNotifications, 50);
              }}
              className="w-4 h-4 rounded text-rose-600 bg-[#161c28] border-[#303c50]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#121620] border border-[#1f2738] rounded-xl cursor-pointer">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Critical Security Notices</span>
              <span className="text-[11px] text-slate-400">Mandatory alerts regarding password updates or unfamiliar session logins.</span>
            </div>
            <input
              type="checkbox"
              checked={securityAlerts}
              onChange={e => {
                setSecurityAlerts(e.target.checked);
                setTimeout(handleSaveNotifications, 50);
              }}
              className="w-4 h-4 rounded text-rose-600 bg-[#161c28] border-[#303c50]"
            />
          </label>
        </div>
      </div>

    </div>
  );
};
