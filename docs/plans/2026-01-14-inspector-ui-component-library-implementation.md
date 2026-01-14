# Inspector UI Component Library Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a reusable UI component library and refactor all 15 Inspector workflow screens to use it, achieving ~50% code reduction while maintaining pixel-perfect visual parity.

**Architecture:** Flat component structure in `src/components/ui/` with barrel exports. Components use a centralized theme for colors, spacing, typography. Screens import from the barrel and replace inline styling with component usage.

**Tech Stack:** React Native, TypeScript, @expo/vector-icons (MaterialIcons), react-native-safe-area-context

---

## Phase 1: Component Library Creation

### Task 1: Create Theme File

**Files:**
- Create: `src/components/ui/theme.ts`

**Step 1: Create the ui directory and theme file**

```typescript
// src/components/ui/theme.ts

export const colors = {
  // Primary actions
  primary: '#007AFF',
  primaryPressed: '#0056B3',

  // Semantic colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',

  // Neutral
  textPrimary: '#1D1D1F',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  background: '#F8F9FA',
  surface: '#FFFFFF',

  // Status backgrounds
  successLight: '#F0FFF4',
  errorLight: '#FFF5F5',
  warningLight: '#FFF9E6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const typography = {
  headerTitle: { fontSize: 18, fontWeight: '600' as const },
  cardTitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, color: '#8E8E93' },
  label: { fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const },
};

export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
};
```

**Step 2: Commit**

```bash
git add src/components/ui/theme.ts
git commit -m "feat(ui): add theme with design tokens"
```

---

### Task 2: Create Button Component

**Files:**
- Create: `src/components/ui/Button.tsx`

**Step 1: Create Button component**

```typescript
// src/components/ui/Button.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.primary, text: '#FFFFFF', border: colors.primary },
  secondary: { bg: colors.surface, text: colors.primary, border: colors.primary },
  destructive: { bg: colors.error, text: '#FFFFFF', border: colors.error },
  outline: { bg: colors.surface, text: colors.textSecondary, border: colors.border },
  ghost: { bg: 'transparent', text: colors.primary, border: 'transparent' },
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const variantStyle = variantStyles[variant];
  const iconColor = variantStyle.text;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <MaterialIcons name={icon} size={20} color={iconColor} />
          )}
          <Text style={[styles.label, { color: variantStyle.text }, textStyle]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons name={icon} size={20} color={iconColor} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  fullWidth: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat(ui): add Button component with variants"
```

---

### Task 3: Create ScreenHeader Component

**Files:**
- Create: `src/components/ui/ScreenHeader.tsx`

**Step 1: Create ScreenHeader component**

```typescript
// src/components/ui/ScreenHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from './theme';

export interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
  rightBadgeCount?: number;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  onClose,
  rightIcon,
  onRightPress,
  rightBadgeCount,
}) => {
  const leftAction = onClose || onBack;
  const leftIconName = onClose ? 'close' : 'arrow-back';

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={leftAction}
        disabled={!leftAction}
      >
        {leftAction && (
          <MaterialIcons name={leftIconName} size={24} color={colors.primary} />
        )}
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onRightPress}
        disabled={!onRightPress}
      >
        {rightIcon && (
          <View>
            <MaterialIcons name={rightIcon} size={24} color={colors.primary} />
            {rightBadgeCount !== undefined && rightBadgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {rightBadgeCount > 99 ? '99+' : rightBadgeCount}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headerTitle,
    flex: 1,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/ScreenHeader.tsx
git commit -m "feat(ui): add ScreenHeader component"
```

---

### Task 4: Create ActionFooter Component

**Files:**
- Create: `src/components/ui/ActionFooter.tsx`

**Step 1: Create ActionFooter component**

```typescript
// src/components/ui/ActionFooter.tsx

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, ButtonVariant } from './Button';
import { colors, spacing } from './theme';

export interface FooterButton {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
}

export interface ActionFooterProps {
  buttons: FooterButton[];
  style?: ViewStyle;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({ buttons, style }) => {
  return (
    <View style={[styles.footer, style]}>
      {buttons.map((button, index) => {
        // Default: last button is primary, others are outline
        const defaultVariant: ButtonVariant =
          index === buttons.length - 1 ? 'primary' : 'outline';

        return (
          <Button
            key={index}
            label={button.label}
            onPress={button.onPress}
            variant={button.variant ?? defaultVariant}
            icon={button.icon}
            iconPosition={button.iconPosition}
            loading={button.loading}
            disabled={button.disabled}
            fullWidth
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/ActionFooter.tsx
git commit -m "feat(ui): add ActionFooter component"
```

