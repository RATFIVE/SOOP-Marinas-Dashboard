# Animation Guidelines

Dieses Dokument beschreibt die Framer Motion Integration und Animation-Guidelines für das SOOP Marinas Dashboard.

## Übersicht

Das Dashboard nutzt Framer Motion für konsistente, performante und barrierefreie Animationen. Alle Animationen respektieren die `prefers-reduced-motion` Einstellung des Benutzers.

## Animation-Prinzipien

### Timing & Durations

```typescript
const durations = {
  micro: 0.16,    // Hover-Effekte, kleine Interaktionen
  small: 0.24,    // Button-Übergänge, kleine Modals
  medium: 0.4,    // Card-Reveals, normale Übergänge  
  large: 0.8,     // Seitenübergänge, große Modals
}
```

### Easing-Kurven

- **easeOut**: Für Entrance-Animationen (Element erscheint)
- **easeIn**: Für Exit-Animationen (Element verschwindet)
- **easeInOut**: Für komplexe Übergänge
- **spring**: Für natürliche, lebendige Bewegungen

### Stagger-Timing

- **Standard**: 60ms zwischen Elementen
- **Fast**: 40ms für kleine Listen
- **Slow**: 80ms für große, komplexe Elemente

## Verfügbare Komponenten

### Layout & Pages

#### MotionLayout
Globaler Wrapper für Seitenübergänge.

```tsx
// Automatisch in app/layout.tsx integriert
<MotionLayout>
  {children}
</MotionLayout>
```

### UI-Komponenten

#### Button (erweitert)
Automatische Animationen für Hover, Tap und Disabled-States.

```tsx
// Standard mit Animationen
<Button>Click me</Button>

// Ohne Animationen
<Button animated={false}>Static button</Button>
```

#### Card (erweitert)
Reveal-Animationen mit Scroll-Detection.

```tsx
// Animiert beim Scrollen in den Viewport
<Card animated animateOnScroll>
  Content
</Card>

// Animiert sofort mit Delay
<Card animated animateOnScroll={false} delay={0.2}>
  Content
</Card>
```

### Motion-Wrapper

#### MotionCard
Dedizierte Card-Animation mit Viewport-Detection.

```tsx
<MotionCard animateOnScroll delay={0.1}>
  <CardHeader>
    <CardTitle>Station Data</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</MotionCard>
```

#### MotionList & MotionListItem
Staggered Animationen für Listen.

```tsx
<MotionList stagger animateOnScroll>
  {items.map((item, index) => (
    <MotionListItem key={item.id}>
      <StationCard {...item} />
    </MotionListItem>
  ))}
</MotionList>
```

#### MotionButton
Dedizierte Button-Animationen.

```tsx
<MotionButton 
  onClick={handleClick}
  disabled={isLoading}
>
  Submit
</MotionButton>
```

#### MotionModal
Animierte Modals mit Backdrop und Focus-Management.

```tsx
<MotionModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  showBackdrop
>
  <h2>Modal Title</h2>
  <p>Modal content...</p>
</MotionModal>
```

## Animation Variants

### Vordefinierte Variants

```typescript
// Page transitions
pageVariants: { initial, animate, exit }

// Card reveals
revealVariants: { hidden, visible }

// List stagger
staggerContainer: { hidden, visible }
staggerItem: { hidden, visible }

// Button interactions
buttonVariants: { idle, hover, tap, disabled }

// Modal animations
modalVariants: { hidden, visible, exit }

// Chart entrance
chartVariants: { hidden, visible }

// Map entrance  
mapVariants: { hidden, visible }
```

### Custom Variants erstellen

```typescript
const customVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    y: 20 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: animationConfig.duration.medium,
      ease: animationConfig.easing.easeOut,
    }
  }
};
```

## Accessibility & Reduced Motion

### Automatische Detection

Alle Komponenten nutzen den `useReducedMotion` Hook:

```typescript
const prefersReducedMotion = useReducedMotion();

// Fallback auf einfache Opacity-Übergänge
const variants = prefersReducedMotion 
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : complexVariants;
```

### Best Practices

1. **Immer** `useReducedMotion` bei Custom-Animationen nutzen
2. **Opacity + Transform** für performante Animationen (GPU-Beschleunigung)
3. **Viewport-Margins** für bessere UX bei Scroll-Animationen
4. **once: true** bei Scroll-Animationen um Re-Trigger zu vermeiden

## Performance-Optimierung

### GPU-Beschleunigung
Nutze nur folgende Eigenschaften für Animationen:
- `opacity`
- `transform` (scale, rotate, translate)
- `filter` (blur, brightness)

Vermeide:
- `width`, `height`
- `top`, `left`
- `background-color` (außer bei kurzen Übergängen)

### Beispiel optimierte Animation

```typescript
// Gut - GPU-beschleunigt
const optimized = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 }
};

// Schlecht - Layout-Thrashing
const problematic = {
  initial: { height: 0, marginTop: 20 },
  animate: { height: 'auto', marginTop: 0 }
};
```

## Verwendung in Projekten

### Neue Komponenten erstellen

```tsx
"use client";

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { revealVariants } from '@/lib/animation-variants';

export function MyComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion 
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : revealVariants;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      Content
    </motion.div>
  );
}
```

### Bestehende Komponenten erweitern

```tsx
// Vor
<div className="card">
  {content}
</div>

// Nach  
<Card animated animateOnScroll>
  {content}
</Card>
```

## Testing

### Manual Testing

1. **Standard-Animationen**: Alle Übergänge laufen flüssig (60 FPS)
2. **Reduced Motion**: Einstellung in Browser aktivieren → nur Opacity-Übergänge
3. **Performance**: DevTools → keine Layout-Thrashing, geringe CPU-Last
4. **Accessibility**: Screen Reader kompatibel, keine Flicker

### Automated Testing

```typescript
// Jest/RTL Test für Reduced Motion
test('respects reduced motion preference', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });

  render(<MyAnimatedComponent />);
  // Assert reduced motion behavior
});
```

## Migration Checklist

- [ ] Framer Motion installiert (`pnpm add framer-motion`)
- [ ] MotionLayout in Root-Layout integriert
- [ ] Animation-Variants definiert
- [ ] useReducedMotion Hook implementiert
- [ ] Bestehende Komponenten erweitert
- [ ] Performance getestet
- [ ] Accessibility validiert
- [ ] Dokumentation aktualisiert

## Troubleshooting

### Häufige Probleme

1. **Hydration Mismatches**: `useReducedMotion` Hook nutzen
2. **Performance Issues**: Nur transform/opacity animieren
3. **Layout Shifts**: Feste Dimensionen oder `layout` Prop nutzen
4. **SSR Probleme**: `"use client"` für animierte Komponenten

### Debug-Tools

```typescript
// Animation Debug Overlay
import { motion } from 'framer-motion';

const debugVariants = {
  // Lange Durations für visuelles Debugging
  animate: { 
    transition: { duration: 2 } 
  }
};
```