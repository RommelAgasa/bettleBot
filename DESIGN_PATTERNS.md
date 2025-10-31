# Design Patterns & SOLID Principles

## Overview

This document explains the design patterns and SOLID principles applied to the Beetlebot steering wheel component and overall architecture.

---

## SOLID Principles Applied

### 1. **Single Responsibility Principle (SRP)**

**"A class should have only one reason to change"**

#### Steering Wheel Component

- ✅ **Handles only steering wheel interaction logic**
- ✅ Separated concerns:
  - `calculateDirection()` - Pure function for direction logic
  - `createSteeringData()` - Data transformation only
  - `handleGestureEvent()` - Gesture processing only
  - Styling - Separate `StyleSheet` object

#### Home Component

- ✅ **Orchestrates components only**
- ✅ Doesn't handle steering logic internally
- ✅ Delegates to child components

**Before (Violates SRP):**

```tsx
// Mixed concerns - UI, logic, data transformation
onPanResponderMove: (_, gesture) => {
  const nextAngle = Math.max(-maxRotation, Math.min(maxRotation, gesture.dx));
  rotation.setValue(nextAngle);
  onAngleChange?.(nextAngle);
};
```

**After (Follows SRP):**

```tsx
// Separated into focused functions
const handleGestureEvent = useCallback(
  (event) => {
    const { translationX } = event.nativeEvent;
    let newAngle = previousAngle.current + translationX * config.sensitivity;
    newAngle = constrainAngle(newAngle); // Single responsibility
    rotation.setValue(newAngle);
    notifyParent(newAngle); // Single responsibility
  },
  [dependencies]
);
```

---

### 2. **Open/Closed Principle (OCP)**

**"Open for extension, closed for modification"**

#### Configuration-Based Extension

```tsx
interface SteeringConfig {
  maxRotation: number;
  sensitivity: number; // ← Can be changed without modifying code
  returnSpeed: number; // ← Can be changed without modifying code
  deadZone: number; // ← Can be changed without modifying code
}
```

✅ **Extensible through props:**

- Can change `maxRotation`, `size` without modifying component
- New callbacks can be added without breaking existing code

✅ **Closed for modification:**

- Core gesture handling logic doesn't need to change
- Adding new features doesn't require rewriting existing code

---

### 3. **Liskov Substitution Principle (LSP)**

**"Objects should be replaceable with instances of their subtypes"**

#### Control Component Interface

```tsx
// Any control component can replace steering wheel
interface ControlComponent {
  onStateChange?: (data: ControlData) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

// SteeringWheel follows this contract
<SteeringWheel
  onSteeringChange={handleChange}
  onSteeringStart={handleStart}
  onSteeringEnd={handleEnd}
/>

// Joystick can follow same contract
<Joystick
  onJoystickChange={handleChange}
  onJoystickStart={handleStart}
  onJoystickEnd={handleEnd}
/>
```

✅ Both components can be used interchangeably without breaking parent code

---

### 4. **Interface Segregation Principle (ISP)**

**"Clients shouldn't depend on interfaces they don't use"**

#### Focused Interfaces

```tsx
// Clean, focused data interface - only what's needed
interface SteeringData {
  angle: number;
  normalizedValue: number;
  direction: "left" | "right" | "center";
}

// Minimal props interface - no unnecessary props
interface SteeringWheelProps {
  size?: number;
  maxRotation?: number;
  onSteeringChange?: (data: SteeringData) => void; // Only if needed
  onSteeringStart?: () => void; // Only if needed
  onSteeringEnd?: () => void; // Only if needed
}
```

❌ **Avoided fat interfaces:**

```tsx
// BAD - Forces clients to handle everything
interface BadSteeringProps {
  onAngleChange: (angle: number) => void; // Required!
  onDirectionChange: (dir: string) => void; // Required!
  onNormalizedChange: (val: number) => void; // Required!
  onEveryTouchMove: (x: number, y: number) => void; // Too much!
}
```

---

### 5. **Dependency Inversion Principle (DIP)**

**"Depend on abstractions, not concretions"**

#### Callback Abstractions

```tsx
// Component depends on abstract callbacks, not concrete implementations
interface SteeringWheelProps {
  onSteeringChange?: (data: SteeringData) => void; // ← Abstraction
}

// Parent can provide any implementation
const handleSteeringChange = (data: SteeringData) => {
  // Could send to Bluetooth
  // Could log to console
  // Could update state
  // Could send to API
  // Component doesn't care!
};
```

✅ **Benefits:**

- Component doesn't know about Bluetooth, state management, or logging
- Easy to test with mock callbacks
- Easy to swap implementations

---

## Design Patterns Applied

### 1. **Strategy Pattern**

**"Define a family of algorithms, encapsulate each one, and make them interchangeable"**

#### Configuration Strategy

```tsx
const config = React.useMemo<SteeringConfig>(() => ({
  maxRotation,
  sensitivity: 1.5,    // ← Strategy parameter
  returnSpeed: 40,     // ← Strategy parameter
  deadZone: 5,         // ← Strategy parameter
}), [maxRotation]);

// Different behaviors without changing code
<SteeringWheel sensitivity={2.0} /> // More responsive
<SteeringWheel sensitivity={0.5} /> // Less responsive
```

---

### 2. **Observer Pattern**

**"Define a one-to-many dependency between objects"**

#### Callback Observers

```tsx
// Component notifies observers of state changes
const handleGestureEvent = (event) => {
  // ... processing ...
  if (onSteeringChange) {
    // ← Notify observer
    onSteeringChange(steeringData);
  }
};

// Multiple observers can listen
<SteeringWheel
  onSteeringChange={observer1} // ← Observer 1
  onSteeringStart={observer2} // ← Observer 2
  onSteeringEnd={observer3} // ← Observer 3
/>;
```

