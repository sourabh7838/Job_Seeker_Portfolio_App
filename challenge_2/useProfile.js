import { useState, useEffect } from 'react';
import DatabaseManager from './database/DatabaseManager';

// Default profile data
const defaultProfile = {
  name: "Chauhan",
  title: "Aspiring React Native Developer",
  profileImage: null,
  bio: "A passionate and driven individual seeking opportunities to leverage skills in mobile development. Eager to contribute to innovative projects and grow within a dynamic team. My goal is to build intuitive and impactful mobile experiences.",
  education: [
    {
      id: 'edu1',
      institution: "Lakehead University",
      degree: "M.Sc. in Computer Science",
      period: "2024 - 2025",
      details: "Relevant coursework: Mobile App Development, Data Structures & Algorithms, Web Technologies. Dean's List 2020, 2021."
    },
    {
      id: 'edu2',
      institution: "Online Coding Bootcamp",
      degree: "Full-Stack Web Development Certificate",
      period: "2022",
      details: "Intensive program covering React, Node.js, Express, and MongoDB."
    }
  ],
  certificates: [
    {
      id: 'cert1',
      name: 'React Native Nanodegree',
      issuer: 'Udacity',
      date: 'March 2023',
      description: 'Completed an intensive program covering advanced React Native concepts, state management with Redux, and native module integration. Built several portfolio-worthy applications.',
      verifyUrl: 'https://confirm.udacity.com/PQRXYZ123'
    }
  ],
  skills: [
    { id: '1', name: 'React Native', proficiency: 'Intermediate', icon: 'logo-react' },
    { id: '2', name: 'JavaScript (ES6+)', proficiency: 'Intermediate', icon: 'logo-javascript' },
    { id: '3', name: 'Expo CLI', proficiency: 'Intermediate', icon: 'flash' }
  ],
  projects: [
    {
      id: '1',
      title: 'My Personal Portfolio App',
      description: 'Developed this React Native application to showcase my skills and projects.',
      longDescription: "This very application serves as a testament to my React Native abilities...",
      technologies: ['React Native', 'Expo', 'JavaScript', 'React Navigation', 'Context API'],
      image: require('./assets/profile.png'),
      link: null,
      valueAdded: "Demonstrates initiative, React Native fundamentals..."
    }
  ],
  testimonials: [
    {
      id: 'test1',
      quote: "Group-2 is a highly motivated and quick learner...",
      author: "Dr. Jane Smith",
      relation: "Professor, State University"
    }
  ],
  contactInfo: {
    email: 'group2@gmail.com',
    phone: '+1234567890',
    linkedin: 'https://linkedin.com/in/group2',
    github: 'https://github.com/group2',
    resumeUrl: 'https://www.example.com/resumes/group2_resume.pdf'
  }
};

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const savedProfile = await DatabaseManager.loadProfile();
      if (savedProfile && Object.keys(savedProfile).length > 0) {
        setProfile(savedProfile);
      } else {
        // Initialize storage with default profile if no data exists
        await DatabaseManager.saveProfile(defaultProfile);
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError(error);
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfile) => {
    try {
      setLoading(true);
      setError(null);
      await DatabaseManager.saveProfile(newProfile);
      setProfile(newProfile);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile: profile || defaultProfile,
    loading,
    error,
    updateProfile,
    loadProfile
  };
}; 