---

### Task 5: Create StatusBadge Component

**Files:**
- Create: `src/components/ui/StatusBadge.tsx`

**Step 1: Create StatusBadge component**

```typescript
// src/components/ui/StatusBadge.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from './theme';

export type BadgeStatus =
  | 'verified'
  | 'frustrated'
  | 'detected'
  | 'not-detected'
  | 'matched'
  | 'unmatched'
  | 'pending'
  | 'na'
  | 'in-progress';

export interface StatusBadgeProps {
  status: BadgeStatus;
  label?: string;
  size?: 'sm' | 'md';
}

interface BadgeConfig {
  bg: string;
  text: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  defaultLabel: string;
}

const badgeConfig: Record<BadgeStatus, BadgeConfig> = {
  verified: {
    bg: colors.success,
    text: '#FFFFFF',
    icon: 'check-circle',
    defaultLabel: 'Verified',
  },
  frustrated: {
    bg: colors.error,
    text: '#FFFFFF',
    icon: 'cancel',
    defaultLabel: 'Frustrated',
  },
  detected: {
    bg: colors.success,
    text: '#FFFFFF',
    icon: 'check-circle',
    defaultLabel: 'Detected',
  },
  'not-detected': {
    bg: colors.warning,
    text: '#FFFFFF',
    icon: 'search-off',
    defaultLabel: 'Not Detected',
  },
  matched: {
    bg: colors.success,
    text: '#FFFFFF',
    icon: 'check-circle',
    defaultLabel: 'Matched',
  },
  unmatched: {
    bg: colors.warning,
    text: '#FFFFFF',
    icon: 'help-outline',
    defaultLabel: 'Unmatched',
  },
  pending: {
    bg: colors.border,
    text: colors.textSecondary,
    icon: 'schedule',
    defaultLabel: 'Pending',
  },
  na: {
    bg: colors.background,
    text: colors.textSecondary,
    icon: 'remove',
    defaultLabel: 'N/A',
  },
  'in-progress': {
    bg: colors.primary,
    text: '#FFFFFF',
    icon: 'autorenew',
    defaultLabel: 'In Progress',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const config = badgeConfig[status];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall && styles.badgeSmall,
      ]}
    >
      <MaterialIcons
        name={config.icon}
        size={isSmall ? 12 : 14}
        color={config.text}
      />
      <Text
        style={[
          styles.label,
          { color: config.text },
          isSmall && styles.labelSmall,
        ]}
      >
        {label ?? config.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  badgeSmall: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  labelSmall: {
    fontSize: 10,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/StatusBadge.tsx
git commit -m "feat(ui): add StatusBadge component"
```

---

### Task 6: Create ValidationCard Component

**Files:**
- Create: `src/components/ui/ValidationCard.tsx`

**Step 1: Create ValidationCard component**

```typescript
// src/components/ui/ValidationCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBadge, BadgeStatus } from './StatusBadge';
import { colors, spacing, borderRadius, shadows, typography } from './theme';

export type ValidationStatus = 'pending' | 'validated' | 'frustrated';
export type MatchStatus = 'matched' | 'unmatched';

export interface ValidationCardProps {
  label: string;
  expectedValues: string[];
  validationStatus: ValidationStatus;
  matchStatus?: MatchStatus;
  confidence?: number;
  afmanReference?: string;
  onValidate: () => void;
  onFrustrate: () => void;
  disabled?: boolean;
}

export const ValidationCard: React.FC<ValidationCardProps> = ({
  label,
  expectedValues,
  validationStatus,
  matchStatus,
  confidence,
  afmanReference,
  onValidate,
  onFrustrate,
  disabled = false,
}) => {
  const getBorderColor = (): string => {
    if (validationStatus === 'validated') return colors.success;
    if (validationStatus === 'frustrated') return colors.error;
    if (matchStatus === 'unmatched') return colors.warning;
    return colors.border;
  };

  const getBackgroundColor = (): string => {
    if (validationStatus === 'validated') return colors.successLight;
    if (validationStatus === 'frustrated') return colors.errorLight;
    if (matchStatus === 'unmatched') return colors.warningLight;
    return colors.surface;
  };

  const getBadgeStatus = (): BadgeStatus => {
    if (validationStatus === 'validated') return 'verified';
    if (validationStatus === 'frustrated') return 'frustrated';
    if (matchStatus === 'matched') return 'detected';
    if (matchStatus === 'unmatched') return 'not-detected';
    return 'pending';
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <StatusBadge status={getBadgeStatus()} />
      </View>

      {/* Expected Values */}
      <View style={styles.expectedContainer}>
        {expectedValues.map((value, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Confidence & Reference */}
      {(confidence !== undefined || afmanReference) && (
        <View style={styles.metaRow}>
          {confidence !== undefined && (
            <Text style={styles.metaText}>
              Confidence: {Math.round(confidence * 100)}%
            </Text>
          )}
          {afmanReference && (
            <Text style={styles.metaText}>{afmanReference}</Text>
          )}
        </View>
      )}

      {/* Actions */}
      {validationStatus === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.validateButton]}
            onPress={onValidate}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <MaterialIcons name="check" size={24} color={colors.success} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.frustrateButton]}
            onPress={onFrustrate}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.cardTitle,
    flex: 1,
    marginRight: spacing.sm,
    color: colors.textPrimary,
  },
  expectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    backgroundColor: colors.background,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  chipText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  metaText: {
    ...typography.caption,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  validateButton: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  frustrateButton: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/ValidationCard.tsx
git commit -m "feat(ui): add ValidationCard component"
```

