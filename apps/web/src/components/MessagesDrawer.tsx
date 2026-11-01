import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  User, 
  Sparkles, 
  CheckCheck,
  Calendar,
  Mic,
  Paperclip
} from 'lucide-react';

interface MessagesDrawerProps {
  onClose: () => void;
  currentRole: string;
}

export const MessagesDrawer: React.FC<MessagesDrawerProps> = ({
  onClose,
  currentRole
}) => {
  const [conversations, setConversations] = useState<any[]>([
    {
      id: 'conv-1',
      participant_id: 'stylist-elena',
      participant_name: 'Elena Rostova (Shop Manager)',
      participant_role: 'stylist',
      participant_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      last_message: "Your fitting appointment for the textured wool coat is confirmed!",
      last_message_at: '10 mins ago',
      unread_count: 1
    },
    {
      id: 'conv-2',
      participant_id: 'brand-maison',
      participant_name: 'Maison Ivory Atelier',
      participant_role: 'brand',
      participant_avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80',
      last_message: 'Your creator campaign application has been approved under escrow.',
      last_message_at: '2 hours ago',
      unread_count: 0
    }
  ]);

  const [activeConv, setActiveConv] = useState<any>(conversations[0]);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm1',
      sender_id: 'other',
      sender_name: 'Elena Rostova',
      content: 'Hello! Welcome to the DROBE Atelier Studio. I have prepared your fitting rack for the textured wool tweed coat.',
      created_at: '11:15 AM'
    },
    {
      id: 'm2',
      sender_id: 'me',
      sender_name: 'Priya',
      content: 'Thank you Elena! I selected Size 38 and would also love your perspective on matching calf suede loafers.',
      created_at: '11:20 AM'
    },
    {
      id: 'm3',
      sender_id: 'other',
      sender_name: 'Elena Rostova',
      content: 'Excellent choice. The Belgian calf suede loafers on the lower podium tie the entire silhouette together.',
      created_at: '11:24 AM'
    }
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender_id: 'me',
      sender_name: 'Me',
      content: inputText.trim(),
      created_at: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex justify-end animate-in fade-in">
      <div className="garment-floating-card w-full max-w-md h-full flex flex-col justify-between border-l border-white shadow-2xl rounded-none sm:rounded-l-3xl p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/60">
          <div className="flex items-center gap-3">
            <img
              src={activeConv.participant_avatar || '/images/stylist_editorial.jpg'}
              alt={activeConv.participant_name}
              className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/images/stylist_editorial.jpg';
              }}
            />
            <div>
              <h3 className="font-serif font-bold text-sm text-[#141414] leading-tight">
                {activeConv.participant_name}
              </h3>
              <span className="text-[10px] text-[#2d5a46] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2d5a46]"></span>
                Verified Concierge
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="icon-btn-glass w-8 h-8 rounded-full"
          >
            <X className="w-4 h-4 text-[#141414]" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {messages.map((m) => {
            const isMe = m.sender_id === 'me';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-[#141414] text-white rounded-br-none'
                      : 'bg-white/80 text-[#141414] border border-white rounded-bl-none'
                  }`}
                >
                  <p>{m.content}</p>
                </div>
                <span className="text-[9px] text-[#7d6f64] mt-1 px-1">
                  {m.created_at}
                </span>
              </div>
            );
          })}
        </div>

        {/* Message Input (Directly like appointment chat bar) */}
        <form onSubmit={handleSend} className="appointment-input-row">
          <input
            type="text"
            placeholder="Write to concierge..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#141414] placeholder-[#9e8e82] focus:outline-none px-3"
          />
          <button type="button" className="round-tool-btn" title="Voice Message">
            <Mic className="w-4 h-4" />
          </button>
          <button type="button" className="round-tool-btn" title="Attach Media">
            <Paperclip className="w-4 h-4" />
          </button>
          <button type="submit" className="btn-capsule-black text-xs py-1.5 px-3">
            <Send className="w-3 h-3" />
          </button>
        </form>

      </div>
    </div>
  );
};
