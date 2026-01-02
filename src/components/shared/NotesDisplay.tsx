import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NotesDisplayProps {
  notes: string[];
  isDisabled?: boolean;
}

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  notes,
  isDisabled = false
}) => {
  return (
    <View style={styles.container}>
      <Text style={[
        styles.label,
        isDisabled && styles.disabledText
      ]}>
        Notes:
      </Text>
      {notes.map((note, index) => (
        <View key={`note-${index}`} style={styles.noteRow}>
          <Text style={[
            styles.bulletPoint,
            isDisabled && styles.disabledText
          ]}>
            •
          </Text>
          <Text style={[
            styles.noteText,
            isDisabled && styles.disabledText
          ]}>
            {note}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6E6E6E',
    marginBottom: 4,
  },
  noteRow: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingLeft: 4,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#000000',
    marginRight: 8,
  },
  noteText: {
    fontSize: 15,
    color: '#000000',
    flex: 1,
  },
  disabledText: {
    color: '#ADADAD',
  },
});