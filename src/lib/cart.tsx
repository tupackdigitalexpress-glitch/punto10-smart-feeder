import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product, type Variant } from "./menu";

export type CartLine = {
  key: string;
  productId: string;
  variantId?: string;
  qty: number;
};

type CartCtx = {
  lines: CartLine[];
  add: (p: Product, variant?: Variant, qty?: number) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  delivery: number;
  setDelivery: (n: number) => void;
  total: number;
  notes: string;
  setNotes: (s: string) => void;
  lastAdded: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

const lineKey = (pid: string, vid?: string) => (vid ? `${pid}::${vid}` : pid);

export function priceFor(pid: string, vid?: string): number {
  const p = PRODUCTS.find((x) => x.id === pid);
  if (!p) return 0;
  const v = vid ? p.variants?.find((x) => x.id === vid) : undefined;
  return p.price + (v?.priceDelta ?? 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [delivery, setDelivery] = useState(0);
  const [notes, setNotes] = useState("");
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const add: CartCtx["add"] = (p, variant, qty = 1) => {
    const key = lineKey(p.id, variant?.id);
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { key, productId: p.id, variantId: variant?.id, qty }];
    });
    setLastAdded(key + ":" + Date.now());
  };

  const inc = (key: string) =>
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)));
  const dec = (key: string) =>
    setLines((prev) =>
      prev.flatMap((l) => (l.key === key ? (l.qty <= 1 ? [] : [{ ...l, qty: l.qty - 1 }]) : [l])),
    );
  const remove = (key: string) => setLines((prev) => prev.filter((l) => l.key !== key));
  const clear = () => {
    setLines([]);
    setNotes("");
  };

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + priceFor(l.productId, l.variantId) * l.qty, 0),
    [lines],
  );

  return (
    <Ctx.Provider
      value={{
        lines,
        add,
        inc,
        dec,
        remove,
        clear,
        count: lines.reduce((s, l) => s + l.qty, 0),
        subtotal,
        delivery,
        setDelivery,
        total: subtotal + delivery,
        notes,
        setNotes,
        lastAdded,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart requires CartProvider");
  return c;
}

/* Order history in localStorage */
export type SavedOrder = {
  id: string;
  date: string;
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  total: number;
  method: string;
};

const HISTORY_KEY = "p10_history_v1";

export function useHistory() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setOrders(JSON.parse(raw));
    } catch {}
  }, []);
  const save = (o: SavedOrder) => {
    const next = [o, ...orders].slice(0, 10);
    setOrders(next);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
  };
  return { orders, save };
}
