# Header Component Implementation

## Overview
The `Header` component in `AppHeader.jsx` has been enhanced to support a centralized logo layout, responsive behavior, and visual adaptation for different backgrounds.

## Implementation Details

### 1. Logo Placement
- **Strategy**: The header uses a Flexbox container for the main layout.
- **Left Section**: Contains the Mobile Menu button (visible on mobile) and the "ASWBYVICKIE" brand text (visible on desktop).
- **Center Section**: The Logo image is positioned using absolute positioning (`absolute left-1/2 -translate-x-1/2`) to ensure it is perfectly centered relative to the screen width, regardless of the width of the left/right sections.
- **Right Section**: Contains "SIGN IN", Cart, and Search actions.

### 2. Responsive Behavior
- **Desktop (>= lg)**:
  - Displays "ASWBYVICKIE" text on the left.
  - Displays Logo in the center.
  - Displays full navigation and actions.
- **Mobile (< lg)**:
  - Hides "ASWBYVICKIE" text from the main bar (`hidden lg:block`).
  - Displays Hamburger menu on the left.
  - Displays Logo in the center.
  - **Mobile Menu**: The "ASWBYVICKIE" text is included inside the slide-out mobile menu for brand visibility.

### 3. Visual Adaptation
- **Prop**: A `variant` prop has been added (`'light' | 'transparent'`).
- **Behavior**:
  - `variant="light"` (Default): White background, Black text, Black Logo (`vickielogoblack.png`).
  - `variant="transparent"`: Transparent background, White text, White Logo (`vickielogowhite.png`).
- **Contrast**: The component automatically switches the logo source and text colors based on the selected variant to ensure proper contrast.

### 4. Accessibility
- **Logo**: Includes descriptive `alt="ASWBYVICKIE Logo"` text.
- **Navigation**: Uses semantic `<nav>` and `<button>` elements with `aria-label` where appropriate.
- **Keyboard Navigation**: Focus states are preserved for search and menu interactions.

## Usage
To use the header in different modes:

```jsx
// Standard (White background)
<Header />

// Transparent (Overlay on dark backgrounds)
<Header variant="transparent" />
```
