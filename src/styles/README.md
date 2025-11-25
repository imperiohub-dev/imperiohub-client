# ImperioHub Design System - SASS

Sistema de diseño completo con tokens, mixins y componentes reutilizables.

## 📁 Estructura

```
src/styles/
├── abstracts/          # Variables, mixins y funciones
│   ├── _variables.scss # Tokens de diseño
│   ├── _mixins.scss    # Mixins reutilizables
│   ├── _functions.scss # Funciones de utilidad
│   └── _index.scss
├── base/               # Estilos base
│   ├── _reset.scss     # Reset CSS
│   ├── _typography.scss # Tipografía
│   └── _index.scss
├── components/         # Componentes UI
│   ├── _buttons.scss
│   ├── _cards.scss
│   ├── _inputs.scss
│   ├── _badges.scss
│   └── _index.scss
├── layout/            # Layouts
│   ├── _container.scss
│   ├── _grid.scss
│   └── _index.scss
├── utils/             # Utilidades
│   ├── _helpers.scss  # Clases de ayuda
│   └── _index.scss
└── main.scss          # Punto de entrada
```

## 🎨 Cómo Usar

### 1. Importar en tu componente SCSS

```scss
@use '../abstracts' as *;

.mi-componente {
  // Usa variables directamente
  background: $color-background-card;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
}
```

### 2. Usar Mixins para Componentes

#### Botones

```scss
.mi-boton {
  @include button-primary;
}

.mi-boton-outline {
  @include button-outline;
}

.mi-boton-pequeño {
  @include button-primary;
  @include button-sm;
}
```

#### Cards/Cajas

```scss
.mi-tarjeta {
  @include card-base;
}

.mi-tarjeta-interactiva {
  @include card-interactive;
}

.mi-tarjeta-glass {
  @include card-glass;
}
```

#### Inputs

```scss
.mi-input {
  @include input-base;
}
```

### 3. Usar Clases Utilitarias en HTML

```tsx
// Botones
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary btn-sm">Secundario Pequeño</button>
<button className="btn btn-outline btn-lg">Outline Grande</button>
<button className="btn btn-ghost">Ghost</button>

// Cards
<div className="card">
  <div className="card-header">
    <h3>Título</h3>
  </div>
  <div className="card-body">
    Contenido
  </div>
  <div className="card-footer">
    Footer
  </div>
</div>

<div className="card-interactive">Card con hover</div>
<div className="card-glass">Card con efecto glass</div>

// Inputs
<div className="form-group">
  <label>Email</label>
  <input type="email" className="input" placeholder="tu@email.com" />
  <span className="help-text">Ingresa tu correo</span>
</div>

<div className="form-group">
  <label>Descripción</label>
  <textarea className="textarea" placeholder="Escribe algo..."></textarea>
</div>

<label className="checkbox">
  <input type="checkbox" />
  <span>Acepto términos</span>
</label>

<label className="radio">
  <input type="radio" name="option" />
  <span>Opción 1</span>
</label>

// Badges
<span className="badge badge-success">Éxito</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-warning">Advertencia</span>
<span className="badge badge-info">Info</span>

// Layout
<div className="container">
  <div className="grid-3">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</div>

// Utilidades
<div className="flex-between p-lg mb-md">
  <span className="text-accent">Texto con acento</span>
  <span className="text-secondary">Texto secundario</span>
</div>
```

### 4. Layout y Grids

```scss
// Container
.mi-contenedor {
  @include container(1280px);
}

// Flex
.mi-flex {
  @include flex-center;
  gap: $spacing-md;
}

.mi-flex-between {
  @include flex-between;
}

// Grid
.mi-grid {
  @include grid(3, $spacing-lg); // 3 columnas con gap de $spacing-lg
}
```

### 5. Tipografía

```scss
.mi-titulo {
  @include heading-1;
}

.mi-texto {
  @include text-body;
}

.mi-texto-pequeño {
  @include text-small;
}

// Truncate
.mi-texto-truncado {
  @include text-truncate;
}

// Clamp (múltiples líneas)
.mi-texto-clamped {
  @include text-clamp(3); // Máximo 3 líneas
}
```

### 6. Utilidades Avanzadas

```scss
// Spinner de carga
.mi-spinner {
  @include spinner(40px, $color-accent);
}

// Scrollbar personalizado
.mi-contenedor-scroll {
  @include custom-scrollbar;
}

// Badge
.mi-badge {
  @include badge($color-status-success);
}

// Tooltip
.mi-elemento-con-tooltip {
  @include tooltip;
}

// Responsive
.mi-componente-responsive {
  font-size: $font-size-sm;

  @include respond-to(md) {
    font-size: $font-size-lg;
  }

  @include respond-to(lg) {
    font-size: $font-size-xl;
  }
}
```

