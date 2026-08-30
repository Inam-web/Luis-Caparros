import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ALL_PRODUCTS, SHOP, formatPrice } from "../data/books";
import { getLang, tr } from "../i18n";

const Ctx = createContext(null);

const CART_KEY = "lc-cart-v1";
const ORDER_KEY = "lc-last-order-v1";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const [lines, setLines] = useState(() => load(CART_KEY, []));
  const [isOpen, setOpen] = useState(false);
  const [lastOrder, setLastOrderState] = useState(() => load(ORDER_KEY, null));
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable */
    }
  }, [lines]);

  const pushToast = useCallback((msg, kind = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback(
    (p, qty = 1, silent = false) => {
      setLines((prev) => {
        const found = prev.find((l) => l.id === p.id);
        if (found) {
          return prev.map((l) =>
            l.id === p.id ? { ...l, qty: Math.min(l.qty + qty, p.stock) } : l
          );
        }
        return [...prev, { id: p.id, qty: Math.min(qty, p.stock) }];
      });
      if (!silent) pushToast(tr("cart.added", getLang(), { title: p.title }));
    },
    [pushToast]
  );

  const setQty = useCallback((id, qty) => {
    const product = ALL_PRODUCTS.find((p) => p.id === id);
    const max = product?.stock ?? 99;
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, max) } : l))
    );
  }, []);

  const removeLine = useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const productOf = useCallback((id) => ALL_PRODUCTS.find((p) => p.id === id), []);

  const subtotal = useMemo(
    () =>
      lines.reduce((acc, l) => {
        const p = ALL_PRODUCTS.find((x) => x.id === l.id);
        return acc + (p ? p.price * l.qty : 0);
      }, 0),
    [lines]
  );

  const count = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);

  const shipping =
    lines.length === 0 ? 0 : subtotal >= SHOP.freeShippingThreshold ? 0 : SHOP.flatShipping;
  const total = subtotal + shipping;

  const setLastOrder = useCallback((o) => {
    setLastOrderState(o);
    try {
      if (o) localStorage.setItem(ORDER_KEY, JSON.stringify(o));
      else localStorage.removeItem(ORDER_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const placeOrder = useCallback(
    (customer, payment) =>
      new Promise((resolve) => {
        window.setTimeout(() => {
          const order = {
            number: "LC-" + String(Date.now()).slice(-6),
            date: new Date().toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            lines: lines.map((l) => {
              const p = ALL_PRODUCTS.find((x) => x.id === l.id);
              return { title: p?.title ?? l.id, qty: l.qty, price: (p?.price ?? 0) * l.qty };
            }),
            total,
            customer,
            payment,
          };
          setLastOrder(order);
          clearCart();
          resolve(order);
        }, 1400);
      }),
    [lines, total, clearCart, setLastOrder]
  );

  const value = {
    lines,
    count,
    subtotal,
    shipping,
    total,
    isOpen,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    addToCart,
    setQty,
    removeLine,
    clearCart,
    productOf,
    placeOrder,
    lastOrder,
    setLastOrder,
    toasts,
    pushToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export { formatPrice };