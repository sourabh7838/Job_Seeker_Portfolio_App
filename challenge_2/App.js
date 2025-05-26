import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Switch,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import ClientView from './ClientView';
import ProfileEditor from './ProfileEditor';
import { ThemeContext, useTheme, lightColors, darkColors } from './ThemeContext';
import { useProfile } from './useProfile';
import InterviewScreen from './InterviewScreen';
import InterviewDetailScreen from './InterviewDetailScreen';

// --- 1. PORTFOLIO DATA (Added Certificates and Resume URL) ---
const personalInfo = {
  name: "Chauhan",
  title: "Aspiring React Native Developer",
  profileImage: require('./assets/profile.png'),
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
  certificates: [ // NEW CERTIFICATES SECTION
    {
      id: 'cert1',
      name: 'React Native Nanodegree',
      issuer: 'Udacity',
      date: 'March 2023',
      // imageUrl: 'https://link.to.your/certificate-image1.jpg', // Optional: URL to the certificate image
      description: 'Completed an intensive program covering advanced React Native concepts, state management with Redux, and native module integration. Built several portfolio-worthy applications.',
      verifyUrl: 'https://confirm.udacity.com/PQRXYZ123' // Optional: Link to verify certificate
    },
    {
      id: 'cert2',
      name: 'Certified JavaScript Developer',
      issuer: 'FreeCodeCamp',
      date: 'December 2022',
      // imageUrl: null,
      description: 'Achieved certification by completing all JavaScript algorithms and data structures projects, demonstrating proficiency in core JavaScript principles.',
      verifyUrl: 'https://www.freecodecamp.org/certification/alexdoe/javascript-algorithms-and-data-structures'
    },
    {
      id: 'cert3',
      name: 'Agile Foundations',
      issuer: 'LinkedIn Learning',
      date: 'January 2023',
      // imageUrl: null,
      description: 'Gained foundational knowledge in Agile methodologies, Scrum, and Kanban, essential for modern software development teams.',
      verifyUrl: null
    }
  ]
};

const skills = [
  { id: '1', name: 'React Native', proficiency: 'Intermediate', icon: 'logo-react' },
  { id: '2', name: 'JavaScript (ES6+)', proficiency: 'Intermediate', icon: 'logo-javascript' },
  { id: '3', name: 'Expo CLI', proficiency: 'Intermediate', icon: 'flash' },
  // ... other skills
];

const projects = [
  {
    id: '1',
    title: 'My Personal Portfolio App',
    description: 'Developed this React Native application to showcase my skills and projects.',
    longDescription: "This very application serves as a testament to my React Native abilities...",
    technologies: ['React Native', 'Expo', 'JavaScript', 'React Navigation', 'Context API'],
    image: require('./assets/profile.png'),
    link: null,
    valueAdded: "Demonstrates initiative, React Native fundamentals..."
  },
  {
    id: '2',
    title: 'Task Management App (Conceptual)',
    description: 'Designed and conceptualized a task management application...',
    longDescription: "This project involved user research to identify pain points...",
    technologies: ['Figma (for design)', 'User Research', 'Prototyping'],
    image: require('./assets/profile.png'),
    link: null,
    valueAdded: "Highlights UI/UX thinking, problem-solving..."
  },
  // ... other projects
];

const testimonials = [
  {
    id: 'test1',
    quote: "Group-2 is a highly motivated and quick learner...",
    author: "Dr. Jane Smith",
    relation: "Professor, State University"
  },
  // ... other testimonials
];

const contactInfo = {
  email: 'group2@gmail.com',
  phone: '+1234567890',
  linkedin: 'https://linkedin.com/in/alexdoe',
  github: 'https://github.com/alexdoe',
  resumeUrl: 'https://www.example.com/resumes/alex_doe_resume.pdf', // << IMPORTANT: REPLACE WITH YOUR ACTUAL RESUME URL
};

// --- 2. COMPONENTS (New CertificateCard) ---

