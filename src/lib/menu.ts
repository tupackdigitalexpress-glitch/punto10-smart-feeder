import lomito from "@/assets/lomito.jpg";
import sandwichLomito from "@/assets/sandwich-lomito.jpg";
import pollo from "@/assets/pollo.jpg";
import papas from "@/assets/papas.jpg";
import aguaMineral from "@/assets/agua mineral.jpg";
import cocaCola250ml from "@/assets/coca-cola-250ml.webp";
import cocaCola500ml from "@/assets/coca-cola-500ml.webp";
import cocaCola600ml from "@/assets/coca-cola-600ml.webp";
import cocaCola1l from "@/assets/coca-cola-1l.webp";
import cocaCola15l from "@/assets/coca-cola-1-5l.webp";
import cocaCola2l from "@/assets/coca-cola-2l.webp";
import cocaColaLata from "@/assets/coca-cola-lata.webp";

// Burger images
import burgerGuarani from "@/assets/guarani-gold-doble.png";
import burgerNanduti from "@/assets/nanduti-black-triple.png";
import burgerAcaray from "@/assets/acaray-prime-completa.png";

// Pizza images
import pizzaPolloCatupiry from "@/assets/calabreza-catupiry.jpg";
import pizzaCalabresa from "@/assets/calabreza.png";
import pizzaPepperoni from "@/assets/pepperoni.png";
import pizzaNapolitana from "@/assets/napolitana-pepperoni.png";
import pizzaBacon from "@/assets/catupiry-pepperoni.png";
import pizzaPicana from "@/assets/picaña-catupiry.png";
import pizzaPortuguesa from "@/assets/catupiry-portuguesa.png";
import pizzaLomipizza from "@/assets/picaña-portuguesa.png";
import pizzaCuatroQuesoCalabresa from "@/assets/cuatro queso-calabreza.png";
import pizzaCuatroQuesoPepperoni from "@/assets/cuatro queso-pepperoni.png";
import pizzaLomipizzaSpecial from "@/assets/lomipizza.jpg";
import pizzaFamiliar from "@/assets/pizza-familiar.webp";

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
  badge?: string;
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

const pizza2 = (id: string, name: string, description: string, image: string): Product => ({
  id,
  name,
  description,
  price: 50000,
  image,
  category: "pizzas",
  variants: pizzaVariants,
});

