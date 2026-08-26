# LUXXO - Catálogo Mayorista Multi-País

Bienvenido al código fuente del catálogo mayorista de LUXXO. Esta aplicación está construida sobre **Next.js 15**, React, y Tailwind CSS. Utiliza un sistema dinámico de rutas que le permite escalar fácilmente a múltiples países y lee automáticamente tus productos basado únicamente en carpetas y archivos locales (sin necesidad de bases de datos complejas).

---

## Estructura Principal del Proyecto

El código está limpio y organizado en el directorio `src/`. Aquí te dejo un resumen rápido para que nunca te pierdas:

### 📂 RUTAS (El esqueleto de la aplicación)
- **`src/app/page.tsx`**: La puerta principal (Landing Page). Aquí es donde el usuario selecciona su país (Ej: Colombia vs Ecuador).
- **`src/app/[country]/page.tsx`**: El menú inicial del catálogo por país. Lee las categorías grandes (Hombre, Mujer, Combos) y las muestra en recuadros estilo vidrio.
- **`src/app/[country]/[...slug]/page.tsx`**: La página individual de cada producto. Toma el nombre de las carpetas y construye toda la ficha técnica (fotos, descripción).

### 🧩 COMPONENTES & LÓGICA
- **`src/components/`**: Pequeñas piezas reutilizables de la aplicación.
  - `CartDrawer.tsx`: La ventana emergente lateral del carrito (crea el PDF interactivo de compra).
  - `CartIcon.tsx`: El botón esférico flotante del carrito con sus animaciones "pop".
  - `GlobalTierSelector.tsx`: La caja que contiene la matemática de los descuentos (-30%, -40%, etc). Cambia todo globalmente.
  - `layout/TopNav.tsx`: La barra superior de navegación y el menú de hamburguesa dinámico.
- **`src/context/CartContext.tsx`**: El "cerebro" o la memoria del carrito. Aquí se guarda la información cruda de cuánto has agregado, el gran total de tus ahorros y tu estado general.
- **`src/config/countries.ts`**: Aquí puedes apagar o prender diferentes naciones (`active: true / false`), y definir monedas oficiales.
- **`src/lib/catalog.ts`**: El "explorador de Windows" interno. Este código escanea la carpeta `public/images` buscando cada foto y `metadata.json` para cargarlos a la web.

---

## ¿Cómo Modificar Precios y Productos?

El aspecto más brillante de la aplicación es que **no requieres programar para añadir colecciones**. Todo funciona escaneando tus archivos en la carpeta `public/images/`.

### 1. Añadir Productos y Fotos
1. Ve a `public/images/` y crea una carpeta exactamente como quieres que se llame el producto.
2. Suelta tus imágenes `.jpg`, `.png` o `.webp` dentro de esa carpeta de producto. ¡El código las leerá solas!
3. Crea un archivo llamado `metadata.json` en esa misma carpeta para colocar el precio.

### 2. Estructura Exacta del Precio (`metadata.json`)
El sistema está construido para manejar **Únicamente Precios al Detal Base**. Los números deben ser introducidos enteramente, sin decimales ni símbolos. (Es decir, cien mil pesos se escribe `100000`).

**Ejemplo 1: Un solo artículo**
```json
{
    "originalPrice": 114000,
    "isFreeShipping": true,
    "material": "Oro Laminado 18K"
}
```

**Ejemplo 2: Artículo con diferentes tamaños y variantes de dinero**
```json
{
    "originalPrice": 114000,
    "isFreeShipping": true,
    "material": "Oro Laminado 18K",
    "variants": [
        {
            "label": "3mm/60cm",
            "price": 80000
        },
        {
            "label": "6mm/65cm",
            "price": 114000
        }
    ]
}
```

### 🚨 ¡Aclaración Importante sobre los Descuentos!
No intentes forzar o programar los precios promocionales o precios con descuentos (Ej: tratar de agregar `"salePrice"` manual) dentro del `metadata.json`. 

El código del proyecto es capaz de **hacer el trabajo por sí mismo**. Todas tus compras escalables para categorías "Emprendedor, Elite, Mayorista", aplican automáticamente un factor matemático sobre `originalPrice` cada vez que el usuario selecciona una opción en el menú simulador visual de la plataforma. Tu único trabajo es mantener `originalPrice` exacto según lo que pretendes vender al detal.