const ImageWithLoading = ({ source, style, resizeMode = 'cover' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;

  const getImageSource = () => {
    if (!source) return null;
    if (typeof source === 'number') return source; // Handle require() images
    if (typeof source === 'string') {
      if (source.startsWith('file://') || source.startsWith('content://') || source.startsWith('ph://')) {
        return { uri: source };
      }
      return { uri: source };
    }
    return source; // Handle other cases (like {uri: '...'})
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

const SkillItem = ({ name, proficiency, icon }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  return (
    <View style={[styles.skillContainer, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black, }]}>
      <Ionicons name={icon || 'code-slash'} size={28} color={Colors.primary} style={styles.skillIcon} />
      <View style={styles.skillTextContainer}>
        <Text style={[styles.skillName, { color: Colors.text }]}>{name}</Text>
        <Text style={[styles.skillProficiency, { color: Colors.lightText }]}>{proficiency}</Text>
      </View>
    </View>
  );
};

const ProjectCard = ({ project, onPress }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.projectCard, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black }]}>
      {project.image && <ImageWithLoading source={project.image} style={styles.projectImage} />}
      <Text style={[styles.projectTitle, { color: Colors.primary }]}>{project.title}</Text>
      <Text style={[styles.projectDescription, { color: Colors.text }]}>{project.description}</Text>
      <View style={styles.projectTechContainer}>
        {project.technologies.slice(0, 3).map((tech, index) => (
          <Text key={index} style={[styles.projectTechItem, { backgroundColor: Colors.primary + '20', color: Colors.primary, }]}>
            {tech}
          </Text>
        ))}
        {project.technologies.length > 3 && (
            <Text style={[styles.projectTechItem, { backgroundColor: Colors.primary + '20', color: Colors.primary, }]}>
            +{project.technologies.length - 3} more
          </Text>
        )}
      </View>
      <View style={styles.viewDetailsContainer}>
        <Text style={[styles.viewDetailsText, { color: Colors.accent }]}>View Details</Text>
        <Ionicons name="arrow-forward" size={18} color={Colors.accent} />
      </View>
    </TouchableOpacity>
  );
};

const EducationItem = ({ item }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  return (
    <View style={styles.educationItemContainer}>
      <Text style={[styles.educationInstitution, { color: Colors.secondary }]}>{item.institution}</Text>
      <Text style={[styles.educationDegree, { color: Colors.text }]}>{item.degree}</Text>
      <Text style={[styles.educationPeriod, { color: Colors.lightText }]}>{item.period}</Text>
      {item.details && <Text style={[styles.educationDetails, { color: Colors.text }]}>{item.details}</Text>}
    </View>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  return (
    <View style={[styles.testimonialCard, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black, }]}>
      <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.accent} style={styles.testimonialIcon} />
      <Text style={[styles.testimonialQuote, { color: Colors.text }]}>"{testimonial.quote}"</Text>
      <Text style={[styles.testimonialAuthor, { color: Colors.secondary }]}>- {testimonial.author}</Text>
      <Text style={[styles.testimonialRelation, { color: Colors.lightText }]}>{testimonial.relation}</Text>
    </View>
  );
};

// NEW CertificateCard Component
const CertificateCard = ({ certificate, onPress }) => {
  const { isDarkMode } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.certificateCard, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black }]}>
      <Ionicons name="ribbon-outline" size={30} color={Colors.accent} style={styles.certificateCardIcon} />
      <View style={styles.certificateCardTextContainer}>
        <Text style={[styles.certificateCardName, { color: Colors.primary }]}>{certificate.name}</Text>
        <Text style={[styles.certificateCardIssuer, { color: Colors.lightText }]}>{certificate.issuer} - {certificate.date}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={22} color={Colors.lightText} />
    </TouchableOpacity>
  );
};

// --- 3. SCREENS (Modified AboutScreen and ContactScreen) ---

const AboutScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const Colors = isDarkMode ? darkColors : lightColors;
  const { profile, loading } = useProfile();
  const insets = useSafeAreaInsets();
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const openCertificateModal = (certificate) => {
    setSelectedCertificate(certificate);
    setCertificateModalVisible(true);
  };

  const handleVerifyLinkPress = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => Alert.alert("Error", "Could not open verification link."));
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const defaultImage = require('./assets/profile.png');
  const profileImageSource = profile.profileImage || defaultImage;

  return (
    <ScrollView 
      style={[styles.screenContainer, { backgroundColor: Colors.background }]} 
      contentContainerStyle={[styles.screenContent, { paddingTop: 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.aboutHeader}>
        <ImageWithLoading 
          source={profileImageSource} 
          style={[styles.profileImage, { borderColor: Colors.primary }]} 
          resizeMode="cover"
        />
        <Text style={[styles.aboutName, { color: Colors.text }]}>{profile.name}</Text>
        <Text style={[styles.aboutTitle, { color: Colors.lightText }]}>{profile.title}</Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate('ProfileEditor')}
        >
          <Ionicons name="create-outline" size={20} color={Colors.white} />
          <Text style={[styles.actionButtonText, { color: Colors.white }]}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: Colors.accent }]}
          onPress={() => navigation.navigate('ClientView', {
            personalInfo: {
              name: profile.name,
              title: profile.title,
              profileImage: profile.profileImage,
              bio: profile.bio,
              education: profile.education || [],
              certificates: profile.certificates || []
            },
            skills: profile.skills || [],
            projects: profile.projects || [],
            testimonials: profile.testimonials || [],
            contactInfo: profile.contactInfo || {}
          })}
        >
          <Ionicons name="eye-outline" size={20} color={Colors.white} />
          <Text style={[styles.actionButtonText, { color: Colors.white }]}>View as Client</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.themeToggleContainer, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black }]}>
        <Text style={[styles.themeToggleText, { color: Colors.text }]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: Colors.switchTrackFalse, true: Colors.switchTrackTrue }}
          thumbColor={Colors.switchThumb}
          ios_backgroundColor={Colors.switchTrackFalse}
          onValueChange={toggleTheme}
          value={isDarkMode}
        />
      </View>

      <View style={[styles.aboutSectionContainer, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black, }]}>
        <Text style={[styles.aboutSectionTitle, { color: Colors.secondary }]}>About Me</Text>
        <Text style={[styles.aboutBioText, { color: Colors.text }]}>{profile.bio}</Text>
      </View>

      <View style={[styles.aboutSectionContainer, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black, }]}>
        <Text style={[styles.aboutSectionTitle, { color: Colors.secondary }]}>Education</Text>
        {profile.education.map(edu => <EducationItem key={edu.id} item={edu} />)}
      </View>

      <View style={[styles.aboutSectionContainer, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black, }]}>
        <Text style={[styles.aboutSectionTitle, { color: Colors.secondary }]}>Certificates</Text>
        {profile.certificates && profile.certificates.length > 0 ? (
          profile.certificates.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} onPress={() => openCertificateModal(cert)} />
          ))
        ) : (
          <Text style={{color: Colors.lightText, textAlign: 'center'}}>No certificates to display.</Text>
        )}
      </View>

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={certificateModalVisible}
          onRequestClose={() => setCertificateModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors.cardBackground }]}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setCertificateModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color={Colors.lightText} />
              </TouchableOpacity>
              <ScrollView>
                <Text style={[styles.modalCertificateName, { color: Colors.primary }]}>{selectedCertificate.name}</Text>
                <Text style={[styles.modalCertificateIssuer, { color: Colors.text }]}>
                  Issued by: {selectedCertificate.issuer}
                </Text>
                <Text style={[styles.modalCertificateDate, { color: Colors.lightText }]}>
                  Date: {selectedCertificate.date}
                </Text>
                
                {selectedCertificate.imageUrl && (
                  <ImageWithLoading 
                    source={{ uri: selectedCertificate.imageUrl }} 
                    style={styles.modalCertificateImage}
                    resizeMode="contain"
                  />
                )}

                <Text style={[styles.modalSubHeader, { color: Colors.secondary, marginTop: selectedCertificate.imageUrl ? 15 : 5  }]}>Description:</Text>
                <Text style={[styles.modalCertificateDescription, { color: Colors.text }]}>
                  {selectedCertificate.description}
                </Text>

                {selectedCertificate.verifyUrl && (
                  <TouchableOpacity 
                    style={[styles.verifyLinkButton, {backgroundColor: Colors.accent}]} 
                    onPress={() => handleVerifyLinkPress(selectedCertificate.verifyUrl)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
                    <Text style={[styles.verifyLinkButtonText, {color: Colors.white}]}>Verify Certificate</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const SkillsScreen = () => {
  const theme = useTheme();
  const Colors = theme.isDarkMode ? darkColors : lightColors;
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor: Colors.background }]}>
      <FlatList
        data={profile.skills}
        renderItem={({ item }) => (
          <SkillItem name={item.name} proficiency={item.proficiency} icon={item.icon} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingTop: 20 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const ProjectsScreen = () => {
  const theme = useTheme();
  const Colors = theme.isDarkMode ? darkColors : lightColors;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setModalVisible(true);
  };

  const handleLinkPress = (link) => {
    if (link) { Linking.openURL(link).catch(err => console.error("Couldn't load page", err)); }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: Colors.background }]}>
      <FlatList
        data={profile.projects}
        renderItem={({ item }) => (
          <ProjectCard project={item} onPress={() => openProjectModal(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { paddingTop: 20 }]}
        showsVerticalScrollIndicator={false}
      />
      {selectedProject && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors.cardBackground }]}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={30} color={Colors.lightText} />
              </TouchableOpacity>
              <ScrollView>
                {selectedProject.image && <ImageWithLoading source={selectedProject.image} style={styles.modalProjectImage} />}
                <Text style={[styles.modalProjectTitle, { color: Colors.primary }]}>{selectedProject.title}</Text>
                <Text style={[styles.modalProjectDescription, { color: Colors.text }]}>
                  {selectedProject.longDescription || selectedProject.description}
                </Text>
                <Text style={[styles.modalSubHeader, { color: Colors.secondary }]}>Value Added / Skills Demonstrated:</Text>
                <Text style={[styles.modalValueAdded, { color: Colors.text }]}>{selectedProject.valueAdded}</Text>
                <Text style={[styles.modalSubHeader, { color: Colors.secondary }]}>Technologies Used:</Text>
                <View style={styles.projectTechContainer}>
                  {selectedProject.technologies.map((tech, index) => (
                    <Text key={index} style={[styles.projectTechItem, { backgroundColor: Colors.primary + '20', color: Colors.primary, }]}>
                      {tech}
                    </Text>
                  ))}
                </View>
                {selectedProject.link && (
                  <TouchableOpacity style={[styles.projectLinkButton, {backgroundColor: Colors.accent}]} onPress={() => handleLinkPress(selectedProject.link)}>
                    <Ionicons name="open-outline" size={20} color={Colors.white} />
                    <Text style={[styles.projectLinkButtonText, {color: Colors.white}]}>View Project / Repo</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const TestimonialsScreen = () => {
  const theme = useTheme();
  const Colors = theme.isDarkMode ? darkColors : lightColors;
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor: Colors.background }]}>
      {profile.testimonials && profile.testimonials.length > 0 ? (
        <FlatList
          data={profile.testimonials}
          renderItem={({ item }) => <TestimonialCard testimonial={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContainer, { paddingTop: 20 }]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: Colors.lightText}]}>No testimonials yet.</Text>
        </View>
      )}
    </View>
  );
};