export const PRODUCTS: Product[] = [
  // PIZZAS
  pizza2("pz-pollo", "Catupiry+Calabresa", "Salsa, mozzarella, orégano, catupiry, calabresa y aceitunas.", pizzaPolloCatupiry),
  pizza2("pz-cala", "Calabresa", "Salsa, mozzarella, orégano, calabresa y aceitunas.", pizzaCalabresa),
  pizza2("pz-pepp", "Pepperoni", "Salsa, mozzarella, orégano y pepperoni.", pizzaPepperoni),
  pizza2("pz-napo", "Napolitana+Pepperoni", "Salsa, mozzarella, orégano, jamón, tomate y pepperoni.", pizzaNapolitana),
  pizza2("pz-bacon", "Catupiry+Pepperoni", "Salsa, mozzarella, orégano, catupiry y pepperoni.", pizzaBacon),
  pizza2("pz-pica", "Picaña+Catupiry", "Salsa, mozzarella, orégano, picaña, cebolla y catupiry.", pizzaPicana),
  pizza2("pz-port", "Portuguesa+Catupiry", "Salsa, mozzarella, orégano, huevo, cebolla, jamón, locote, tomate y catupiry.", pizzaPortuguesa),
  pizza2("pz-lomi", "Picaña+Portuguesa", "Salsa, mozzarella, orégano, picaña, cebolla, huevo, jamón y locote.", pizzaLomipizza),
  pizza2("pz-4q-cala", "Cuatro Queso Calabresa", "Salsa, mozzarella, orégano, calabresa y cuatro quesos.", pizzaCuatroQuesoCalabresa),
  pizza2("pz-4q-pepp", "Cuatro Queso Pepperoni", "Salsa, mozzarella, orégano, pepperoni y cuatro quesos.", pizzaCuatroQuesoPepperoni),
  { id: "pz-lomipizza", name: "Lomipizza", description: "Salsa, mozzarella, lomito, lechuga, tomate, huevo y cebolla.", price: 110000, image: pizzaLomipizzaSpecial, category: "pizzas" },
  { id: "pz-familia", name: "Pizza Familiar", description: "12 porciones.", price: 85000, image: pizzaFamiliar, category: "pizzas", badge: "Nueva" },

  // HAMBURGUESAS
  { id: "hb-acaray", name: "Hamburguesa Normal", description: "Hamburguesa clásica.", price: 16000, image: burgerAcaray, category: "hamburguesas" },
  { id: "hb-guarani", name: "Hamburguesa Doble", description: "Hamburguesa con doble carne.", price: 25000, image: burgerGuarani, category: "hamburguesas" },
  { id: "hb-nanduti", name: "Burger Triple", description: "Hamburguesa triple carne.", price: 33000, image: burgerNanduti, category: "hamburguesas" },
  { id: "hb-cheddar", name: "Burger con Cheddar", description: "Hamburguesa con cheddar.", price: 20000, image: burgerAcaray, category: "hamburguesas" },
  { id: "hb-cheddar-doble", name: "Burger con Cheddar Doble", description: "Hamburguesa doble con cheddar.", price: 30000, image: burgerGuarani, category: "hamburguesas" },

  // SÁNDWICHES DE LOMITO
  { id: "lm-simple", name: "Lomito Simple", description: "Jugoso lomito con vegetales frescos y salsa de la casa.", price: 28000, image: sandwichLomito, category: "lomito" },
  { id: "lm-doble", name: "Lomito Doble", description: "Doble porción de lomito para los más hambrientos.", price: 38000, image: sandwichLomito, category: "lomito" },
  { id: "lm-triple", name: "Lomito Triple", description: "Triple carne, todos los agregados.", price: 48000, image: sandwichLomito, category: "lomito" },

  // SÁNDWICHES DE POLLO
  { id: "po-simple", name: "Pollo Simple", description: "Filete de pollo a la plancha, vegetales y salsa especial en pan recién horneado.", price: 25000, image: pollo, category: "pollo" },
  { id: "po-doble", name: "Pollo Doble", description: "Doble filete de pollo, queso derretido y vegetales frescos.", price: 35000, image: pollo, category: "pollo" },

  // LOMITOS ÁRABES
  { id: "ar-carne", name: "Árabe de Carne", description: "Pan árabe, carne jugosa y vegetales frescos.", price: 28000, image: lomito, category: "arabes" },
  { id: "ar-carne2", name: "Árabe de Carne Doble", description: "Doble porción de carne en pan árabe.", price: 38000, image: lomito, category: "arabes" },
  { id: "ar-mixto", name: "Árabe Mixto", description: "Combinación de carne y pollo en pan árabe.", price: 30000, image: lomito, category: "arabes" },
  { id: "ar-mixto2", name: "Árabe Mixto Doble", description: "Doble mixto de carne y pollo.", price: 40000, image: lomito, category: "arabes" },
  { id: "ar-pollo", name: "Árabe de Pollo", description: "Filete de pollo en pan árabe con vegetales.", price: 25000, image: lomito, category: "arabes" },
  { id: "ar-pollo2", name: "Árabe de Pollo Doble", description: "Doble porción de pollo en pan árabe.", price: 35000, image: lomito, category: "arabes" },

  // PORCIONES
  { id: "pr-papas", name: "Papas Fritas (Regular)", description: "Doradas y crocantes, porción individual.", price: 15000, image: papas, category: "porciones" },
  { id: "pr-papas-g", name: "Papas Fritas (Grande)", description: "Porción grande para compartir.", price: 20000, image: papas, category: "porciones" },

  // BEBIDAS
  { id: "bb-coca-250", name: "Coca-Cola 250 ml", description: "Bien fría, para acompañar tu pedido.", price: 5000, image: cocaCola250ml, category: "bebidas" },
  { id: "bb-coca-500", name: "Coca-Cola 500 ml", description: "Bien fría, para acompañar tu pedido.", price: 8000, image: cocaCola500ml, category: "bebidas" },
  { id: "bb-coca-lata", name: "Coca-Cola Lata", description: "Bien fría, para acompañar tu pedido.", price: 8000, image: cocaColaLata, category: "bebidas" },
  { id: "bb-coca-600", name: "Coca-Cola 600 ml", description: "Bien fría, para acompañar tu pedido.", price: 12000, image: cocaCola600ml, category: "bebidas" },
  { id: "bb-coca-1l", name: "Coca-Cola 1 Litro", description: "Bien fría, para acompañar tu pedido.", price: 10000, image: cocaCola1l, category: "bebidas" },
  { id: "bb-coca-1.5l", name: "Coca-Cola 1,5 Litros", description: "Bien fría, para acompañar tu pedido.", price: 13000, image: cocaCola15l, category: "bebidas" },
  { id: "bb-coca-2l", name: "Coca-Cola 2 Litros", description: "Bien fría, para acompañar tu pedido.", price: 16000, image: cocaCola2l, category: "bebidas" },
  { id: "bb-agua", name: "Agua mineral", description: "Botella 500 ml.", price: 7000, image: aguaMineral, category: "bebidas" },
];

export const UPSELL_MAP: Record<string, string[]> = {
  pizzas: ["bb-coca-500", "pr-papas", "pr-papas-g"],
  hamburguesas: ["pr-papas", "bb-coca-500", "pr-papas-g"],
  lomito: ["pr-papas", "bb-coca-500", "pr-papas-g"],
  pollo: ["pr-papas", "bb-coca-500", "pr-papas-g"],
  arabes: ["pr-papas", "bb-coca-500"],
  porciones: ["bb-coca-500"],
  bebidas: [],
};

export const formatGs = (n: number) =>
  "Gs. " + n.toLocaleString("es-PY").replace(/,/g, ".");
