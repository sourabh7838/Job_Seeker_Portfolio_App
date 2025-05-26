import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PROFILE: '@portfolio_profile',
  EDUCATION: '@portfolio_education',
  SKILLS: '@portfolio_skills',
  PROJECTS: '@portfolio_projects',
  TESTIMONIALS: '@portfolio_testimonials',
  CERTIFICATES: '@portfolio_certificates',
  CONTACT_INFO: '@portfolio_contact_info'
};

export default class DatabaseManager {
  static async saveProfile(profileData) {
    try {
      const promises = [
        AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({
          name: profileData.name,
          title: profileData.title,
          bio: profileData.bio,
          profileImage: profileData.profileImage
        })),
        AsyncStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(profileData.education)),
        AsyncStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(profileData.skills)),
        AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(profileData.projects)),
        AsyncStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(profileData.testimonials)),
        AsyncStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(profileData.certificates)),
        AsyncStorage.setItem(STORAGE_KEYS.CONTACT_INFO, JSON.stringify(profileData.contactInfo))
      ];

      await Promise.all(promises);
      console.log("Profile data saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving profile data:", error);
      throw new Error("Failed to save profile data");
    }
  }

  static async loadProfile() {
    try {
      const [
        profileStr,
        educationStr,
        skillsStr,
        projectsStr,
        testimonialsStr,
        certificatesStr,
        contactInfoStr
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
        AsyncStorage.getItem(STORAGE_KEYS.EDUCATION),
        AsyncStorage.getItem(STORAGE_KEYS.SKILLS),
        AsyncStorage.getItem(STORAGE_KEYS.PROJECTS),
        AsyncStorage.getItem(STORAGE_KEYS.TESTIMONIALS),
        AsyncStorage.getItem(STORAGE_KEYS.CERTIFICATES),
        AsyncStorage.getItem(STORAGE_KEYS.CONTACT_INFO)
      ]);

      const profile = {
        ...(profileStr ? JSON.parse(profileStr) : {}),
        education: educationStr ? JSON.parse(educationStr) : [],
        skills: skillsStr ? JSON.parse(skillsStr) : [],
        projects: projectsStr ? JSON.parse(projectsStr) : [],
        testimonials: testimonialsStr ? JSON.parse(testimonialsStr) : [],
        certificates: certificatesStr ? JSON.parse(certificatesStr) : [],
        contactInfo: contactInfoStr ? JSON.parse(contactInfoStr) : {}
      };

      console.log("Profile data loaded successfully");
      return profile;
    } catch (error) {
      console.error("Error loading profile data:", error);
      throw new Error("Failed to load profile data");
    }
  }

  static async clearProfile() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      console.log("Profile data cleared successfully");
      return true;
    } catch (error) {
      console.error("Error clearing profile data:", error);
      throw new Error("Failed to clear profile data");
    }
  }
} 