---

### Task 7: Create DetailCard Component

**Files:**
- Create: `src/components/ui/DetailCard.tsx`

**Step 1: Create DetailCard component**

```typescript
// src/components/ui/DetailCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from './theme';

export interface DetailField {
  label: string;
  value: string | React.ReactNode;
  accent?: boolean;
}

export type DetailCardStatus = 'default' | 'success' | 'error' | 'warning';

export interface DetailCardProps {
  title?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  fields: DetailField[];
  status?: DetailCardStatus;
}

const statusColors: Record<DetailCardStatus, string> = {
  default: colors.border,
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
};

export const DetailCard: React.FC<DetailCardProps> = ({
  title,
  icon,
  fields,
  status = 'default',
}) => {
  return (
    <View style={[styles.card, { borderColor: statusColors[status] }]}>
      {title && (
        <View style={styles.titleRow}>
          {icon && (
            <MaterialIcons name={icon} size={20} color={colors.textSecondary} />
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {fields.map((field, index) => (
        <View
          key={index}
          style={[
            styles.field,
            field.accent && styles.fieldAccent,
            index < fields.length - 1 && styles.fieldBorder,
          ]}
        >
          <Text style={styles.fieldLabel}>{field.label}</Text>
          {typeof field.value === 'string' ? (
            <Text style={styles.fieldValue}>{field.value}</Text>
          ) : (
            field.value
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.light,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  field: {
    paddingVertical: spacing.sm,
  },
  fieldAccent: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/DetailCard.tsx
git commit -m "feat(ui): add DetailCard component"
```

---

### Task 8: Create SectionHeader Component

**Files:**
- Create: `src/components/ui/SectionHeader.tsx`

**Step 1: Create SectionHeader component**

```typescript
// src/components/ui/SectionHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

export interface SectionHeaderProps {
  title: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  count?: { completed: number; total: number };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  count,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {icon && (
          <MaterialIcons name={icon} size={20} color={colors.textSecondary} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {count && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {count.completed}/{count.total}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textSecondary,
  },
  countBadge: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  countText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/SectionHeader.tsx
git commit -m "feat(ui): add SectionHeader component"
```

---

### Task 9: Create StepIndicator Component

**Files:**
- Create: `src/components/ui/StepIndicator.tsx`

**Step 1: Create StepIndicator component**

```typescript
// src/components/ui/StepIndicator.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export type StepStatus = 'pending' | 'active' | 'pass' | 'fail';

export interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  stepStatuses?: StepStatus[];
  showLabel?: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  stepStatuses = [],
  showLabel = true,
}) => {
  const getStepColor = (index: number): string => {
    const status = stepStatuses[index];
    if (status === 'pass') return colors.success;
    if (status === 'fail') return colors.error;
    if (index === currentStep) return colors.primary;
    if (index < currentStep) return colors.success;
    return colors.border;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: getStepColor(index) },
              index === currentStep && styles.dotActive,
            ]}
          />
        ))}
      </View>
      {showLabel && (
        <Text style={styles.label}>
          Step {currentStep + 1} of {totalSteps}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    ...typography.caption,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/StepIndicator.tsx
git commit -m "feat(ui): add StepIndicator component"
```

---

### Task 10: Create InfoBox Component

**Files:**
- Create: `src/components/ui/InfoBox.tsx`

**Step 1: Create InfoBox component**

