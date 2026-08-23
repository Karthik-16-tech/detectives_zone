// API Client for Detective Zone Backend (Unified Domain Routing)

const API_BASE_URL =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "https://api.detectiveszone.com/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dz_admin_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("dz_admin_token", token);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("dz_refresh_token");
}

export function setRefreshToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("dz_refresh_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("dz_admin_token");
    localStorage.removeItem("dz_refresh_token");
    localStorage.removeItem("dz_admin_user");
  }
}

export function getSavedAdminUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("dz_admin_user");
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setSavedAdminUser(user: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("dz_admin_user", JSON.stringify(user));
  }
}

let isRefreshing = false;

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle Token Expiration & Refresh Flow (401 Interception)
  if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
    const refreshToken = getRefreshToken();
    if (refreshToken && !isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const tokenData = await refreshRes.json();
          setAuthToken(tokenData.access_token);
          if (tokenData.refresh_token) {
            setRefreshToken(tokenData.refresh_token);
          }
          headers.set("Authorization", `Bearer ${tokenData.access_token}`);
          
          // Retry original request with new token
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          removeAuthToken();
          if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
            window.location.href = "/admin/login";
          }
        }
      } catch {
        removeAuthToken();
      } finally {
        isRefreshing = false;
      }
    } else {
      removeAuthToken();
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
  }

  if (!response.ok) {
    let errorDetail = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (Array.isArray(errorJson.detail)) {
        errorDetail = errorJson.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(", ");
      } else if (typeof errorJson.detail === "object" && errorJson.detail !== null) {
        errorDetail = JSON.stringify(errorJson.detail);
      } else if (errorJson.detail) {
        errorDetail = String(errorJson.detail);
      } else if (errorJson.message) {
        errorDetail = String(errorJson.message);
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: { email?: string; username_or_email?: string; password: string }) =>
    apiRequest("/auth/login", { 
      method: "POST", 
      body: JSON.stringify({
        email: data.email || data.username_or_email,
        username_or_email: data.username_or_email || data.email,
        password: data.password
      }) 
    }),
  refreshToken: (refreshToken: string) =>
    apiRequest("/auth/refresh", { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) }),
  getMe: () => apiRequest("/auth/me"),
  changePassword: (data: { current_password: string; new_password: string }) =>
    apiRequest("/auth/change-password", { method: "POST", body: JSON.stringify(data) }),

  // Dashboard Telemetry
  getDashboardStats: () => apiRequest("/dashboard/stats"),
  getRecentActivity: () => apiRequest("/dashboard/activity"),

  // Cases CMS
  getCases: (params?: { status?: string; difficulty?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append("status", params.status);
    if (params?.difficulty) q.append("difficulty", params.difficulty);
    if (params?.search) q.append("search", params.search);
    const qs = q.toString();
    return apiRequest(`/cases${qs ? `?${qs}` : ""}`);
  },
  getAllCasesAdmin: () => apiRequest("/cases/admin/all"),
  getCase: (idOrSlug: string | number) => apiRequest(`/cases/${idOrSlug}`),
  getCasePage: (idOrSlug: string | number) => apiRequest(`/cases/${idOrSlug}/page`),
  updateCasePage: (id: number, data: any) =>
    apiRequest(`/cases/${id}/page`, { method: "PUT", body: JSON.stringify(data) }),
  createCase: (data: any) => apiRequest("/cases", { method: "POST", body: JSON.stringify(data) }),
  updateCase: (id: number, data: any) =>
    apiRequest(`/cases/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCase: (id: number) => apiRequest(`/cases/${id}`, { method: "DELETE" }),

  // Store & Products CMS
  getProducts: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append("category", params.category);
    if (params?.search) q.append("search", params.search);
    const qs = q.toString();
    return apiRequest(`/products${qs ? `?${qs}` : ""}`);
  },
  getAllProductsAdmin: () => apiRequest("/products/admin/all"),
  getProduct: (idOrSlug: string | number) => apiRequest(`/products/${idOrSlug}`),
  createProduct: (data: any) =>
    apiRequest("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: number, data: any) =>
    apiRequest(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: number) => apiRequest(`/products/${id}`, { method: "DELETE" }),

  // Case Kits CMS
  getKits: () => apiRequest("/kits"),
  getKit: (idOrSlug: string | number) => apiRequest(`/kits/${idOrSlug}`),
  createKit: (data: any) => apiRequest("/kits", { method: "POST", body: JSON.stringify(data) }),
  updateKit: (id: number, data: any) =>
    apiRequest(`/kits/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteKit: (id: number) => apiRequest(`/kits/${id}`, { method: "DELETE" }),

  // Signature Evidence Clues
  getSignatures: () => apiRequest("/kits/signatures"),
  createSignature: (data: any) =>
    apiRequest("/kits/signatures", { method: "POST", body: JSON.stringify(data) }),
  updateSignature: (id: number, data: any) =>
    apiRequest(`/kits/signatures/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSignature: (id: number) =>
    apiRequest(`/kits/signatures/${id}`, { method: "DELETE" }),

  // Settings & Global CMS
  getSettings: () => apiRequest("/settings"),
  updateSettings: (data: Record<string, string>) =>
    apiRequest("/settings", { method: "PUT", body: JSON.stringify(data) }),
  bulkUpdateSettings: (data: Record<string, string>) =>
    apiRequest("/settings/admin/bulk", { method: "POST", body: JSON.stringify({ settings: data }) }),
  updateUpiId: (upiId: string) =>
    apiRequest("/settings/upi-id", { method: "PUT", body: JSON.stringify({ upi_id: upiId }) }),

  // Media Uploads
  uploadMedia: async (file: File, folder: string = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    return apiRequest("/media/upload", { method: "POST", body: formData });
  },

  // Inquiries / Contact & Inbox CMS
  sendContactMessage: (data: { name: string; email: string; phone?: string; subject?: string; message: string; case_interest?: string }) =>
    apiRequest("/contact", { method: "POST", body: JSON.stringify(data) }),
  getInbox: (status?: string) => {
    const q = status && status !== "ALL" ? `?status=${status}` : "";
    return apiRequest(`/contact/admin/inbox${q}`);
  },
  updateInboxMessage: (id: number, data: { status?: string; notes?: string }) =>
    apiRequest(`/contact/admin/inbox/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInboxMessage: (id: number) =>
    apiRequest(`/contact/admin/inbox/${id}`, { method: "DELETE" }),

  // Orders, Checkout & Payment Gateway API
  createOrder: (data: any) =>
    apiRequest("/orders", { method: "POST", body: JSON.stringify(data) }),
  processOrderPayment: (orderId: number, data: { payment_method: string; upi_id?: string; card_last4?: string }) =>
    apiRequest(`/orders/${orderId}/process-payment`, { method: "POST", body: JSON.stringify(data) }),
  lookupOrder: (orderNumberOrId: string | number) =>
    apiRequest(`/orders/lookup/${orderNumberOrId}`),
  adminListOrders: (params?: { status?: string; search?: string; sort_by?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.append("status", params.status);
    if (params?.search) q.append("search", params.search);
    if (params?.sort_by) q.append("sort_by", params.sort_by);
    const qs = q.toString();
    return apiRequest(`/orders/admin/all${qs ? `?${qs}` : ""}`);
  },
  adminGetOrder: (orderId: number) =>
    apiRequest(`/orders/admin/${orderId}`),
  adminAcceptOrder: (orderId: number, data: { expected_delivery_date: string; notes?: string }) =>
    apiRequest(`/orders/admin/${orderId}/accept`, { method: "PUT", body: JSON.stringify(data) }),
  adminUpdateOrderStatus: (orderId: number, data: any) =>
    apiRequest(`/orders/admin/${orderId}/status`, { method: "PUT", body: JSON.stringify(data) }),
  adminEditOrder: (orderId: number, data: any) =>
    apiRequest(`/orders/admin/${orderId}/edit`, { method: "PUT", body: JSON.stringify(data) }),
  adminCancelOrder: (orderId: number) =>
    apiRequest(`/orders/admin/${orderId}/cancel`, { method: "POST" }),
  adminRetryOrderEmail: (orderId: number) =>
    apiRequest(`/orders/admin/${orderId}/retry-email`, { method: "POST" }),
  adminExportAllOrdersJson: () =>
    apiRequest("/orders/admin/export-json"),
  adminExportSingleOrderJson: (orderId: number) =>
    apiRequest(`/orders/admin/${orderId}/export-json`),
  // PhonePe UPI Gateway & Verification
  createPaymentTransaction: (data: { order_id: number; payment_method?: string; redirect_url?: string }) =>
    apiRequest<{
      merchant_transaction_id: string;
      order_id: number;
      order_number: string;
      amount: number;
      currency: string;
      upi_id: string;
      qr_payload: string;
      qr_image_url: string;
      payment_url?: string;
      status: string;
      expires_in_seconds: number;
    }>("/payments/create", { method: "POST", body: JSON.stringify(data) }),

  getPaymentStatus: (transactionId: string) =>
    apiRequest<{
      merchant_transaction_id: string;
      order_id: number;
      order_number: string;
      amount: number;
      currency: string;
      payment_status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
      order_status: string;
      provider: string;
      provider_transaction_id?: string;
      verified_at?: string;
      paid_at?: string;
      message: string;
    }>(`/payments/${transactionId}/status`),

  adminReconcilePayment: (transactionId: string, data: { reason: string; action: string; provider_transaction_id?: string }) =>
    apiRequest(`/payments/admin/reconcile/${transactionId}`, { method: "POST", body: JSON.stringify(data) }),

  adminTestEmail: () =>
    apiRequest("/orders/admin/email/test", { method: "POST" }),
  adminDeleteOrder: (orderId: number) =>
    apiRequest(`/orders/admin/${orderId}`, { method: "DELETE" }),

  // Media Management
  getMediaList: (type?: string) =>
    apiRequest<any[]>(`/media${type && type !== "all" ? `?type=${type}` : ""}`),
  deleteMedia: (id: number) =>
    apiRequest(`/media/${id}`, { method: "DELETE" }),

  // Contact / Inbox Management
  getInboxAdmin: (status?: string) =>
    apiRequest<any[]>(`/inbox/admin${status && status !== "ALL" ? `?status=${status}` : ""}`),
  updateMessageStatus: (id: number, status: string) =>
    apiRequest(`/inbox/admin/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteMessage: (id: number) =>
    apiRequest(`/inbox/admin/${id}`, { method: "DELETE" }),

  // Case Subsections & Evidence
  addCaseSection: (caseId: number, data: any) =>
    apiRequest(`/cases/${caseId}/sections`, { method: "POST", body: JSON.stringify(data) }),
  deleteCaseSection: (sectionId: number) =>
    apiRequest(`/cases/sections/${sectionId}`, { method: "DELETE" }),
  addCaseEvidence: (caseId: number, data: any) =>
    apiRequest(`/cases/${caseId}/evidence`, { method: "POST", body: JSON.stringify(data) }),
  deleteCaseEvidence: (evidenceId: number) =>
    apiRequest(`/cases/evidence/${evidenceId}`, { method: "DELETE" }),
  addCaseClue: (caseId: number, data: any) =>
    apiRequest(`/cases/${caseId}/clues`, { method: "POST", body: JSON.stringify(data) }),
  deleteCaseClue: (clueId: number) =>
    apiRequest(`/cases/clues/${clueId}`, { method: "DELETE" }),
};
