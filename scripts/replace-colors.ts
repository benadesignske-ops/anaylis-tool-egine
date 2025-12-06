// Color replacement mapping from purple to Deriv brand colors
// This script documents the color replacement strategy

/*
DERIV BRAND COLOR MAPPING:
- Purple gradients → Red Coral to Teal gradients
- Purple backgrounds → Brand Blue or Teal backgrounds
- Purple text → Brand Red Coral text
- Purple borders → Brand Teal borders
- Purple buttons → Brand Red Coral buttons

REPLACEMENT PATTERNS:
Dark Mode:
- bg-purple-500/10 → bg-brand-blue/10 or bg-accent/10
- bg-purple-500/20 → bg-brand-blue/20
- border-purple-500/30 → border-brand-teal/30 or border-accent/30
- text-purple-400 → text-brand-red or text-primary
- text-purple-300 → text-brand-teal-light or text-success
- from-purple-500 to-pink-500 → from-brand-red to-brand-teal

Light Mode:
- bg-purple-50 → bg-muted
- bg-purple-100 → bg-muted
- border-purple-200 → border-border
- text-purple-600 → text-primary
- text-purple-700 → text-primary

Buttons:
- bg-purple-500 hover:bg-purple-600 → bg-primary hover:bg-primary/90
*/

export const colorReplacements = {
  dark: {
    backgrounds: [
      ["bg-purple-500/5", "bg-accent/5"],
      ["bg-purple-500/10", "bg-accent/10"],
      ["bg-purple-500/20", "bg-accent/20"],
      ["bg-gradient-to-br from-purple-500/10 to-purple-500/5", "bg-gradient-to-br from-accent/10 to-brand-teal/5"],
      ["bg-gradient-to-br from-purple-500/10 to-pink-500/10", "bg-gradient-to-br from-primary/10 to-brand-teal/10"],
      ["bg-gradient-to-br from-purple-900/30", "bg-gradient-to-br from-accent/30"],
      ["bg-gradient-to-br from-purple-900/40", "bg-gradient-to-br from-primary/40"],
    ],
    borders: [
      ["border-purple-500/20", "border-accent/20"],
      ["border-purple-500/30", "border-accent/30"],
      ["border-purple-500/40", "border-accent/40"],
    ],
    text: [
      ["text-purple-300", "text-brand-teal-light"],
      ["text-purple-400", "text-primary"],
      ["text-purple-500", "text-primary"],
    ],
  },
  light: {
    backgrounds: [
      ["bg-purple-50", "bg-muted"],
      ["bg-purple-100", "bg-muted"],
    ],
    borders: [
      ["border-purple-200", "border-border"],
      ["border-purple-300", "border-border"],
    ],
    text: [
      ["text-purple-600", "text-primary"],
      ["text-purple-700", "text-primary"],
      ["text-purple-800", "text-card-foreground"],
    ],
  },
  buttons: [
    ["bg-purple-500 hover:bg-purple-600", "bg-primary hover:bg-primary/90"],
    ["bg-purple-500", "bg-primary"],
    ["from-purple-500 to-pink-500", "from-primary to-brand-teal"],
    ["hover:from-purple-600 hover:to-pink-600", "hover:from-primary/90 hover:to-brand-teal/90"],
  ],
  gradients: [
    ["bg-gradient-to-r from-purple-400 to-pink-400", "bg-gradient-to-r from-primary to-brand-secondary"],
    ["bg-gradient-to-r from-purple-500 to-pink-500", "bg-gradient-to-r from-primary to-brand-teal"],
    ["linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", "linear-gradient(135deg, #ff444f 0%, #00c6ff 100%)"],
  ],
}

console.log("Color replacement mapping documented")
