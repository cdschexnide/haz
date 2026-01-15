// src/components/preparer/ShipmentTable.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/components/ui/theme';
import { SavedShipment } from '@/contexts/HazProPreparerProvider/reducer';

export interface ShipmentTableProps {
  shipments: SavedShipment[];
  onShipmentLongPress: (shipment: SavedShipment) => void;
  onDelete: (shipmentId: string) => void;
  onCopy: (shipmentId: string) => void;
  isLoading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const TableHeader: React.FC = () => (
  <View style={styles.tableHeader}>
    <View style={styles.column}>
      <Text style={styles.headerText}>TCN</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>UN, NA, ID No.</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>Class/Div</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>POE</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>POD</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>Signatory</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.headerText}>Status</Text>
    </View>
  </View>
);

const EmptyComponent: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading shipments...</Text>
      </View>
    );
  }
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No shipments found</Text>
      <Text style={styles.emptySubtext}>Create a new shipment to get started</Text>
    </View>
  );
};

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onShipmentLongPress,
  onDelete,
  onCopy,
  isLoading = false,
  refreshing = false,
  onRefresh,
}) => {
  const renderItem = ({ item, index }: { item: SavedShipment; index: number }) => (
    <ListItem.Swipeable
      containerStyle={styles.listItemContainer}
      leftWidth={120}
      rightWidth={120}
      onLongPress={() => onShipmentLongPress(item)}
      leftContent={
        <Button
          title="Copy"
          icon={<Feather style={{ marginRight: 10 }} name="copy" size={20} color="white" />}
          buttonStyle={{ minHeight: '100%' }}
          onPress={() => onCopy(item.id)}
        />
      }
      rightContent={
        <Button
          title="Delete"
          onPress={() => onDelete(item.id)}
          icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: colors.error }}
        />
      }
    >
      <ListItem.Content>
        <View style={styles.listItemRow}>
          <View style={styles.columnCell}>
            <Text style={styles.columnText}>
              {item.hazProPreparerContext.shipment?.tcn || '-'}
            </Text>
          </View>
          <View style={styles.columnCell}>
            <Text style={styles.columnText}>
              {item.hazProPreparerContext.hazardousMaterial?.unid || '-'}
            </Text>
          </View>
          <View style={styles.columnCell}>
            <Text style={styles.columnText}>
              {item.hazProPreparerContext.hazardousMaterial?.hazclassDiv || '-'}
            </Text>
          </View>
          <View style={styles.columnCell}>
            <Text style={styles.columnText}>
              {item.hazProPreparerContext.shipment?.poe || '-'}
            </Text>
          </View>
          <View style={styles.columnCell}>
            <Text style={styles.columnText}>
              {item.hazProPreparerContext.shipment?.pod || '-'}
            </Text>
          </View>
          <View style={styles.columnCell}>
            <Text style={styles.columnText}>
              {item.hazProPreparerContext.preparer?.preparerName || '-'}
            </Text>
          </View>
          <View style={styles.columnCell}>
            <Text
              style={[
                styles.statusBadge,
                item.status === 'completed' ? styles.statusCompleted : styles.statusInProgress,
              ]}
            >
              {item.status === 'completed' ? 'Completed' : 'In Progress'}
            </Text>
          </View>
        </View>
      </ListItem.Content>
    </ListItem.Swipeable>
  );

  return (
    <FlatList
      data={shipments}
      keyExtractor={(item) => item.id}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      getItemLayout={(data, index) => ({
        length: 60,
        offset: 60 * index,
        index,
      })}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={<TableHeader />}
      ListEmptyComponent={<EmptyComponent isLoading={isLoading} />}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  headerText: {
    ...typography.body,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  columnCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderTopWidth: 0.5,
    borderColor: colors.border,
  },
  columnText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  listItemContainer: {
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderColor: colors.border,
    width: '100%',
    borderRadius: 0,
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 'bold',
    overflow: 'hidden',
    textAlign: 'center',
  },
  statusCompleted: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },
  statusInProgress: {
    backgroundColor: colors.warningLight,
    color: colors.warning,
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    ...typography.body,
    color: colors.primary,
    fontStyle: 'italic',
    marginLeft: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
