import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CATEGORIES,
  PRODUCTS,
  UPSELL_MAP,
  formatGs,
  type Product,
  type Variant,
} from "@/lib/menu";
import {
  CartProvider,
  priceFor,
  useCart,
  useHistory,
  type CartLine,
  type SavedOrder,
} from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Punto 10 Pizza & Burguer — Pedí online" },
      { name: "description", content: "Asistente inteligente de pedidos. Elegí, sumá y enviá tu pedido por WhatsApp en menos de un minuto." },
      { property: "og:title", content: "Punto 10 Pizza & Burguer" },
      { property: "og:description", content: "Pizzas, lomitos y más. Pedí fácil por WhatsApp." },
      { name: "theme-color", content: "#8B0000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Punto 10" },
      { name: "mobile-web-app-capable", content: "yes" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" },
    ],
  }),
  component: () => (
    <CartProvider>
      <App />
    </CartProvider>
  ),
});

const WHATSAPP_NUMBER = "595986212416";

/* ---------------- helpers ---------------- */

function isOpenNow(now = new Date()): boolean {
  return now.getHours() >= 16;
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const t = useRef<number | null>(null);
  const show = (m: string) => {
    setMsg(m);
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setMsg(null), 1800);
  };
  return { msg, show };
}

/* ---------------- app root ---------------- */

function App() {
  const [screen, setScreen] = useState<"splash" | "menu" | "history">("splash");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { msg, show } = useToast();
  const cart = useCart();

  // Fly-cart animation trigger
  const [flyPulse, setFlyPulse] = useState(0);
  useEffect(() => {
    if (cart.lastAdded) {
      setFlyPulse((n) => n + 1);
      show("✓ Producto agregado");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.lastAdded]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {screen === "splash" && <Splash onStart={() => setScreen("menu")} />}
      {screen === "menu" && (
        <Menu
          onOpenCart={() => setCartOpen(true)}
          onOpenHistory={() => setScreen("history")}
        />
      )}
      {screen === "history" && <History onBack={() => setScreen("menu")} onOpenCart={() => setCartOpen(true)} />}

      {screen !== "splash" && (
        <FloatingCartButton onClick={() => setCartOpen(true)} count={cart.count} pulse={flyPulse} />
      )}

      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
          }}
        />
      )}
      {checkoutOpen && <Checkout onClose={() => setCheckoutOpen(false)} onSent={() => { setCheckoutOpen(false); }} />}

      <Toast msg={msg} />
    </div>
  );
}

/* ---------------- splash ---------------- */

function Splash({ onStart }: { onStart: () => void }) {
  const open = isOpenNow();
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-6 pt-16 pb-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, oklch(0.42 0.16 27 / 0.55), transparent 55%), radial-gradient(circle at 80% 90%, oklch(0.78 0.14 82 / 0.25), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-6 mt-8 animate-slide-up">
        <Logo size="lg" />
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Punto 10</h1>
          <p className="text-gold font-semibold text-lg mt-1">Pizza &amp; Burguer</p>
          <p className="text-muted-foreground mt-4 text-sm">Preparando lo mejor para vos</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
        <OpenBadge open={open} />
        <p className="text-center text-xs text-muted-foreground">
          Abierto desde las 16:00 Hs todos los días
        </p>
        <button
          onClick={onStart}
          className="btn-press w-full bg-primary text-primary-foreground font-bold text-lg py-5 rounded-2xl shadow-lg shadow-primary/30 active:shadow-md"
        >
          Ver menú
        </button>
      </div>
    </div>
  );
}

function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const s = size === "lg" ? "h-32 w-32" : "h-12 w-12";
  return (
    <img
      src="/logo.png"
      alt="Punto 10 Pizza & Burguer"
      className={`${s} rounded-2xl object-cover shadow-lg shadow-primary/40 border border-gold/30`}
    />
  );
}

