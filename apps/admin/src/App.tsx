import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  IndianRupee, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '@drobe/api-client';

export function App() {
  const [stats, setStats] = useState<any | null>(null);
  const [pendingStylists, setPendingStylists] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    // Authenticate as admin
    loginAsAdmin();
  }, []);

  const loginAsAdmin = async () => {
    try {
      const res = await api.auth.login('admin@drobe.style', 'Drobe@2026');
      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
      }
      loadData();
    } catch {
      loadData();
    }
  };

  const loadData = async () => {
    try {
      const [s, st, u] = await Promise.all([
        api.admin.getStats(),
        api.admin.getPendingStylists(),
        api.admin.getUsers()
      ]);
      setStats(s);
      setPendingStylists(st);
      setUsersList(u);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (id: string, status: string) => {
    try {
      await api.admin.verifyStylist(id, status, 'Approved in Admin Portal');
      setActionMsg(`Stylist ${status} successfully!`);
      loadData();
    } catch (err: any) {
      setActionMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#191919] p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#EAE8E3]">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#B85D43]">DROBE Operations Control</span>
            <h1 className="text-3xl font-serif font-bold text-[#191919]">Executive Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-xs"
            >
              <span>Open Customer Web App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button onClick={loadData} className="btn-primary text-xs">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="p-3.5 rounded-xl bg-[#2D5A46]/10 text-xs text-[#2D5A46] font-medium">
            {actionMsg}
          </div>
        )}

        {/* Metrics Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-editorial p-5 bg-white space-y-1">
              <span className="text-xs text-[#8A8176]">Total Users</span>
              <h3 className="text-2xl font-bold">{stats.total_users}</h3>
            </div>
            <div className="card-editorial p-5 bg-white space-y-1">
              <span className="text-xs text-[#8A8176]">Verified Stylists</span>
              <h3 className="text-2xl font-bold text-[#2D5A46]">{stats.verified_stylists}</h3>
            </div>
            <div className="card-editorial p-5 bg-white space-y-1">
              <span className="text-xs text-[#8A8176]">Bookings Completed</span>
              <h3 className="text-2xl font-bold">{stats.total_bookings}</h3>
            </div>
            <div className="card-editorial p-5 bg-white space-y-1">
              <span className="text-xs text-[#8A8176]">Platform Commission (20%)</span>
              <h3 className="text-2xl font-bold text-[#2D5A46]">₹{stats.platform_commission_inr?.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        )}

        {/* Stylist Verification Queue */}
        <div className="card-editorial p-6 bg-white space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#191919]">Stylist Professional Verification Queue</h2>
          <div className="divide-y divide-[#EAE8E3]">
            {pendingStylists.map((st) => (
              <div key={st.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={st.user?.avatar_url}
                    alt={st.user?.display_name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#191919]">{st.user?.display_name}</h4>
                    <p className="text-xs text-[#8A8176]">{st.category} • {st.base_city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    st.verification_status === 'verified' ? 'bg-[#2D5A46]/10 text-[#2D5A46]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {st.verification_status}
                  </span>
                  <button
                    onClick={() => handleVerify(st.id, 'verified')}
                    className="btn-primary text-xs py-1 px-3"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerify(st.id, 'rejected')}
                    className="btn-secondary text-xs py-1 px-3 text-[#B85D43]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