```typescript
// src/components/ui/InfoBox.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from './theme';

export type InfoBoxVariant = 'info' | 'success' | 'warning' | 'error';

export interface InfoBoxProps {
  message: string;
  variant?: InfoBoxVariant;
  title?: string;
}

interface VariantConfig {
  bg: string;
  border: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
}

const variantConfig: Record<InfoBoxVariant, VariantConfig> = {
  info: {
    bg: '#E3F2FD',
    border: colors.primary,
    icon: 'info',
    iconColor: colors.primary,
  },
  success: {
    bg: colors.successLight,
    border: colors.success,
    icon: 'check-circle',
    iconColor: colors.success,
  },
  warning: {
    bg: colors.warningLight,
    border: colors.warning,
    icon: 'warning',
    iconColor: colors.warning,
  },
  error: {
    bg: colors.errorLight,
    border: colors.error,
    icon: 'error',
    iconColor: colors.error,
  },
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  message,
  variant = 'info',
  title,
}) => {
  const config = variantConfig[variant];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.bg, borderLeftColor: config.border },
      ]}
    >
      <MaterialIcons name={config.icon} size={20} color={config.iconColor} />
      <View style={styles.content}>
        {title && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderRadius: borderRadius.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
```

**Step 2: Commit**

```bash
git add src/components/ui/InfoBox.tsx
git commit -m "feat(ui): add InfoBox component"
```

---

### Task 11: Create Barrel Export

**Files:**
- Create: `src/components/ui/index.ts`

**Step 1: Create barrel export file**

```typescript
// src/components/ui/index.ts

// Theme
export * from './theme';

// Components
export * from './Button';
export * from './ScreenHeader';
export * from './ActionFooter';
export * from './StatusBadge';
export * from './ValidationCard';
export * from './DetailCard';
export * from './SectionHeader';
export * from './StepIndicator';
export * from './InfoBox';
```

**Step 2: Commit**

```bash
git add src/components/ui/index.ts
git commit -m "feat(ui): add barrel export for component library"
```

---

## Phase 2: Screen Refactoring - Material-Specific Screens

### Task 12: Refactor InspectorDryIceScreen

**Files:**
- Modify: `src/components/Inspector/InspectorDryIceScreen.tsx`

**Step 1: Read the current implementation**

Read the file to understand the current structure and identify:
- Header pattern being used
- Footer button configuration
- Any status badges or cards
- Step indicator usage

**Step 2: Add UI library import**

Replace individual imports with:
```typescript
import {
  ScreenHeader,
  ActionFooter,
  Button,
  StepIndicator,
  InfoBox,
  colors,
  spacing,
} from '../ui';
```

**Step 3: Replace header with ScreenHeader**

Find the header View and replace with:
```typescript
<ScreenHeader
  title="Dry Ice Verification"
  onBack={() => navigation.goBack()}
  rightIcon="help-outline"
  onRightPress={() => setShowHelp(true)}
/>
```

**Step 4: Replace footer with ActionFooter**

Find the footer View and replace with appropriate ActionFooter configuration.

**Step 5: Replace hardcoded colors with theme tokens**

Search and replace:
- `'#007AFF'` → `colors.primary`
- `'#34C759'` → `colors.success`
- `'#FF3B30'` → `colors.error`
- etc.

**Step 6: Remove unused styles**

Delete StyleSheet entries that are now handled by components.

**Step 7: Verify visual parity**

Run the app and navigate to this screen to verify it looks identical.

**Step 8: Commit**

```bash
git add src/components/Inspector/InspectorDryIceScreen.tsx
git commit -m "refactor(inspector): migrate InspectorDryIceScreen to UI library"
```

---

### Task 13-17: Refactor Remaining Material-Specific Screens

Repeat Task 12 pattern for each screen:

**Task 13:** `InspectorMagnetizedMaterialsScreen.tsx`
**Task 14:** `InspectorCapacitorsScreen.tsx`
**Task 15:** `InspectorLifeSavingAppliancesScreen.tsx`
**Task 16:** `InspectorSafetyDevicesScreen.tsx`
**Task 17:** `InspectorLithiumBatteriesScreen.tsx`

Each task follows the same steps:
1. Read current implementation
2. Add UI library import
3. Replace header with ScreenHeader
4. Replace footer with ActionFooter
5. Replace hardcoded colors with theme tokens
6. Remove unused styles
7. Verify visual parity
8. Commit with message: `refactor(inspector): migrate [ScreenName] to UI library`

---

## Phase 3: Screen Refactoring - SDDG & Summary Screens

### Task 18: Refactor SDDGInspectionCompleteScreen

**Files:**
- Modify: `src/components/SDDGInspectionCompleteScreen.tsx`