const ContactScreen = () => {
  const theme = useTheme();
  const Colors = theme.isDarkMode ? darkColors : lightColors;
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const handleLinkPress = (url, type = 'web') => {
    if (!url) { Alert.alert("Not Available", "This contact information or link is not provided."); return; }
    let fullUrl = url;
    if (type === 'email') fullUrl = `mailto:${url}`;
    if (type === 'tel') fullUrl = `tel:${url}`;
    Linking.canOpenURL(fullUrl)
      .then(supported => {
        if (supported) { return Linking.openURL(fullUrl); }
        else { Alert.alert("Error", `Unable to open this URL: ${fullUrl}`); }
      })
      .catch(err => Alert.alert("Error", "An error occurred: " + err.message));
  };

  const ContactItem = ({ icon, text, onPress, type, value }) => (
    <TouchableOpacity style={[styles.contactItem, { borderBottomColor: Colors.separator }]} onPress={() => onPress(value, type)}>
      <Ionicons name={icon} size={28} color={Colors.primary} style={styles.contactIcon} />
      <Text style={[styles.contactText, { color: Colors.text }]}>{text}</Text>
      <Ionicons name="chevron-forward-outline" size={24} color={Colors.lightText} />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.screenContainer, { backgroundColor: Colors.background }]} 
      contentContainerStyle={[styles.screenContent, { paddingTop: 20 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.screenTitle, { color: Colors.primary }]}>Get In Touch</Text>
      <View style={[styles.contactList, { backgroundColor: Colors.cardBackground, shadowColor: Colors.black, }]}>
         {profile.contactInfo.email && (
          <ContactItem icon="mail-outline" text={profile.contactInfo.email} onPress={handleLinkPress} type="email" value={profile.contactInfo.email} />
        )}
        {profile.contactInfo.phone && (
          <ContactItem icon="call-outline" text={profile.contactInfo.phone} onPress={handleLinkPress} type="tel" value={profile.contactInfo.phone} />
        )}
        {profile.contactInfo.linkedin && (
          <ContactItem icon="logo-linkedin" text="LinkedIn Profile" onPress={handleLinkPress} type="web" value={profile.contactInfo.linkedin} />
        )}
        {profile.contactInfo.github && (
          <ContactItem icon="logo-github" text="GitHub Profile" onPress={handleLinkPress} type="web" value={profile.contactInfo.github} />
        )}
        {profile.contactInfo.resumeUrl && (
           <ContactItem
            icon="document-attach-outline"
            text="Download My Resume"
            onPress={handleLinkPress}
            type="web"
            value={profile.contactInfo.resumeUrl}
          />
        )}
      </View>
      <Text style={[styles.contactFooterText, { color: Colors.lightText }]}>Looking forward to connecting!</Text>
    </ScrollView>
  );
};

