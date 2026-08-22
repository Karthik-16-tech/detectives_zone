import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { A as Radio, Dt as CloudOff, Et as CloudRain, Ht as ArrowUpRight, K as Menu, X as Mail, b as Shield, i as X, mt as FingerprintPattern, v as ShoppingCart } from "../_libs/lucide-react.mjs";
import { t as Lenis } from "../_libs/lenis.mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Cyu50FZl.js
var API_BASE_URL = "http://13.61.187.145/api/v1";
function getAuthToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("dz_admin_token");
}
function setAuthToken(token) {
	if (typeof window !== "undefined") localStorage.setItem("dz_admin_token", token);
}
function getRefreshToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("dz_refresh_token");
}
function setRefreshToken(token) {
	if (typeof window !== "undefined") localStorage.setItem("dz_refresh_token", token);
}
function removeAuthToken() {
	if (typeof window !== "undefined") {
		localStorage.removeItem("dz_admin_token");
		localStorage.removeItem("dz_refresh_token");
		localStorage.removeItem("dz_admin_user");
	}
}
function getSavedAdminUser() {
	if (typeof window === "undefined") return null;
	const user = localStorage.getItem("dz_admin_user");
	try {
		return user ? JSON.parse(user) : null;
	} catch {
		return null;
	}
}
function setSavedAdminUser(user) {
	if (typeof window !== "undefined") localStorage.setItem("dz_admin_user", JSON.stringify(user));
}
var isRefreshing = false;
async function apiRequest(endpoint, options = {}) {
	const token = getAuthToken();
	const headers = new Headers(options.headers || {});
	if (!headers.has("Content-Type") && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
	if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
	const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
	let response = await fetch(url, {
		...options,
		headers
	});
	if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
		const refreshToken = getRefreshToken();
		if (refreshToken && !isRefreshing) {
			isRefreshing = true;
			try {
				const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ refresh_token: refreshToken })
				});
				if (refreshRes.ok) {
					const tokenData = await refreshRes.json();
					setAuthToken(tokenData.access_token);
					if (tokenData.refresh_token) setRefreshToken(tokenData.refresh_token);
					headers.set("Authorization", `Bearer ${tokenData.access_token}`);
					response = await fetch(url, {
						...options,
						headers
					});
				} else {
					removeAuthToken();
					if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") window.location.href = "/admin/login";
				}
			} catch {
				removeAuthToken();
			} finally {
				isRefreshing = false;
			}
		} else {
			removeAuthToken();
			if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") window.location.href = "/admin/login";
		}
	}
	if (!response.ok) {
		let errorDetail = `API Error ${response.status}: ${response.statusText}`;
		try {
			const errorJson = await response.json();
			if (Array.isArray(errorJson.detail)) errorDetail = errorJson.detail.map((e) => e.msg || e.message || JSON.stringify(e)).join(", ");
			else if (typeof errorJson.detail === "object" && errorJson.detail !== null) errorDetail = JSON.stringify(errorJson.detail);
			else if (errorJson.detail) errorDetail = String(errorJson.detail);
			else if (errorJson.message) errorDetail = String(errorJson.message);
		} catch {}
		throw new Error(errorDetail);
	}
	return response.json();
}
var api = {
	login: (data) => apiRequest("/auth/login", {
		method: "POST",
		body: JSON.stringify({
			email: data.email || data.username_or_email,
			username_or_email: data.username_or_email || data.email,
			password: data.password
		})
	}),
	refreshToken: (refreshToken) => apiRequest("/auth/refresh", {
		method: "POST",
		body: JSON.stringify({ refresh_token: refreshToken })
	}),
	getMe: () => apiRequest("/auth/me"),
	changePassword: (data) => apiRequest("/auth/change-password", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	getDashboardStats: () => apiRequest("/dashboard/stats"),
	getRecentActivity: () => apiRequest("/dashboard/activity"),
	getCases: (params) => {
		const q = new URLSearchParams();
		if (params?.status) q.append("status", params.status);
		if (params?.difficulty) q.append("difficulty", params.difficulty);
		if (params?.search) q.append("search", params.search);
		const qs = q.toString();
		return apiRequest(`/cases${qs ? `?${qs}` : ""}`);
	},
	getAllCasesAdmin: () => apiRequest("/cases/admin/all"),
	getCase: (idOrSlug) => apiRequest(`/cases/${idOrSlug}`),
	getCasePage: (idOrSlug) => apiRequest(`/cases/${idOrSlug}/page`),
	updateCasePage: (id, data) => apiRequest(`/cases/${id}/page`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	createCase: (data) => apiRequest("/cases", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	updateCase: (id, data) => apiRequest(`/cases/${id}`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	deleteCase: (id) => apiRequest(`/cases/${id}`, { method: "DELETE" }),
	getProducts: (params) => {
		const q = new URLSearchParams();
		if (params?.category) q.append("category", params.category);
		if (params?.search) q.append("search", params.search);
		const qs = q.toString();
		return apiRequest(`/products${qs ? `?${qs}` : ""}`);
	},
	getAllProductsAdmin: () => apiRequest("/products/admin/all"),
	getProduct: (idOrSlug) => apiRequest(`/products/${idOrSlug}`),
	createProduct: (data) => apiRequest("/products", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	updateProduct: (id, data) => apiRequest(`/products/${id}`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	deleteProduct: (id) => apiRequest(`/products/${id}`, { method: "DELETE" }),
	getKits: () => apiRequest("/kits"),
	getKit: (idOrSlug) => apiRequest(`/kits/${idOrSlug}`),
	createKit: (data) => apiRequest("/kits", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	updateKit: (id, data) => apiRequest(`/kits/${id}`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	deleteKit: (id) => apiRequest(`/kits/${id}`, { method: "DELETE" }),
	getSignatures: () => apiRequest("/kits/signatures"),
	createSignature: (data) => apiRequest("/kits/signatures", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	updateSignature: (id, data) => apiRequest(`/kits/signatures/${id}`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	deleteSignature: (id) => apiRequest(`/kits/signatures/${id}`, { method: "DELETE" }),
	getSettings: () => apiRequest("/settings"),
	updateSettings: (data) => apiRequest("/settings", {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	bulkUpdateSettings: (data) => apiRequest("/settings/admin/bulk", {
		method: "POST",
		body: JSON.stringify({ settings: data })
	}),
	updateUpiId: (upiId) => apiRequest("/settings/upi-id", {
		method: "PUT",
		body: JSON.stringify({ upi_id: upiId })
	}),
	uploadMedia: async (file, folder = "general") => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", folder);
		return apiRequest("/media/upload", {
			method: "POST",
			body: formData
		});
	},
	sendContactMessage: (data) => apiRequest("/contact", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	getInbox: (status) => {
		return apiRequest(`/contact/admin/inbox${status && status !== "ALL" ? `?status=${status}` : ""}`);
	},
	updateInboxMessage: (id, data) => apiRequest(`/contact/admin/inbox/${id}`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	deleteInboxMessage: (id) => apiRequest(`/contact/admin/inbox/${id}`, { method: "DELETE" }),
	createOrder: (data) => apiRequest("/orders", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	processOrderPayment: (orderId, data) => apiRequest(`/orders/${orderId}/process-payment`, {
		method: "POST",
		body: JSON.stringify(data)
	}),
	lookupOrder: (orderNumberOrId) => apiRequest(`/orders/lookup/${orderNumberOrId}`),
	adminListOrders: (params) => {
		const q = new URLSearchParams();
		if (params?.status) q.append("status", params.status);
		if (params?.search) q.append("search", params.search);
		if (params?.sort_by) q.append("sort_by", params.sort_by);
		const qs = q.toString();
		return apiRequest(`/orders/admin/all${qs ? `?${qs}` : ""}`);
	},
	adminGetOrder: (orderId) => apiRequest(`/orders/admin/${orderId}`),
	adminAcceptOrder: (orderId, data) => apiRequest(`/orders/admin/${orderId}/accept`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	adminUpdateOrderStatus: (orderId, data) => apiRequest(`/orders/admin/${orderId}/status`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	adminEditOrder: (orderId, data) => apiRequest(`/orders/admin/${orderId}/edit`, {
		method: "PUT",
		body: JSON.stringify(data)
	}),
	adminCancelOrder: (orderId) => apiRequest(`/orders/admin/${orderId}/cancel`, { method: "POST" }),
	adminRetryOrderEmail: (orderId) => apiRequest(`/orders/admin/${orderId}/retry-email`, { method: "POST" }),
	adminExportAllOrdersJson: () => apiRequest("/orders/admin/export-json"),
	adminExportSingleOrderJson: (orderId) => apiRequest(`/orders/admin/${orderId}/export-json`),
	createPaymentTransaction: (data) => apiRequest("/payments/create", {
		method: "POST",
		body: JSON.stringify(data)
	}),
	getPaymentStatus: (transactionId) => apiRequest(`/payments/${transactionId}/status`),
	adminReconcilePayment: (transactionId, data) => apiRequest(`/payments/admin/reconcile/${transactionId}`, {
		method: "POST",
		body: JSON.stringify(data)
	}),
	adminTestEmail: () => apiRequest("/orders/admin/email/test", { method: "POST" }),
	adminDeleteOrder: (orderId) => apiRequest(`/orders/admin/${orderId}`, { method: "DELETE" }),
	getMediaList: (type) => apiRequest(`/media${type && type !== "all" ? `?type=${type}` : ""}`),
	deleteMedia: (id) => apiRequest(`/media/${id}`, { method: "DELETE" }),
	getInboxAdmin: (status) => apiRequest(`/inbox/admin${status && status !== "ALL" ? `?status=${status}` : ""}`),
	updateMessageStatus: (id, status) => apiRequest(`/inbox/admin/${id}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status })
	}),
	deleteMessage: (id) => apiRequest(`/inbox/admin/${id}`, { method: "DELETE" }),
	addCaseSection: (caseId, data) => apiRequest(`/cases/${caseId}/sections`, {
		method: "POST",
		body: JSON.stringify(data)
	}),
	deleteCaseSection: (sectionId) => apiRequest(`/cases/sections/${sectionId}`, { method: "DELETE" }),
	addCaseEvidence: (caseId, data) => apiRequest(`/cases/${caseId}/evidence`, {
		method: "POST",
		body: JSON.stringify(data)
	}),
	deleteCaseEvidence: (evidenceId) => apiRequest(`/cases/evidence/${evidenceId}`, { method: "DELETE" }),
	addCaseClue: (caseId, data) => apiRequest(`/cases/${caseId}/clues`, {
		method: "POST",
		body: JSON.stringify(data)
	}),
	deleteCaseClue: (clueId) => apiRequest(`/cases/clues/${clueId}`, { method: "DELETE" })
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CBHk_fdB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-BvWv-05W.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Ctx = (0, import_react.createContext)({
	enabled: true,
	toggle: () => {}
});
var useRain = () => (0, import_react.useContext)(Ctx);
function RainProvider({ children }) {
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			enabled,
			toggle: () => setEnabled((v) => !v)
		},
		children
	});
}
function RainCanvas({ enabled }) {
	const canvasRef = (0, import_react.useRef)(null);
	const flashRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!enabled) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let w = 0;
		let h = 0;
		let dpr = 1;
		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = window.innerWidth;
			h = window.innerHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener("resize", resize);
		const count = Math.round(Math.min(380, w * h / 4800));
		const drops = Array.from({ length: count }, () => spawn(w, h, true));
		const splashes = [];
		function spawn(width, height, initial = false) {
			const depth = Math.random();
			return {
				x: Math.random() * (width + 200) - 100,
				y: initial ? Math.random() * height : -Math.random() * 180 - 10,
				len: 8 + depth * 22,
				speed: 4 + depth * 10,
				thickness: .4 + depth * .9,
				alpha: .1 + depth * .28
			};
		}
		let wind = .9;
		let windTarget = .9;
		let gustTimer = 0;
		let nextStrike = 5e3;
		let elapsed = 0;
		const strike = () => {
			if (!flashRef.current) return;
			[
				[0, .5],
				[70, 0],
				[120, .85],
				[230, .12],
				[300, .4],
				[420, 0]
			].forEach(([t, o]) => {
				window.setTimeout(() => {
					if (flashRef.current) flashRef.current.style.opacity = String(o);
				}, t);
			});
			try {
				rumble();
			} catch {}
		};
		let audioCtx = null;
		const rumble = () => {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) return;
			audioCtx = audioCtx ?? new AC();
			if (audioCtx.state === "suspended") return;
			const dur = 3.2;
			const rate = audioCtx.sampleRate;
			const buf = audioCtx.createBuffer(1, rate * dur, rate);
			const data = buf.getChannelData(0);
			let last = 0;
			for (let i = 0; i < data.length; i++) {
				const white = Math.random() * 2 - 1;
				last = (last + .02 * white) / 1.02;
				data[i] = last * 3.5;
			}
			const src = audioCtx.createBufferSource();
			src.buffer = buf;
			const lp = audioCtx.createBiquadFilter();
			lp.type = "lowpass";
			lp.frequency.value = 220;
			const gain = audioCtx.createGain();
			const t0 = audioCtx.currentTime + .35;
			gain.gain.setValueAtTime(1e-4, t0);
			gain.gain.exponentialRampToValueAtTime(.22, t0 + .25);
			gain.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
			src.connect(lp).connect(gain).connect(audioCtx.destination);
			src.start(t0);
			src.stop(t0 + dur);
		};
		let raf = 0;
		let prev = performance.now();
		const loop = (now) => {
			const dt = Math.min(48, now - prev);
			prev = now;
			elapsed += dt;
			gustTimer -= dt;
			if (gustTimer <= 0) {
				gustTimer = 2500 + Math.random() * 4e3;
				windTarget = .3 + Math.random() * 2.4;
			}
			wind += (windTarget - wind) * .002 * dt;
			if (elapsed > nextStrike) {
				elapsed = 0;
				nextStrike = 5e3;
				strike();
			}
			ctx.clearRect(0, 0, w, h);
			const f = dt / 16.67;
			for (let i = 0; i < drops.length; i++) {
				const d = drops[i];
				const vx = wind * (d.speed * .16);
				d.x += vx * f;
				d.y += d.speed * f;
				ctx.beginPath();
				ctx.strokeStyle = `rgba(198,214,230,${d.alpha})`;
				ctx.lineWidth = d.thickness;
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(d.x - vx * 1.6, d.y - d.len);
				ctx.stroke();
				if (d.y > h) {
					if (d.alpha > .18 && splashes.length < 60) splashes.push({
						x: d.x,
						y: h - 2,
						r: 0,
						life: 0,
						max: 380
					});
					drops[i] = spawn(w, h);
				}
			}
			for (let i = splashes.length - 1; i >= 0; i--) {
				const s = splashes[i];
				s.life += dt;
				const p = s.life / s.max;
				if (p >= 1) {
					splashes.splice(i, 1);
					continue;
				}
				s.r = p * 14;
				ctx.beginPath();
				ctx.strokeStyle = `rgba(198,214,230,${.18 * (1 - p)})`;
				ctx.lineWidth = .7;
				ctx.ellipse(s.x, s.y, s.r, s.r * .28, 0, 0, Math.PI * 2);
				ctx.stroke();
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		const resumeAudio = () => {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) return;
			audioCtx = audioCtx ?? new AC();
			audioCtx.resume();
		};
		window.addEventListener("pointerdown", resumeAudio, { once: true });
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointerdown", resumeAudio);
			audioCtx?.close();
		};
	}, [enabled]);
	if (!enabled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "h-full w-full opacity-80"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: flashRef,
			className: "absolute inset-0 transition-opacity duration-150",
			style: {
				opacity: 0,
				background: "radial-gradient(120% 80% at 70% 0%, rgba(214,228,244,0.5), rgba(180,200,224,0.12) 45%, transparent 70%)"
			}
		})]
	});
}
var CartContext = (0, import_react.createContext)(void 0);
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem("dz_cart_items");
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
		return [];
	});
	const saveItems = (newItems) => {
		setItems(newItems);
		if (typeof window !== "undefined") try {
			localStorage.setItem("dz_cart_items", JSON.stringify(newItems));
		} catch {}
	};
	const addToCart = (newItem) => {
		const existingIndex = items.findIndex((i) => i.id === newItem.id);
		let nextItems;
		if (existingIndex > -1) nextItems = items.map((item, idx) => idx === existingIndex ? {
			...item,
			quantity: item.quantity + 1
		} : item);
		else nextItems = [...items, {
			...newItem,
			quantity: 1
		}];
		saveItems(nextItems);
	};
	const removeFromCart = (id) => {
		saveItems(items.filter((i) => i.id !== id));
	};
	const updateQuantity = (id, delta) => {
		const nextItems = items.map((item) => {
			if (item.id === id) {
				const nextQty = item.quantity + delta;
				return nextQty > 0 ? {
					...item,
					quantity: nextQty
				} : null;
			}
			return item;
		}).filter(Boolean);
		saveItems(nextItems);
	};
	const clearCart = () => {
		saveItems([]);
	};
	const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value: {
			items,
			addToCart,
			removeFromCart,
			updateQuantity,
			clearCart,
			totalCount,
			subtotal
		},
		children
	});
}
function useCart() {
	const context = (0, import_react.useContext)(CartContext);
	if (!context) throw new Error("useCart must be used within a CartProvider");
	return context;
}
/**
* Central Media Repository for Detective Zone
* 
* - Hero Video: Loaded directly from local assets for instant loading and scrubbing.
* - All Other Media: Fetched directly from the AWS S3 bucket URLs.
*/
var S3_MEDIA = {
	heroVideo: "/assets/detective-scrub-fast-CRU0MsA1.mp4",
	logo: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/logo.png",
	evidenceRoom: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence-room.jpg",
	noirStreet: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/noir-street.jpg",
	hqScene: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/hq-scene.jpg",
	supportScene: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/support-scene.jpg",
	shortVideo: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/thi_svidoe_make_it_seconds.mp4",
	about: {
		believeCrimeScene: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/believe-crime-scene.jpg",
		believeEye: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/believe-eye.jpg",
		ctaDesk: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/cta-desk.jpg",
		detectiveAlley: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/detective-alley.jpg",
		evidenceBoard: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/about/evidence-board.jpg"
	},
	caseKits: { dz001Kit: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/case_kits/image.png" },
	cases: {
		caseBetrayal: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-betrayal.png",
		caseExperiment: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-experiment.png",
		caseHeir: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-heir.png",
		caseLetter: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-letter.png",
		caseVoicemail: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-voicemail.png",
		caseWitness: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/cases/case-witness.png"
	},
	evidence: {
		alley: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/alley.jpg",
		corkboard: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/corkboard.jpg",
		e01: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-01.jpg",
		e02: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-02.jpg",
		e03: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-03.jpg",
		e04: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-04.jpg",
		e05: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-05.jpg",
		e06: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-06.jpg",
		e07: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-07.jpg",
		e08: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-08.jpg",
		e09: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-09.jpg",
		e10: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-10.jpg",
		e11: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-11.jpg",
		e12: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/evidence/e-12.jpg"
	},
	testimonials: {
		birthday: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-birthday.jpg",
		couple: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-couple.jpg",
		family: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-family.jpg",
		friends: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/testimonals/testimonial-friends.jpg"
	},
	signature: {
		audio: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/audio.png",
		camera: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/camera.png",
		files: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/files.png",
		mobile: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/mobile.png",
		puzzle: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/puzzle.png",
		time: "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/signature/time.png"
	}
};
var logo$1 = S3_MEDIA.logo;
function Navbar() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const { totalCount } = useCart();
	const { enabled, toggle } = useRain();
	const pathname = useRouterState().location.pathname;
	const isHomePage = pathname === "/";
	const isCartPage = pathname === "/cart";
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const closeMobile = (0, import_react.useCallback)(() => setMobileOpen(false), []);
	const scrollToSection = (id) => {
		closeMobile();
		if (isHomePage) if (id === "home") window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		else {
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({ behavior: "smooth" });
		}
	};
	const linkClass = (active) => `group relative py-1 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 cursor-pointer ${active ? "text-white" : "text-white/55 hover:text-white"}`;
	const linkUnderline = (active) => `absolute -bottom-0.5 left-0 h-px bg-blood transition-all duration-500 ${active ? "w-full" : "w-0 group-hover:w-full"}`;
	const mobileLinkClass = (active) => `block py-3 font-mono text-[12px] uppercase tracking-[0.22em] transition-colors duration-300 cursor-pointer ${active ? "text-blood" : "text-white/55 hover:text-white"}`;
	const homeLinks = [
		{
			id: "home",
			label: "Home"
		},
		{
			id: "about",
			label: "About"
		},
		{
			id: "challenge",
			label: "Challenge"
		},
		{
			id: "contact",
			label: "Contact"
		}
	];
	const generalLinks = [
		{
			to: "/cases",
			label: "Cases"
		},
		{
			to: "/store",
			label: "Store"
		},
		{
			to: "/about",
			label: "About"
		},
		{
			to: "/contact",
			label: "Contact"
		}
	];
	const isGeneralActive = (to) => {
		if (to === "/cases") return pathname === "/cases" || pathname.startsWith("/cases/");
		if (to === "/store") return pathname === "/store" || pathname.startsWith("/store/");
		return pathname === to || pathname.startsWith(`${to}/`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "fixed inset-x-0 top-0 z-50 transition-all duration-500",
			style: {
				height: 50,
				background: scrolled ? "rgba(4,4,4,0.88)" : "rgba(4,4,4,0.32)",
				backdropFilter: "blur(20px)",
				WebkitBackdropFilter: "blur(20px)",
				borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.07)"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex shrink-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo$1,
							alt: "Detective Zone logo",
							className: "h-8 w-8 shrink-0 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "whitespace-nowrap font-display text-[14px] font-semibold uppercase tracking-[0.24em] text-white",
							children: ["Detectives ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-blood",
								children: "Zone"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden items-center gap-8 lg:flex",
						children: [isHomePage ? homeLinks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => scrollToSection(item.id),
							className: linkClass(false),
							children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: linkUnderline(false) })]
						}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [generalLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: l.to,
							className: linkClass(isGeneralActive(l.to)),
							children: [l.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: linkUnderline(isGeneralActive(l.to)) })]
						}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/cart",
							"aria-label": "Cart",
							className: `relative p-2 transition-colors duration-300 ${isCartPage ? "text-white" : "text-white/55 hover:text-white"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-[18px] w-[18px]" }), !isCartPage && totalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blood text-[9px] font-bold text-white shadow-sm",
								children: totalCount
							})]
						})] }), isHomePage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: toggle,
							"aria-label": enabled ? "Turn rain off" : "Turn rain on",
							className: "flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 transition-all duration-300 hover:border-blood/50 hover:bg-white/[0.1] hover:text-white cursor-pointer",
							children: [enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: "h-3.5 w-3.5 text-blood animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "h-3.5 w-3.5 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Rain ", enabled ? "On" : "Off"] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 lg:hidden",
						children: [
							isHomePage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: toggle,
								"aria-label": enabled ? "Turn rain off" : "Turn rain on",
								className: "flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70",
								children: [enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: "h-3.5 w-3.5 text-blood" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "h-3.5 w-3.5 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: enabled ? "Rain On" : "Rain Off" })]
							}),
							!isHomePage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cart",
								"aria-label": "Cart",
								className: "relative p-2 text-white/60 hover:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-5 w-5" }), totalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blood text-[9px] font-bold text-white shadow-sm",
									children: totalCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileOpen((v) => !v),
								"aria-label": mobileOpen ? "Close menu" : "Open menu",
								className: "flex items-center justify-center p-1.5 text-white/70 transition-colors hover:text-white",
								children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
			onClick: closeMobile
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `fixed top-0 right-0 z-[51] h-full w-[280px] border-l border-border/30 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`,
			style: {
				background: "rgba(6,6,6,0.97)",
				backdropFilter: "blur(24px)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/10 px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-white/60",
						children: "Menu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: closeMobile,
						"aria-label": "Close menu",
						className: "p-1 text-white/60 transition-colors hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-b border-white/10 px-5 py-4",
					children: isHomePage ? homeLinks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => scrollToSection(item.id),
						className: `w-full text-left ${mobileLinkClass(false)}`,
						children: item.label
					}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [generalLinks.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						onClick: closeMobile,
						className: mobileLinkClass(isGeneralActive(l.to)),
						children: l.label
					}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						onClick: closeMobile,
						className: mobileLinkClass(false),
						children: "Home"
					})] })
				}),
				isHomePage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-4 border-t border-white/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: toggle,
						className: "flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.04] p-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-blood/40 hover:text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRain, { className: "h-4 w-4 text-blood" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, { className: "h-4 w-4 text-white/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Atmospheric Rain" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[10px] font-bold ${enabled ? "text-blood" : "text-white/40"}`,
							children: enabled ? "ON" : "OFF"
						})]
					})
				}),
				!isHomePage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cart",
						onClick: closeMobile,
						className: "flex items-center gap-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }),
							"Cart ",
							totalCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 text-blood",
								children: [
									"(",
									totalCount,
									")"
								]
							})
						]
					})
				})
			]
		})
	] });
}
var logo = S3_MEDIA.logo;
function Footer() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [subscribed, setSubscribed] = (0, import_react.useState)(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!email.trim()) return;
		setSubscribed(true);
		setTimeout(() => {
			setEmail("");
			setSubscribed(false);
		}, 4e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative mt-20 sm:mt-32 overflow-hidden border-t border-white/[0.08] bg-[#020202] text-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 z-0 opacity-40",
			style: { backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(179,18,23,0.18) 0%, transparent 65%),
            linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)
          ` }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-12 gap-10 lg:gap-14",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-12 lg:col-span-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/",
									className: "inline-flex items-center gap-3 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-colors duration-300 group-hover:border-blood/50",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: logo,
											alt: "Detectives Zone",
											className: "h-7 w-7 object-contain"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-[19px] font-bold uppercase tracking-[0.22em] text-white",
										children: ["Detectives ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-blood",
											children: "Zone"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-sm font-sans text-[13px] leading-relaxed text-white/55",
									children: "An interactive, story-driven crime investigation universe. Every shadow conceals a motive, every dossier holds the key to uncovering the truth."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-7 flex flex-wrap items-center gap-2.5",
									children: [
										{
											icon: Shield,
											label: "Encrypted Dossier"
										},
										{
											icon: FingerprintPattern,
											label: "Verified Evidence"
										},
										{
											icon: Radio,
											label: "Live Dispatch"
										}
									].map((badge, i) => {
										const Icon = badge.icon;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 transition-colors duration-300 hover:border-blood/40 hover:text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3 text-blood" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: badge.label })]
										}, i);
									})
								})
							]
						}),
						[{
							title: "Investigations",
							links: [
								{
									label: "Case Files",
									to: "/cases"
								},
								{
									label: "Evidence Archive",
									to: "/evidence-wall"
								},
								{
									label: "Detective Store",
									to: "/store"
								},
								{
									label: "Crime Challenge",
									to: "/challenge"
								}
							]
						}, {
							title: "Agency",
							links: [
								{
									label: "About Dossier",
									to: "/about"
								},
								{
									label: "Contact HQ",
									to: "/contact"
								},
								{
									label: "Privacy Protocol",
									to: "/about"
								},
								{
									label: "Terms of Service",
									to: "/about"
								}
							]
						}].map((group, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-6 sm:col-span-3 lg:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80",
								children: ["// ", group.title]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 space-y-3.5 font-mono text-[12px] uppercase tracking-[0.14em]",
								children: group.links.map((link, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: link.to,
									className: "group flex items-center gap-2 text-white/45 transition-colors duration-300 hover:text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-0 bg-blood transition-all duration-300 group-hover:w-2.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "relative",
											children: link.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-blood" })
									]
								}) }, i))
							})]
						}, idx)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-span-12 sm:col-span-6 lg:col-span-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-transparent p-6 lg:p-7",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-blood",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Classified Dispatch" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2.5 font-display text-[18px] font-bold uppercase tracking-[0.08em] text-white",
										children: "Receive New Case Files"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 font-sans text-[12px] leading-relaxed text-white/50",
										children: "Get notified as soon as new investigations, physical crime scene kits, and clues drop."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleSubmit,
										className: "mt-5 flex flex-col gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												required: true,
												value: email,
												onChange: (e) => setEmail(e.target.value),
												placeholder: "agent@detectiveszone.co",
												className: "w-full rounded-lg border border-white/12 bg-black/70 px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-blood focus:ring-1 focus:ring-blood"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "submit",
											className: "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-blood py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-blood/90 hover:shadow-[0_0_24px_rgba(179,18,23,0.4)] cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "relative",
												children: subscribed ? "✓ Registered" : "Request Clearance"
											}), !subscribed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
										})]
									})
								]
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mt-16 select-none border-t border-white/[0.06] pt-8 text-center",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display font-black tracking-widest uppercase text-white/[0.035] leading-none",
						style: {
							fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
							fontFamily: "Bebas Neue, Oswald, sans-serif"
						},
						children: "DETECTIVES ZONE"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-col items-center justify-center gap-4 border-t border-white/[0.05] pt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 sm:flex-row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Detectives Zone. All classified rights reserved."
					] })
				})
			]
		})]
	});
}
var LenisContext = (0, import_react.createContext)(null);
function SmoothScrollProvider({ children }) {
	const [lenis, setLenis] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		gsapWithCSS.registerPlugin(ScrollTrigger);
		const instance = new Lenis({
			autoRaf: false,
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 1.4
		});
		instance.on("scroll", ScrollTrigger.update);
		const tickerUpdate = (time) => {
			instance.raf(time * 1e3);
		};
		gsapWithCSS.ticker.add(tickerUpdate);
		gsapWithCSS.ticker.lagSmoothing(0);
		setLenis(instance);
		return () => {
			gsapWithCSS.ticker.remove(tickerUpdate);
			instance.destroy();
			setLenis(null);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LenisContext.Provider, {
		value: lenis,
		children
	});
}
/**
* PORTABLE detective "buffering ring" preloader.
* Self-contained: no Tailwind config, no CSS file, no dependencies.
* Copy this ONE file into any React project and use:
*
*   const [loading, setLoading] = useState(true);
*   {loading && <DetectivePreloader onDone={() => setLoading(false)} />}
*/
var SEARCH_MS = 2200;
var SOLVED_MS = 700;
var NOIR = "#141210";
var CREAM = "#f2e9d8";
var CLUE = "#b03a2e";
var GOLD = "#d9b45b";
var CSS = `
@keyframes dp-ring-spin { to { transform: rotate(360deg); } }
@keyframes dp-ring-dash {
  0% { stroke-dasharray: 12 252; }
  50% { stroke-dasharray: 150 114; }
  100% { stroke-dasharray: 12 252; }
}
@keyframes dp-ticks-spin { to { transform: rotate(-360deg); } }
@keyframes dp-glass-pulse {
  0%,100% { opacity: .75; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
@keyframes dp-glass-pop {
  0% { transform: scale(1); }
  100% { transform: scale(1.25); opacity: 1; }
}
@keyframes dp-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
@keyframes dp-exit {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.06); }
}
.dp-arc {
  transform-origin: 50% 50%;
  stroke-dasharray: 80 184;
  animation: dp-ring-spin 1.1s linear infinite, dp-ring-dash 1.8s ease-in-out infinite;
  will-change: transform;
}
.dp-arc-solved {
  animation: none; stroke-dasharray: 264; stroke-dashoffset: 0;
  filter: drop-shadow(0 0 5px ${CLUE});
}
.dp-ticks { animation: dp-ticks-spin 14s linear infinite; will-change: transform; }
.dp-glass { animation: dp-glass-pulse 1.8s ease-in-out infinite; }
.dp-glass-pop { animation: dp-glass-pop .5s ease-out forwards; }
.dp-cursor { animation: dp-blink .9s steps(1) infinite; }
.dp-exit { animation: dp-exit .7s ease-in .25s forwards; }
@media (prefers-reduced-motion: reduce) {
  .dp-arc, .dp-ticks, .dp-glass, .dp-glass-pop, .dp-cursor, .dp-exit { animation: none; }
}
`;
function DetectivePreloader({ onDone, searchMs, solvedMs }) {
	const [solved, setSolved] = (0, import_react.useState)(false);
	const [gone, setGone] = (0, import_react.useState)(false);
	const SEARCH = searchMs ?? SEARCH_MS;
	const SOLVED = solvedMs ?? SOLVED_MS;
	(0, import_react.useEffect)(() => {
		const t1 = setTimeout(() => setSolved(true), SEARCH);
		const t2 = setTimeout(() => {
			setGone(true);
			onDone?.();
		}, SEARCH + SOLVED);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [
		onDone,
		SEARCH,
		SOLVED
	]);
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);
	if (gone) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: solved ? "dp-exit" : void 0,
		"aria-hidden": "true",
		style: {
			position: "fixed",
			inset: 0,
			zIndex: 9999,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			background: NOIR
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: CSS }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					height: 112,
					width: 112
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 100 100",
						style: {
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							transform: "rotate(-90deg)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "50",
							cy: "50",
							r: "42",
							fill: "none",
							stroke: CREAM,
							strokeOpacity: "0.12",
							strokeWidth: "1.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "50",
							cy: "50",
							r: "42",
							fill: "none",
							stroke: CLUE,
							strokeWidth: "1.5",
							strokeLinecap: "round",
							className: solved ? "dp-arc dp-arc-solved" : "dp-arc"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						viewBox: "0 0 100 100",
						className: "dp-ticks",
						style: {
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%"
						},
						children: Array.from({ length: 24 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "50",
							y1: "6",
							x2: "50",
							y2: "10",
							stroke: GOLD,
							strokeOpacity: i % 6 === 0 ? .55 : .18,
							strokeWidth: "1",
							transform: `rotate(${i * 15} 50 50)`
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: CREAM,
						strokeWidth: "1.5",
						strokeLinecap: "round",
						className: solved ? "dp-glass-pop" : "dp-glass",
						style: {
							position: "absolute",
							inset: 0,
							margin: "auto",
							height: 32,
							width: 32
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "10.5",
							cy: "10.5",
							r: "6.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: "15.5",
							y1: "15.5",
							x2: "21",
							y2: "21"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				style: {
					marginTop: 28,
					fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
					fontSize: "0.7rem",
					letterSpacing: "0.35em",
					textTransform: "uppercase",
					color: CREAM,
					opacity: .8
				},
				children: [solved ? "Case Solved" : "Investigating", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "dp-cursor",
					style: {
						display: "inline-block",
						marginLeft: 6,
						width: 2,
						height: 12,
						verticalAlign: "middle",
						background: CLUE
					}
				})]
			})
		]
	});
}
/**
* Preloader orchestration.
* - "initial"  → full cinematic preloader, only on the home page (where "Explore Cases" lives)
* - "nav"      → shorter "case loading" transition, only when entering the Cases route
* - "idle"     → nothing showing (all dashboard pages skip the preloader)
*/
var NAV_SEARCH_MS = 1200;
var NAV_SOLVED_MS = 600;
var isCaseRoute = (path) => path === "/cases" || path.startsWith("/cases/");
var PreloaderContext = (0, import_react.createContext)(null);
function PreloaderProvider({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [phase, setPhase] = (0, import_react.useState)(pathname === "/" ? "initial" : "idle");
	const prevPath = (0, import_react.useRef)(pathname);
	(0, import_react.useEffect)(() => {
		if (prevPath.current === pathname) return;
		prevPath.current = pathname;
		setPhase(isCaseRoute(pathname) ? "nav" : "idle");
	}, [pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PreloaderContext.Provider, {
		value: { trigger: () => setPhase("nav") },
		children: [
			phase === "initial" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetectivePreloader, { onDone: () => setPhase("idle") }),
			phase === "nav" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetectivePreloader, {
				searchMs: NAV_SEARCH_MS,
				solvedMs: NAV_SOLVED_MS,
				onDone: () => setPhase("idle")
			}),
			children
		]
	});
}
var AdminAuthContext = (0, import_react.createContext)(void 0);
function AdminAuthProvider({ children }) {
	const [admin, setAdmin] = (0, import_react.useState)(getSavedAdminUser());
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (getAuthToken()) api.getMe().then((user) => {
			setAdmin(user);
			setSavedAdminUser(user);
		}).catch(() => {
			removeAuthToken();
			setAdmin(null);
		}).finally(() => setIsLoading(false));
		else setIsLoading(false);
	}, []);
	const login = async (usernameOrEmail, password) => {
		const res = await api.login({
			email: usernameOrEmail,
			username_or_email: usernameOrEmail,
			password
		});
		setAuthToken(res.access_token);
		if (res.refresh_token) setRefreshToken(res.refresh_token);
		setSavedAdminUser(res.admin);
		setAdmin(res.admin);
	};
	const logout = () => {
		removeAuthToken();
		setAdmin(null);
		if (typeof window !== "undefined") window.location.href = "/admin/login";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthContext.Provider, {
		value: {
			admin,
			isAuthenticated: !!admin,
			isLoading,
			login,
			logout
		},
		children
	});
}
function useAdminAuth() {
	const context = (0, import_react.useContext)(AdminAuthContext);
	if (!context) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
	return context;
}
function WhatsAppFloatingButton({ phoneNumber, message, position = "bottom-left", className = "" }) {
	const [activeNumber, setActiveNumber] = (0, import_react.useState)(phoneNumber || "6305729867");
	const [activeMessage, setActiveMessage] = (0, import_react.useState)(message || "Hi Detective Zone Team, I have an inquiry.");
	(0, import_react.useEffect)(() => {
		if (!phoneNumber) api.getSettings().then((s) => {
			if (s) {
				if (s.whatsapp_phone_number) setActiveNumber(s.whatsapp_phone_number);
				else if (s.contact_phone) setActiveNumber(s.contact_phone);
				if (s.whatsapp_message) setActiveMessage(s.whatsapp_message);
			}
		}).catch(() => {});
	}, [phoneNumber]);
	const cleanNumber = activeNumber.replace(/[^0-9]/g, "");
	const whatsappUrl = `https://wa.me/${cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber || "916305729867"}?text=${encodeURIComponent(activeMessage)}`;
	const posClasses = position === "bottom-left" ? "bottom-6 left-6" : "bottom-6 right-6";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: whatsappUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": "Chat with Detective Zone on WhatsApp",
		title: `Chat on WhatsApp (${activeNumber})`,
		className: `fixed z-[999] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 ${posClasses} ${className}`,
		style: {
			backgroundColor: "#25D366",
			boxShadow: "0 4px 16px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(37, 211, 102, 0.3)",
			textDecoration: "none"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 32 32",
			width: "30",
			height: "30",
			fill: "#FFFFFF",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 2C8.28 2 2 8.28 2 16c0 2.65.74 5.14 2.03 7.28L2 30l6.95-1.99C11.02 29.28 13.43 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.65c-2.31 0-4.47-.67-6.3-1.83l-.45-.29-4.22 1.21 1.23-4.11-.31-.47C4.7 20.3 4 18.22 4 16 4 9.38 9.38 4 16 4s12 5.38 12 12-5.38 11.65-12 11.65zm6.54-8.87c-.36-.18-2.12-1.05-2.45-1.17-.33-.12-.57-.18-.81.18-.24.36-.93 1.17-1.14 1.41-.21.24-.42.27-.78.09-.36-.18-1.52-.56-2.9-1.79-1.07-.96-1.8-2.14-2.01-2.5-.21-.36-.02-.56.16-.74.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.81-1.95-1.11-2.67-.29-.7-.59-.61-.81-.62-.21-.01-.45-.01-.69-.01-.24 0-.63.09-.96.45-.33.36-1.26 1.23-1.26 3.01s1.29 3.49 1.47 3.73c.18.24 2.54 3.88 6.16 5.44.86.37 1.53.59 2.06.76.87.28 1.66.24 2.28.15.7-.1 2.12-.87 2.42-1.71.3-.84.3-1.56.21-1.71-.09-.15-.33-.24-.69-.42z" })
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$26 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Detective Zone — Story-Driven Investigation Cases" },
			{
				name: "description",
				content: "Detective Zone is a cinematic, story-driven investigation experience. Examine evidence, connect clues and uncover the truth hidden in the shadows."
			},
			{
				name: "author",
				content: "Detective Zone"
			},
			{
				property: "og:title",
				content: "Detective Zone — Story-Driven Investigation Cases"
			},
			{
				property: "og:description",
				content: "Examine the evidence. Connect the unconnected. Uncover what others never saw."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Special+Elite&family=Courier+Prime:wght@400;700&family=Caveat:wght@400;500;600;700&family=Share+Tech+Mono&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$26.useRouteContext();
	const pathname = useRouterState().location.pathname;
	const isAdminRoute = pathname.startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmoothScrollProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RainProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PreloaderProvider, { children: [
			!isAdminRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-h-screen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			!isAdminRoute && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			!isAdminRoute && !(pathname === "/") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppFloatingButton, { position: "bottom-left" })
		] }) }) }) }) })
	});
}
var $$splitComponentImporter$25 = () => import("./routes-DgRqLRIk.mjs");
S3_MEDIA.cases.caseVoicemail;
var Route$25 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Detective Zone — Every Shadow Has a Story" },
		{
			name: "description",
			content: "Step into Case File 001. Examine the scene, inspect every clue and uncover the truth hidden beneath layers of deception."
		},
		{
			property: "og:title",
			content: "Detective Zone — Every Shadow Has a Story"
		},
		{
			property: "og:description",
			content: "A cinematic, story-driven investigation experience. Open the case file."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./about-u98dpetu.mjs");
var Route$24 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Us — Detectives Zone | We Create Mysteries, You Solve Them" },
		{
			name: "description",
			content: "Detectives Zone builds immersive detective experiences: realistic case files, evidence, clues and hidden secrets that challenge your observation and deduction."
		},
		{
			property: "og:title",
			content: "About Detectives Zone — We Create Mysteries"
		},
		{
			property: "og:description",
			content: "Immersive detective case files filled with evidence, clues, statements and hidden secrets. Think. Investigate. Uncover."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./cart-M1LT6lsa.mjs");
var Route$23 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./cases-BCCqUJV-.mjs");
var Route$22 = createFileRoute("/cases")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./challenge-C71XnPPT.mjs");
var Route$21 = createFileRoute("/challenge")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./contact-D37pRrVP.mjs");
var Route$20 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact — Detective Zone" }, {
		name: "description",
		content: "Every investigation starts with a conversation. Report a clue, request assistance or explore partnership opportunities with the Detective Zone team."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./evidence-wall-De2zuzgE.mjs");
var title = "Evidence Wall — Case 001 | Detective Zone";
var description = "The full pinned evidence wall for Case 001, The Last Voicemail: 12 exhibits connected by red string across the corkboard.";
var Route$19 = createFileRoute("/evidence-wall")({
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./store-BsZptu29.mjs");
var Route$18 = createFileRoute("/store")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin-BdwXYT6q.mjs");
var Route$17 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./cases-DaSncoxc.mjs");
var Route$16 = createFileRoute("/admin/cases")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./contact-BKzdNJgO.mjs");
var Route$15 = createFileRoute("/admin/contact")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./inbox-CXti5Sa0.mjs");
var Route$14 = createFileRoute("/admin/inbox")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./kits-DeTuF6f2.mjs");
var Route$13 = createFileRoute("/admin/kits")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./login-BS43Zou3.mjs");
var Route$12 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./media--s9VdU-2.mjs");
var Route$11 = createFileRoute("/admin/media")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./orders-BvKL3oBL.mjs");
var Route$10 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./pages-C26m45W8.mjs");
var Route$9 = createFileRoute("/admin/pages")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./payments-DAww0_vC.mjs");
var Route$8 = createFileRoute("/admin/payments")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./settings-oExUxSni.mjs");
var Route$7 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./store-CajQPhT1.mjs");
var Route$6 = createFileRoute("/admin/store")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./whatsapp-DB8HCQSm.mjs");
var Route$5 = createFileRoute("/admin/whatsapp")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./cases-D7PPPYT4.mjs");
var Route$4 = createFileRoute("/cases/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitNotFoundComponentImporter = () => import("./cases._caseId-Cds9KbYn.mjs");
var $$splitComponentImporter$3 = () => import("./cases._caseId-D6HMfDLh.mjs");
var Route$3 = createFileRoute("/cases/$caseId")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
var $$splitComponentImporter$2 = () => import("./orders.index-BHo6s3vJ.mjs");
var Route$2 = createFileRoute("/orders/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./orders._orderId-BPCzGioL.mjs");
var Route$1 = createFileRoute("/orders/$orderId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./cases._caseId-_8YuQGGs.mjs");
var Route = createFileRoute("/admin/cases/$caseId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var AboutRoute = Route$24.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$26
});
var CartRoute = Route$23.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$26
});
var CasesRoute = Route$22.update({
	id: "/cases",
	path: "/cases",
	getParentRoute: () => Route$26
});
var ChallengeRoute = Route$21.update({
	id: "/challenge",
	path: "/challenge",
	getParentRoute: () => Route$26
});
var ContactRoute = Route$20.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$26
});
var EvidenceWallRoute = Route$19.update({
	id: "/evidence-wall",
	path: "/evidence-wall",
	getParentRoute: () => Route$26
});
var StoreRoute = Route$18.update({
	id: "/store",
	path: "/store",
	getParentRoute: () => Route$26
});
var AdminIndexRoute = Route$17.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$26
});
var AdminCasesRoute = Route$16.update({
	id: "/admin/cases",
	path: "/admin/cases",
	getParentRoute: () => Route$26
});
var AdminContactRoute = Route$15.update({
	id: "/admin/contact",
	path: "/admin/contact",
	getParentRoute: () => Route$26
});
var AdminInboxRoute = Route$14.update({
	id: "/admin/inbox",
	path: "/admin/inbox",
	getParentRoute: () => Route$26
});
var AdminKitsRoute = Route$13.update({
	id: "/admin/kits",
	path: "/admin/kits",
	getParentRoute: () => Route$26
});
var AdminLoginRoute = Route$12.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$26
});
var AdminMediaRoute = Route$11.update({
	id: "/admin/media",
	path: "/admin/media",
	getParentRoute: () => Route$26
});
var AdminOrdersRoute = Route$10.update({
	id: "/admin/orders",
	path: "/admin/orders",
	getParentRoute: () => Route$26
});
var AdminPagesRoute = Route$9.update({
	id: "/admin/pages",
	path: "/admin/pages",
	getParentRoute: () => Route$26
});
var AdminPaymentsRoute = Route$8.update({
	id: "/admin/payments",
	path: "/admin/payments",
	getParentRoute: () => Route$26
});
var AdminSettingsRoute = Route$7.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$26
});
var AdminStoreRoute = Route$6.update({
	id: "/admin/store",
	path: "/admin/store",
	getParentRoute: () => Route$26
});
var AdminWhatsappRoute = Route$5.update({
	id: "/admin/whatsapp",
	path: "/admin/whatsapp",
	getParentRoute: () => Route$26
});
var CasesIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => CasesRoute
});
var CasesCaseIdRoute = Route$3.update({
	id: "/$caseId",
	path: "/$caseId",
	getParentRoute: () => CasesRoute
});
var OrdersIndexRoute = Route$2.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => Route$26
});
var OrdersOrderIdRoute = Route$1.update({
	id: "/orders/$orderId",
	path: "/orders/$orderId",
	getParentRoute: () => Route$26
});
var AdminCasesCaseIdRoute = Route.update({
	id: "/$caseId",
	path: "/$caseId",
	getParentRoute: () => AdminCasesRoute
});
var CasesRouteChildren = {
	CasesCaseIdRoute,
	CasesIndexRoute
};
var CasesRouteWithChildren = CasesRoute._addFileChildren(CasesRouteChildren);
var AdminCasesRouteChildren = { AdminCasesCaseIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	CartRoute,
	CasesRoute: CasesRouteWithChildren,
	ChallengeRoute,
	ContactRoute,
	EvidenceWallRoute,
	StoreRoute,
	AdminCasesRoute: AdminCasesRoute._addFileChildren(AdminCasesRouteChildren),
	AdminContactRoute,
	AdminInboxRoute,
	AdminKitsRoute,
	AdminLoginRoute,
	AdminMediaRoute,
	AdminOrdersRoute,
	AdminPagesRoute,
	AdminPaymentsRoute,
	AdminSettingsRoute,
	AdminStoreRoute,
	AdminWhatsappRoute,
	OrdersOrderIdRoute,
	AdminIndexRoute,
	OrdersIndexRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { useCart as a, api as c, S3_MEDIA as i, Route$3 as n, RainCanvas as o, useAdminAuth as r, useRain as s, router_exports as t };
