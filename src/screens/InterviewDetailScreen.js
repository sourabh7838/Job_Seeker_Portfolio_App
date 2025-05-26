import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, darkColors, lightColors } from '../contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Interview,
  InterviewStatus,
  saveInterview,
  addInterviewQuestion,
  addTechnicalTopic,
  updateInterviewStatus,
} from '../utils/InterviewTracker';

const InterviewDetailScreen = ({ route, navigation }) => {
  const { interview: initialInterview } = route.params;
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  const [interview, setInterview] = useState(initialInterview);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(interview.date));

  useEffect(() => {
    navigation.setOptions({
      title: interview.company,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSave}
        >
          <Text style={{ color: Colors.primary }}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [interview]);

  const handleSave = async () => {
    const success = await saveInterview(interview);
    if (success) {
      Alert.alert('Success', 'Interview details saved successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save interview details');
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    const success = await addInterviewQuestion(interview.id, newQuestion);
    if (success) {
      setInterview(prev => ({
        ...prev,
        questions: [
          ...prev.questions,
          {
            id: Date.now().toString(),
            question: newQuestion,
            answer: '',
            timestamp: new Date().toISOString()
          }
        ]
      }));
      setNewQuestion('');
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.trim()) return;
    
    const success = await addTechnicalTopic(interview.id, newTopic);
    if (success) {
      setInterview(prev => ({
        ...prev,
        technicalTopics: [
          ...prev.technicalTopics,
          {
            id: Date.now().toString(),
            topic: newTopic,
            prepared: false,
            notes: '',
            resources: []
          }
        ]
      }));
      setNewTopic('');
    }
  };

  const updateTopicPrepared = (topicId) => {
    setInterview(prev => ({
      ...prev,
      technicalTopics: prev.technicalTopics.map(topic =>
        topic.id === topicId ? { ...topic, prepared: !topic.prepared } : topic
      )
    }));
  };

  const updateQuestionAnswer = (questionId, answer) => {
    setInterview(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, answer } : q
      )
    }));
  };

  const handleStatusChange = async (newStatus) => {
    const success = await updateInterviewStatus(interview.id, newStatus);
    if (success) {
      setInterview(prev => ({ ...prev, status: newStatus }));
    }
  };

  const commonTips = [
    "Research the company's values and recent news",
    "Prepare STAR method responses for behavioral questions",
    "Review the job description thoroughly",
    "Prepare questions to ask the interviewer",
    "Test your technical setup if it's a virtual interview",
    "Plan your route if it's an in-person interview",
    "Review your portfolio/projects mentioned in your application",
    "Practice common technical questions in your field"
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={[styles.container, { backgroundColor: Colors.background }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Status Section */}
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Status</Text>
            <View style={styles.statusContainer}>
              {Object.values(InterviewStatus).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    { 
                      backgroundColor: interview.status === status ? Colors.primary : 'transparent',
                      borderColor: Colors.primary
                    }
                  ]}
                  onPress={() => handleStatusChange(status)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: interview.status === status ? Colors.white : Colors.primary }
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date and Time Section */}
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Interview Date</Text>
            <View style={[styles.dateTimeContent, { backgroundColor: Colors.cardBackground }]}>
              <View style={styles.dateTimeInfo}>
                <View style={styles.dateBlock}>
                  <Ionicons name="calendar-outline" size={24} color={Colors.primary} style={styles.dateTimeIcon} />
                  <Text style={[styles.dateTimeText, { color: Colors.text }]}>
                    {new Date(interview.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <View style={styles.timeBlock}>
                  <Ionicons name="time-outline" size={24} color={Colors.primary} style={styles.dateTimeIcon} />
                  <Text style={[styles.dateTimeText, { color: Colors.text }]}>
                    {new Date(interview.date).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.editDateButton, { backgroundColor: Colors.primary + '15' }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="pencil-outline" size={20} color={Colors.primary} style={styles.editIcon} />
                <Text style={[styles.editDateText, { color: Colors.primary }]}>
                  Edit Date & Time
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && Platform.OS === 'ios' && (
              <View style={[styles.datePickerContainer, { 
                backgroundColor: Colors.cardBackground,
                borderColor: Colors.separator 
              }]}>
                <DateTimePicker
                  value={selectedDate}
                  mode="datetime"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setSelectedDate(selectedDate);
                      setInterview(prev => ({ ...prev, date: selectedDate.toISOString() }));
                    }
                  }}
                  style={styles.iosDatePicker}
                  textColor={Colors.text}
                />
                <TouchableOpacity
                  style={[styles.doneDateButton, { backgroundColor: Colors.primary }]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={[styles.doneDateText, { color: Colors.white }]}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setSelectedDate(selectedDate);
                    setInterview(prev => ({ ...prev, date: selectedDate.toISOString() }));
                  }
                }}
              />
            )}
          </View>

          {/* Preparation Tips */}
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Preparation Tips</Text>
            {commonTips.map((tip, index) => (
              <View key={index} style={styles.tipContainer}>
                <Ionicons name="checkmark-circle-outline" size={24} color={Colors.primary} />
                <Text style={[styles.tipText, { color: Colors.text }]}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Technical Topics */}
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Technical Topics to Prepare</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: Colors.text, borderColor: Colors.separator }]}
                placeholder="Add a technical topic to prepare"
                placeholderTextColor={Colors.lightText}
                value={newTopic}
                onChangeText={setNewTopic}
                returnKeyType="done"
                onSubmitEditing={handleAddTopic}
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: Colors.primary }]}
                onPress={handleAddTopic}
              >
                <Ionicons name="add" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            {interview.technicalTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicContainer}
                onPress={() => updateTopicPrepared(topic.id)}
              >
                <Ionicons
                  name={topic.prepared ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={24}
                  color={topic.prepared ? Colors.primary : Colors.lightText}
                />
                <Text style={[styles.topicText, { color: Colors.text }]}>{topic.topic}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Questions and Answers */}
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Questions & Answers</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { color: Colors.text, borderColor: Colors.separator }]}
                placeholder="Add a question"
                placeholderTextColor={Colors.lightText}
                value={newQuestion}
                onChangeText={setNewQuestion}
                returnKeyType="done"
                onSubmitEditing={handleAddQuestion}
              />
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: Colors.primary }]}
                onPress={handleAddQuestion}
              >
                <Ionicons name="add" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
            {interview.questions.map((q) => (
              <View key={q.id} style={styles.questionContainer}>
                <Text style={[styles.questionText, { color: Colors.text }]}>{q.question}</Text>
                <TextInput
                  style={[styles.answerInput, { color: Colors.text, borderColor: Colors.separator }]}
                  placeholder="Add your answer"
                  placeholderTextColor={Colors.lightText}
                  value={q.answer}
                  onChangeText={(text) => updateQuestionAnswer(q.id, text)}
                  multiline
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>
            ))}
          </View>

          {/* Notes Section */}
          <View style={[styles.section, { backgroundColor: Colors.cardBackground, marginBottom: 20 }]}>
            <Text style={[styles.sectionTitle, { color: Colors.text }]}>Additional Notes</Text>
            <TextInput
              style={[styles.notesInput, { color: Colors.text, borderColor: Colors.separator }]}
              placeholder="Add any additional notes"
              placeholderTextColor={Colors.lightText}
              value={interview.notes}
              onChangeText={(text) => setInterview(prev => ({ ...prev, notes: text }))}
              multiline
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 15,
  },
  section: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeContent: {
    paddingTop: 5,
  },
  dateTimeInfo: {
    marginBottom: 12,
  },
  dateBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeIcon: {
    width: 30,
  },
  dateTimeText: {
    fontSize: 17,
    fontWeight: '400',
  },
  editDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  editIcon: {
    marginRight: 8,
  },
  editDateText: {
    fontSize: 17,
    fontWeight: '400',
  },
  datePickerContainer: {
    borderRadius: 12,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
  },
  iosDatePicker: {
    height: 200,
  },
  doneDateButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  doneDateText: {
    fontSize: 17,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  topicText: {
    marginLeft: 10,
    fontSize: 16,
  },
  questionContainer: {
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  answerInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tipText: {
    marginLeft: 10,
    fontSize: 14,
  },
});

export default InterviewDetailScreen; 