import AsyncStorage from '@react-native-async-storage/async-storage';

const INTERVIEW_STORAGE_KEY = '@portfolio_interviews';

export class Interview {
  constructor(company, position, date, notes = '', status = 'scheduled') {
    this.id = Date.now().toString();
    this.company = company;
    this.position = position;
    this.date = date;
    this.notes = notes;
    this.status = status; // scheduled, completed, cancelled, offered, rejected
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.feedback = '';
    this.followUpDate = null;
    this.questions = [];
    this.preparationNotes = '';
    this.technicalTopics = [];
  }
}

export const InterviewStatus = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OFFERED: 'offered',
  REJECTED: 'rejected'
};

export const saveInterview = async (interview) => {
  try {
    const interviews = await getInterviews();
    const existingIndex = interviews.findIndex(i => i.id === interview.id);
    
    if (existingIndex >= 0) {
      interviews[existingIndex] = { ...interview, updatedAt: new Date().toISOString() };
    } else {
      interviews.push(interview);
    }
    
    await AsyncStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(interviews));
    return true;
  } catch (error) {
    console.error('Error saving interview:', error);
    return false;
  }
};

export const getInterviews = async () => {
  try {
    const interviews = await AsyncStorage.getItem(INTERVIEW_STORAGE_KEY);
    return interviews ? JSON.parse(interviews) : [];
  } catch (error) {
    console.error('Error getting interviews:', error);
    return [];
  }
};

export const deleteInterview = async (interviewId) => {
  try {
    const interviews = await getInterviews();
    const filteredInterviews = interviews.filter(i => i.id !== interviewId);
    await AsyncStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(filteredInterviews));
    return true;
  } catch (error) {
    console.error('Error deleting interview:', error);
    return false;
  }
};

export const addInterviewQuestion = async (interviewId, question) => {
  try {
    const interviews = await getInterviews();
    const interview = interviews.find(i => i.id === interviewId);
    
    if (interview) {
      interview.questions.push({
        id: Date.now().toString(),
        question,
        answer: '',
        timestamp: new Date().toISOString()
      });
      interview.updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(interviews));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding interview question:', error);
    return false;
  }
};

export const updateInterviewStatus = async (interviewId, status, feedback = '') => {
  try {
    const interviews = await getInterviews();
    const interview = interviews.find(i => i.id === interviewId);
    
    if (interview) {
      interview.status = status;
      interview.updatedAt = new Date().toISOString();
      if (feedback) {
        interview.feedback = feedback;
      }
      
      await AsyncStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(interviews));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating interview status:', error);
    return false;
  }
};

export const addTechnicalTopic = async (interviewId, topic) => {
  try {
    const interviews = await getInterviews();
    const interview = interviews.find(i => i.id === interviewId);
    
    if (interview) {
      interview.technicalTopics.push({
        id: Date.now().toString(),
        topic,
        prepared: false,
        notes: '',
        resources: []
      });
      interview.updatedAt = new Date().toISOString();
      
      await AsyncStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(interviews));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error adding technical topic:', error);
    return false;
  }
}; 