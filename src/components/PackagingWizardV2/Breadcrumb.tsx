import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

interface BreadcrumbProps {
  step: number;
  selectedPackagingType?: string;
  selectedCategory?: string;
  selectedCode?: string;
}

const theme = {
  colors: {
    primary: '#0066cc',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
    background: {
      card: '#ffffff',
    },
    border: '#dee2e6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
  },
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  step,
  selectedPackagingType,
  selectedCategory,
  selectedCode,
}) => {
  const breadcrumbs: string[] = [];

  if (selectedPackagingType) {
    breadcrumbs.push(selectedPackagingType);
  }
  if (selectedCategory && step >= 2) {
    breadcrumbs.push(selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1));
  }
  if (selectedCode && step >= 3) {
    breadcrumbs.push(selectedCode);
  }

  // Add placeholder for current step
  if (step === 0 && !selectedPackagingType) {
    breadcrumbs.push('Select Type');
  } else if (step === 1 && !selectedCategory) {
    breadcrumbs.push('Select Container');
  } else if (step === 2 && !selectedCode) {
    breadcrumbs.push('Select Code');
  }

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {breadcrumbs.map((crumb, index) => (
        <View key={index} style={styles.breadcrumbItem}>
          <Text
            style={[
              styles.breadcrumbText,
              index === breadcrumbs.length - 1 ? styles.activeBreadcrumb : null,
            ]}
          >
            {crumb}
          </Text>
          {index < breadcrumbs.length - 1 && (
            <Icon
              name="chevron-right"
              size={16}
              color={theme.colors.text.secondary}
              style={styles.separator}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  activeBreadcrumb: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  separator: {
    marginHorizontal: theme.spacing.xs,
  },
});

export default Breadcrumb;
