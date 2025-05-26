import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  Switch,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, darkColors, lightColors } from './ThemeContext';
import { Interview, InterviewStatus, saveInterview, getInterviews, deleteInterview, updateInterviewStatus } from './InterviewTracker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SCREEN_HEIGHT = Dimensions.get('window').height;

const InterviewScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  const [interviews, setInterviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [newInterview, setNewInterview] = useState({
    company: '',
    position: '',
    date: new Date(),
    notes: ''
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      width: '100%',
      maxHeight: '90%',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: 'hidden',
      backgroundColor: Colors.cardBackground,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      backgroundColor: Colors.cardBackground,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.text,
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      padding: 10,
      zIndex: 1,
    },
    formScrollContent: {
      flexGrow: 1,
    },
    formContainer: {
      padding: 20,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      fontSize: 16,
    },
    textArea: {
      height: 100,
      paddingTop: 12,
      paddingBottom: 12,
      textAlignVertical: 'top',
    },
    dateButton: {
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    dateButtonText: {
      fontSize: 16,
      fontWeight: '500',
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
      paddingHorizontal: 5,
    },
    reminderText: {
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
    },
    button: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    buttonText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    interviewCard: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    interviewCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    companyContainer: {
      flex: 1,
      marginRight: 16,
    },
    companyName: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 4,
    },
    position: {
      fontSize: 16,
      marginBottom: 8,
    },
    deleteButton: {
      padding: 4,
    },
    dateTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      marginBottom: 16,
      gap: 12,
    },
    dateTimeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
    },
    dateTimeText: {
      fontSize: 15,
      marginLeft: 6,
      fontWeight: '500',
    },
    statusContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    activeStatus: {
      backgroundColor: '#fff',
    },
    statusText: {
      fontSize: 14,
      fontWeight: '500',
    },
    notesContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },
    notes: {
      flex: 1,
      fontSize: 14,
      marginLeft: 8,
      lineHeight: 20,
    },
    viewDetailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginTop: 12,
    },
    viewDetailsText: {
      fontSize: 14,
      fontWeight: '600',
      marginRight: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      marginTop: 12,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    datePickerContainer: {
      backgroundColor: Colors.cardBackground,
      borderRadius: 8,
      marginBottom: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: Colors.separator,
    },
    iosDatePicker: {
      height: 200,
      marginBottom: 10,
    },
    datePickerButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    datePickerButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.white,
    },
    statusButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 1,
    },
  });

  useEffect(() => {
    loadInterviews();
    requestNotificationPermissions();
  }, []);

  const resetForm = useCallback(() => {
    setNewInterview({
      company: '',
      position: '',
      date: new Date(),
      notes: ''
    });
    setEnableReminder(false);
    setReminderTime(new Date());
    setShowDatePicker(false);
    setShowReminderPicker(false);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowDatePicker(false);
    setShowReminderPicker(false);
    Keyboard.dismiss();
    setModalVisible(false);
    resetForm();
  }, [resetForm]);

  const handleModalOpen = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleAddInterview = useCallback(async () => {
    try {
      if (!newInterview.company.trim() || !newInterview.position.trim()) {
        Alert.alert('Required Fields', 'Please fill in both Company Name and Position');
        return;
      }

      const interview = new Interview(
        newInterview.company.trim(),
        newInterview.position.trim(),
        newInterview.date.toISOString(),
        newInterview.notes.trim()
      );

      const success = await saveInterview(interview);
      
      if (success) {
        if (enableReminder) {
          try {
            await scheduleNotification(interview);
          } catch (error) {
            console.error('Failed to schedule notification:', error);
            // Continue with saving interview even if notification fails
          }
        }
        
        await loadInterviews(); // Reload the interviews list
        handleModalClose(); // Close the modal after successful save
        
        // Show success message
        Alert.alert('Success', 'Interview has been added successfully');
      } else {
        Alert.alert('Error', 'Failed to save interview. Please try again.');
      }
    } catch (error) {
      console.error('Error adding interview:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  }, [newInterview, enableReminder, handleModalClose, loadInterviews]);

  const handleInputChange = useCallback((field, value) => {
    setNewInterview(prev => ({ ...prev, [field]: value }));
  }, []);

  const scheduleNotification = async (interview) => {
    if (!enableReminder) return;

    try {
      // Get the interview date
      const interviewDate = new Date(interview.date);
      
      // Create reminder date - default to 1 day before the interview at the specified time
      const reminderDate = new Date(interviewDate);
      reminderDate.setDate(reminderDate.getDate() - 1); // Set to one day before
      reminderDate.setHours(reminderTime.getHours());
      reminderDate.setMinutes(reminderTime.getMinutes());
      reminderDate.setSeconds(0);
      reminderDate.setMilliseconds(0);

      // Validate that the reminder date is in the future
      const now = new Date();
      if (reminderDate <= now) {
        Alert.alert(
          "Invalid Reminder Time",
          "The reminder time must be in the future. Please select a different time."
        );
        return;
      }

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Interview Reminder',
          body: `You have an interview with ${interview.company} for ${interview.position} tomorrow at ${interviewDate.toLocaleTimeString()}`,
          data: { interviewId: interview.id },
        },
        trigger: {
          date: reminderDate,
          seconds: null, // Ensure no seconds are specified
        },
      });

      console.log('Notification scheduled for:', reminderDate.toLocaleString());
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert(
        "Reminder Setup Failed",
        "Could not set up the interview reminder. Please try again."
      );
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to receive interview reminders",
          [{ text: "OK" }]
        );
        setEnableReminder(false);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert(
        "Permission Error",
        "Could not request notification permissions. Reminders will be disabled.",
        [{ text: "OK" }]
      );
      setEnableReminder(false);
      return false;
    }
  };

  const loadInterviews = async () => {
    const loadedInterviews = await getInterviews();
    setInterviews(loadedInterviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleStatusChange = async (interview, newStatus) => {
    const success = await updateInterviewStatus(interview.id, newStatus);
    if (success) {
      loadInterviews();
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    Alert.alert(
      'Delete Interview',
      'Are you sure you want to delete this interview?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteInterview(interviewId);
            if (success) {
              loadInterviews();
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case InterviewStatus.SCHEDULED: return '#007AFF';
      case InterviewStatus.COMPLETED: return '#34C759';
      case InterviewStatus.CANCELLED: return '#FF3B30';
      case InterviewStatus.OFFERED: return '#5856D6';
      case InterviewStatus.REJECTED: return '#FF9500';
      default: return Colors.text;
    }
  };

  const AddInterviewModal = useCallback(() => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleModalClose}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
        
        <View style={[styles.modalContent, { backgroundColor: Colors.cardBackground }]}>
          <View style={[styles.modalHeader, { borderBottomColor: Colors.separator }]}>
            <Text style={[styles.modalTitle, { color: Colors.text }]}>Add New Interview</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={Colors.lightText} />
            </TouchableOpacity>
          </View>

          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formScrollContent}
          >
            <View style={styles.formContainer}>
              <TextInput
                style={[styles.input, { 
                  color: Colors.text, 
                  borderColor: Colors.separator, 
                  backgroundColor: Colors.cardBackground 
                }]}
                placeholder="Company Name"
                placeholderTextColor={Colors.lightText}
                value={newInterview.company}
                onChangeText={(text) => handleInputChange('company', text)}
                returnKeyType="next"
                autoCapitalize="words"
                autoCorrect={false}
              />

              <TextInput
                style={[styles.input, { 
                  color: Colors.text, 
                  borderColor: Colors.separator, 
                  backgroundColor: Colors.cardBackground 
                }]}
                placeholder="Position"
                placeholderTextColor={Colors.lightText}
                value={newInterview.position}
                onChangeText={(text) => handleInputChange('position', text)}
                returnKeyType="next"
                autoCapitalize="words"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: Colors.primary + '20' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: Colors.primary }]}>
                  {newInterview.date.toLocaleDateString()} {newInterview.date.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={newInterview.date}
                    mode="datetime"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        handleInputChange('date', selectedDate);
                      }
                    }}
                    textColor={Colors.text}
                    style={styles.iosDatePicker}
                  />
                  <TouchableOpacity
                    style={[styles.datePickerButton, { backgroundColor: Colors.primary }]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}

              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  value={newInterview.date}
                  mode="datetime"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      handleInputChange('date', selectedDate);
                    }
                  }}
                />
              )}

              <View style={styles.reminderContainer}>
                <Text style={[styles.reminderText, { color: Colors.text }]}>Enable Reminder</Text>
                <Switch
                  value={enableReminder}
                  onValueChange={setEnableReminder}
                  trackColor={{ false: Colors.lightText, true: Colors.primary }}
                />
              </View>

              {enableReminder && (
                <TouchableOpacity
                  style={[styles.dateButton, { backgroundColor: Colors.primary + '20' }]}
                  onPress={() => setShowReminderPicker(true)}
                >
                  <Text style={[styles.dateButtonText, { color: Colors.primary }]}>
                    Reminder Time: {reminderTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              )}

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { 
                    color: Colors.text, 
                    borderColor: Colors.separator, 
                    backgroundColor: Colors.cardBackground 
                  }
                ]}
                placeholder="Notes"
                placeholderTextColor={Colors.lightText}
                value={newInterview.notes}
                onChangeText={(text) => handleInputChange('notes', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={[styles.buttonContainer, { 
            borderTopColor: Colors.separator, 
            backgroundColor: Colors.cardBackground 
          }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.primary }]}
              onPress={handleAddInterview}
            >
              <Text style={styles.buttonText}>Add Interview</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: Colors.accent }]}
              onPress={handleModalClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  ), [modalVisible, newInterview, enableReminder, reminderTime, showDatePicker, showReminderPicker, Colors, handleModalClose, handleInputChange, handleAddInterview]);

  const InterviewCard = ({ interview, onPress, onDelete, onStatusChange }) => {
    const { isDarkMode } = useTheme();
    const Colors = isDarkMode ? darkColors : lightColors;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(/\s/g, ''); // Remove extra spaces
    };

    const getStatusStyle = (status) => {
      let backgroundColor, textColor, borderColor;
      switch (status) {
        case InterviewStatus.SCHEDULED:
          backgroundColor = '#007AFF15';
          textColor = '#007AFF';
          borderColor = '#007AFF';
          break;
        case InterviewStatus.COMPLETED:
          backgroundColor = '#34C75915';
          textColor = '#34C759';
          borderColor = '#34C759';
          break;
        case InterviewStatus.CANCELLED:
          backgroundColor = '#FF3B3015';
          textColor = '#FF3B30';
          borderColor = '#FF3B30';
          break;
        case InterviewStatus.OFFERED:
          backgroundColor = '#5856D615';
          textColor = '#5856D6';
          borderColor = '#5856D6';
          break;
        case InterviewStatus.REJECTED:
          backgroundColor = '#FF950015';
          textColor = '#FF9500';
          borderColor = '#FF9500';
          break;
        default:
          backgroundColor = Colors.primary + '15';
          textColor = Colors.primary;
          borderColor = Colors.primary;
      }
      return {
        backgroundColor,
        color: textColor,
        borderColor,
      };
    };

    return (
      <TouchableOpacity
        style={[styles.interviewCard, { 
          backgroundColor: Colors.cardBackground,
          borderLeftWidth: 4,
          borderLeftColor: getStatusStyle(interview.status).borderColor
        }]}
        onPress={onPress}
      >
        <View style={styles.interviewCardHeader}>
          <View style={styles.companyContainer}>
            <Text style={[styles.companyName, { color: Colors.text }]}>{interview.company}</Text>
            <Text style={[styles.position, { color: Colors.lightText }]}>{interview.position}</Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => onDelete(interview.id)}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={[styles.dateTimeItem, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <Text style={[styles.dateTimeText, { color: Colors.text }]}>
              {formatDate(interview.date)}
            </Text>
          </View>
          <View style={[styles.dateTimeItem, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <Text style={[styles.dateTimeText, { color: Colors.text }]}>
              {formatTime(interview.date)}
            </Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          {Object.values(InterviewStatus).map((status) => {
            const statusStyle = getStatusStyle(status);
            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  { 
                    backgroundColor: interview.status === status ? statusStyle.backgroundColor : 'transparent',
                    borderColor: statusStyle.borderColor
                  }
                ]}
                onPress={() => onStatusChange(interview, status)}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: statusStyle.color }
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {interview.notes && (
          <View style={[styles.notesContainer, { borderTopColor: Colors.separator }]}>
            <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
            <Text style={[styles.notes, { color: Colors.lightText }]} numberOfLines={2}>
              {interview.notes}
            </Text>
          </View>
        )}

        <View style={styles.viewDetailsContainer}>
          <Text style={[styles.viewDetailsText, { color: Colors.primary }]}>View Details</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={[styles.header, { backgroundColor: Colors.cardBackground, borderBottomColor: Colors.separator }]}>
        <Text style={[styles.headerTitle, { color: Colors.text }]}>Interview Tracker</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: Colors.primary }]}
          onPress={handleModalOpen}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {interviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="briefcase-outline" 
            size={64} 
            color={Colors.lightText} 
            style={styles.emptyIcon}
          />
          <Text style={[styles.emptyText, { color: Colors.lightText }]}>
            No interviews yet. Tap the + button to add your first interview.
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onPress={() => navigation.navigate('InterviewDetail', { interview })}
              onDelete={handleDeleteInterview}
              onStatusChange={handleStatusChange}
            />
          ))}
        </ScrollView>
      )}

      <AddInterviewModal />
    </View>
  );
};

export default InterviewScreen; 