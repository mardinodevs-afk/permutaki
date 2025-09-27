# Permutaki Design Guidelines

## Design Approach Documentation

**Selected Approach**: Reference-Based (Social/Professional Platform)
- **Primary Reference**: LinkedIn's professional networking patterns combined with WhatsApp's communication simplicity
- **Secondary Influences**: Government portal accessibility standards for Mozambican users
- **Justification**: This is a utility-focused professional platform requiring trust, accessibility, and clear information hierarchy

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary Blue: 220 85% 45% (professional trust)
- Secondary Gray: 220 15% 65% (neutral backgrounds)
- Background: 0 0% 98% (clean white)
- Text Primary: 220 20% 15% (high contrast)

**Dark Mode:**
- Primary Blue: 220 75% 55% (accessible contrast)
- Secondary Gray: 220 15% 25% (dark surfaces)
- Background: 220 20% 8% (deep dark)
- Text Primary: 0 0% 95% (bright text)

**Accent Colors:**
- Success Green: 120 60% 45% (permutation completed)
- Warning Orange: 35 85% 55% (fraud alerts)
- Error Red: 0 75% 50% (validation errors)

### B. Typography
- **Primary Font**: Inter (Google Fonts) - excellent Portuguese/Mozambican character support
- **Headers**: Inter Bold (24px, 20px, 18px, 16px)
- **Body Text**: Inter Regular (14px, 16px)
- **Captions**: Inter Medium (12px)

### C. Layout System
**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16
- **Consistent spacing**: p-4, m-6, gap-8 for most layouts
- **Large sections**: py-12, px-16 for landing page sections
- **Cards**: p-6 internal padding, gap-4 between elements

### D. Component Library

**Navigation:**
- Fixed header with logo, navigation links, and user menu
- Mobile hamburger menu with slide-out drawer
- Breadcrumbs for multi-step forms and dashboard sections

**Forms:**
- Multi-step wizard with progress indicators
- Floating label inputs for better mobile experience
- Dropdown selectors for provinces/districts with search
- Toggle switches for preferences and settings

**Cards:**
- User profile cards with avatar, key info, and WhatsApp contact
- Testimonial cards with star ratings and quotes
- Information cards for landing page features
- Dashboard stat cards with icons and metrics

**Data Display:**
- User search results in card grid layout
- Dashboard tables for admin panel
- Star rating component (1-5 stars)
- Status badges (active, completed, reported)

**Modals & Overlays:**
- Login/registration modals with backdrop blur
- Confirmation dialogs for logout and critical actions
- Report user modal with form fields
- Success/error toast notifications

**Buttons:**
- Primary: Blue background, white text
- Secondary: Outline blue border, blue text
- WhatsApp: Green background with WhatsApp icon
- Danger: Red background for report/ban actions

### E. Images
**Hero Section**: Large background image of Mozambican government buildings or professional meeting, with overlay gradient (220 85% 45% to transparent)

**Testimonial Images**: Professional headshot placeholders for user testimonials

**Feature Icons**: Simple line icons representing security, matching, communication

**No custom animations** - rely on subtle CSS transitions for hover states and modal appearances only.

## Mobile-First Responsive Design
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly button sizes (minimum 44px)
- Simplified navigation for mobile with bottom tab bar in dashboard
- Collapsible sidebar for admin panel on mobile

## Accessibility & Localization
- High contrast ratios for both light/dark modes
- Portuguese language support throughout
- Screen reader friendly with proper ARIA labels
- Keyboard navigation support
- Support for Mozambican phone number formats (+258)