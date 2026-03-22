# TariffLookup.ca Brand System

Status: Active working brand guidance  
Last updated: 2026-03-22  
Owner: ML1  
Applies to: marketing copy, UI/UX, frontend implementation, design handoff packets, Canva templates, launch surfaces

## Purpose

This document is the working source of truth for TariffLookup.ca brand expression across product UI, landing pages, social templates, and external design handoffs.

It is meant to keep the repo's marketing agents, frontend decisions, and external production work aligned to one coherent system.

## Brand Positioning

- Product: TariffLookup.ca
- Audience: Canadian exporters
- Core value: Instant clarity on tariffs

## Brand Personality

- Precise
- Trustworthy
- Efficient
- Calm

## Brand Keywords

Clear. Structured. Intelligent. Reliable. Professional.

## Brand Voice Rules

- Prefer plain, exporter-facing language over generic SaaS hype.
- Sound informed and composed, not flashy or salesy.
- Lead with clarity and workflow confidence.
- Avoid exaggerated claims, legal-advice framing, or certainty beyond repo evidence.
- When product coverage is partial, say so directly and cleanly.

## Logo System

### Current Provisional Mark

The current starter logo provided by ML1 is a red maple leaf with an integrated lookup/search stroke plus the `tarifflookup.ca` wordmark.

Use it as a provisional brand reference only until a cleaner production vector pack exists. It successfully signals Canada plus search, but it is more expressive than the desired long-term brand personality of precise, calm, and structured.

### Target Logo Direction

#### Primary Brand Logo: Maple Grid Mark

- Simplified maple leaf built from a structured grid
- Meaning: Canadian identity plus organized data
- Shape: rounded-square container with a restrained internal maple silhouette
- Grid treatment: subtle 4x4 or 5x5 divisions inside the leaf
- Default colorway:
  - container: Deep Navy `#0F2A44`
  - leaf: White `#FFFFFF`
  - grid: White at `10%` to `15%` opacity
  - optional accent node: Maple Red `#D72638`

#### Secondary Product Mark: Lookup Lens

- Magnifying glass over a globe
- Meaning: searching global trade data
- Use for favicon, app icon, compact badge, or product-specific contexts
- Default colorway:
  - stroke: Deep Navy `#0F2A44`
  - background: White or transparent
  - optional red accent at joint or handle tip

### Logo Usage Rule

- Website header: prefer Maple Grid Mark
- App icon / favicon: prefer Lookup Lens
- Marketing surfaces: use the mark that best emphasizes either authority or function

## Color System

### Primary Palette

- Deep Navy `#0F2A44` for authority, trust, and primary actions
- Maple Red `#D72638` for Canadian accent and selected call-to-action emphasis
- Cool White `#F7F9FC` for the base interface background

### Secondary Palette

- Steel Blue `#4A6FA5` for data and UI support elements
- Soft Gray `#A7B0BE` for metadata, labels, and low-emphasis borders
- Dark Charcoal `#1F2933` for primary body text

### Functional Accents

- Green `#2BB673` for low tariff or positive states
- Orange `#F59E0B` for moderate or caution states
- Red `#E63946` for high tariff or negative states

### Color Ratio Rule

- `70%` neutral: white and gray
- `20%` navy and blue
- `10%` functional or brand accents

### Color Use Guardrails

- Use color to communicate meaning, not decoration.
- Prefer subtle borders over heavy fills.
- Keep dashboards and result surfaces mostly neutral.
- Red should not dominate the interface even though it is part of the brand.

## Typography System

### Primary Font

- Inter for UI, data display, navigation, labels, and headings

### Secondary Font

- Space Grotesk for optional marketing headers or campaign moments only

### Hierarchy

- H1: `48px` to `56px`, bold
- H2: `32px` to `40px`, semibold
- H3: `20px` to `24px`, medium
- Body: `14px` to `16px`, regular
- Labels: `12px`, medium, tracking `+2%`

### Typography Rule

- Use no more than two font families across a surface.

## Layout System

### Grid and Spacing

- 12-column grid for web
- 8px base spacing system
- Spacing scale: `8 / 16 / 24 / 32 / 48 / 64`

### Core Layout Patterns

#### Dashboard

- Left: filters and search controls
- Center: results table or primary data surface
- Right: insights, notes, or decision-support panel

#### Marketing Hero

- Left: headline, proof, CTA
- Right: product screenshot or UI illustration

#### Cards

- Radius: `12px` to `16px`
- Padding: `16px` to `24px`
- Shadow: soft and low-opacity only
- Prefer light borders over deep shadow stacks

## Component System

### Core Components

- Search bar as the dominant interaction element
- Data table cards
- Status badges with semantic color use
- Small consistent country flags
- CTA buttons

### Buttons

- Primary: Deep Navy background with white text
- Secondary: navy outline with white or neutral background
- Danger: red background for destructive or warning actions only

## Icon and Illustration Style

### Icons

- Minimal line icons
- `2px` stroke
- Slightly rounded geometry

Suggested search terms for external libraries or Canva:

- `line icon set minimal`
- `finance line icons`
- `data dashboard icons`

### Illustration Direction

- Abstract data flows
- Global trade maps
- Structured data motifs
- Avoid cartoonish or playful illustration styles

## Visual Language

Direction: Structured Intelligence

### Visual Rules

- Use generous white space
- Separate data blocks clearly
- Prefer subtle borders to heavy shadows
- Let content hierarchy do most of the visual work
- Use color to signal state, not to fill space

## Social and Marketing Templates

### Tariff Insight

- Large numeric tariff figure
- Country flags
- One short explanation

### Exporter Tip

- Short header
- Two or three practical bullets
- One subtle supporting icon

### Feature Highlight

- Product screenshot
- One headline
- One CTA

## Canva Implementation Guide

### Brand Kit Setup

- Load the palette in this document
- Set Inter as the primary font
- Set Space Grotesk as the optional display font

### Component Library

- `BTN / Primary`
- `BTN / Secondary`
- `CARD / Data`
- `BADGE / High Tariff`
- `BADGE / Moderate Tariff`
- `BADGE / Low Tariff`
- `INPUT / Search`

### Template Library

- LinkedIn post
- Instagram post
- Pitch deck slide
- Landing page section
- Product screenshot frame

## Repo Implementation Notes

- Product UI should default to Inter and the neutral-plus-navy palette.
- Existing screens can evolve toward this system incrementally; do not force a full visual rewrite unless ML1 asks for one.
- When an external design tool is required, agents must produce a truthful handoff packet instead of claiming a live file was edited.
- If the source logo asset is later supplied as SVG, store it under `docs/brand/assets/` and reference it from this file.

## Agent Usage Rule

All TariffLookup marketing agents, design agents, UX agents, and website implementation prompts should treat this file as mandatory brand guidance alongside product and engineering docs.