## 🎯 Tokens de Diseño

### Colores

```scss
// Principales
$color-primary: #000814;
$color-secondary: #1d212c;
$color-accent: #ffd700;

// Fondos
$color-background-primary: #1b1b1b;
$color-background-secondary: #1d212c;
$color-background-card: #130d00;

// Texto
$color-text-primary: #ffffff;
$color-text-secondary: #979797;
$color-text-accent: #ffd700;

// Estados
$color-status-success: #00ff9d;
$color-status-error: #ff4d4f;
$color-status-warning: #ff9100;
$color-status-info: #5865f2;

// Bordes
$color-border-primary: rgba(255, 255, 255, 0.1);
$color-border-accent: #ffd700;
```

### Espaciado

```scss
$spacing-xs: 0.4rem;    // 4px
$spacing-sm: 0.8rem;    // 8px
$spacing-md: 1.6rem;    // 16px
$spacing-lg: 2.4rem;    // 24px
$spacing-xl: 3.2rem;    // 32px
$spacing-xxl: 4.8rem;   // 48px
$spacing-xxxl: 6.4rem;  // 64px
```

### Tipografía

```scss
$font-family-primary: "Montserrat", "Inter", sans-serif;
$font-family-secondary: "Inter", sans-serif;

$font-size-xs: 1.2rem;   // 12px
$font-size-sm: 1.4rem;   // 14px
$font-size-md: 1.6rem;   // 16px
$font-size-lg: 2.0rem;   // 20px
$font-size-xl: 2.8rem;   // 28px
$font-size-xxl: 3.2rem;  // 32px
$font-size-xxxl: 4.0rem; // 40px
```

### Border Radius

```scss
$border-radius-xs: 2px;
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;
$border-radius-xl: 16px;
```

### Shadows

```scss
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
$shadow-md: 0 3px 6px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
$shadow-xl: 0 15px 25px rgba(0, 0, 0, 0.15);
```

### Transitions

```scss
$transition-fast: 150ms ease-in-out;
$transition-normal: 250ms ease-in-out;
$transition-slow: 350ms ease-in-out;
```

## 📱 Breakpoints

```scss
$breakpoint-xs: 480px;
$breakpoint-sm: 768px;
$breakpoint-md: 1024px;
$breakpoint-lg: 1280px;
$breakpoint-xl: 1536px;

// Uso:
@include respond-to(md) {
  // Estilos para tablet y arriba
}
```

## 🚀 Ejemplo Completo

```tsx
import './styles/MiComponente.scss';

function MiComponente() {
  return (
    <div className="container">
      <div className="card card-elevated">
        <div className="card-header">
          <h2 className="h2">Título del Card</h2>
          <span className="badge badge-success">Activo</span>
        </div>

        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="input"
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                className="textarea"
                placeholder="Describe algo..."
              />
            </div>

            <label className="checkbox">
              <input type="checkbox" />
              <span>Acepto los términos</span>
            </label>
          </form>
        </div>

        <div className="card-footer">
          <button className="btn btn-secondary">
            Cancelar
          </button>
          <button className="btn btn-primary">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
```

```scss
// styles/MiComponente.scss
@use '../abstracts' as *;

.mi-componente-custom {
  @include card-glass;
  padding: $spacing-xl;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-xl;
  }

  .titulo {
    @include heading-2;
    color: $color-accent;
    margin-bottom: $spacing-md;
  }

  @include respond-to(md) {
    padding: $spacing-xxl;
  }
}
```

## 💡 Tips

1. **Usa mixins para componentes**: En lugar de duplicar CSS, usa los mixins predefinidos
2. **Clases utilitarias para layouts rápidos**: Para espaciado y flex, usa las clases de ayuda
3. **Responsive**: Usa el mixin `respond-to()` para breakpoints consistentes
4. **Variables siempre**: No uses valores hardcodeados, usa los tokens del sistema

## 🎨 Personalización

Para extender el sistema, simplemente crea nuevos archivos SCSS en las carpetas correspondientes:

```scss
// components/_mi-nuevo-componente.scss
@use '../abstracts' as *;

.mi-componente {
  @include card-base;
  // Tu código personalizado
}
```

Y agrégalo al index:

```scss
// components/_index.scss
@forward './buttons';
@forward './cards';
@forward './mi-nuevo-componente'; // ← Agregar aquí
```
