# 📱 Checklist de QA - Responsive Design

## 🎯 Dispositivos de Prueba

### iPhone (Mobile)
- [ ] **iPhone SE (320px)** - Pantalla más pequeña
- [ ] **iPhone 12/13 (375px)** - Estándar actual
- [ ] **iPhone 14/15 Pro Max (430px)** - Pantalla grande

### iPad (Tablet)
- [ ] **iPad Mini (768px portrait)** - Tablet pequeña
- [ ] **iPad Air (820px portrait, 1180px landscape)** - Tablet mediana
- [ ] **iPad Pro (1024px portrait, 1366px landscape)** - Tablet grande

### Desktop
- [ ] **Laptop pequeña (1280px)** - MacBook Air
- [ ] **Desktop estándar (1920px)** - Monitor full HD

---

## ✅ Checklist General (Todas las Páginas)

### Navegación
- [ ] Bottom nav bar visible solo en mobile (<768px)
- [ ] Bottom nav bar con 6 temas principales
- [ ] Top menu bar con hamburger en mobile
- [ ] Sidebar como drawer off-canvas en mobile
- [ ] Drawer se cierra al hacer clic fuera (overlay)
- [ ] Drawer se cierra al seleccionar un sub-tema
- [ ] Breadcrumbs ocultos en mobile
- [ ] Touch targets ≥ 44x44px en todos los botones

### Layout
- [ ] ❌ **NO hay scroll horizontal** en ningún viewport
- [ ] Padding reducido en mobile (16px vs 24px)
- [ ] Spacing entre elementos apropiado
- [ ] Content visible sin hacer zoom
- [ ] Safe area insets respetados (iPhone notch)

### Tipografía
- [ ] Headings escalados para mobile (40px → 28px H1)
- [ ] Body text legible (≥ 14px en mobile)
- [ ] Inputs con font-size ≥ 16px (previene zoom iOS)
- [ ] Line-height apropiado para lectura

---

## 📄 Checklist por Página

### 1. MarketplacePage (`/trading/marketplace`)
- [ ] Grid de bots: 1 columna mobile → 2 tablet → auto-fill desktop
- [ ] Cards de bots no overflow
- [ ] Botones "Comprar" tocables (≥44px)
- [ ] Precio visible y legible
- [ ] Descripción no cortada
- [ ] Loading state visible
- [ ] Empty state centrado

**Breakpoints críticos:**
- 320px: 1 columna, gap reducido
- 768px: 2 columnas
- 1024px: 3-4 columnas auto-fill

### 2. MyBotsPage (`/trading/my-bots`)
- [ ] Grid de bots: 1 columna mobile → 2 tablet → auto-fill desktop
- [ ] Page header apilado verticalmente en mobile
- [ ] Bot info: 2 columnas → 1 columna en <480px
- [ ] Bot actions: botones apilados verticalmente en <480px
- [ ] Badges de estado visibles
- [ ] Botones de acción tocables

**Breakpoints críticos:**
- 320px: Todo apilado verticalmente
- 480px: Bot info en 2 columnas
- 768px: Grid de 2 columnas
- 1024px: Grid auto-fill

### 3. OrdersView (`/sales/orders`)
- [ ] Tabla → Cards en mobile (<768px)
- [ ] Primera celda como header destacado (ID)
- [ ] Labels visibles en cada celda (data-label)
- [ ] Badges de estado: Completado, Pendiente, Procesando
- [ ] Botones Ver/Editar tocables
- [ ] Scroll vertical suave en cards
- [ ] Desktop: tabla tradicional funcional

**Elementos críticos:**
- [ ] `data-label` en todos los `<td>`
- [ ] `.table-responsive` wrapper
- [ ] `.table-status` con clases de estado
- [ ] `.table-actions` para botones

### 4. ClientsView (`/sales/clients`)
- [ ] Tabla → Cards en mobile
- [ ] Nombre destacado como header
- [ ] Email legible (no overflow)
- [ ] Badge de órdenes visible
- [ ] Botones de acción responsive

### 5. ProductsView (`/inventory/products`)
- [ ] Tabla → Cards en mobile
- [ ] Producto destacado como header
- [ ] SKU visible
- [ ] Badge de stock con colores (warning <20, success ≥20)
- [ ] Precio formateado correctamente
- [ ] Botones de acción responsive

---

## 🎨 Componentes Nuevos a Probar

### Forms (`.form-responsive`)
- [ ] Inputs full-width en mobile
- [ ] Font-size ≥ 16px (NO zoom en iOS)
- [ ] Labels visibles arriba del input
- [ ] Error messages visibles
- [ ] Required indicator (*) visible
- [ ] Form rows apilados verticalmente en mobile
- [ ] Form actions (botones) full-width en mobile
- [ ] Focus states visibles
- [ ] Checkboxes/radios con touch targets 24x24px

**Test específico iOS:**
1. Abrir Safari en iPhone
2. Tocar input de texto
3. Verificar que NO hace zoom automático
4. Si hace zoom = font-size < 16px (BUG)

### Modales (`.modal`)
- [ ] Full-screen en mobile (<768px)
- [ ] Centrado con max-width en desktop
- [ ] Header sticky en mobile
- [ ] Footer sticky en mobile
- [ ] Close button (X) tocable (44x44px)
- [ ] Animación suave (slide up)
- [ ] Backdrop blur visible
- [ ] Body scrolleable
- [ ] Botones footer full-width en mobile

