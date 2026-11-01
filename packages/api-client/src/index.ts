/**
 * DROBE Centralized Typed API Client
 * Compatible with Web (Next.js), Mobile (React Native / Expo), and Admin
 */

export interface ApiClientConfig {
  baseUrl?: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

export class DrobeApiClient {
  private baseUrl: string;
  private getToken: () => string | null;
  private onUnauthorized?: () => void;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || (typeof window !== 'undefined' && (window as any).__DROBE_API_URL__) || 'http://localhost:8000/api/v1';
    this.getToken = config?.getToken || (() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('drobe_token');
      }
      return null;
    });
    this.onUnauthorized = config?.onUnauthorized;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && this.onUnauthorized) {
        this.onUnauthorized();
      }

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText };
        }
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`API Error on [${options.method || 'GET'}] ${url}:`, error.message);
      throw error;
    }
  }

  // --- Auth ---
  auth = {
    login: (email: string, password: string) =>
      this.request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (payload: any) =>
      this.request<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    customerRegister: (payload: any) =>
      this.request<any>('/auth/customer/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    customerLogin: (email: string, password: string) =>
      this.request<any>('/auth/customer/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    boutiqueRegister: (payload: any) =>
      this.request<any>('/auth/boutique/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    boutiqueLogin: (email: string, password: string) =>
      this.request<any>('/auth/boutique/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    consultantRegister: (payload: any) =>
      this.request<any>('/auth/consultant/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    consultantLogin: (email: string, password: string) =>
      this.request<any>('/auth/consultant/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    adminLogin: (email: string, password: string) =>
      this.request<any>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    forgotPassword: (email: string) =>
      this.request<any>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (payload: { email: string; token: string; new_password: string }) =>
      this.request<any>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getMe: () => this.request<any>('/auth/me'),
    logout: () => this.request<any>('/auth/logout', { method: 'POST' }),
  };

  // --- Posts & Feed ---
  posts = {
    getFeed: (params?: { category?: string; city?: string; skip?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.city) q.append('city', params.city);
      if (params?.skip !== undefined) q.append('skip', String(params.skip));
      if (params?.limit !== undefined) q.append('limit', String(params.limit));
      return this.request<any[]>(`/posts/?${q.toString()}`);
    },
    getPost: (id: string) => this.request<any>(`/posts/${id}`),
    createPost: (payload: any) =>
      this.request<any>('/posts/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    likePost: (id: string) =>
      this.request<{ liked: boolean; likes_count: number }>(`/posts/${id}/like`, { method: 'POST' }),
    savePost: (id: string) =>
      this.request<{ saved: boolean; saves_count: number }>(`/posts/${id}/save`, { method: 'POST' }),
    getComments: (id: string) => this.request<any[]>(`/posts/${id}/comments`),
    addComment: (id: string, content: string, parentId?: string) =>
      this.request<any>(`/posts/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, parent_id: parentId }),
      }),
  };

  // --- Stylists & Marketplace ---
  stylists = {
    list: (params?: { city?: string; category?: string }) => {
      const q = new URLSearchParams();
      if (params?.city) q.append('city', params.city);
      if (params?.category) q.append('category', params.category);
      return this.request<any[]>(`/stylists/?${q.toString()}`);
    },
    getCities: () => this.request<string[]>('/stylists/meta/cities'),
    get: (id: string) => this.request<any>(`/stylists/${id}`),
    onboard: (payload: any) =>
      this.request<any>('/stylists/onboard', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    addService: (stylistId: string, payload: any) =>
      this.request<any>(`/stylists/${stylistId}/services`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    addReview: (stylistId: string, payload: { rating: number; review_text: string; booking_id?: string }) =>
      this.request<any>(`/stylists/${stylistId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // --- Bookings ---
  bookings = {
    create: (payload: any) =>
      this.request<any>('/bookings/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    list: () => this.request<any[]>('/bookings/'),
    get: (id: string) => this.request<any>(`/bookings/${id}`),
    updateStatus: (id: string, status: string, reason?: string) =>
      this.request<any>(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
      }),
  };

  // --- Payments & Wallet ---
  payments = {
    verify: (bookingId: string, orderId: string, paymentId: string) =>
      this.request<any>('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          booking_id: bookingId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
        }),
      }),
    getWallet: () => this.request<any>('/payments/wallet'),
    withdraw: (amount: number, payoutMethod: string, accountDetails: string) =>
      this.request<any>('/payments/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          payout_method: payoutMethod,
          account_details: accountDetails,
        }),
      }),
  };

  // --- Brands & Commerce ---
  brands = {
    list: (params?: { city?: string; category?: string }) => {
      const q = new URLSearchParams();
      if (params?.city) q.append('city', params.city);
      if (params?.category) q.append('category', params.category);
      return this.request<any[]>(`/brands/?${q.toString()}`);
    },
    get: (id: string) => this.request<any>(`/brands/${id}`),
    addProduct: (brandId: string, payload: any) =>
      this.request<any>(`/brands/${brandId}/products`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    trackClick: (productId: string) =>
      this.request<any>(`/brands/products/${productId}/click`, { method: 'POST' }),
  };

  // --- Creator Campaigns ---
  campaigns = {
    list: (category?: string) => {
      const q = category ? `?category=${encodeURIComponent(category)}` : '';
      return this.request<any[]>(`/campaigns/${q}`);
    },
    get: (id: string) => this.request<any>(`/campaigns/${id}`),
    create: (payload: any) =>
      this.request<any>('/campaigns/', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    apply: (campaignId: string, payload: { proposal: string; quoted_price: number; deliverables_plan: string }) =>
      this.request<any>(`/campaigns/${campaignId}/apply`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  };

  // --- Style Guides ---
  styleGuides = {
    list: (category?: string) => {
      const q = category ? `?category=${encodeURIComponent(category)}` : '';
      return this.request<any[]>(`/style-guides/${q}`);
    },
    get: (id: string) => this.request<any>(`/style-guides/${id}`),
  };

  // --- Discover ---
  discover = {
    search: (q: string) => this.request<any>(`/discover/search?q=${encodeURIComponent(q)}`),
    getTrending: () => this.request<any>('/discover/trending'),
  };

  // --- Messages ---
  messages = {
    getConversations: () => this.request<any[]>('/messages/conversations'),
    getMessages: (conversationId: string) => this.request<any[]>(`/messages/${conversationId}`),
    sendMessage: (recipientId: string, content: string, mediaUrl?: string) =>
      this.request<any>('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ recipient_id: recipientId, content, media_url: mediaUrl }),
      }),
  };

  // --- Notifications ---
  notifications = {
    list: () => this.request<any[]>('/notifications/'),
    markRead: (id: string) => this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => this.request<any>('/notifications/mark-all-read', { method: 'POST' }),
  };

  // --- Admin ---
  admin = {
    getStats: () => this.request<any>('/admin/stats'),
    getUsers: () => this.request<any[]>('/admin/users'),
    setUserStatus: (userId: string, status: string) =>
      this.request<any>(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    getPendingStylists: () => this.request<any[]>('/admin/verifications/stylists'),
    verifyStylist: (stylistId: string, status: string, notes?: string) =>
      this.request<any>(`/admin/verifications/stylists/${stylistId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
    getBoutiques: () => this.request<any[]>('/admin/verifications/brands'),
    verifyBoutique: (brandId: string, status: string, notes?: string) =>
      this.request<any>(`/admin/verifications/brands/${brandId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }),
    getBookings: (statusFilter?: string) => {
      const q = statusFilter ? `?status_filter=${statusFilter}` : '';
      return this.request<any[]>(`/admin/bookings${q}`);
    },
    getReports: () => this.request<any[]>('/admin/reports'),
    deletePost: (postId: string) => this.request<any>(`/admin/posts/${postId}`, { method: 'DELETE' }),
    getPayouts: () => this.request<any[]>('/admin/payouts'),
  };

  // --- Media ---
  media = {
    upload: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const url = `${this.baseUrl}/media/upload`;
      const token = this.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
      });
      if (!res.ok) throw new Error('File upload failed');
      return await res.json();
    },
  };
}

export const api = new DrobeApiClient();
