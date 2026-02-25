# Islamic Dataset Interface - Design System

## 🎨 Border Radius Guidelines

### **Consistent Border Radius Scale:**

#### **`rounded-lg` (8px) - Buttons & Interactive Elements**

- **Primary buttons** (green, blue, red)
- **Secondary buttons** (stone, gray)
- **Icon buttons** and small interactive elements
- **Badges** and status indicators

**Examples:**

```tsx
// Primary buttons
className = "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700";

// Secondary buttons
className = "px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700";

// Icon buttons
className = "p-2 rounded-lg hover:bg-stone-100";
```

#### **`rounded-xl` (12px) - Input Fields & Cards**

- **All input fields** (text, email, password, select)
- **Card containers** and content panels
- **Modal dialogs** and popups
- **Search bars** and form elements

**Examples:**

```tsx
// Input fields
className = "w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2";

// Card containers
className = "bg-white dark:bg-stone-800 rounded-xl shadow-lg p-4";

// Modal dialogs
className = "bg-white dark:bg-stone-800 rounded-xl shadow-xl max-w-md w-full";
```

#### **`rounded-2xl` (16px) - Major Sections & Modals**

- **Large containers** and major content sections
- **Full-page modals** and overlays
- **Hero sections** and prominent displays

**Examples:**

```tsx
// Major sections
className = "bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8";

// Hero containers
className = "bg-white dark:bg-stone-800 rounded-2xl shadow-2xl";
```

#### **`rounded-full` - Circular Elements**

- **Avatars** and profile pictures
- **Loading spinners** and indicators
- **Badges** and status dots
- **Icon containers** that should be perfectly round

**Examples:**

```tsx
// Loading spinners
className = "animate-spin rounded-full h-12 w-12 border-b-2";

// Avatar containers
className = "w-12 h-12 rounded-full bg-stone-200";

// Status indicators
className = "w-2 h-2 bg-red-500 rounded-full";
```

## 🎯 **Design Principles**

### **Consistency First**

- **Same element types** should always use the same border radius
- **Hierarchical relationships** should be reflected in radius size
- **Interactive elements** should have consistent hover states

### **Accessibility**

- **Focus states** should be clearly visible
- **Touch targets** should be appropriately sized
- **Color contrast** should meet WCAG guidelines

### **Performance**

- **Minimize custom CSS** - use Tailwind utilities
- **Consistent patterns** reduce cognitive load
- **Predictable interactions** improve UX

## 📋 **Implementation Checklist**

### **✅ Completed Standardizations:**

#### **Buttons (rounded-lg)**

- [x] All primary buttons (green, blue, red)
- [x] All secondary buttons (stone, gray)
- [x] Icon buttons and small interactive elements
- [x] Badges and status indicators

#### **Input Fields (rounded-xl)**

- [x] Text inputs in forms
- [x] Email and password fields
- [x] Select dropdowns
- [x] Search bars and filters
- [x] All form elements

#### **Cards & Containers (rounded-xl)**

- [x] Main content containers
- [x] Chart containers
- [x] Modal dialogs
- [x] Content panels
- [x] Search result cards

#### **Major Sections (rounded-2xl)**

- [x] Hero sections
- [x] Large modal overlays
- [x] Major content areas

#### **Circular Elements (rounded-full)**

- [x] Loading spinners
- [x] Status indicators
- [x] Avatar containers
- [x] Icon buttons

## 🔄 **Maintenance Guidelines**

### **When Adding New Components:**

1. **Check existing patterns** for similar elements
2. **Use consistent radius** based on element type
3. **Test in both light and dark modes**
4. **Ensure accessibility** standards are met

### **When Refactoring:**

1. **Update all instances** of inconsistent patterns
2. **Test across all pages** and components
3. **Update documentation** if patterns change
4. **Consider impact** on existing user experience

## 🎨 **Color Palette**

### **Primary Colors:**

- **Green**: `#10b981` (Primary actions, success)
- **Blue**: `#3b82f6` (Information, links)
- **Red**: `#ef4444` (Errors, destructive actions)

### **Neutral Colors:**

- **Stone**: `#78716c` (Text, borders, backgrounds)
- **Gray**: `#6b7280` (Secondary text, disabled states)

### **Background Colors:**

- **Light**: `#ffffff` (Primary background)
- **Dark**: `#1f2937` (Dark mode background)
- **Light Gray**: `#f9fafb` (Secondary background)
- **Dark Gray**: `#374151` (Dark mode secondary)

## 📱 **Responsive Design**

### **Breakpoints:**

- **Mobile**: `< 768px` (rounded-lg for smaller elements)
- **Tablet**: `768px - 1024px` (standard radius)
- **Desktop**: `> 1024px` (standard radius)

### **Touch Targets:**

- **Minimum 44px** for touch interactions
- **Adequate spacing** between interactive elements
- **Clear visual feedback** for all interactions

---

_This design system ensures consistent, accessible, and professional user experience across the Islamic Dataset Interface application._
