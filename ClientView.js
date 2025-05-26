import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
  ActivityIndicator,
  Modal,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sharePortfolio } from './ProfileUtils';
import { useTheme, darkColors, lightColors } from './ThemeContext';

const ImageWithLoading = ({ source, style, resizeMode = 'cover' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;

  const getImageSource = () => {
    if (!source) return null;
    if (typeof source === 'number') return source;
    if (typeof source === 'string') {
      return { uri: source };
    }
    return source;
  };

  const imageSource = getImageSource();

  if (!imageSource) {
    return (
      <View style={[style, styles.imagePlaceholder, { backgroundColor: Colors.cardBackground }]}>
        <Ionicons name="person" size={style.width ? style.width / 2 : 50} color={Colors.lightText} />
      </View>
    );
  }

  return (
    <View style={[style, styles.imageLoadingContainer]}>
      {loading && (
        <View style={[StyleSheet.absoluteFill, styles.imagePlaceholder, { backgroundColor: Colors.cardBackground }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      {error && (
        <View style={[StyleSheet.absoluteFill, styles.imagePlaceholder, { backgroundColor: Colors.cardBackground }]}>
          <Ionicons name="alert-circle" size={style.width ? style.width / 3 : 30} color={Colors.lightText} />
        </View>
      )}
      <Image
        source={imageSource}
        style={[style, { opacity: loading || error ? 0 : 1 }]}
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        resizeMode={resizeMode}
      />
    </View>
  );
};

const ClientView = ({ route, navigation }) => {
  const { personalInfo, skills, projects, testimonials, contactInfo } = route.params || {};
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleVerifyLinkPress = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => Alert.alert("Error", "Could not open verification link."));
    }
  };

  // Add a check for required data
  if (!personalInfo || !personalInfo.name) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.text, fontSize: 16, marginBottom: 10 }}>No profile data available</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.white} style={{ marginRight: 8 }} />
          <Text style={{ color: Colors.white, fontSize: 16 }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      const shareContent = {
        title: `${personalInfo.name}'s Portfolio`,
        message: `
${personalInfo.name}
${personalInfo.title}

About:
${personalInfo.bio}

Skills:
${skills.map(skill => `• ${skill.name} (${skill.proficiency})`).join('\n')}

Projects:
${projects.map(project => `• ${project.title}\n  ${project.description}`).join('\n\n')}

Contact:
${contactInfo.email ? `Email: ${contactInfo.email}` : ''}
${contactInfo.phone ? `\nPhone: ${contactInfo.phone}` : ''}
${contactInfo.linkedin ? `\nLinkedIn: ${contactInfo.linkedin}` : ''}
${contactInfo.github ? `\nGitHub: ${contactInfo.github}` : ''}
${contactInfo.resumeUrl ? `\nResume: ${contactInfo.resumeUrl}` : ''}
`,
      };

      const result = await Share.share(
        Platform.OS === 'ios' 
          ? shareContent
          : { title: shareContent.title, message: shareContent.message }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('Shared with activity type:', result.activityType);
        } else {
          // shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Could not share the portfolio at this time. Please try again later.',
        [{ text: 'OK' }]
      );
      console.error('Share error:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      setShowExportMenu(false);
      await sharePortfolio({
        ...personalInfo,
        education: personalInfo.education || [],
        skills: skills || [],
        projects: projects || [],
        testimonials: testimonials || [],
        contactInfo: contactInfo || {},
      }, format);
    } catch (error) {
      Alert.alert('Error', `Failed to export as ${format.toUpperCase()}`);
    }
  };

  const ExportMenu = () => (
    <Modal
      visible={showExportMenu}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowExportMenu(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setShowExportMenu(false)}
      >
        <View style={[styles.exportMenu, { backgroundColor: Colors.cardBackground }]}>
          <TouchableOpacity 
            style={styles.exportOption} 
            onPress={() => handleExport('pdf')}
          >
            <Ionicons name="document-text-outline" size={24} color={Colors.primary} />
            <Text style={[styles.exportOptionText, { color: Colors.text }]}>Export as PDF</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Add share button to navigation header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => setShowExportMenu(true)}
            style={styles.headerButton}
          >
            <Ionicons 
              name="ellipsis-vertical" 
              size={24} 
              color={Colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleShare}
            style={styles.headerButton}
          >
            <Ionicons 
              name="share-outline" 
              size={24} 
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      ),
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
      title: 'Portfolio Preview',
      headerTitleAlign: 'center'
    });
  }, [navigation, Colors.primary]);

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <ExportMenu />

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
          <View style={styles.profileHeader}>
            <ImageWithLoading
              source={personalInfo.profileImage}
              style={styles.profileImage}
            />
            <Text style={[styles.name, { color: Colors.text }]}>{personalInfo.name}</Text>
            <Text style={[styles.title, { color: Colors.lightText }]}>{personalInfo.title}</Text>
          </View>
          <Text style={[styles.bio, { color: Colors.text }]}>{personalInfo.bio}</Text>
        </View>

        {personalInfo.education && personalInfo.education.length > 0 && (
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.secondary }]}>Education</Text>
            {personalInfo.education.map((edu, index) => (
              <View key={edu.id || index} style={[styles.educationItem, { backgroundColor: Colors.background }]}>
                <Text style={[styles.educationInstitution, { color: Colors.text }]}>{edu.institution}</Text>
                <Text style={[styles.educationDegree, { color: Colors.primary }]}>{edu.degree}</Text>
                <Text style={[styles.educationPeriod, { color: Colors.lightText }]}>{edu.period}</Text>
                {edu.details && (
                  <Text style={[styles.educationDetails, { color: Colors.text }]}>{edu.details}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {personalInfo.certificates && personalInfo.certificates.length > 0 && (
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.secondary }]}>Certificates</Text>
            {personalInfo.certificates.map((cert, index) => (
              <View key={cert.id || index} style={[styles.certificateItem, { backgroundColor: Colors.background }]}>
                <Text style={[styles.certificateName, { color: Colors.text }]}>{cert.name}</Text>
                <Text style={[styles.certificateIssuer, { color: Colors.primary }]}>{cert.issuer}</Text>
                <Text style={[styles.certificateDate, { color: Colors.lightText }]}>{cert.date}</Text>
                {cert.description && (
                  <Text style={[styles.certificateDescription, { color: Colors.text }]}>{cert.description}</Text>
                )}
                {cert.verifyUrl && (
                  <TouchableOpacity 
                    style={[styles.verifyButton, { backgroundColor: Colors.accent }]}
                    onPress={() => handleVerifyLinkPress(cert.verifyUrl)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={16} color={Colors.white} />
                    <Text style={[styles.verifyButtonText, { color: Colors.white }]}>Verify Certificate</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {skills && skills.length > 0 && (
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.secondary }]}>Skills</Text>
            {skills.map((skill, index) => (
              <View key={index} style={[styles.skillItem, { backgroundColor: Colors.background }]}>
                <Text style={[styles.skillName, { color: Colors.text }]}>{skill.name}</Text>
                <Text style={[styles.skillLevel, { color: Colors.lightText }]}>{skill.proficiency}</Text>
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.secondary }]}>Projects</Text>
            {projects.map((project, index) => (
              <View key={index} style={[styles.projectItem, { backgroundColor: Colors.background }]}>
                <Text style={[styles.projectTitle, { color: Colors.primary }]}>{project.title}</Text>
                <Text style={[styles.projectDescription, { color: Colors.text }]}>{project.description}</Text>
                <View style={styles.techContainer}>
                  {project.technologies.map((tech, techIndex) => (
                    <Text key={techIndex} style={[styles.techItem, { backgroundColor: Colors.primary + '20', color: Colors.primary }]}>
                      {tech}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {testimonials && testimonials.length > 0 && (
          <View style={[styles.section, { backgroundColor: Colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: Colors.secondary }]}>Testimonials</Text>
            {testimonials.map((testimonial, index) => (
              <View key={index} style={[styles.testimonialItem, { backgroundColor: Colors.background }]}>
                <Text style={[styles.testimonialQuote, { color: Colors.text }]}>"{testimonial.quote}"</Text>
                <Text style={[styles.testimonialAuthor, { color: Colors.primary }]}>- {testimonial.author}</Text>
                <Text style={[styles.testimonialRole, { color: Colors.lightText }]}>{testimonial.relation}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '500',
  },
  skillLevel: {
    fontSize: 14,
  },
  projectItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  techItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '500',
  },
  testimonialItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  testimonialQuote: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  exportButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exportMenu: {
    width: '80%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  exportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  exportOptionText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  imageLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  educationItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  educationInstitution: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  educationDegree: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  educationPeriod: {
    fontSize: 12,
  },
  educationDetails: {
    fontSize: 14,
  },
  certificateItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  certificateIssuer: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  certificateDate: {
    fontSize: 12,
  },
  certificateDescription: {
    fontSize: 14,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  verifyButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ClientView; 