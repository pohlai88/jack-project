---
title: Branding y personalización
description: >-
  Personalizá tu tenant de Afenda con colores, tipografía, densidad, estilos de
  superficie y otras opciones visuales.
section: admin
order: 2
translation:
  sourceLocale: en
  sourcePath: admin/branding.md
  sourceHash: 8aaf92670ab03db5a7a4acd107eb7d3e31dcaef30ee188c706bb3edc9fa45255
  status: reviewed
---

# Branding y personalización

Afenda es altamente personalizable para adaptarse a la identidad visual y a las preferencias de diseño de tu organización. Esta guía explica las opciones de branding disponibles para admins.

---

## Dónde encontrar la configuración de branding

1. Iniciá sesión como **Admin** y entrá en la **Vista Admin**
2. En la barra lateral, seleccioná **Configuración**
3. Hacé clic en la pestaña **Branding** (o similar)
4. Realizá los cambios y hacé clic en **Guardar**

Todos los cambios se aplican de inmediato a tu tenant para todos los usuarios y dispositivos.

---

## Elementos de branding personalizables

### Colores

Personalizá los tres colores principales que definen tu marca en Afenda:

#### Color primario

- **Qué es:** El color principal de la marca, usado en botones primarios, enlaces, acentos y destacados.
- **Predeterminado:** Azul vibrante (`#3B82F6`)
- **Consejos:**
  - Elegí un color con buen contraste sobre blanco y sobre el fondo neutro que uses.
  - Usá un color saturado y memorable; evitá grises y blancos.
  - Probalo en modo claro y oscuro para asegurar legibilidad.

#### Color secundario

- **Qué es:** Un color complementario para acciones secundarias, badges y elementos de apoyo.
- **Predeterminado:** Verde azulado (`#10B981`)
- **Consejos:**
  - Funciona bien como acento de contraste, por ejemplo para progreso o acciones positivas.
  - Debería combinar visualmente con tu Color primario.

#### Color de acento

- **Qué es:** Un color brillante y enérgico para destacados, alertas y énfasis.
- **Predeterminado:** Ámbar cálido (`#F59E0B`)
- **Consejos:**
  - Suele usarse para advertencias, CTAs secundarios y estados hover interactivos.
  - Debería diferenciarse claramente del Color primario y del Color secundario.

#### Feedback de contraste de color

- **Validación WCAG** — Cuando definís un par de colores, Afenda comprueba automáticamente si cumple con las pautas de accesibilidad WCAG.
- **Check verde** — El par de colores cumple **WCAG AA** (relación de contraste 4.5:1 para texto normal).
- **Advertencia naranja** — El contraste es bueno, pero conviene mejorarlo para cumplir AA.
- **Recomendación** — Si el contraste es bajo, el sistema sugiere tonos más claros u oscuros para cumplir accesibilidad.

**Ejemplo:**

```
Primario: #0066CC (Azul)
Fondo: #FFFFFF (Blanco)
Relación de contraste: 8.6:1 ✓ WCAG AAA (mejor legibilidad)
```

---

### Tipografía

Personalizá cómo se muestra el texto en toda la plataforma.

#### Familia tipográfica

Elegí entre varias familias tipográficas mantenidas profesionalmente:

- **DM Sans** (predeterminada) — Moderna, amigable y ligeramente redondeada. Muy buena para productos tecnológicos.
- **Inter** — Neutral y muy legible. Excelente para UI y texto corrido.
- **Open Sans** — Cálida y cercana. Funciona bien en entornos corporativos.
- **System Font** — Usa la fuente predeterminada de tu sistema operativo (San Francisco en Mac, Segoe UI en Windows). Es la opción más rápida porque no carga fuentes externas.

**Consejos:**

- Si el rendimiento es crítico, usá **System Font**.
- Para mantener consistencia de marca, alineá la fuente y sus pesos con los de tu sitio de marketing.
- Todas las fuentes incluyen pesos 400 (regular), 500 (medium), 600 (semibold) y 700 (bold).

---

### Densidad

Controlá cuánto espaciado (padding y margin) se usa en toda la interfaz.

- **Compacta** (0.75x) — Menos espaciado. Más información por pantalla. Útil para equipos que gestionan muchos elementos.
- **Predeterminada** (1x) — Espaciado equilibrado. La experiencia estándar de Afenda.
- **Cómoda** (1.25x) — Más espaciado. Mejor para accesibilidad y legibilidad. Recomendada para audiencias con foco en accesibilidad.

**Consejos:**

- Compacta sirve para dashboards administrativos con mucha densidad de información.
- Cómoda funciona mejor para miembros centrados en su desarrollo personal.
- Solo podés definir una densidad por tenant; cada usuario no la puede sobrescribir.

---

### Estilo de superficie

Controlá la profundidad visual y la elevación de tarjetas, paneles y contenedores.

- **Plano** — Sin sombras y con separación visual mínima. Estética limpia y minimalista.
- **Elevado** (predeterminado) — Sombras sutiles y sensación de profundidad. Más fácil de escanear visualmente.
- **Glass** (glassmorphism) — Efecto de vidrio esmerilado con blur y transparencia. Estética moderna y llamativa.

**Consejos:**