// --- 5. NAVIGATION ---
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AppNavigator = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const Colors = theme.isDarkMode ? darkColors : lightColors;

  const screenOptions = {
    headerStyle: {
      backgroundColor: Colors.cardBackground,
      borderBottomColor: Colors.separator,
      borderBottomWidth: 1,
      height: Platform.OS === 'ios' ? 44 + insets.top : 56,
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.text,
    },
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerStatusBarHeight: insets.top,
  };

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'About': iconName = focused ? 'person' : 'person-outline'; break;
            case 'Skills': iconName = focused ? 'code-slash' : 'code-slash-outline'; break;
            case 'Projects': iconName = focused ? 'folder' : 'folder-outline'; break;
            case 'Testimonials': iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; break;
            case 'Interviews': iconName = focused ? 'briefcase' : 'briefcase-outline'; break;
            case 'Contact': iconName = focused ? 'mail' : 'mail-outline'; break;
            default: iconName = 'help';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.lightText,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopColor: Colors.separator,
          height: Platform.OS === 'ios' ? 49 + insets.bottom : 56,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
          paddingTop: 8,
        },
        ...screenOptions,
      })}
    >
      <Tab.Screen name="About" component={AboutScreen} options={{ headerTitle: 'About Me' }} />
      <Tab.Screen name="Skills" component={SkillsScreen} options={{ headerTitle: 'My Skills' }} />
      <Tab.Screen name="Projects" component={ProjectsScreen} options={{ headerTitle: 'Projects' }} />
      <Tab.Screen name="Testimonials" component={TestimonialsScreen} options={{ headerTitle: 'Testimonials' }} />
      <Tab.Screen name="Interviews" component={InterviewScreen} options={{ headerTitle: 'Interviews' }} />
      <Tab.Screen name="Contact" component={ContactScreen} options={{ headerTitle: 'Contact' }} />
    </Tab.Navigator>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="ClientView" 
        component={ClientView} 
        options={{ 
          headerShown: true,
          ...screenOptions,
          presentation: 'modal',
          headerBackVisible: false,
        }} 
      />
      <Stack.Screen 
        name="ProfileEditor" 
        component={ProfileEditor} 
        options={{ 
          headerShown: true,
          ...screenOptions,
          presentation: 'modal',
          headerBackVisible: false,
          headerLeft: null,
        }} 
      />
      <Stack.Screen 
        name="InterviewDetail" 
        component={InterviewDetailScreen} 
        options={{ 
          headerShown: true,
          ...screenOptions,
        }} 
      />
    </Stack.Navigator>
  );
};

// --- 6. MAIN APP COMPONENT ---
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) { setIsDarkMode(savedTheme === 'dark'); }
      } catch (error) { console.error('Failed to load theme from storage', error); }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    try { await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light'); }
    catch (error) { console.error('Failed to save theme to storage', error); }
  };

  const theme = { isDarkMode, toggleTheme };
  const Colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={Colors.statusBar} backgroundColor={Colors.background} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

