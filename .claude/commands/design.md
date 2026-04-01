# Purpose
Design and build distinctive, production-grade frontend interfaces for TariffLookup.ca that reject generic AI aesthetics.

# Design Thinking (do this before writing any code)

Before coding, commit to a **bold aesthetic direction**:

1. **Purpose** — What problem does this interface solve? Who uses it?
2. **Tone** — Pick a direction and execute it with precision: brutally minimal, retro-futuristic, editorial/magazine, luxury/refined, industrial/utilitarian, brutalist/raw, art deco/geometric, etc.
3. **Differentiation** — What makes this unforgettable? What's the one thing a user will remember?
4. **Constraints** — Read the existing files in `frontend/src/` first to understand current component structure, CSS conventions, and patterns before designing.

# Frontend Aesthetics Guidelines

**Typography**
- Choose fonts that are beautiful, unique, and interesting — never Inter, Roboto, Arial, or system fonts
- Pair a distinctive display font with a refined body font
- Typography should be a design decision, not a default

**Color & Theme**
- Use CSS variables for consistency
- Commit to a cohesive palette — dominant colors with sharp accents outperform timid, evenly-distributed palettes
- Vary between light and dark; never default to purple gradients on white

**Motion**
- Use animations for page load, micro-interactions, and scroll-triggered effects
- One well-orchestrated reveal with staggered `animation-delay` creates more impact than scattered effects
- CSS-first; use Motion library for React when available

**Spatial Composition**
- Unexpected layouts: asymmetry, overlap, diagonal flow, grid-breaking elements
- Generous negative space OR controlled density — pick one and commit

**Backgrounds & Visual Details**
- Create atmosphere: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, grain overlays
- Never default to solid colors

**NEVER use:**
- Overused fonts: Inter, Roboto, Arial, Space Grotesk, system fonts
- Clichéd color schemes (especially purple gradients on white)
- Predictable layouts and cookie-cutter component patterns
- Generic AI-generated aesthetics with no context-specific character

# Steps

1. **Read current state** — read the relevant files in `frontend/src/` before proposing anything
2. **Establish aesthetic direction** — commit to a clear conceptual direction; state it explicitly before coding
3. **Choose the right agent for the work:**
   - *Layout + UX decisions* → use `mkt-ux-design-agent` (wireframes, interaction rules, component definitions)
   - *Visual direction + assets* → use `mkt-design-production-agent` (design direction, SVG/CSS assets, visual specs)
   - *Implement in code* → use `mkt-website-implementation-agent` (patch React components, apply styles)
4. **Implement** — write production-grade, functional code. Match complexity to the vision: maximalist designs need elaborate animations and effects; minimalist designs need restraint and precision.

# Implementation Constraints
- Mobile-first: all layouts must be responsive
- Prefer editing existing components over creating new files
- No new dependencies without explicit approval
- Maintain semantic HTML and accessibility
- Use CSS variables for any new design tokens