- **Plano** funciona bien en interfaces densas y centradas en datos.
- **Elevado** es la opción más segura para equilibrar estética y usabilidad.
- **Glass** es moderno y visualmente fuerte; probalo en dark mode para asegurar legibilidad.

---

### Calidez neutra

Ajustá el subtono de tus colores neutros (grises y bordes).

- **Fría** — Grises con subtono azulado. Se siente técnica y fresca. Va bien con colores fríos.
- **Neutra** (predeterminada) — Grises puros, sin calidez ni frialdad. Versátil y moderna.
- **Cálida** — Grises con subtono cálido (naranja o marrón). Se siente más cercana y amigable. Va bien con colores cálidos.

**Consejos:**

- Hacé coincidir la calidez de la paleta neutra con tu Color primario para mantener armonía visual.
- Fría funciona con azules, verdes azulados y púrpuras.
- Cálida funciona con naranjas, rojos y marrones.
- Neutra es la opción más segura en entornos corporativos.

---

## Logo e identidad de la organización

Además de colores y tipografía:

- **Nombre del tenant** — El nombre de tu organización, que se muestra en encabezados y pies.
- **Logo** — Si está disponible, subí el logo de tu organización para el encabezado y la página de login.
- **Favicon** — El pequeño ícono que aparece en la pestaña del navegador.
- **Colores de plantillas de email** — Los emails enviados desde la plataforma pueden usar tus colores de marca.

---

## Vista previa y pruebas en vivo

Antes de guardar, usá el **panel de vista previa** dentro de Branding para:

1. Ver tus colores aplicados a botones, tarjetas y elementos de UI
2. Alternar entre modo claro y modo oscuro
3. Revisar contraste y legibilidad del texto

**Probá siempre:**

- Modo claro y modo oscuro
- Distintos tamaños de pantalla (desktop, tablet, mobile)
- Con tu equipo (pedí feedback a algunos usuarios)

---

## Buenas prácticas

### Consistencia

- Si es posible, hacé coincidir colores y fuentes con tu sitio de marketing.
- Mantené un branding consistente entre Afenda, las plantillas de email y las integraciones.

### Accesibilidad

- Mantené siempre buen contraste (WCAG AA o AAA).
- Usá el validador de contraste integrado de Afenda al elegir colores.
- No dependas solo del color para comunicar significado; combiná íconos y color cuando haga falta.

### Rendimiento

- Evitá usar demasiadas fuentes personalizadas; en general alcanza con 1 o 2 familias.
- System Font carga más rápido; las fuentes personalizadas pueden agregar entre 50 y 200 ms a la carga.
- Para la mayoría de los usuarios, la diferencia visual es mínima.

### Dark mode

- Probá todas las decisiones de color en dark mode.
- Las superficies tipo glass pueden necesitar ajustes para seguir siendo legibles.
- Verificá que el Color primario sea lo suficientemente brillante sobre fondos oscuros.

### Mobile

- La densidad y el estilo de superficie impactan mucho en la usabilidad móvil.
- Probalo en un teléfono o tablet real, no solo en devtools del navegador.
- Las pantallas pequeñas suelen beneficiarse de densidad Cómoda y superficies Elevadas.

---

## Restablecer valores predeterminados

Si querés empezar de nuevo:

1. Andá a **Configuración** → **Branding**
2. Hacé clic en **Restablecer valores predeterminados** (si está disponible)
3. Confirmá

Esto revierte colores, fuentes, densidad y estilos de superficie a los valores predeterminados de Afenda. El nombre del tenant y el logo no cambian.

---

## Solución de problemas

**Los colores no cambian después de guardar:**

- Refrescá la página o limpiá la caché del navegador (Cmd+Shift+R en Mac, Ctrl+Shift+R en Windows).
- Revisá tu conexión a internet.
- Si el problema continúa, contactá al soporte de Afenda.

**Mi fuente personalizada no se muestra:**

- Algunos navegadores bloquean fuentes externas si estás detrás de un proxy corporativo.
- Probá System Font como alternativa.
- Pedile a tu equipo de IT que permita `fonts.googleapis.com` o `fonts.gstatic.com` si usás fuentes personalizadas.

**Aparece una advertencia de contraste de texto; ¿qué hago?**

- El validador integrado sugiere tonos más claros u oscuros.
- Podés aceptar la sugerencia o ajustar manualmente.
- WCAG AA (4.5:1) es el estándar mínimo; AAA (7:1) es mejor para accesibilidad.

**Dark mode se ve distinto al modo claro:**

- Es normal; la percepción del color cambia según el brillo del fondo.
- Ajustá tus colores pensando en ambos modos o pedí ayuda de diseño si la necesitás.

---

## Próximos pasos

- **Explorar otras configuraciones** → [Resumen de configuración](./settings)
- **Agregar integraciones** → [Guía de integraciones](./integrations)
- **Gestionar miembros y roles** → [Miembros e invitaciones](./members-invitations)
- **¿Querés más guía de diseño?** → Contactá a tu diseñador de Afenda o escribí a <support@example.com>

Tu marca importa. Vale la pena dedicar tiempo a ajustar colores y tipografía: es una de las primeras cosas que las personas ven cada día en Afenda.
