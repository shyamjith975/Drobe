/**
 * DROBE Shared Types & Domain Models
 */

export type UserRole =
  | 'enthusiast'
  | 'stylist'
  | 'creator'
  | 'brand'
  | 'store'
  | 'photographer'
  | 'makeup_artist'
  | 'designer'
  | 'admin'
  | 'super_admin';

export type AccountStatus = 'active' | 'pending_verification' | 'suspended' | 'deactivated';

export interface User {
  id: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: AccountStatus;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  cover_url?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  website_url?: string | null;
  instagram_handle?: string | null;
  is_verified: boolean;
  fashion_interests: string[];
  followers_count: number;
  following_count: number;
  posts_count: number;
}

export interface PostMedia {
  id: string;
  post_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  order_index: number;
  aspect_ratio?: number;
}

export interface ProductTag {
  id: string;
  post_id: string;
  product_id?: string | null;
  title: string;
  brand_name: string;
  price: number;
  currency: string;
  shopping_url?: string | null;
  pin_x: number;
  pin_y: number;
}

export interface Post {
  id: string;
  user_id: string;
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string | null;
    role: UserRole;
    is_verified: boolean;
    city?: string | null;
  };
  caption: string;
  description?: string | null;
  category: string;
  occasion?: string | null;
  city?: string | null;
  tags: string[];
  media: PostMedia[];
  product_tags: ProductTag[];
  tagged_stylist_id?: string | null;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  has_liked?: boolean;
  has_saved?: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author: {
    username: string;
    display_name: string;
    avatar_url?: string | null;
  };
  content: string;
  created_at: string;
}

export interface SavedCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_private: boolean;
  items_count: number;
  cover_url?: string | null;
  created_at: string;
}

export type ServiceMode =
  | 'virtual_consultation'
  | 'video_consultation'
  | 'chat_consultation'
  | 'remote_shopping'
  | 'physical_shopping'
  | 'home_visit'
  | 'wedding_assignment'
  | 'commercial_production';

export interface ProfessionalService {
  id: string;
  stylist_id: string;
  title: string;
  description: string;
  category: string;
  service_mode: ServiceMode;
  duration_minutes: number;
  price: number;
  currency: string;
  advance_percentage: number;
  is_active: boolean;
}

export interface StylistProfile {
  id: string;
  user_id: string;
  user: {
    username: string;
    display_name: string;
    avatar_url?: string | null;
    is_verified: boolean;
  };
  category: string;
  specializations: string[];
  bio: string;
  experience_years: number;
  languages: string[];
  base_city: string;
  operating_cities: string[];
  rating: number;
  reviews_count: number;
  starting_price: number;
  currency: string;
  instant_booking_enabled: boolean;
  verification_status: 'verified' | 'pending' | 'rejected';
  portfolio_images: string[];
  services: ProfessionalService[];
}

export type BookingStatus =
  | 'draft'
  | 'requested'
  | 'quotation_pending'
  | 'accepted'
  | 'payment_pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'refund_pending'
  | 'refunded'
  | 'disputed';

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  stylist_id: string;
  stylist_name: string;
  service_id: string;
  service_title: string;
  service_mode: ServiceMode;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  notes?: string | null;
  location_address?: string | null;
  city?: string | null;
  total_amount: number;
  advance_amount: number;
  paid_amount: number;
  currency: string;
  platform_commission: number;
  stylist_payout: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  brand_name: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount_price?: number | null;
  currency: string;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  shopping_url: string;
  store_city?: string | null;
  is_available: boolean;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  brand_name: string;
  category: string;
  tagline: string;
  description: string;
  logo_url: string;
  banner_url: string;
  city: string;
  website_url: string;
  is_verified: boolean;
  products_count: number;
}

export interface CreatorCampaign {
  id: string;
  brand_id: string;
  brand_name: string;
  brand_logo: string;
  title: string;
  description: string;
  category: string;
  required_creator_type: string;
  target_city: string;
  budget_inr: number;
  deliverables: string[];
  application_deadline: string;
  status: 'open' | 'reviewing' | 'closed';
  applications_count: number;
}

export interface CampaignApplication {
  id: string;
  campaign_id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string | null;
  proposal: string;
  quoted_price: number;
  deliverables_plan: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface StyleGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  hero_image: string;
  gallery_images: string[];
  color_palette: string[];
  clothing_combinations: string[];
  stylist_tips: string[];
  occasion: string;
  author_name: string;
  author_title: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  media_url?: string | null;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  participant_one_id: string;
  participant_two_id: string;
  participant_two_name: string;
  participant_two_avatar?: string | null;
  participant_two_role: UserRole;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'social' | 'payment' | 'campaign' | 'system';
  is_read: boolean;
  reference_id?: string | null;
  created_at: string;
}

export interface AdminAnalytics {
  total_users: number;
  verified_stylists: number;
  active_brands: number;
  total_posts: number;
  total_bookings: number;
  total_gmv_inr: number;
  platform_commission_inr: number;
  active_campaigns: number;
  pending_verifications: number;
}