function OpenBadge({ open }: { open: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-full py-2 px-4 text-sm font-semibold border ${
        open
          ? "bg-success/15 border-success/40 text-success"
          : "bg-danger/15 border-danger/40 text-danger"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${open ? "bg-success animate-pulse" : "bg-danger"}`} />
      {open ? "Abierto ahora — Estamos preparando pedidos" : "Cerrado — Abrimos a las 16:00 Hs"}
    </div>
  );
}

/* ---------------- menu ---------------- */

function Menu({ onOpenCart, onOpenHistory }: { onOpenCart: () => void; onOpenHistory: () => void }) {
  const [active, setActive] = useState<string>(CATEGORIES[0].id);
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const open = isOpenNow();

  const scrollTo = (id: string) => {
    setActive(id);
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive((visible.target as HTMLElement).dataset.cat!);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-3">
          <Logo />
          <button
            onClick={onOpenHistory}
            aria-label="Mis pedidos"
            className="btn-press h-11 w-11 rounded-full bg-muted flex items-center justify-center border border-border"
          >
            <span aria-hidden>🕘</span>
          </button>
        </div>
        <div className="px-4 pb-2">
          <OpenBadge open={open} />
        </div>
        <nav className="scroll-hide flex gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollTo(c.id)}
              className={`btn-press shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                active === c.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-foreground border-border"
              }`}
            >
              <span className="mr-1" aria-hidden>{c.emoji}</span>
              {c.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="px-4 pt-4 space-y-10">
        {CATEGORIES.map((cat) => (
          <section
            key={cat.id}
            data-cat={cat.id}
            ref={(el) => { refs.current[cat.id] = el; }}
            className="scroll-mt-40"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h2 className="text-2xl font-extrabold">
                <span className="mr-2" aria-hidden>{cat.emoji}</span>{cat.name}
              </h2>
              {cat.badge && <span className="gold-chip">{cat.badge}</span>}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {PRODUCTS.filter((p) => p.category === cat.id).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

/* ---------------- product card ---------------- */

function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | undefined>(product.variants?.[0]?.id);
  const variant = product.variants?.find((v) => v.id === variantId);
  const displayPrice = product.price + (variant?.priceDelta ?? 0);

  const [upsellOpen, setUpsellOpen] = useState(false);

  const onAdd = () => {
    add(product, variant, qty);
    setQty(1);
    if (UPSELL_MAP[product.category]?.length) setUpsellOpen(true);
  };

  return (
    <article className="card-elev rounded-2xl overflow-hidden animate-slide-up">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={640}
          height={400}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 right-3">
          <span className="gold-chip !text-base !py-1.5 !px-3">{formatGs(displayPrice)}</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        </div>

        {product.variants && (
          <div className="flex gap-2 flex-wrap">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`btn-press text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  variantId === v.id
                    ? "bg-gold text-gold-foreground border-gold"
                    : "bg-muted text-foreground border-border"
                }`}
              >
                {v.name}
                {v.priceDelta > 0 && <span className="ml-1 opacity-70">+{formatGs(v.priceDelta)}</span>}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <QtySelector value={qty} onChange={setQty} />
          <button
            onClick={onAdd}
            className="btn-press flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-md shadow-primary/30"
          >
            Agregar
          </button>
        </div>

        {upsellOpen && (
          <Upsell category={product.category} onClose={() => setUpsellOpen(false)} />
        )}
      </div>
    </article>
  );
}

function QtySelector({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-muted border border-border">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Restar"
        className="btn-press h-11 w-11 grid place-items-center font-bold text-lg"
      >−</button>
      <span className="w-6 text-center font-bold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label="Sumar"
        className="btn-press h-11 w-11 grid place-items-center font-bold text-lg"
      >+</button>
    </div>
  );
}

function Upsell({ category, onClose }: { category: string; onClose: () => void }) {
  const { add } = useCart();
  const items = UPSELL_MAP[category]
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  if (!items.length) return null;
  return (
    <div className="animate-slide-up mt-2 rounded-xl border border-gold/40 bg-gold/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-gold">Completa tu pedido con nuestros favoritos</p>
        <button onClick={onClose} className="btn-press text-xs text-muted-foreground px-2">✕</button>
      </div>
      <div className="scroll-hide flex gap-2 overflow-x-auto">
        {items.map((p) => (
          <button
            key={p.id}
            onClick={() => { add(p); onClose(); }}
            className="btn-press shrink-0 w-32 text-left rounded-lg bg-card border border-border overflow-hidden"
          >
            <img src={p.image} alt="" className="h-16 w-full object-cover" loading="lazy" />
            <div className="p-2">
              <p className="text-xs font-semibold truncate">{p.name}</p>
              <p className="text-[11px] text-gold font-bold mt-0.5">{formatGs(p.price)}</p>
              <div className="mt-1 text-[11px] font-bold text-primary-foreground bg-primary rounded-md py-1 text-center">
                Agregar
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- floating cart button ---------------- */

function FloatingCartButton({ onClick, count, pulse }: { onClick: () => void; count: number; pulse: number }) {
  return (
    <button
      onClick={onClick}
      aria-label="Abrir carrito"
      className="btn-press fixed bottom-5 right-5 z-40 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/40 grid place-items-center border-2 border-gold/40"
    >
      <span className="text-2xl" aria-hidden>🛒</span>
      {count > 0 && (
        <span
          key={pulse}
          className="animate-pop absolute -top-1 -right-1 min-w-6 h-6 px-1.5 rounded-full bg-gold text-gold-foreground text-xs font-extrabold grid place-items-center border-2 border-background"
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ---------------- cart drawer ---------------- */

function CartDrawer({ onClose, onCheckout }: { onClose: () => void; onCheckout: () => void }) {
  const { lines, inc, dec, remove, subtotal, delivery, setDelivery, total, notes, setNotes } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-slide-up bg-background rounded-t-3xl border-t border-border max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Tu carrito</h2>
          <button onClick={onClose} className="btn-press h-10 w-10 rounded-full bg-muted grid place-items-center" aria-label="Cerrar">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {lines.length === 0 && (
            <p className="text-center text-muted-foreground py-16">Tu carrito está vacío.<br />Sumá algo delicioso 🍕</p>
          )}
          {lines.map((l) => {
            const p = PRODUCTS.find((x) => x.id === l.productId)!;
            const v = l.variantId ? p.variants?.find((x) => x.id === l.variantId) : undefined;
            const unit = priceFor(l.productId, l.variantId);
            return (
              <div key={l.key} className="card-elev rounded-xl p-3 flex gap-3">
                <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{p.name}</p>
                  {v && <p className="text-xs text-gold font-semibold">{v.name}</p>}
                  <p className="text-xs text-muted-foreground">{formatGs(unit)} c/u</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-muted border border-border rounded-lg">
                      <button onClick={() => dec(l.key)} className="btn-press h-9 w-9 grid place-items-center font-bold">−</button>
                      <span className="w-6 text-center font-bold text-sm">{l.qty}</span>
                      <button onClick={() => inc(l.key)} className="btn-press h-9 w-9 grid place-items-center font-bold">+</button>
                    </div>
                    <p className="font-extrabold text-gold">{formatGs(unit * l.qty)}</p>
                  </div>
                </div>
                <button onClick={() => remove(l.key)} aria-label="Eliminar" className="btn-press text-muted-foreground self-start px-1">🗑</button>
              </div>
            );
          })}

          {lines.length > 0 && (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Notas o aclaraciones</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej.: Sin cebolla, extra salsa, tocar timbre, etc."
                  rows={2}
                  className="w-full rounded-lg bg-muted border border-border p-2 text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Costo de delivery (Gs.)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={delivery}
                  onChange={(e) => setDelivery(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full rounded-lg bg-muted border border-border p-2 text-sm"
                />
              </div>
            </>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border p-4 space-y-2 bg-card/50">
            <Row label="Subtotal" value={formatGs(subtotal)} />
            <Row label="Delivery" value={formatGs(delivery)} />
            <Row label="Total" value={formatGs(total)} big />
            <button
              onClick={onCheckout}
              className="btn-press w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 mt-2"
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className={`flex justify-between ${big ? "text-lg font-extrabold" : "text-sm"}`}>
      <span className={big ? "" : "text-muted-foreground"}>{label}</span>
      <span className={big ? "text-gold" : "font-semibold"}>{value}</span>
    </div>
  );
}

/* ---------------- checkout ---------------- */

type PayMethod = "efectivo" | "tarjeta" | "qr" | "confirmar";
const PAY_LABELS: Record<PayMethod, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  qr: "QR",
  confirmar: "A confirmar",
};
const PAY_ICONS: Record<PayMethod, string> = {
  efectivo: "💵",
  tarjeta: "💳",
  qr: "📱",
  confirmar: "❓",
};

function Checkout({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const cart = useCart();
  const { save } = useHistory();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pay, setPay] = useState<PayMethod>("efectivo");
  const [geo, setGeo] = useState<string | null>(null);
  const [geoErr, setGeoErr] = useState<string | null>(null);
  const [confirmClosed, setConfirmClosed] = useState<null | "ask">(null);
  const open = isOpenNow();

  const shareLocation = () => {
    setGeoErr(null);
    if (!("geolocation" in navigator)) {
      setGeoErr("Tu navegador no soporta ubicación.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo(`https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`),
      () => setGeoErr("No pudimos obtener tu ubicación."),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const buildMessage = () => {
    const linesTxt = cart.lines
      .map((l) => {
        const p = PRODUCTS.find((x) => x.id === l.productId)!;
        const v = l.variantId ? p.variants?.find((x) => x.id === l.variantId) : undefined;
        const label = v ? `${p.name} (${v.name})` : p.name;
        const sub = priceFor(l.productId, l.variantId) * l.qty;
        return `${label} x ${l.qty} - ${formatGs(sub)}`;
      })
      .join("\n");
    return (
`Nuevo pedido - Punto 10 Pizza & Burguer

Nombre:
${name || "-"}

Pedido:
${linesTxt}

--------------------------------
Subtotal:
${formatGs(cart.subtotal)}

Delivery:
${formatGs(cart.delivery)}

Total:
${formatGs(cart.total)}

Método de pago:
${PAY_LABELS[pay]}

Dirección:
${address || "-"}

Ubicación:
${geo || "-"}

Nota:
${cart.notes || "-"}`
    );
  };

  const send = () => {
    if (!open && confirmClosed !== "ask") {
      setConfirmClosed("ask");
      return;
    }
    const msg = buildMessage();
    const order: SavedOrder = {
      id: String(Date.now()),
      date: new Date().toISOString(),
      lines: cart.lines,
      subtotal: cart.subtotal,
      delivery: cart.delivery,
      total: cart.total,
      method: PAY_LABELS[pay],
    };
    save(order);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    cart.clear();
    onSent();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto animate-slide-up">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} aria-label="Volver" className="btn-press h-10 w-10 rounded-full bg-muted grid place-items-center">←</button>
        <h2 className="text-lg font-extrabold">Revisá tu pedido</h2>
      </header>

      <div className="p-4 pb-32 space-y-5">
        {!open && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm">
            🔴 Actualmente el local se encuentra cerrado. Tu pedido será recibido cuando volvamos a abrir a las 16:00 Hs.
          </div>
        )}

        <Field label="Nombre">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="input" />
        </Field>

        <Field label="Dirección de entrega">
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, referencia" className="input" />
        </Field>

        <div>
          <button onClick={shareLocation} className="btn-press w-full bg-muted border border-border rounded-xl py-3 font-semibold flex items-center justify-center gap-2">
            📍 {geo ? "Ubicación compartida ✓" : "Compartir mi ubicación"}
          </button>
          {geo && <p className="text-xs text-success mt-1 break-all">{geo}</p>}
          {geoErr && <p className="text-xs text-danger mt-1">{geoErr}</p>}
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">Método de pago</p>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PAY_LABELS) as PayMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setPay(m)}
                className={`btn-press rounded-xl py-3 px-3 border font-semibold flex items-center gap-2 ${
                  pay === m ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border"
                }`}
              >
                <span aria-hidden>{PAY_ICONS[m]}</span> {PAY_LABELS[m]}
              </button>
            ))}
          </div>
        </div>

        <Field label="Notas">
          <textarea value={cart.notes} onChange={(e) => cart.setNotes(e.target.value)} rows={2} className="input resize-none" placeholder="Aclaraciones del pedido" />
        </Field>

        <div className="card-elev rounded-2xl p-4">
          <p className="font-bold mb-2">Productos</p>
          <ul className="space-y-1 text-sm">
            {cart.lines.map((l) => {
              const p = PRODUCTS.find((x) => x.id === l.productId)!;
              const v = l.variantId ? p.variants?.find((x) => x.id === l.variantId) : undefined;
              const sub = priceFor(l.productId, l.variantId) * l.qty;
              return (
                <li key={l.key} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">{p.name}{v ? ` (${v.name})` : ""} × {l.qty}</span>
                  <span className="font-semibold">{formatGs(sub)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            <Row label="Subtotal" value={formatGs(cart.subtotal)} />
            <Row label="Delivery" value={formatGs(cart.delivery)} />
            <Row label="Total" value={formatGs(cart.total)} big />
          </div>
        </div>

        {confirmClosed === "ask" && (
          <div className="rounded-xl border border-gold/40 bg-gold/10 p-4 space-y-3">
            <p className="text-sm">El local está cerrado. ¿Enviar tu pedido igualmente?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmClosed(null)} className="btn-press flex-1 py-3 rounded-xl bg-muted border border-border font-semibold">Volver</button>
              <button onClick={send} className="btn-press flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold">Enviar igualmente</button>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border">
        <button
          onClick={send}
          disabled={cart.lines.length === 0}
          className="btn-press w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/40 disabled:opacity-50"
        >
          Confirmar y enviar pedido
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground block mb-1">{label}</span>
      {children}
    </label>
  );
}

/* ---------------- history ---------------- */

function History({ onBack, onOpenCart }: { onBack: () => void; onOpenCart: () => void }) {
  const { orders } = useHistory();
  const { add } = useCart();
  const repeat = (o: SavedOrder) => {
    o.lines.forEach((l: CartLine) => {
      const p = PRODUCTS.find((x) => x.id === l.productId);
      if (!p) return;
      const v: Variant | undefined = l.variantId ? p.variants?.find((x) => x.id === l.variantId) : undefined;
      add(p, v, l.qty);
    });
    onOpenCart();
  };
  return (
    <div className="pb-32">
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="btn-press h-10 w-10 rounded-full bg-muted grid place-items-center" aria-label="Volver">←</button>
        <h2 className="text-lg font-extrabold">Mis últimos pedidos</h2>
      </header>
      <div className="p-4 space-y-3">
        {orders.length === 0 && <p className="text-center text-muted-foreground py-16">Todavía no tenés pedidos guardados.</p>}
        {orders.map((o) => {
          const d = new Date(o.date);
          return (
            <div key={o.id} className="card-elev rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">{d.toLocaleDateString("es-PY")} · {d.toLocaleTimeString("es-PY", { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="font-bold mt-0.5">{o.method}</p>
                </div>
                <p className="text-gold font-extrabold">{formatGs(o.total)}</p>
              </div>
              <ul className="mt-2 text-sm text-muted-foreground space-y-0.5">
                {o.lines.map((l) => {
                  const p = PRODUCTS.find((x) => x.id === l.productId);
                  return <li key={l.key}>{p?.name ?? "Producto"} × {l.qty}</li>;
                })}
              </ul>
              <button onClick={() => repeat(o)} className="btn-press mt-3 w-full bg-gold text-gold-foreground font-bold py-3 rounded-xl">
                🔁 Repetir pedido
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- toast ---------------- */

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-pop bg-success text-background font-bold px-4 py-2.5 rounded-full shadow-xl text-sm">
      {msg}
    </div>
  );
}
