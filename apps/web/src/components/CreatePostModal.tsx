import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Tag, 
  Sparkles, 
  MapPin, 
  Plus, 
  Trash2, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '@drobe/api-client';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: any) => void;
  stylists: any[];
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onPostCreated,
  stylists
}) => {
  const [mediaUrl, setMediaUrl] = useState('/images/hero_editorial.jpg');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Quiet Luxury');
  const [occasion, setOccasion] = useState('Resort & Brunch');
  const [city, setCity] = useState('Kochi');
  const [tagsInput, setTagsInput] = useState('#QuietLuxury #TexturedTweed #DROBE');
  const [taggedStylistId, setTaggedStylistId] = useState('');
  
  // Product tags for "Shop This Look"
  const [productTags, setProductTags] = useState<any[]>([
    {
      title: 'Textured wool tweed coat',
      brand_name: 'Maison Ivory',
      price: 48000,
      shopping_url: 'https://drobe.style/maison/wool-tweed',
      pin_x: 48,
      pin_y: 35
    }
  ]);

  const [newTagTitle, setNewTagTitle] = useState('');
  const [newTagBrand, setNewTagBrand] = useState('');
  const [newTagPrice, setNewTagPrice] = useState('');
  const [newTagUrl, setNewTagUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleImageOptions = [
    '/images/hero_editorial.jpg',
    '/images/textured_tweed_coat.jpg',
    '/images/pink_tweed_coat.jpg',
    '/images/stylist_editorial.jpg'
  ];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagTitle.trim() || !newTagBrand.trim() || !newTagPrice) return;

    setProductTags([
      ...productTags,
      {
        title: newTagTitle.trim(),
        brand_name: newTagBrand.trim(),
        price: Number(newTagPrice),
        shopping_url: newTagUrl.trim() || 'https://drobe.style',
        pin_x: 50,
        pin_y: 50
      }
    ]);

    setNewTagTitle('');
    setNewTagBrand('');
    setNewTagPrice('');
    setNewTagUrl('');
  };

  const handleRemoveTag = (index: number) => {
    setProductTags(productTags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalMediaUrl = mediaUrl.trim() || sampleImageOptions[0];
    if (!caption.trim()) {
      setErrorMsg('Please write a caption for your look');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        caption: caption.trim(),
        description: description.trim(),
        category,
        occasion,
        city,
        tags: tagsInput.split(' ').filter(t => t.startsWith('#')),
        tagged_stylist_id: taggedStylistId || undefined,
        media: [
          {
            media_type: 'image',
            media_url: finalMediaUrl,
            aspect_ratio: 1.25,
            sort_order: 0
          }
        ],
        product_tags: productTags
      };

      const newPost = await api.posts.createPost(payload);
      onPostCreated(newPost);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="garment-floating-card w-full max-w-2xl p-6 sm:p-8 space-y-6 relative border border-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="icon-btn-glass w-8 h-8 rounded-full absolute top-6 right-6"
        >
          <X className="w-4 h-4 text-[#141414]" />
        </button>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#b85d43]">Editorial Lookbook</span>
          <h2 className="font-serif font-bold text-2xl text-[#141414]">Publish Sartorial Look</h2>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Sample Photo Chooser */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#141414]">Choose or Paste Editorial Image</label>
            <div className="grid grid-cols-4 gap-2">
              {sampleImageOptions.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setMediaUrl(url)}
                  className={`cursor-pointer rounded-2xl overflow-hidden aspect-[4/5] border-2 transition-all ${
                    (mediaUrl === url || (!mediaUrl && i === 0))
                      ? 'border-[#141414] shadow-md scale-102'
                      : 'border-white/70 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={url}
                    alt="Sample"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_editorial.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste direct image URL..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="w-full bg-white/70 border border-white p-2.5 rounded-xl focus:outline-none mt-2"
            />
          </div>

          {/* Caption & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#141414]">Caption</label>
              <input
                type="text"
                required
                placeholder="e.g. Sculpted tweed coat in blush pink..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-white/70 border border-white p-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#141414]">Category Aesthetic</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/70 border border-white p-2.5 rounded-xl focus:outline-none font-semibold text-[#141414]"
              >
                <option value="Quiet Luxury">Quiet Luxury</option>
                <option value="Old Money">Old Money</option>
                <option value="Wedding & Occasion">Wedding & Occasion</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Casual Luxury">Casual Luxury</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-[#141414]">Sartorial Description & Notes</label>
            <textarea
              rows={2}
              placeholder="Fabric composition, silhouette rationale, styling context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/70 border border-white p-2.5 rounded-xl focus:outline-none"
            />
          </div>

          {/* Shop This Look Tags */}
          <div className="space-y-2 pt-2 border-t border-white/60">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#141414]">Tagged Products ({productTags.length})</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {productTags.map((tag, idx) => (
                <div key={idx} className="bg-white/80 px-3 py-1.5 rounded-xl border border-white flex items-center gap-2">
                  <span className="font-bold text-[#141414]">{tag.title}</span>
                  <span className="text-[#b85d43]">₹{tag.price}</span>
                  <button type="button" onClick={() => handleRemoveTag(idx)} className="text-stone-400 hover:text-stone-700">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-capsule-black w-full py-3 text-sm shadow-xl mt-4"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>{isSubmitting ? 'Publishing Look...' : 'Publish to Editorial Feed'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