**Variante Bottom Sheet:**
- [ ] Aparece desde abajo en mobile
- [ ] Drag handle visible arriba
- [ ] Max-height 90vh
- [ ] Backdrop funcional

### Tablas (`.table-responsive`)
**Desktop (≥768px):**
- [ ] Tabla tradicional con headers
- [ ] Hover states en filas
- [ ] Borders visibles
- [ ] Spacing apropiado

**Mobile (<768px):**
- [ ] Convertido a cards
- [ ] Headers ocultos
- [ ] Labels antes de cada valor (data-label)
- [ ] Primera celda como header card
- [ ] Gap entre cards (16px)
- [ ] Shadow en cards
- [ ] Botones de acción responsive

---

## 🔍 Tests de Estrés

### Overflow Tests
1. **Texto largo:**
   - [ ] Título de 100 caracteres no rompe layout
   - [ ] Email largo (50+ chars) se trunca o wrappea
   - [ ] Descripción de 500 palabras scrolleable

2. **Números grandes:**
   - [ ] Precio $999,999.99 visible completo
   - [ ] Stock de 5 dígitos (99999) no overflow

3. **Grids con muchos items:**
   - [ ] 50 cards en marketplace no rompen
   - [ ] 100 filas en tabla mobile scrolleable

### Touch Target Tests
- [ ] Medir botones pequeños: Chrome DevTools → Inspect → Width/Height
- [ ] Todos los botones ≥ 44x44px
- [ ] Checkboxes/radios ≥ 24x24px
- [ ] Links en texto ≥ 44px de altura (line-height)

### Performance Tests
- [ ] Scroll suave en listas largas
- [ ] Animaciones a 60fps (no lag)
- [ ] Imágenes optimizadas (WebP)
- [ ] CSS bundle ≤ 15kB gzipped
- [ ] JS bundle ≤ 120kB gzipped

---

## 🐛 Bugs Comunes a Revisar

### Layout
- [ ] Scroll horizontal aparece al rotar iPad
- [ ] Keyboard en iOS cubre inputs (usar `scrollIntoView`)
- [ ] Bottom nav bar oculta content (padding-bottom: 64px)
- [ ] Sidebar no cierra en desktop resize

### Typography
- [ ] iOS hace zoom en inputs (font-size < 16px)
- [ ] Headings cortados en 2 líneas en mobile
- [ ] Text overflow sin ellipsis
- [ ] Line-height muy apretado (< 1.2)

### Forms
- [ ] Select dropdown cortado en mobile
- [ ] Datepicker fuera de viewport
- [ ] Validation errors ocultos bajo keyboard
- [ ] Submit button inaccesible

### Tables
- [ ] Headers no alineados con columnas
- [ ] Scroll horizontal en tabla (usar table-responsive)
- [ ] Data-label faltantes
- [ ] Botones muy pequeños (<44px)

### Modales
- [ ] No scrolleable cuando content largo
- [ ] Close button fuera de viewport
- [ ] Footer oculto bajo keyboard
- [ ] Backdrop no cierra modal

---

## 📊 Métricas de Éxito

### Core Web Vitals
- [ ] **LCP (Largest Contentful Paint)** < 2.5s
- [ ] **FID (First Input Delay)** < 100ms
- [ ] **CLS (Cumulative Layout Shift)** < 0.1

### Lighthouse Scores (Mobile)
- [ ] **Performance** ≥ 90
- [ ] **Accessibility** ≥ 95
- [ ] **Best Practices** ≥ 95
- [ ] **SEO** ≥ 90

### Tamaños de Bundle
- [x] CSS: 114.21 kB (13.27 kB gzipped) ✅
- [x] JS: 349.05 kB (110.37 kB gzipped) ✅

---

## 🚀 Comandos de Testing

```bash
# Dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lighthouse CI
npx lighthouse http://localhost:4173 --view

# Bundle analyzer
npx vite-bundle-visualizer
```

---

## 📝 Reporte de Bugs

Cuando encuentres un bug, documenta:

1. **Dispositivo**: iPhone 12, iOS 17.1
2. **Viewport**: 375x667px, portrait
3. **Página**: `/trading/marketplace`
4. **Acción**: Scroll horizontal aparece
5. **Esperado**: No scroll horizontal
6. **Actual**: Scroll de 50px hacia la derecha
7. **Screenshot**: Adjuntar captura

---

## ✅ Sign-off Final

Fecha de testing: _______________

**Testeado por:**
- [ ] Developer (nombre): _______________
- [ ] QA (nombre): _______________
- [ ] Product Owner (nombre): _______________

**Dispositivos reales usados:**
- [ ] iPhone SE (320px)
- [ ] iPhone 12/13 (375px)
- [ ] iPad Air (820px)
- [ ] Desktop (1920px)

**Bugs críticos encontrados:** _____ (debe ser 0 para aprobar)

**Bugs menores encontrados:** _____ (documentar en issues)

**Estado final:**
- [ ] ✅ APROBADO - Listo para producción
- [ ] ⚠️ APROBADO CON RESERVAS - Bugs menores documentados
- [ ] ❌ RECHAZADO - Bugs críticos pendientes