---

### 3. **Factory Pattern (Data Creation)**

**"Create objects without specifying exact classes"**

```tsx
// Factory function for creating steering data
const createSteeringData = useCallback(
  (angle: number): SteeringData => ({
    angle,
    normalizedValue: angle / config.maxRotation,
    direction: calculateDirection(angle),
  }),
  [config.maxRotation, calculateDirection]
);

// Usage
const data = createSteeringData(45); // Creates consistent data object
```

---

### 4. **Template Method Pattern**

**"Define skeleton of algorithm, let subclasses override steps"**

```tsx
// Gesture handling template
const handleGestureEvent = () => {
  // 1. Get input
  const input = getGestureInput();

  // 2. Transform (can be customized via config)
  const transformed = applyTransformation(input);

  // 3. Validate (can be customized via config)
  const validated = validateAndConstrain(transformed);

  // 4. Update
  updateAnimation(validated);

  // 5. Notify
  notifyObservers(validated);
};
```

---

## Code Quality Improvements

### Before vs After Comparison

#### ❌ **Before (Poor Design)**

```tsx
// Mixed concerns, tight coupling, hard to test
const responder = PanResponder.create({
  onPanResponderMove: (_, gesture) => {
    const nextAngle = Math.max(-maxRotation, Math.min(maxRotation, gesture.dx));
    rotation.setValue(nextAngle);
    onAngleChange?.(nextAngle); // Just a number - no context
  },
});
```

**Problems:**

- ❌ Multiple responsibilities in one function
- ❌ Tight coupling to PanResponder
- ❌ No multi-touch support
- ❌ Poor data structure (just a number)
- ❌ No configuration flexibility
- ❌ Hard to test

#### ✅ **After (Good Design)**

```tsx
// Clean separation, loose coupling, easy to test
const handleGestureEvent = useCallback(
  (event) => {
    const { translationX } = event.nativeEvent;
    let newAngle = previousAngle.current + translationX * config.sensitivity;
    newAngle = Math.max(
      -config.maxRotation,
      Math.min(config.maxRotation, newAngle)
    );
    rotation.setValue(newAngle);

    if (onSteeringChange) {
      const steeringData = createSteeringData(newAngle); // Rich data object
      onSteeringChange(steeringData);
    }
  },
  [config, onSteeringChange, createSteeringData]
);
```

**Benefits:**

- ✅ Single responsibility per function
- ✅ Uses PanGestureHandler (multi-touch support)
- ✅ Rich, structured data output
- ✅ Configurable behavior
- ✅ Easy to test with mocks

---

## Testing Benefits

### Pure Functions (Easy to Test)

```tsx
// Pure function - no side effects
const calculateDirection = (angle: number) => {
  if (Math.abs(angle) < config.deadZone) return "center";
  return angle < 0 ? "left" : "right";
};

// Test
expect(calculateDirection(0)).toBe("center");
expect(calculateDirection(-10)).toBe("left");
expect(calculateDirection(10)).toBe("right");
```

### Dependency Injection (Easy to Mock)

```tsx
// Easy to test with mock callbacks
const mockCallback = jest.fn();

render(<SteeringWheel onSteeringChange={mockCallback} />);

// Test that callback was called with correct data
expect(mockCallback).toHaveBeenCalledWith({
  angle: 45,
  normalizedValue: 0.33,
  direction: "right",
});
```

---

## Performance Optimizations

### 1. **useMemo for Config**

```tsx
// Prevents recreation on every render
const config = React.useMemo(
  () => ({
    maxRotation,
    sensitivity: 1.5,
    returnSpeed: 40,
    deadZone: 5,
  }),
  [maxRotation]
);
```

### 2. **useCallback for Handlers**

```tsx
// Prevents recreation of functions on every render
const handleGestureEvent = useCallback(
  (event) => {
    // ...
  },
  [dependencies]
);
```

### 3. **Native Driver**

```tsx
// Hardware-accelerated animations
Animated.spring(rotation, {
  toValue: 0,
  useNativeDriver: true, // ← Runs on native thread
}).start();
```

---

## Future Extensibility

### Easy to Add New Features

#### 1. Haptic Feedback

```tsx
// Just add to config
const config = {
  maxRotation,
  sensitivity: 1.5,
  returnSpeed: 40,
  deadZone: 5,
  hapticEnabled: true, // ← New feature
};

// Use in handler
if (config.hapticEnabled) {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
```

#### 2. Audio Feedback

```tsx
// Add new callback
interface SteeringWheelProps {
  onSteeringChange?: (data: SteeringData) => void;
  onPlaySound?: (soundType: string) => void; // ← New callback
}
```

#### 3. Visual Indicators

```tsx
// Add to data interface
interface SteeringData {
  angle: number;
  normalizedValue: number;
  direction: "left" | "right" | "center";
  intensity: "light" | "medium" | "heavy"; // ← New property
}
```

---

## Summary

### Key Achievements

- ✅ **SOLID Principles**: All 5 principles applied consistently
- ✅ **Design Patterns**: Strategy, Observer, Factory, Template Method
- ✅ **Clean Code**: Focused functions, clear naming, good documentation
- ✅ **Testability**: Pure functions, dependency injection, mockable
- ✅ **Maintainability**: Easy to understand, modify, and extend
- ✅ **Performance**: Optimized with useMemo, useCallback, native driver
- ✅ **Multi-touch**: Supports simultaneous gestures
- ✅ **Type Safety**: Full TypeScript with clear interfaces

### Next Steps

1. Apply same patterns to Joystick component
2. Create shared base class/hooks for common control logic
3. Add unit tests for pure functions
4. Create integration tests for gesture handling
5. Document Bluetooth service integration patterns