Follow the same pattern as Task 12, additionally:
- Use `DetailCard` for the summary card showing TCN, PSN, etc.
- Use `InfoBox` with `variant="success"` for the success message

**Commit:** `refactor(sddg): migrate SDDGInspectionCompleteScreen to UI library`

---

### Task 19: Refactor SDDGFrustrationSummary

**Files:**
- Modify: `src/components/SDDGFrustrationSummary.tsx`

Follow the same pattern, additionally:
- Use `DetailCard` with `status="error"` for frustration cards
- Use `StatusBadge` for frustration indicators

**Commit:** `refactor(sddg): migrate SDDGFrustrationSummary to UI library`

---

### Task 20: Refactor PackageInspectionCompleteScreen

**Files:**
- Modify: `src/components/Inspector/PackageInspectionCompleteScreen.tsx`

**Commit:** `refactor(inspector): migrate PackageInspectionCompleteScreen to UI library`

---

### Task 21: Refactor PackageFrustrationSummary

**Files:**
- Modify: `src/components/Inspector/PackageFrustrationSummary.tsx`

**Commit:** `refactor(inspector): migrate PackageFrustrationSummary to UI library`

---

### Task 22: Refactor InspectorPOPMarkingValidationScreen

**Files:**
- Modify: `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

Additionally:
- Use `ValidationCard` if applicable
- Use `StatusBadge` for validation states

**Commit:** `refactor(inspector): migrate InspectorPOPMarkingValidationScreen to UI library`

---

### Task 23: Refactor InteractiveSDDGComplianceScreen

**Files:**
- Modify: `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx`

**Commit:** `refactor(inspector): migrate InteractiveSDDGComplianceScreen to UI library`

---

### Task 24: Refactor InspectorHomeScreen

**Files:**
- Modify: `src/components/Inspector/InspectorHomeScreen.tsx`

**Commit:** `refactor(inspector): migrate InspectorHomeScreen to UI library`

---

## Phase 4: Screen Refactoring - High Complexity Screens

### Task 25: Refactor InspectorMarkingsLabelsValidationScreen

**Files:**
- Modify: `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

This screen heavily uses the validation card pattern. Key changes:
- Replace all validation card implementations with `ValidationCard` component
- Use `SectionHeader` for the MARKINGS and LABELS section headers
- Use `StatusBadge` for all status indicators

**Commit:** `refactor(inspector): migrate InspectorMarkingsLabelsValidationScreen to UI library`

---

### Task 26: Refactor MLDetectionScreen

**Files:**
- Modify: `src/components/Inspector/MLDetectionScreen.tsx`

This is a complex screen with camera, cropping, and results states. Focus on:
- Header/footer standardization
- Status badges in results view
- Color token replacement

**Commit:** `refactor(inspector): migrate MLDetectionScreen to UI library`

---

### Task 27: Refactor InspectorAMC1015Form

**Files:**
- Modify: `src/components/Inspector/InspectorAMC1015Form.tsx`

**Commit:** `refactor(inspector): migrate InspectorAMC1015Form to UI library`

---

## Phase 5: Cleanup & Verification

### Task 28: Remove Duplicate Style Definitions

**Step 1: Search for orphaned styles**

Run grep to find any remaining hardcoded color values:
```bash
grep -r "#007AFF\|#34C759\|#FF3B30\|#FF9500" src/components/Inspector/
```

**Step 2: Fix any remaining instances**

Replace with theme tokens.

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor(inspector): clean up remaining hardcoded styles"
```

---

### Task 29: Final Verification

**Step 1: Run TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 2: Run existing tests**

```bash
npm test
```

Expected: All tests pass

**Step 3: Manual visual verification**

Navigate through complete Inspector workflow:
1. InspectorHomeScreen → Start inspection
2. SDDG flow → InteractiveSDDGComplianceScreen → SDDGInspectionCompleteScreen
3. Package flow → MLDetectionScreen → POPMarkingValidation → MarkingsLabelsValidation
4. Material screen (if applicable)
5. Completion → PackageInspectionCompleteScreen → AMC1015Form

Verify each screen looks identical to before refactoring.

**Step 4: Final commit**

```bash
git add -A
git commit -m "refactor(inspector): complete UI library migration - all screens verified"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1-11 | Create component library (11 files) |
| 2 | 12-17 | Refactor material-specific screens (6 screens) |
| 3 | 18-24 | Refactor SDDG & summary screens (7 screens) |
| 4 | 25-27 | Refactor high-complexity screens (3 screens) |
| 5 | 28-29 | Cleanup and verification |

**Total tasks:** 29
**Estimated commits:** ~30
