import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  Crown, 
  Scissors, 
  Camera, 
  ShoppingBag, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Briefcase
} from 'lucide-react';
import { api } from '@drobe/api-client';

export type PortalType = 'customer' | 'boutique' | 'consultant' | 'admin';

interface AuthViewProps {
  currentRole: string;
  setCurrentRole: (role: string) => void;
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
  onLoginSuccess: (role: string, targetPortal?: PortalType) => void;
  initialPortal?: PortalType;
  initialMode?: 'signin' | 'register';
  onClose?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  currentRole,
  setCurrentRole,
  currentUser,
  setCurrentUser,
  onLoginSuccess,
  initialPortal = 'customer',
  initialMode = 'signin',
  onClose
}) => {
  const [portal, setPortal] = useState<PortalType>(initialPortal);
  const [mode, setMode] = useState<'signin' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Common Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 1. Customer Register Fields (Prompt Section 4.1)
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('+91 98470 12345');
  const [custPassword, setCustPassword] = useState('');
  const [custCity, setCustCity] = useState('Kochi');
  const [custInterests, setCustInterests] = useState('Old Money, Minimalist, Wedding');

  // 2. Boutique Register Fields (Prompt Section 4.2)
  const [btqBusinessName, setBtqBusinessName] = useState('');
  const [btqOwnerName, setBtqOwnerName] = useState('');
  const [btqEmail, setBtqEmail] = useState('');
  const [btqPhone, setBtqPhone] = useState('+91 94471 23456');
  const [btqPassword, setBtqPassword] = useState('');
  const [btqCategory, setBtqCategory] = useState('Boutique & Designer Studio');
  const [btqAddress, setBtqAddress] = useState('900 North Michigan Avenue');
  const [btqCity, setBtqCity] = useState('Chicago');
  const [btqState, setBtqState] = useState('Illinois');
  const [btqWebsite, setBtqWebsite] = useState('https://maison-ivory.style');
  const [btqRegDetails, setBtqRegDetails] = useState('CIN: U17299KL2026PTC049210');

  // 3. Consultant Register Fields (Prompt Section 4.3)
  const [consName, setConsName] = useState('');
  const [consEmail, setConsEmail] = useState('');
  const [consPhone, setConsPhone] = useState('+91 98950 88990');
  const [consPassword, setConsPassword] = useState('');
  const [consCategory, setConsCategory] = useState('Bridal & Occasion Stylist');
  const [consExperience, setConsExperience] = useState('5');
  const [consSpecializations, setConsSpecializations] = useState('Wedding Styling, Wardrobe Audit, Old Money');
  const [consCity, setConsCity] = useState('Kochi');
  const [consOpCities, setConsOpCities] = useState('Kozhikode, Kochi, Bengaluru, Thrissur');
  const [consLanguages, setConsLanguages] = useState('English, Malayalam, Hindi');
  const [consBio, setConsBio] = useState('Certified personal fashion consultant specializing in bridal trousseau and bespoke heritage drapes.');
  const [consStartingPrice, setConsStartingPrice] = useState('3500');

  // Pre-configured 1-Click Demo Accounts
  const demoAccounts = [
    {
      roleTitle: 'Customer / Fashion Client',
      portalKey: 'customer' as PortalType,
      name: 'Priya Nair',
      email: 'customer@drobe.style',
      password: 'Drobe@2026',
      icon: ShoppingBag,
      desc: 'Explore feeds, discover curated color & fabric guides, book personal stylists.'
    },
    {
      roleTitle: 'Boutique / Luxury Atelier',
      portalKey: 'boutique' as PortalType,
      name: 'Maison Ivory Atelier',
      email: 'brand@drobe.style',
      password: 'Drobe@2026',
      icon: Crown,
      desc: 'Catalog CRUD, interactive hotspot pins, lookbooks & campaigns.'
    },
    {
      roleTitle: 'Stylist / Fashion Consultant',
      portalKey: 'consultant' as PortalType,
      name: 'Maya Nambiar',
      email: 'stylist@drobe.style',
      password: 'Drobe@2026',
      icon: Scissors,
      desc: 'Client bookings, calendar slots, service pricing, and wallet.'
    },
    {
      roleTitle: 'Enterprise Admin',
      portalKey: 'admin' as PortalType,
      name: 'Vikramaditya Menon',
      email: 'admin@drobe.style',
      password: 'Drobe@2026',
      icon: ShieldCheck,
      desc: 'Operations governance, KYC verification, revenue ledger, and moderation.'
    }
  ];

  const handle1ClickLogin = async (acc: typeof demoAccounts[0]) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let res: any;
      if (acc.portalKey === 'admin') {
        res = await api.auth.adminLogin(acc.email, acc.password);
      } else if (acc.portalKey === 'boutique') {
        res = await api.auth.boutiqueLogin(acc.email, acc.password);
      } else if (acc.portalKey === 'consultant') {
        res = await api.auth.consultantLogin(acc.email, acc.password);
      } else {
        res = await api.auth.customerLogin(acc.email, acc.password);
      }

      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
        if (res.user) {
          setCurrentUser(res.user);
          setCurrentRole(res.user.role);
        }
        setSuccessToast(`Welcome back, ${acc.name}! Redirecting to ${acc.portalKey} portal...`);
        setTimeout(() => {
          onLoginSuccess(res.user?.role || acc.portalKey, acc.portalKey);
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      let res: any;
      if (portal === 'admin') {
        res = await api.auth.adminLogin(loginEmail, loginPassword);
      } else if (portal === 'boutique') {
        res = await api.auth.boutiqueLogin(loginEmail, loginPassword);
      } else if (portal === 'consultant') {
        res = await api.auth.consultantLogin(loginEmail, loginPassword);
      } else {
        res = await api.auth.customerLogin(loginEmail, loginPassword);
      }

      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
        if (res.user) {
          setCurrentUser(res.user);
          setCurrentRole(res.user.role);
        }
        setSuccessToast(`Signed in successfully! Entering ${portal} portal.`);
        setTimeout(() => {
          onLoginSuccess(res.user?.role || portal, portal);
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Incorrect credentials for this portal.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail || !custPassword) {
      setErrorMsg('Please fill in all required customer fields.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.auth.customerRegister({
        full_name: custName,
        email: custEmail,
        phone: custPhone,
        password: custPassword,
        city: custCity,
        fashion_interests: custInterests.split(',').map(s => s.trim())
      });
      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
        setSuccessToast('Account created! Welcome to DROBE.');
        setTimeout(() => onLoginSuccess('enthusiast', 'customer'), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBoutiqueRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!btqBusinessName || !btqOwnerName || !btqEmail || !btqPassword) {
      setErrorMsg('Please fill in all required boutique fields.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.auth.boutiqueRegister({
        business_name: btqBusinessName,
        owner_name: btqOwnerName,
        email: btqEmail,
        phone: btqPhone,
        password: btqPassword,
        category: btqCategory,
        city: btqCity,
        state: btqState,
        address: btqAddress,
        website_url: btqWebsite,
        business_registration_details: btqRegDetails
      });
      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
        setSuccessToast('Boutique profile created with pending verification status.');
        setTimeout(() => onLoginSuccess('brand', 'boutique'), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Boutique registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultantRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consName || !consEmail || !consPassword) {
      setErrorMsg('Please fill in all required consultant fields.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.auth.consultantRegister({
        full_name: consName,
        email: consEmail,
        phone: consPhone,
        password: consPassword,
        category: consCategory,
        experience_years: parseInt(consExperience) || 3,
        specializations: consSpecializations.split(',').map(s => s.trim()),
        city: consCity,
        operating_cities: consOpCities.split(',').map(s => s.trim()),
        languages: consLanguages.split(',').map(s => s.trim()),
        bio: consBio,
        starting_price: parseFloat(consStartingPrice) || 2500
      });
      if (res?.access_token) {
        localStorage.setItem('drobe_token', res.access_token);
        setCurrentUser(res.user);
        setCurrentRole(res.user.role);
        setSuccessToast('Stylist profile registered with pending certification review.');
        setTimeout(() => onLoginSuccess('stylist', 'consultant'), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Consultant registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '2rem 1.5rem 5rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: '#FFFFFF',
          border: '1px solid #EAE8E3',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#8A8176',
          marginBottom: '1rem'
        }}>
          <ShieldCheck size={16} color="#191919" />
          <span>DROBE Unified Identity Architecture</span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#191919',
          marginBottom: '8px'
        }}>
          Select Your Portal Experience
        </h1>
        <p style={{ color: '#666', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Four independent portals sharing one secure PostgreSQL database. Choose your account type to proceed.
        </p>
      </div>

      {/* 4 Portal Selector Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '2.5rem'
      }}>
        {[
          { key: 'customer' as PortalType, title: 'Customer Portal', icon: ShoppingBag, desc: 'Fashion discovery & stylist booking' },
          { key: 'boutique' as PortalType, title: 'Boutique / Brand', icon: Crown, desc: 'Store catalog, hotspots & lookbooks' },
          { key: 'consultant' as PortalType, title: 'Stylist / Consultant', icon: Scissors, desc: 'Client appointments & earnings' },
          { key: 'admin' as PortalType, title: 'Enterprise Admin', icon: ShieldCheck, desc: 'Verifications & governance' }
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = portal === item.key;
          return (
            <div
              key={item.key}
              onClick={() => {
                setPortal(item.key);
                setErrorMsg('');
                if (item.key === 'admin') setMode('signin');
              }}
              style={{
                background: isSelected ? '#191919' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#191919',
                borderRadius: '20px',
                padding: '20px',
                border: isSelected ? '1px solid #191919' : '1px solid #EAE8E3',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 10px 25px rgba(25,25,25,0.15)' : '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Icon size={22} color={isSelected ? '#D4AF37' : '#191919'} />
                {isSelected && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37' }} />}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.78rem', color: isSelected ? '#A09C94' : '#8A8176' }}>{item.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Main Authentication Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '28px',
        padding: '36px',
        border: '1px solid #EAE8E3',
        boxShadow: '0 15px 40px rgba(0,0,0,0.04)',
        maxWidth: '720px',
        margin: '0 auto 3rem'
      }}>
        {/* Mode Toggle Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #EAE8E3', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A8176' }}>
              {portal.toUpperCase()} PORTAL
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.8rem', fontWeight: 700, color: '#191919' }}>
              {mode === 'signin' && `Sign In to ${portal.charAt(0).toUpperCase() + portal.slice(1)}`}
              {mode === 'register' && `Register as ${portal.charAt(0).toUpperCase() + portal.slice(1)}`}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
          </div>

          {portal !== 'admin' && (
            <div style={{ display: 'flex', gap: '8px', background: '#F7F5F0', padding: '4px', borderRadius: '999px' }}>
              <button
                onClick={() => { setMode('signin'); setErrorMsg(''); }}
                style={{
                  background: mode === 'signin' ? '#191919' : 'transparent',
                  color: mode === 'signin' ? '#FFFFFF' : '#666',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                style={{
                  background: mode === 'register' ? '#191919' : 'transparent',
                  color: mode === 'register' ? '#FFFFFF' : '#666',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div style={{
            background: '#FFEBEE',
            color: '#C62828',
            padding: '12px 18px',
            borderRadius: '14px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            border: '1px solid #FFCDD2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successToast && (
          <div style={{
            background: '#E8F5E9',
            color: '#2E7D32',
            padding: '12px 18px',
            borderRadius: '14px',
            marginBottom: '20px',
            fontSize: '0.88rem',
            border: '1px solid #A5D6A7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={16} />
            <span>{successToast}</span>
          </div>
        )}

        {/* ---------------- A. SIGN IN FORM (Common across portals with role enforcement) ---------------- */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {portal === 'admin' && (
              <div style={{
                background: '#FFF8E1',
                border: '1px solid #FFE082',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: '#8D6E63'
              }}>
                🔒 <strong>Restricted Access:</strong> Admin accounts do NOT have public self-registration. Only super admin can grant administrative credentials.
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919', display: 'block', marginBottom: '4px' }}>
                Account Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#8A8176" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  placeholder={portal === 'admin' ? 'admin@drobe.style' : `${portal}@drobe.style`}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid #EAE8E3', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{ background: 'none', border: 'none', color: '#8A8176', fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#8A8176" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1px solid #EAE8E3', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} color="#8A8176" /> : <Eye size={16} color="#8A8176" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px',
                boxShadow: '0 4px 15px rgba(25,25,25,0.15)'
              }}
            >
              {loading ? 'Authenticating...' : `Enter ${portal.charAt(0).toUpperCase() + portal.slice(1)} Portal`}
            </button>
          </form>
        )}

        {/* ---------------- B. CUSTOMER REGISTER FORM (Prompt Section 4.1) ---------------- */}
        {mode === 'register' && portal === 'customer' && (
          <form onSubmit={handleCustomerRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Nair"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98470 12345"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Email Address *</label>
              <input
                type="email"
                required
                placeholder="priya@example.com"
                value={custEmail}
                onChange={(e) => setCustEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>City</label>
                <input
                  type="text"
                  placeholder="Kochi / Chicago"
                  value={custCity}
                  onChange={(e) => setCustCity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Fashion Aesthetic Interests</label>
              <input
                type="text"
                placeholder="Old Money, Streetwear, Minimalist"
                value={custInterests}
                onChange={(e) => setCustInterests(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {loading ? 'Creating Customer Profile...' : 'Complete Customer Registration'}
            </button>
          </form>
        )}

        {/* ---------------- C. BOUTIQUE REGISTER FORM (Prompt Section 4.2) ---------------- */}
        {mode === 'register' && portal === 'boutique' && (
          <form onSubmit={handleBoutiqueRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Business / Boutique Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maison Ivory Atelier"
                  value={btqBusinessName}
                  onChange={(e) => setBtqBusinessName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Owner / Manager Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={btqOwnerName}
                  onChange={(e) => setBtqOwnerName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Business Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@maison-ivory.style"
                  value={btqEmail}
                  onChange={(e) => setBtqEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Business Phone</label>
                <input
                  type="text"
                  placeholder="+1 312 555 0199"
                  value={btqPhone}
                  onChange={(e) => setBtqPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Password *</label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={btqPassword}
                onChange={(e) => setBtqPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>City *</label>
                <input
                  type="text"
                  required
                  placeholder="Chicago / Kochi"
                  value={btqCity}
                  onChange={(e) => setBtqCity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>State / Region</label>
                <input
                  type="text"
                  placeholder="Illinois / Kerala"
                  value={btqState}
                  onChange={(e) => setBtqState(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Store Address</label>
              <input
                type="text"
                placeholder="900 North Michigan Avenue"
                value={btqAddress}
                onChange={(e) => setBtqAddress(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
              />
            </div>

            <div style={{
              background: '#FFF8E1',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#8D6E63'
            }}>
              ℹ️ Boutique profiles are initialized with <strong>Pending Verification Status</strong> until approved by DROBE editorial administration.
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {loading ? 'Submitting Application...' : 'Register Boutique Profile'}
            </button>
          </form>
        )}

        {/* ---------------- D. CONSULTANT REGISTER FORM (Prompt Section 4.3) ---------------- */}
        {mode === 'register' && portal === 'consultant' && (
          <form onSubmit={handleConsultantRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Full Professional Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Nambiar"
                  value={consName}
                  onChange={(e) => setConsName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Professional Category *</label>
                <select
                  value={consCategory}
                  onChange={(e) => setConsCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                >
                  <option value="Bridal & Occasion Stylist">Bridal & Occasion Stylist</option>
                  <option value="Personal Stylist">Personal Stylist</option>
                  <option value="Celebrity Stylist">Celebrity Stylist</option>
                  <option value="Wardrobe Consultant">Wardrobe Consultant</option>
                  <option value="Commercial & Editorial Stylist">Commercial & Editorial Stylist</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="maya.stylist@example.com"
                  value={consEmail}
                  onChange={(e) => setConsEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={consPassword}
                  onChange={(e) => setConsPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Base City *</label>
                <input
                  type="text"
                  required
                  placeholder="Kochi / Kozhikode"
                  value={consCity}
                  onChange={(e) => setConsCity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Starting Fee (INR)</label>
                <input
                  type="number"
                  placeholder="3500"
                  value={consStartingPrice}
                  onChange={(e) => setConsStartingPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Operating Cities (comma separated)</label>
              <input
                type="text"
                placeholder="Kozhikode, Kochi, Thrissur, Kannur, Bengaluru"
                value={consOpCities}
                onChange={(e) => setConsOpCities(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#191919' }}>Professional Biography</label>
              <textarea
                rows={2}
                value={consBio}
                onChange={(e) => setConsBio(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAE8E3', marginTop: '4px' }}
              />
            </div>

            <div style={{
              background: '#FFF8E1',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              color: '#8D6E63'
            }}>
              ℹ️ Consultant accounts initially show a <strong>Pending Verification Badge</strong>. Admin approval activates your public booking calendar and marketplace search.
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              {loading ? 'Submitting Verification...' : 'Submit Stylist Registration'}
            </button>
          </form>
        )}

        {/* ---------------- E. FORGOT PASSWORD ---------------- */}
        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.88rem', color: '#666' }}>
              Enter your registered email address to receive password reset instructions.
            </p>
            <input
              type="email"
              placeholder="Your email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={{ padding: '12px 14px', borderRadius: '12px', border: '1px solid #EAE8E3' }}
            />
            <button
              onClick={() => {
                alert('Password reset instructions dispatched to your email.');
                setMode('signin');
              }}
              style={{
                background: '#191919',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '999px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Dispatch Reset Link
            </button>
            <button
              onClick={() => setMode('signin')}
              style={{ background: 'none', border: 'none', color: '#8A8176', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>

      {/* 1-Click Instant Demo Credentials Grid */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A8176', letterSpacing: '0.08em' }}>
            Rapid Developer & Reviewer Testing
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#191919', marginTop: '2px' }}>
            1-Click Instant Test Access
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px'
        }}>
          {demoAccounts.map((acc, i) => {
            const Icon = acc.icon;
            return (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '18px',
                  border: '1px solid #EAE8E3',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Icon size={16} color="#191919" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#191919' }}>{acc.roleTitle}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#191919' }}>{acc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8A8176', margin: '4px 0 12px' }}>{acc.email}</div>
                  <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, marginBottom: '14px' }}>
                    {acc.desc}
                  </p>
                </div>
                <button
                  onClick={() => handle1ClickLogin(acc)}
                  disabled={loading}
                  style={{
                    background: '#191919',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Launch as {acc.portalKey}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