// --- 7. STYLES (Added styles for CertificateCard and Certificate Modal) ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  screenTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, paddingHorizontal: 20 },
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    backgroundColor: '#e0e0e0',
  },
  aboutHeader: { alignItems: 'center', marginBottom: 20 },
  aboutName: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  aboutTitle: { fontSize: 18, textAlign: 'center' },
  themeToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 12, width: '100%', marginBottom: 20, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  themeToggleText: { fontSize: 16, fontWeight: '500' },
  aboutSectionContainer: { borderRadius: 12, padding: 20, width: '100%', marginBottom: 20, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  aboutSectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15 },
  aboutBioText: { fontSize: 16, lineHeight: 24, textAlign: 'justify' },
  educationItemContainer: { marginBottom: 15, paddingBottom: 10 },
  educationInstitution: { fontSize: 18, fontWeight: '600' },
  educationDegree: { fontSize: 16, fontWeight: '500', marginTop: 2 },
  educationPeriod: { fontSize: 14, fontStyle: 'italic', marginTop: 2 },
  educationDetails: { fontSize: 14, marginTop: 5, lineHeight: 20 },
  skillContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  skillIcon: { marginRight: 15 },
  skillTextContainer: { flex: 1 },
  skillName: { fontSize: 18, fontWeight: '600' },
  skillProficiency: { fontSize: 14 },
  projectCard: { borderRadius: 12, padding: 20, marginBottom: 20, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4 },
  projectImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 15 },
  projectTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  projectDescription: { fontSize: 15, lineHeight: 20, marginBottom: 12 },
  projectTechContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  projectTechItem: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, marginRight: 8, marginBottom: 8, fontSize: 13, fontWeight: '500' },
  viewDetailsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 },
  viewDetailsText: { fontSize: 14, fontWeight: '600', marginRight: 5 },
  projectLinkButton: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 15 },
  projectLinkButtonText: { marginLeft: 8, fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxHeight: '85%', borderRadius: 15, paddingVertical: 20, paddingHorizontal:15, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  closeModalButton: { position: 'absolute', top: 10, right: 10, zIndex: 1, padding: 5 },
  modalProjectImage: { width: '100%', height: 180, borderRadius: 10, marginBottom: 20 },
  modalProjectTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalProjectDescription: { fontSize: 16, lineHeight: 24, marginBottom: 15, textAlign: 'justify' },
  modalSubHeader: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 8 },
  modalValueAdded: { fontSize: 15, fontStyle: 'italic', lineHeight: 22, marginBottom: 15 },
  testimonialCard: { borderRadius: 12, padding: 20, marginBottom: 20, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 4, alignItems: 'center' },
  testimonialIcon: { marginBottom: 10 },
  testimonialQuote: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', lineHeight: 22, marginBottom: 10 },
  testimonialAuthor: { fontSize: 15, fontWeight: '600', marginBottom: 3 },
  testimonialRelation: { fontSize: 13 },
  contactContentContainer: { paddingBottom: 30, paddingHorizontal: 20 },
  contactList: { borderRadius: 12, overflow: 'hidden', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 15, borderBottomWidth: 1 },
  contactIcon: { marginRight: 15 },
  contactText: { flex: 1, fontSize: 17 },
  contactFooterText: { marginTop: 30, textAlign: 'center', fontSize: 16 },

  // CertificateCard Styles (NEW)
  certificateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1, // Optional: add a subtle border
    borderColor: '#e0e0e0', // Set dynamically if needed based on theme
  },
  certificateCardIcon: {
    marginRight: 15,
  },
  certificateCardTextContainer: {
    flex: 1,
  },
  certificateCardName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  certificateCardIssuer: {
    fontSize: 14,
  },

  // Certificate Modal Styles (NEW)
  modalCertificateName: { // Renamed from modalProjectTitle for clarity
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalCertificateIssuer: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalCertificateDate: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalCertificateImage: { // NEW
    width: '100%',
    height: 200, // Adjust as needed
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
  },
  modalCertificateDescription: { // Renamed from modalProjectDescription
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
    textAlign: 'justify',
  },
  verifyLinkButton: { // NEW
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10, // Added margin bottom
  },
  verifyLinkButtonText: { // NEW
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAsClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewAsClientButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});