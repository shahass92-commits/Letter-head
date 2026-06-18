import React, { useState, useEffect } from 'react';
import { initialLetterData } from './defaultData';
import { AppointmentLetterData, ThemeVariant } from './types';
import { generateMailBodyHtml } from './utils/htmlGenerator';
import SignaturePad from './components/SignaturePad';
import { 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  FileCode, 
  Sparkles, 
  RefreshCw, 
  Mail, 
  Info, 
  ShieldCheck, 
  Eye, 
  ChevronRight, 
  FileText,
  MousePointerClick,
  Monitor,
  Smartphone,
  ExternalLink,
  LogOut,
  FilePlus,
  Share2,
  Database,
  Compass
} from 'lucide-react';

import { 
  initAuth, 
  googleSignIn, 
  logout, 
  createAcceptanceForm, 
  fetchFormResponses,
  FormResponseDetail
} from './utils/googleAuth';
import { User } from 'firebase/auth';

export default function App() {
  const [data, setData] = useState<AppointmentLetterData>(initialLetterData);
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('midnight-gold');
  
  // Custom states
  const [copied, setCopied] = useState(false);
  const [emailSentSimulated, setEmailSentSimulated] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'terms' | 'signatures' | 'acceptance' | 'forms'>('edit');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [customTermTitle, setCustomTermTitle] = useState('');
  const [customTermDesc, setCustomTermDesc] = useState('');

  // Google Forms integration states
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [formDeployLoading, setFormDeployLoading] = useState(false);
  const [formDeploySuccess, setFormDeploySuccess] = useState(false);
  const [deployedFormUri, setDeployedFormUri] = useState('');
  const [createdFormId, setCreatedFormId] = useState('');
  const [formsResponses, setFormsResponses] = useState<FormResponseDetail[]>([]);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState('');

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setSyncError('');
      }
    } catch (error) {
      console.error(error);
      alert("Sign-in failed. Please accept popup permissions and try again.");
    }
  };

  const handleGoogleSignOut = async () => {
    await logout();
    setGoogleUser(null);
    setGoogleToken(null);
    setFormsResponses([]);
    setCreatedFormId('');
    setDeployedFormUri('');
  };

  const handleCreateForm = async () => {
    if (!googleToken) return;
    setFormDeployLoading(true);
    setFormDeploySuccess(false);
    try {
      const { formId, responderUri } = await createAcceptanceForm(
        googleToken,
        data.recipientName,
        data.designation
      );
      setCreatedFormId(formId);
      setDeployedFormUri(responderUri);
      
      // Update data state so the candidate letter now points directly to the actual Google Form!
      setData(prev => ({
        ...prev,
        showAcceptButton: true,
        acceptOfferUrl: responderUri,
        acceptBtnText: "ACCEPT APPOINTMENT ON GOOGLE FORMS"
      }));

      setFormDeploySuccess(true);
      
      // Fetch responses immediately to initialize
      try {
        const responses = await fetchFormResponses(googleToken, formId);
        setFormsResponses(responses);
      } catch (e) {
        // Safe to ignore on first run
      }
    } catch (error: any) {
      console.error(error);
      alert("Failed to create Google Form: " + error.message);
    } finally {
      setFormDeployLoading(false);
    }
  };

  const handleSyncResponses = async () => {
    if (!googleToken || !createdFormId) return;
    setSyncLoading(true);
    setSyncError('');
    try {
      const responses = await fetchFormResponses(googleToken, createdFormId);
      setFormsResponses(responses);
    } catch (error: any) {
      console.error(error);
      setSyncError(error.message || "Failed to fetch responses. If newly created, wait 5 seconds and sync again.");
    } finally {
      setSyncLoading(false);
    }
  };
  
  // Quick presets for fast demonstration
  const presets = [
    {
      name: "Default: Muhammad Ibrahim",
      role: "Fleet Coordinator and Driving Executive",
      comp: "As per company policy and mutually agreed remuneration structure",
      location: "Technopark Campus, Thiruvananthapuram",
      recipient: "Mr. Muhammad Ibrahim",
      fh: "Shamnad H",
      ref: "CTT/APPT/FLEET/2026/001"
    },
    {
      name: "Corporate Logistics Advisor",
      role: "Senior Flight & Logistics Operations Lead",
      comp: "INR 65,000/- Per Month Consolidated",
      location: "Technopark Campus & Kochi Regional Operations Base",
      recipient: "Aditya R. Nair",
      fh: "Rajendran Nair K.",
      ref: "CTT/APPT/LOG/2026/084"
    },
    {
      name: "Corporate Customer Dispatch Supervisor",
      role: "Corporate Transit Manager & Client Relations Lead",
      comp: "INR 50,000/- Basic with Performance Superchargers",
      location: "Infopark Campus, Kakkanad, Kochi",
      recipient: "Sherin Varghese",
      fh: "Varghese Abraham",
      ref: "CTT/APPT/OPS/2026/112"
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setData(prev => ({
      ...prev,
      recipientName: preset.recipient,
      recipientFH: preset.fh,
      designation: preset.role,
      compensationStructure: preset.comp,
      reportingLocation: preset.location,
      docRef: preset.ref,
      employeeName: preset.recipient
    }));
  };

  const updateField = (key: keyof AppointmentLetterData, value: any) => {
    setData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Modify HTML background color dynamically based on theme variant choice
  const getThemedCustomHtml = () => {
    return generateMailBodyHtml(data, themeVariant);
  };

  const htmlOutput = getThemedCustomHtml();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Compass-Appointment-Letter-${data.recipientName.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTriggerPrint = () => {
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }
  };

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTermTitle.trim() || !customTermDesc.trim()) return;
    
    const newTerm = {
      id: data.terms.length + 1,
      title: customTermTitle.trim(),
      description: customTermDesc.trim()
    };

    updateField('terms', [...data.terms, newTerm]);
    setCustomTermTitle('');
    setCustomTermDesc('');
  };

  const handleRemoveTerm = (id: number) => {
    const filtered = data.terms.filter(t => t.id !== id).map((t, idx) => ({ ...t, id: idx + 1 }));
    updateField('terms', filtered);
  };

  const handlePostSimulatedEmail = () => {
    setEmailSentSimulated(true);
    setTimeout(() => {
      setEmailSentSimulated(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950" id="main-container">
      
      {/* Header Panel */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-400/20">
            <Sparkles className="w-5.5 h-5.5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-extrabold text-lg tracking-wide uppercase text-amber-400">
                Compass Portal
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                PRO Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Luxury Corporate Appointment Letter Designer & Export Workspace
            </p>
          </div>
        </div>

        {/* Integration Credentials Alert */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg p-2 max-w-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-400 text-[11px] leading-tight">
            Corrected acceptance scheme loaded for <strong className="text-slate-200">Muhammad Ibrahim</strong> on date <strong className="text-amber-400">17/06/2026</strong>.
          </span>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg transition-transform active:scale-95 duration-200 ${
              copied 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/10'
            }`}
            id="btn-copy-template"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied HTML Email Component!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy HTML Template
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2.5 rounded-lg border border-slate-700 transition"
            id="btn-download-raw"
            title="Download fully compileable standalone .html file"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Download HTML</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        
        {/* LEFT COLUMN: EDITOR & PLACEHOLDERS (ColSpan 5) */}
        <aside className="lg:col-span-5 border-r border-slate-800 bg-slate-950 flex flex-col p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-130px)] lg:max-h-[calc(100vh-73px)]">
          
          {/* Quick presets controller */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase flex items-center gap-1.5 font-bold">
                <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
                Representative Presets
              </span>
              <span className="text-[9px] text-slate-500">Quick load profiles</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`text-left text-xs p-2.5 rounded-lg border transition duration-150 ${
                    data.recipientName === preset.recipient 
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-200' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                  id={`preset-${idx}`}
                >
                  <p className="font-bold flex justify-between items-center text-slate-100">
                    <span>{preset.recipient}</span>
                    <span className="text-[9px] font-mono text-slate-500 font-normal">Ref: {preset.ref.split('/').pop()}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{preset.role}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Theme Premium Background Preference */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3 font-bold">
              Premium Styling &amp; Email Outer Background Choice
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setThemeVariant('midnight-gold')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  themeVariant === 'midnight-gold'
                    ? 'bg-slate-900 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                id="btn-theme-midnight"
              >
                <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-400 mx-auto mb-1" />
                <span className="text-[10px] font-semibold block">Classic White BG</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeVariant('royal-navy')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  themeVariant === 'royal-navy'
                    ? 'bg-slate-900 border-indigo-400 text-indigo-200 shadow-md ring-1 ring-indigo-400/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                id="btn-theme-royal"
              >
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700 mx-auto mb-1" />
                <span className="text-[10px] font-semibold block">Dominant Blue BG</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeVariant('classic-indigo')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  themeVariant === 'classic-indigo'
                    ? 'bg-slate-900 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                id="btn-theme-indigo"
              >
                <div className="w-3 h-3 rounded-full bg-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-semibold block">Royal Sapphire</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeVariant('emperor-blue')}
                className={`p-2 rounded-lg border text-center transition-all ${
                  themeVariant === 'emperor-blue'
                    ? 'bg-slate-900 border-yellow-600 text-yellow-300 shadow-md ring-1 ring-yellow-600/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                id="btn-theme-emperor"
              >
                <div className="w-3 h-3 rounded-full bg-stone-100 border border-amber-500/50 mx-auto mb-1" />
                <span className="text-[10px] font-semibold block">Gold Ivory Accent</span>
              </button>

              <button
                type="button"
                onClick={() => setThemeVariant('sophisticated-dark')}
                className={`p-2 rounded-lg border text-center transition-all col-span-2 md:col-span-1 ${
                  themeVariant === 'sophisticated-dark'
                    ? 'bg-slate-900 border-yellow-500 text-yellow-500 shadow-md ring-1 ring-yellow-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
                id="btn-theme-sophisticated"
              >
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-yellow-550/50 mx-auto mb-1" />
                <span className="text-[10px] font-semibold block text-amber-500 font-bold">Sophisticated Dark</span>
              </button>
            </div>
          </section>

          {/* Sub Navigation Tab bar inside aside */}
          <div className="border-b border-slate-800 flex gap-2">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'edit' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              id="tab-edit"
            >
              Fields
              {activeTab === 'edit' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'terms' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              id="tab-terms"
            >
              Terms ({data.terms.length})
              {activeTab === 'terms' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
            </button>
            <button
              onClick={() => setActiveTab('signatures')}
              className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'signatures' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              id="tab-signatures"
            >
              Signatures
              {activeTab === 'signatures' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
            </button>
            <button
              onClick={() => setActiveTab('acceptance')}
              className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'acceptance' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              id="tab-acceptance"
            >
              Acceptance
              {activeTab === 'acceptance' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              className={`flex-1 pb-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors ${
                activeTab === 'forms' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              id="tab-forms"
            >
              Google Forms
              {activeTab === 'forms' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
            </button>
          </div>

          {/* TAB 1: BASIC EDIT TAB */}
          {activeTab === 'edit' && (
            <div className="space-y-4 animate-fadeIn" id="basic-fields-group">
              
              {/* Document Reference Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                    Document Ref ID
                  </label>
                  <input
                    type="text"
                    value={data.docRef}
                    onChange={(e) => updateField('docRef', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500"
                    id="input-docRef"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                    Date of Document
                  </label>
                  <input
                    type="text"
                    value={data.issueDate}
                    onChange={(e) => updateField('issueDate', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500"
                    id="input-issueDate"
                  />
                </div>
              </div>

              {/* Company Branding */}
              <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800 space-y-3">
                <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider font-semibold">Corporate Identity</span>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500 font-bold"
                    id="input-companyName"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                    Banner Tagline
                  </label>
                  <input
                    type="text"
                    value={data.companySubName}
                    onChange={(e) => updateField('companySubName', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-400 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                    id="input-companySubName"
                  />
                </div>
              </div>

              {/* Recipient Coordinates */}
              <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800 space-y-3">
                <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider font-semibold">Recipient Details</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                      Prefix
                    </label>
                    <select
                      value={data.recipientPrefix}
                      onChange={(e) => updateField('recipientPrefix', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:border-amber-500"
                      id="select-recipientPrefix"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={data.recipientName}
                      onChange={(e) => {
                        updateField('recipientName', e.target.value);
                        updateField('employeeName', e.target.value);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-amber-500"
                      id="input-recipientName"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <select
                      value={data.recipientFHPrefix}
                      onChange={(e) => updateField('recipientFHPrefix', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-1 text-xs focus:outline-none"
                    >
                      <option value="S/O:">S/O:</option>
                      <option value="D/O:">D/O:</option>
                      <option value="W/O:">W/O:</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={data.recipientFH}
                      onChange={(e) => updateField('recipientFH', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                      placeholder="Father / Guardian Name"
                      id="input-recipientFH"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={data.recipientAddressLine1}
                    onChange={(e) => updateField('recipientAddressLine1', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                    placeholder="Address Line 1"
                    id="input-addr-1"
                  />
                  <input
                    type="text"
                    value={data.recipientAddressLine2}
                    onChange={(e) => updateField('recipientAddressLine2', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                    placeholder="Address Line 2"
                    id="input-addr-2"
                  />
                  <input
                    type="text"
                    value={data.recipientAddressLine3}
                    onChange={(e) => updateField('recipientAddressLine3', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-3 text-xs focus:outline-none font-medium"
                    placeholder="State & Zipcode"
                    id="input-addr-3"
                  />
                </div>
              </div>

              {/* Subject & Salutation */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                  Document Appointment Title & Subject
                </label>
                <textarea
                  value={data.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500"
                  id="input-subject"
                />
              </div>

              {/* Tabular Details */}
              <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800 space-y-3">
                <span className="text-[9px] uppercase font-mono text-slate-500 tracking-wider font-semibold">Contract Particulars</span>
                
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Designation</label>
                  <input
                    type="text"
                    value={data.designation}
                    onChange={(e) => updateField('designation', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs"
                    id="input-designation"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Joining Date</label>
                    <input
                      type="text"
                      value={data.dateOfJoining}
                      onChange={(e) => updateField('dateOfJoining', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs"
                      id="input-doj"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Employment Type</label>
                    <input
                      type="text"
                      value={data.employmentType}
                      onChange={(e) => updateField('employmentType', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs"
                      id="input-type"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Reporting Location</label>
                  <input
                    type="text"
                    value={data.reportingLocation}
                    onChange={(e) => updateField('reportingLocation', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs"
                    id="input-location"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Remuneration & Compensation Structure</label>
                  <input
                    type="text"
                    value={data.compensationStructure}
                    onChange={(e) => updateField('compensationStructure', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs font-semibold text-amber-300"
                    id="input-remuneration"
                  />
                </div>
              </div>

              {/* Text message parameters */}
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                  Introductory Content Block
                </label>
                <textarea
                  value={data.welcomeIntro}
                  onChange={(e) => updateField('welcomeIntro', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                  Team Welcoming Statement
                </label>
                <textarea
                  value={data.teamWelcomeMessage}
                  onChange={(e) => updateField('teamWelcomeMessage', e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-3 text-xs focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* TAB 2: TERMS AND CLAUSES EDITOR */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn" id="terms-customizer-pane">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] font-bold text-slate-200 block mb-0.5">Regulatory Operations & Conditions list</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Customize the official terms and conditions sections layout. Placeholders will automatically recalculate and sequence order indexes.
                </p>
              </div>

              {/* Add New clause Form */}
              <form onSubmit={handleAddTerm} className="bg-slate-900/50 p-3.5 rounded-lg border border-dashed border-slate-700 space-y-3">
                <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-400">Add Custom Regulatory Clause</p>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Clause Heading</label>
                  <input
                    type="text"
                    value={customTermTitle}
                    onChange={(e) => setCustomTermTitle(e.target.value)}
                    placeholder="e.g., Performance Review Cycle"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded py-1 px-2.5 text-xs focus:outline-none"
                    id="input-new-term-title"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Clause Verbatim Paragraph</label>
                  <textarea
                    value={customTermDesc}
                    onChange={(e) => setCustomTermDesc(e.target.value)}
                    placeholder="Describe specific rules, requirements, timings, or confidentiality policies..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded py-1 px-2.5 text-xs focus:outline-none"
                    id="input-new-term-desc"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold transition flex items-center justify-center gap-1 border border-slate-700"
                  id="btn-add-clause"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  Insert Regulatory Clause
                </button>
              </form>

              {/* List of active terms */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                  Active Document Clauses ({data.terms.length})
                </label>
                <div className="space-y-2">
                  {data.terms.map((term) => (
                    <div key={term.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-start gap-2.5 group">
                      <span className="bg-slate-800 text-amber-400 text-xs font-bold px-1.5 py-0.5 rounded border border-slate-700 text-center min-w-6">
                        {term.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{term.title}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mt-0.5">{term.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTerm(term.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition self-center"
                        title="Remove clause"
                        id={`btn-remove-clause-${term.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SIGNATURES PAD TAB */}
          {activeTab === 'signatures' && (
            <div className="space-y-5 animate-fadeIn" id="signatures-pad-pane">
              
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] font-bold text-slate-200 block mb-0.5">Dual-Signature Capture Panel</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Draw signatures using your mouse or touchscreen to instantly sign the official copies. Signature base64 maps directly into the email-ready HTML container!
                </p>
              </div>

              {/* Employer signature */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Handover Executive Signature</span>
                  <span className="text-slate-400 font-medium">Shahas S (Managing Partner)</span>
                </div>
                <SignaturePad
                  placeholderText="Shahas S Signature Pad"
                  savedImageUrl={data.senderSignatureUrl}
                  onSave={(base64) => updateField('senderSignatureUrl', base64)}
                  onClear={() => updateField('senderSignatureUrl', '')}
                />
              </div>

              {/* Employee acceptance signature */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Employee Aceptación Signature</span>
                  <span className="text-slate-300 font-bold">{data.recipientName}</span>
                </div>
                <SignaturePad
                  placeholderText="Muhammad Ibrahim Signature Pad"
                  savedImageUrl={data.employeeSignatureUrl}
                  onSave={(base64) => updateField('employeeSignatureUrl', base64)}
                  onClear={() => updateField('employeeSignatureUrl', '')}
                />
              </div>

              <div className="space-y-3 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">Acceptance Legal Metas</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Signing Date</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 py-1 px-2 text-xs rounded"
                      value={data.employeeDate}
                      onChange={(e) => updateField('employeeDate', e.target.value)}
                      placeholder="17/06/2026"
                      id="input-signing-date"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Signing Location</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 py-1 px-2 text-xs rounded"
                      value={data.employeePlace}
                      onChange={(e) => updateField('employeePlace', e.target.value)}
                      placeholder="Thiruvananthapuram"
                      id="input-signing-place"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ACCEPTANCE BUTTON CONFIGURATION */}
          {activeTab === 'acceptance' && (
            <div className="space-y-4 animate-fadeIn" id="acceptance-fields-group">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[11px] font-bold text-slate-200 block mb-0.5">Interactive Email Call-to-Action</span>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Incorporate a highly visible, custom-styled 'Accept Offer' button embedded instantly into the HTML email template.
                </p>
              </div>

              {/* Show Accept Button Toggle */}
              <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                <div className="space-y-0.5">
                  <label className="text-xs font-bold text-slate-300 block">Embed Accept Button</label>
                  <span className="text-[10px] text-slate-400 block">Enable clickable enrollment link</span>
                </div>
                <input
                  type="checkbox"
                  checked={data.showAcceptButton}
                  onChange={(e) => updateField('showAcceptButton', e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  style={{ transform: "scale(1.2)" }}
                />
              </div>

              {data.showAcceptButton && (
                <>
                  {/* Button Label Text */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={data.acceptBtnText}
                      onChange={(e) => updateField('acceptBtnText', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500 font-bold"
                      placeholder="ACCEPT APPOINTMENT"
                    />
                  </div>

                  {/* Redirect URL Link */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                      Redirect URL Link
                    </label>
                    <input
                      type="text"
                      value={data.acceptOfferUrl}
                      onChange={(e) => updateField('acceptOfferUrl', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500 font-mono"
                      placeholder="https://..."
                    />
                    <span className="text-[9px] text-slate-500 mt-1 block leading-normal">
                      Ideally points to your secure online acknowledgement form, Google Form, or internal company intranet.
                    </span>
                  </div>

                  {/* Offline instructions */}
                  <div>
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">
                      Fallback Response Instructions
                    </label>
                    <textarea
                      rows={4}
                      value={data.acceptInstructions}
                      onChange={(e) => updateField('acceptInstructions', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                      placeholder="Instructions if button click is not possible..."
                    />
                  </div>

                  {/* Quick preview / Sandbox actions */}
                  <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 space-y-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Interactive Acceptance Action</span>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Candidates will view a secure page where they review records, draw signatures, place acceptance coordinates, and confirm details.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        alert("Simulated Secure Link Action!\n\nThis would normally redirect Mr. Muhammad Ibrahim to:\n" + data.acceptOfferUrl + "\n\nWe have set up the employee signature pad in the 'Signatures' tab to allow you to sign, date and accept right here!");
                        setActiveTab('signatures');
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Test candidate portal
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Verification Code Box / Footer Metas */}
          <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-bold">Document Metadata</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[9px] text-slate-500 block">Category Status</label>
                <input
                  type="text"
                  value={data.footerDocStatus}
                  className="bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px] py-1 px-2 rounded w-full"
                  onChange={(e) => updateField('footerDocStatus', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block">Slogan quote</label>
                <input
                  type="text"
                  value={data.footerSlogan}
                  className="bg-slate-950/80 border border-slate-800 text-[10px] text-amber-200 py-1 px-2 rounded w-full"
                  onChange={(e) => updateField('footerSlogan', e.target.value)}
                />
              </div>
            </div>
          </section>

        </aside>

        {/* RIGHT COLUMN: REAL-TIME PREVIEW WORKSPACE & INSPECTOR (ColSpan 7) */}
        <main className="lg:col-span-7 bg-slate-900 flex flex-col p-4 md:p-6 space-y-4 min-h-0">
          
          {/* Workspace bar controller */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950/65 border border-slate-800/85 rounded-xl p-3">
            
            {/* Left selector keys */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-500 animate-pulse" />
                Live Preview Output
              </span>

              {/* Layout controls */}
              <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex items-center gap-1 font-mono">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    previewMode === 'desktop' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Desktop 680px Standard view"
                >
                  <Monitor className="w-3 h-3" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                    previewMode === 'mobile' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Mobile standard 415px layout wrapper"
                >
                  <Smartphone className="w-3 h-3" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Quick interactive helpers */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleTriggerPrint}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700"
                id="btn-print"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                Print Letter
              </button>

              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  showCode 
                    ? 'bg-amber-500/10 border border-amber-500 text-amber-300' 
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
                }`}
                id="btn-inspect-code"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                {showCode ? 'Hide Code' : 'Inspect Code'}
              </button>
            </div>

          </div>

          {/* Simulated Email Sender Banner */}
          <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Mail className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Email Body Dispatch Sandbox</p>
                <p className="text-[10px] text-slate-400">Perfectly complies with corporate systems, Outlook, &amp; Gmail</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePostSimulatedEmail}
              disabled={emailSentSimulated}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-300 active:scale-95 flex items-center gap-1.5 border ${
                emailSentSimulated
                  ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/50 shadow-md shadow-indigo-500/10'
              }`}
            >
              {emailSentSimulated ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Email sent to shahass92@gmail.com!
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-300" />
                  Simulate Email Dispatch
                </>
              )}
            </button>
          </div>

          {/* Quick Simulation success alert overlay */}
          {emailSentSimulated && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Success!</strong> Prepared official message container with custom embedded base64 signatures. Template dispatch completed for employee <strong>{data.recipientName}</strong>. Valid license status confirmed from TC 35/384(3).
              </span>
            </div>
          )}

          {/* WORKSPACE PREVIEW FRAME WINDOW */}
          <div className="flex-1 min-h-[400px] flex justify-center items-start bg-slate-950/40 rounded-2xl border border-slate-800/80 p-2 md:p-4 overflow-hidden relative">
            
            {/* Show standalone inspect code panel or sandboxed iframe preview */}
            {showCode ? (
              <div className="absolute inset-0 flex flex-col bg-slate-950 p-4 font-mono text-xs overflow-hidden select-text">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3 text-[10px] text-slate-400 bg-slate-900/30 px-3 rounded">
                  <span>Stand-alone Mailing Component markup</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-sans font-bold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </button>
                </div>
                <pre className="flex-1 overflow-auto text-slate-300 p-3 bg-slate-900/40 rounded border border-slate-800/60 leading-relaxed font-mono select-all">
                  {htmlOutput}
                </pre>
              </div>
            ) : (
              <div 
                className="h-full w-full mx-auto flex items-center justify-center transition-all duration-300"
                style={{ maxWidth: previewMode === 'desktop' ? '100%' : '415px' }}
              >
                <iframe
                  id="preview-iframe"
                  title="Official Appointment Template Frame"
                  srcDoc={htmlOutput}
                  className="w-full h-full rounded-xl bg-slate-100 shadow-2xl border border-slate-850"
                  style={{ minHeight: '520px' }}
                />
              </div>
            )}

            {/* Float visual indicator of parameters validity */}
            <div className="absolute bottom-6 right-6 bg-slate-900/90 py-1.5 px-3 rounded-full border border-slate-800 text-[10px] flex items-center gap-2 text-slate-400 pointer-events-none shadow-lg no-print">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>A4 Document Ratio Active (680px Width wrapper)</span>
            </div>
          </div>

          {/* Quick instructions and tip footer bar */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-amber-500 tracking-wider shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This digital letter designer is engineered using highly compatible, table-based structural rules (`table`, `tr`, `td`) ensuring clean, high-fidelity rendering across all modern webmail providers, Outlook clients, and mobile operating platforms. It embeds any raw client signatures seamlessly as inline graphical base64 assets.
            </p>
          </div>

        </main>

      </div>
    </div>
  );
}
