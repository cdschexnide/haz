/**
 * LabelPickerModal - Searchable picker for hazmat label classes
 *
 * Used for:
 * - Adding missed labels manually
 * - Reclassifying misidentified labels
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  SectionList,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ClassInfo } from "../types";

// Import class mapping
const CLASS_MAPPING: ClassInfo[] = require("../data/class_mapping.json");

interface LabelPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (classInfo: ClassInfo) => void;
  currentClassId?: number; // Highlight current selection (for edit mode)
  title?: string;
}

// Category display names and order
const CATEGORY_CONFIG: { key: string; label: string; color: string }[] = [
  { key: "general_marking", label: "General Markings", color: "#007AFF" },
  { key: "hazardClass1", label: "Class 1 - Explosives", color: "#FF3B30" },
  { key: "hazardClass2", label: "Class 2 - Gases", color: "#34C759" },
  { key: "hazardClass3", label: "Class 3 - Flammable Liquids", color: "#FF9500" },
  { key: "hazardClass4", label: "Class 4 - Flammable Solids", color: "#FF2D55" },
  { key: "hazardClass5", label: "Class 5 - Oxidizers", color: "#FFCC00" },
  { key: "hazardClass6", label: "Class 6 - Toxic/Infectious", color: "#AF52DE" },
  { key: "hazardClass8", label: "Class 8 - Corrosive", color: "#5856D6" },
  { key: "hazardClass9", label: "Class 9 - Miscellaneous", color: "#8E8E93" },
];

// Format camelCase class name to readable text
function formatClassName(name: string): string {
  // Special handling for explosives with compatibility group (e.g., "explosives1.1B" -> "Explosives 1.1B")
  const explosivesMatch = name.match(/^explosives(\d+\.?\d*)([A-Z])?(_.*)?$/i);
  if (explosivesMatch) {
    const division = explosivesMatch[1];
    const compatGroup = explosivesMatch[2] || "";
    const suffix = explosivesMatch[3]
      ? explosivesMatch[3]
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim()
      : "";
    return `Explosives ${division}${compatGroup}${suffix ? " " + suffix : ""}`;
  }

  // Default formatting for other class names
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/([0-9]+)/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

// Get category color
function getCategoryColor(category: string): string {
  return CATEGORY_CONFIG.find((c) => c.key === category)?.color || "#007AFF";
}

export function LabelPickerModal({
  visible,
  onClose,
  onSelect,
  currentClassId,
  title = "Select Label",
}: LabelPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Group classes by category and filter by search
  const sections = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return CATEGORY_CONFIG.map((cat) => {
      const items = CLASS_MAPPING.filter((cls) => {
        // Match category
        if (cls.category !== cat.key) return false;
        // Match search query
        if (query) {
          const formattedName = formatClassName(cls.name).toLowerCase();
          const rawName = cls.name.toLowerCase();
          return formattedName.includes(query) || rawName.includes(query);
        }
        return true;
      });

      return {
        title: cat.label,
        color: cat.color,
        category: cat.key,
        data: items,
      };
    }).filter((section) => section.data.length > 0); // Hide empty sections
  }, [searchQuery]);

  const handleSelect = useCallback(
    (classInfo: ClassInfo) => {
      onSelect(classInfo);
      setSearchQuery("");
      onClose();
    },
    [onSelect, onClose]
  );

  const handleClose = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose]);

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; color: string; data: ClassInfo[] };
  }) => (
    <View style={[styles.sectionHeader, { backgroundColor: section.color + "15" }]}>
      <View style={[styles.sectionDot, { backgroundColor: section.color }]} />
      <Text style={[styles.sectionTitle, { color: section.color }]}>
        {section.title}
      </Text>
      <Text style={styles.sectionCount}>{section.data.length}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: ClassInfo }) => {
    const isSelected = item.id === currentClassId;
    const color = getCategoryColor(item.category);

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.itemDot, { backgroundColor: color }]} />
        <Text
          style={[styles.itemText, isSelected && styles.itemTextSelected]}
          numberOfLines={2}
        >
          {formatClassName(item.name)}
        </Text>
        {isSelected && (
          <MaterialIcons name="check" size={20} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  const totalResults = sections.reduce((sum, s) => sum + s.data.length, 0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.closeButton} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search labels..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Results count */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {searchQuery
              ? `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${searchQuery}"`
              : `${CLASS_MAPPING.length} labels in ${CATEGORY_CONFIG.length} categories`}
          </Text>
        </View>

        {/* List */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={48} color="#C7C7CC" />
              <Text style={styles.emptyText}>No labels found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#1D1D1F",
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  listContent: {
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  sectionCount: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemSelected: {
    backgroundColor: "#F0F8FF",
  },
  itemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: "#1D1D1F",
  },
  itemTextSelected: {
    fontWeight: "600",
    color: "#007AFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#C7C7CC",
    marginTop: 4,
  },
});

export default LabelPickerModal;
