import pizza from "@/assets/pizza-muzzarella.jpg";
import lomito from "@/assets/lomito.jpg";
import pollo from "@/assets/pollo.jpg";
import papas from "@/assets/papas.jpg";
import bebida from "@/assets/bebida.jpg";

export type Category = {
  id: string;
  name: string;
  emoji: string;
  badge?: string;
};

export type Variant = { id: string; name: string; priceDelta: number };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  variants?: Variant[];
};

export const CATEGORIES: Category[] = [
  { id: "pizzas", name: "Pizzas", emoji: "🍕", badge: "Con borde: +Gs. 10.000" },
  { id: "hamburguesas", name: "Hamburguesas", emoji: "🍔" },
  { id: "lomito", name: "Sándwiches de Lomito", emoji: "🥩" },
  { id: "pollo", name: "Sándwiches de Pollo", emoji: "🍗" },
  { id: "arabes", name: "Lomitos Árabes", emoji: "🌯" },
  { id: "porciones", name: "Porciones", emoji: "🍟" },
  { id: "bebidas", name: "Bebidas", emoji: "🥤" },
];

// Pizzas: sin borde Gs. 50.000 · con borde Gs. 60.000
const pizzaVariants: Variant[] = [
  { id: "sin-borde", name: "Sin borde", priceDelta: 0 },
  { id: "con-borde", name: "Con borde", priceDelta: 10000 },
];

const pizza2 = (id: string, name: string, description: string): Product => ({
  id,
  name,
  description,
  price: 50000,
  image: pizza,
  category: "pizzas",
  variants: pizzaVariants,
});

export const PRODUCTS: Product[] = [
  // PIZZAS
  pizza2("pz-pollo", "Pollo Catupiry", "Salsa, mozzarella, orégano, pollo y choclo."),
  pizza2("pz-cala", "Calabresa", "Salsa, mozzarella, orégano, calabresa y aceitunas."),
  pizza2("pz-pepp", "Pepperoni", "Salsa, mozzarella, orégano y pepperoni."),
  pizza2("pz-napo", "Napolitana", "Salsa, mozzarella, orégano, jamón y tomate."),
  pizza2("pz-bacon", "Bacon", "Salsa, mozzarella, orégano, bacon y locote."),
  pizza2("pz-pica", "Picaña", "Salsa, mozzarella, orégano, picaña y cebolla."),
  pizza2("pz-port", "Portuguesa", "Salsa, mozzarella, orégano, huevo, cebolla, jamón, locote y tomate."),
  pizza2("pz-lomi", "Lomipizza", "Salsa, mozzarella, orégano, lomito, cebolla y locote."),

  // HAMBURGUESAS
  { id: "hb-normal", name: "Hamburguesa Normal", description: "Pan artesanal, medallón jugoso y vegetales frescos.", price: 16000, image: lomito, category: "hamburguesas" },
  { id: "hb-doble", name: "Hamburguesa Doble", description: "Doble medallón, doble sabor.", price: 25000, image: lomito, category: "hamburguesas" },
  { id: "hb-triple", name: "Burger Triple", description: "Triple carne para los más hambrientos.", price: 33000, image: lomito, category: "hamburguesas" },
  { id: "hb-ched", name: "Burger con Cheddar", description: "Cheddar derretido y medallón a la plancha.", price: 20000, image: lomito, category: "hamburguesas" },
  { id: "hb-ched2", name: "Burger con Cheddar Doble", description: "Doble medallón bañado en cheddar.", price: 30000, image: lomito, category: "hamburguesas" },

  // SÁNDWICHES DE LOMITO
  { id: "lm-simple", name: "Lomito Simple", description: "Jugoso lomito con vegetales frescos y salsa de la casa.", price: 28000, image: lomito, category: "lomito" },
  { id: "lm-doble", name: "Lomito Doble", description: "Doble porción de lomito para los más hambrientos.", price: 38000, image: lomito, category: "lomito" },
  { id: "lm-triple", name: "Lomito Triple", description: "Triple carne, todos los agregados.", price: 48000, image: lomito, category: "lomito" },

  // SÁNDWICHES DE POLLO
  { id: "po-simple", name: "Pollo Simple", description: "Filete de pollo a la plancha, vegetales y salsa especial en pan recién horneado.", price: 25000, image: pollo, category: "pollo" },
  { id: "po-doble", name: "Pollo Doble", description: "Doble filete de pollo, queso derretido y vegetales frescos.", price: 35000, image: pollo, category: "pollo" },

  // LOMITOS ÁRABES
  { id: "ar-carne", name: "Árabe de Carne", description: "Pan árabe, carne jugosa y vegetales frescos.", price: 28000, image: lomito, category: "arabes" },
  { id: "ar-carne2", name: "Árabe de Carne Doble", description: "Doble porción de carne en pan árabe.", price: 38000, image: lomito, category: "arabes" },
  { id: "ar-mixto", name: "Árabe Mixto", description: "Combinación de carne y pollo en pan árabe.", price: 30000, image: lomito, category: "arabes" },
  { id: "ar-mixto2", name: "Árabe Mixto Doble", description: "Doble mixto de carne y pollo.", price: 40000, image: lomito, category: "arabes" },
  { id: "ar-pollo", name: "Árabe de Pollo", description: "Filete de pollo en pan árabe con vegetales.", price: 25000, image: pollo, category: "arabes" },
  { id: "ar-pollo2", name: "Árabe de Pollo Doble", description: "Doble porción de pollo en pan árabe.", price: 35000, image: pollo, category: "arabes" },

  // PORCIONES
  { id: "pr-papas", name: "Papas Fritas (Regular)", description: "Doradas y crocantes, porción individual.", price: 15000, image: papas, category: "porciones" },
  { id: "pr-papas-g", name: "Papas Fritas (Grande)", description: "Porción grande para compartir.", price: 20000, image: papas, category: "porciones" },

  // BEBIDAS
  { id: "bb-coca", name: "Coca-Cola 600 ml", description: "Bien fría, para acompañar tu pedido.", price: 12000, image: bebida, category: "bebidas" },
  { id: "bb-agua", name: "Agua mineral", description: "Botella 500 ml.", price: 7000, image: bebida, category: "bebidas" },
  { id: "bb-jugo", name: "Jugo del día", description: "Consultá el sabor de hoy.", price: 10000, image: bebida, category: "bebidas" },
];

export const UPSELL_MAP: Record<string, string[]> = {
  pizzas: ["bb-coca", "pr-papas", "pr-papas-g"],
  hamburguesas: ["pr-papas", "bb-coca", "pr-papas-g"],
  lomito: ["pr-papas", "bb-coca", "pr-papas-g"],
  pollo: ["pr-papas", "bb-coca", "pr-papas-g"],
  arabes: ["pr-papas", "bb-coca"],
  porciones: ["bb-coca"],
  bebidas: [],
};

export const formatGs = (n: number) =>
  "Gs. " + n.toLocaleString("es-PY").replace(/,/g, ".");
