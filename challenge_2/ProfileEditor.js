import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, darkColors, lightColors } from './ThemeContext';
import { useProfile } from './useProfile';

const Section = ({ title, children, style }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  
  return (
    <View style={[styles.section, { backgroundColor: Colors.cardBackground }, style]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: Colors.secondary }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

const InputField = ({ label, value, onChangeText, placeholder, multiline, style, error }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  
  return (
    <View style={[styles.inputGroup, style]}>
      {label && <Text style={[styles.inputLabel, { color: Colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input,
          { 
            color: Colors.text,
            borderColor: error ? '#FF3B30' : Colors.separator,
            backgroundColor: Colors.background
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.lightText}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const ProfileEditor = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  const { profile: initialProfile, updateProfile, loading } = useProfile();
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});

  const validateProfile = useCallback(() => {
    const newErrors = {};
    
    if (!profile?.name?.trim()) newErrors.name = 'Name is required';
    if (!profile?.title?.trim()) newErrors.title = 'Title is required';
    if (!profile?.bio?.trim()) newErrors.bio = 'Bio is required';
    
    // Validate education
    profile?.education?.forEach((edu, index) => {
      if (!edu.institution?.trim()) newErrors[`education_${index}_institution`] = 'Institution is required';
      if (!edu.degree?.trim()) newErrors[`education_${index}_degree`] = 'Degree is required';
    });
    
    // Validate skills
    profile?.skills?.forEach((skill, index) => {
      if (!skill.name?.trim()) newErrors[`skill_${index}_name`] = 'Skill name is required';
    });

    // Validate testimonials
    profile?.testimonials?.forEach((testimonial, index) => {
      if (!testimonial.quote?.trim()) newErrors[`testimonial_${index}_quote`] = 'Quote is required';
      if (!testimonial.author?.trim()) newErrors[`testimonial_${index}_author`] = 'Author name is required';
      if (!testimonial.relation?.trim()) newErrors[`testimonial_${index}_relation`] = 'Author relation/title is required';
    });
    
    // Validate certificates
    profile?.certificates?.forEach((cert, index) => {
      if (!cert.name?.trim()) newErrors[`certificate_${index}_name`] = 'Certificate name is required';
      if (!cert.issuer?.trim()) newErrors[`certificate_${index}_issuer`] = 'Issuer is required';
      if (!cert.date?.trim()) newErrors[`certificate_${index}_date`] = 'Date is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [profile]);

  const handleSave = useCallback(async () => {
    if (!validateProfile()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const success = await updateProfile(profile);
      if (success) {
        Alert.alert('Success', 'Profile saved successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to save profile data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile data');
    }
  }, [profile, validateProfile, updateProfile, navigation]);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons 
            name="close" 
            size={24} 
            color={Colors.primary}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleSave}
          style={styles.headerButton}
        >
          <Text style={{ color: Colors.primary, fontSize: 17, fontWeight: '600' }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
      title: 'Edit Profile',
      headerTitleAlign: 'center'
    });
  }, [navigation, Colors.primary, handleSave]);

  if (loading || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const pickImage = async () => {
    try {
      // Request both camera and media library permissions
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libraryStatus.status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        
        // Update the profile state with the new image
        setProfile(prev => ({
          ...prev,
          profileImage: selectedImageUri
        }));

        // Immediately save the profile to persist the image
        try {
          await updateProfile({
            ...profile,
            profileImage: selectedImageUri
          });
        } catch (error) {
          console.error('Error saving profile with new image:', error);
          Alert.alert('Error', 'Failed to save profile picture. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { 
        id: Date.now().toString(),
        institution: '',
        degree: '',
        period: '',
        details: ''
      }]
    }));
  };

  const updateEducation = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, {
        id: Date.now().toString(),
        name: '',
        proficiency: 'Beginner',
        icon: 'code-slash'
      }]
    }));
  };

  const updateSkill = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now().toString(),
        title: '',
        description: '',
        longDescription: '',
        technologies: [''],
        link: '',
        valueAdded: ''
      }]
    }));
  };

  const updateProject = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addTestimonial = () => {
    setProfile(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, {
        id: Date.now().toString(),
        quote: '',
        author: '',
        relation: ''
      }]
    }));
  };

  const updateTestimonial = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(testimonial =>
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const removeTestimonial = (id) => {
    setProfile(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(testimonial => testimonial.id !== id)
    }));
  };

  const addCertificate = () => {
    setProfile(prev => ({
      ...prev,
      certificates: [...(prev.certificates || []), {
        id: Date.now().toString(),
        name: '',
        issuer: '',
        date: '',
        description: '',
        verifyUrl: ''
      }]
    }));
  };

  const updateCertificate = (id, field, value) => {
    setProfile(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertificate = (id) => {
    setProfile(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: Colors.background }]}
    >
      <ScrollView style={styles.content}>
        <Section title="Basic Information">
          <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
            {profile.profileImage ? (
              <Image source={typeof profile.profileImage === 'number' ? profile.profileImage : { uri: profile.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.imagePlaceholder, { borderColor: Colors.separator }]}>
                <Ionicons name="camera" size={40} color={Colors.lightText} />
                <Text style={[styles.imagePlaceholderText, { color: Colors.lightText }]}>
                  Add Profile Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <InputField
            label="Name"
            value={profile.name}
            onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
            placeholder="Your Name"
            error={errors.name}
          />

          <InputField
            label="Professional Title"
            value={profile.title}
            onChangeText={(text) => setProfile(prev => ({ ...prev, title: text }))}
            placeholder="e.g., Full Stack Developer"
            error={errors.title}
          />

          <InputField
            label="Bio"
            value={profile.bio}
            onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
            placeholder="Tell us about yourself"
            multiline
            error={errors.bio}
          />
        </Section>

        <Section title="Education">
          {profile.education.map((edu, index) => (
            <View key={edu.id} style={styles.educationItem}>
              <InputField
                label="Institution"
                value={edu.institution}
                onChangeText={(text) => updateEducation(edu.id, 'institution', text)}
                placeholder="Institution"
                error={errors[`education_${index}_institution`]}
              />
              <InputField
                label="Degree"
                value={edu.degree}
                onChangeText={(text) => updateEducation(edu.id, 'degree', text)}
                placeholder="Degree"
                error={errors[`education_${index}_degree`]}
              />
              <InputField
                label="Period"
                value={edu.period}
                onChangeText={(text) => updateEducation(edu.id, 'period', text)}
                placeholder="Period (e.g., 2018 - 2022)"
                error={errors[`education_${index}_period`]}
              />
              <InputField
                label="Details"
                value={edu.details}
                onChangeText={(text) => updateEducation(edu.id, 'details', text)}
                placeholder="Details"
                multiline
                error={errors[`education_${index}_details`]}
              />
              {profile.education.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeEducation(edu.id)}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
            onPress={addEducation}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={[styles.addButtonText, { color: Colors.white }]}>Add Education</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Skills">
          {profile.skills.map((skill, index) => (
            <View key={skill.id} style={styles.skillItem}>
              <InputField
                label="Skill Name"
                value={skill.name}
                onChangeText={(text) => updateSkill(skill.id, 'name', text)}
                placeholder="Skill Name"
                error={errors[`skill_${index}_name`]}
              />
              <InputField
                label="Proficiency Level"
                value={skill.proficiency}
                onChangeText={(text) => updateSkill(skill.id, 'proficiency', text)}
                placeholder="Proficiency Level"
                error={errors[`skill_${index}_proficiency`]}
              />
              {profile.skills.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeSkill(skill.id)}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
            onPress={addSkill}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={[styles.addButtonText, { color: Colors.white }]}>Add Skill</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Projects">
          {profile.projects.map((project, index) => (
            <View key={project.id} style={styles.projectItem}>
              <InputField
                label="Project Title"
                value={project.title}
                onChangeText={(text) => updateProject(project.id, 'title', text)}
                placeholder="Project Title"
                error={errors[`project_${index}_title`]}
              />
              <InputField
                label="Short Description"
                value={project.description}
                onChangeText={(text) => updateProject(project.id, 'description', text)}
                placeholder="Short Description"
                multiline
                error={errors[`project_${index}_description`]}
              />
              <InputField
                label="Long Description"
                value={project.longDescription}
                onChangeText={(text) => updateProject(project.id, 'longDescription', text)}
                placeholder="Long Description"
                multiline
                error={errors[`project_${index}_longDescription`]}
              />
              <InputField
                label="Technologies"
                value={project.technologies.join(', ')}
                onChangeText={(text) => updateProject(project.id, 'technologies', text.split(',').map(t => t.trim()))}
                placeholder="Technologies (comma-separated)"
                multiline
                error={errors[`project_${index}_technologies`]}
              />
              <InputField
                label="Project Link"
                value={project.link}
                onChangeText={(text) => updateProject(project.id, 'link', text)}
                placeholder="Project Link (optional)"
                error={errors[`project_${index}_link`]}
              />
              <InputField
                label="Value Added / Skills Demonstrated"
                value={project.valueAdded}
                onChangeText={(text) => updateProject(project.id, 'valueAdded', text)}
                placeholder="Value Added / Skills Demonstrated"
                multiline
                error={errors[`project_${index}_valueAdded`]}
              />
              {profile.projects.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeProject(project.id)}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
            onPress={addProject}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={[styles.addButtonText, { color: Colors.white }]}>Add Project</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Testimonials">
          {profile.testimonials.map((testimonial, index) => (
            <View key={testimonial.id} style={styles.testimonialItem}>
              <InputField
                label="Quote"
                value={testimonial.quote}
                onChangeText={(text) => updateTestimonial(testimonial.id, 'quote', text)}
                placeholder="Testimonial quote"
                multiline
                error={errors[`testimonial_${index}_quote`]}
              />
              <InputField
                label="Author"
                value={testimonial.author}
                onChangeText={(text) => updateTestimonial(testimonial.id, 'author', text)}
                placeholder="Author name"
                error={errors[`testimonial_${index}_author`]}
              />
              <InputField
                label="Relation"
                value={testimonial.relation}
                onChangeText={(text) => updateTestimonial(testimonial.id, 'relation', text)}
                placeholder="Author's relation or title"
                error={errors[`testimonial_${index}_relation`]}
              />
              {profile.testimonials.length > 0 && (
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeTestimonial(testimonial.id)}
                >
                  <Ionicons name="trash-outline" size={24} color={Colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
            onPress={addTestimonial}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={[styles.addButtonText, { color: Colors.white }]}>Add Testimonial</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Certificates & Achievements">
          {(profile.certificates || []).map((cert, index) => (
            <View key={cert.id} style={styles.certificateItem}>
              <InputField
                label="Certificate Name"
                value={cert.name}
                onChangeText={(text) => updateCertificate(cert.id, 'name', text)}
                placeholder="e.g., AWS Solutions Architect"
                error={errors[`certificate_${index}_name`]}
              />
              <InputField
                label="Issuing Organization"
                value={cert.issuer}
                onChangeText={(text) => updateCertificate(cert.id, 'issuer', text)}
                placeholder="e.g., Amazon Web Services"
                error={errors[`certificate_${index}_issuer`]}
              />
              <InputField
                label="Date Achieved"
                value={cert.date}
                onChangeText={(text) => updateCertificate(cert.id, 'date', text)}
                placeholder="e.g., March 2024"
                error={errors[`certificate_${index}_date`]}
              />
              <InputField
                label="Description"
                value={cert.description}
                onChangeText={(text) => updateCertificate(cert.id, 'description', text)}
                placeholder="Brief description of the certification"
                multiline
                error={errors[`certificate_${index}_description`]}
              />
              <InputField
                label="Verification URL"
                value={cert.verifyUrl}
                onChangeText={(text) => updateCertificate(cert.id, 'verifyUrl', text)}
                placeholder="Link to verify the certificate"
                error={errors[`certificate_${index}_verifyUrl`]}
              />
              <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => removeCertificate(cert.id)}
              >
                <Ionicons name="trash-outline" size={24} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: Colors.primary }]}
            onPress={addCertificate}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
            <Text style={[styles.addButtonText, { color: Colors.white }]}>Add Certificate</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Contact Information">
          <InputField
            label="Email"
            value={profile.contactInfo.email}
            onChangeText={(text) => setProfile(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, email: text }
            }))}
            placeholder="Email"
            keyboardType="email-address"
            error={errors.email}
          />
          <InputField
            label="Phone"
            value={profile.contactInfo.phone}
            onChangeText={(text) => setProfile(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, phone: text }
            }))}
            placeholder="Phone"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <InputField
            label="LinkedIn URL"
            value={profile.contactInfo.linkedin}
            onChangeText={(text) => setProfile(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, linkedin: text }
            }))}
            placeholder="LinkedIn URL"
            error={errors.linkedin}
          />
          <InputField
            label="GitHub URL"
            value={profile.contactInfo.github}
            onChangeText={(text) => setProfile(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, github: text }
            }))}
            placeholder="GitHub URL"
            error={errors.github}
          />
          <InputField
            label="Resume URL"
            value={profile.contactInfo.resumeUrl}
            onChangeText={(text) => setProfile(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, resumeUrl: text }
            }))}
            placeholder="Resume URL"
            error={errors.resumeUrl}
          />
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  educationItem: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillItem: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  projectItem: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  testimonialItem: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  certificateItem: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  removeButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  lastHalfInput: {
    flex: 1,
    marginRight: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  headerButton: {
    padding: 10,
  },
});

export default ProfileEditor; 