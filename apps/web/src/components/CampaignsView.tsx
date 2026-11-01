import React, { useState } from 'react';
import { 
  Briefcase, 
  IndianRupee, 
  Calendar, 
  Send, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface CampaignsViewProps {
  campaigns: any[];
  currentRole: string;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  currentRole
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [proposal, setProposal] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('35000');
  const [deliverablesPlan, setDeliverablesPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.campaigns.apply(selectedCampaign.id, {
        proposal: proposal.trim(),
        quoted_price: Number(quotedPrice),
        deliverables_plan: deliverablesPlan.trim() || '1x 4K Reel + 2x Feed Carousels',
      });
      setSuccessMsg('Your proposal has been submitted to the brand for review!');
      setTimeout(() => {
        setSelectedCampaign(null);
        setSuccessMsg('');
        setProposal('');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/40">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#b85d43] font-bold">
            Creator Collaboration Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141414] tracking-tight mt-1">
            Brand Campaigns & Escrow Briefs
          </h1>
          <p className="text-xs sm:text-sm text-[#7d6f64] font-serif italic mt-0.5">
            Verified brand campaigns with escrow payment locks. Apply with creative deliverables plans and guaranteed milestone disbursements.
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-5 border border-white/80 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43] bg-white/70 px-2.5 py-1 rounded-full border border-white">
                  {camp.brand?.brand_name || 'Maison Ivory'}
                </span>
                <span className="text-xs font-bold text-[#2d5a46] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ₹{Number(camp.total_budget).toLocaleString('en-IN')} Budget
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#141414] leading-snug">
                {camp.title}
              </h3>

              <p className="text-xs text-[#5e564e] line-clamp-3 leading-relaxed">
                {camp.brief}
              </p>
            </div>

            <div className="pt-4 border-t border-white/60 space-y-3 text-xs">
              <div className="flex items-center justify-between text-[#7d6f64]">
                <span>Status:</span>
                <span className="font-semibold text-[#141414] capitalize">{camp.status}</span>
              </div>

              <button
                onClick={() => setSelectedCampaign(camp)}
                className="btn-capsule-black w-full text-xs py-2 px-4"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Submit Collaboration Proposal</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="garment-floating-card w-full max-w-lg p-6 sm:p-8 space-y-5 relative border border-white shadow-2xl">
            <button
              onClick={() => setSelectedCampaign(null)}
              className="icon-btn-glass w-8 h-8 rounded-full absolute top-6 right-6"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43]">Campaign Pitch</span>
              <h3 className="font-serif font-bold text-xl text-[#141414] mt-0.5">{selectedCampaign.title}</h3>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-50 text-[#2d5a46] rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{errorMsg}</div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-[#141414]">Creator Pitch & Creative Concept</label>
                  <textarea
                    rows={3}
                    required
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe your visual concept, styling moodboard, and target audience alignment..."
                    className="w-full bg-white/70 border border-white p-3 rounded-2xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#141414]">Quoted Fee (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      className="w-full bg-white/70 border border-white p-2.5 rounded-2xl focus:outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#141414]">Deliverables</label>
                    <input
                      type="text"
                      value={deliverablesPlan}
                      onChange={(e) => setDeliverablesPlan(e.target.value)}
                      placeholder="1x 4K Reel + 2x Feed"
                      className="w-full bg-white/70 border border-white p-2.5 rounded-2xl focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-capsule-black w-full py-2.5 text-xs shadow-lg mt-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Proposal...' : 'Submit Pitch via Escrow'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
