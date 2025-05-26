import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const IMAGES_DIRECTORY = `${FileSystem.documentDirectory}profile_images/`;

// HTML template for PDF generation
const generateHtmlContent = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.name}'s Portfolio</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #007AFF; text-align: center; }
    h2 { color: #5856D6; margin-top: 20px; }
    .section { margin-bottom: 30px; }
    .skill-item { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
    .project-item { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; }
    .contact-info { text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <h1>${data.name}'s Portfolio</h1>
  <p style="text-align: center; font-size: 1.2em;">${data.title}</p>
  
  <div class="section">
    <h2>About Me</h2>
    <p>${data.bio}</p>
  </div>

  <div class="section">
    <h2>Education</h2>
    ${data.education.map(edu => `
      <div class="project-item">
        <h3>${edu.institution}</h3>
        <p><strong>${edu.degree}</strong></p>
        <p>${edu.period}</p>
        ${edu.details ? `<p>${edu.details}</p>` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Skills</h2>
    ${data.skills.map(skill => `
      <div class="skill-item">
        <strong>${skill.name}</strong> - ${skill.proficiency}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Projects</h2>
    ${data.projects.map(project => `
      <div class="project-item">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
        ${project.valueAdded ? `<p><strong>Value Added:</strong> ${project.valueAdded}</p>` : ''}
      </div>
    `).join('')}
  </div>

  ${data.testimonials && data.testimonials.length > 0 ? `
    <div class="section">
      <h2>Testimonials</h2>
      ${data.testimonials.map(testimonial => `
        <div class="project-item">
          <p><em>"${testimonial.quote}"</em></p>
          <p><strong>- ${testimonial.author}</strong></p>
          <p>${testimonial.relation}</p>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <div class="contact-info">
    <h2>Contact Information</h2>
    <p>Email: ${data.contactInfo.email}</p>
    ${data.contactInfo.phone ? `<p>Phone: ${data.contactInfo.phone}</p>` : ''}
    ${data.contactInfo.linkedin ? `<p>LinkedIn: ${data.contactInfo.linkedin}</p>` : ''}
    ${data.contactInfo.github ? `<p>GitHub: ${data.contactInfo.github}</p>` : ''}
  </div>
</body>
</html>
`;

// Generate and save PDF
export const generatePDF = async (data) => {
  try {
    const html = generateHtmlContent(data);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false
    });
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Ensure images directory exists
const ensureImagesDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIRECTORY, { intermediates: true });
  }
};

// Save image to local storage and return local URI
export const saveImageLocally = async (imageUri) => {
  if (!imageUri) return null;
  
  // If it's already a require() asset, return null to use default
  if (typeof imageUri === 'number') {
    return null;
  }

  try {
    // Ensure the directory exists
    await ensureImagesDirectory();

    // If the image is already in our directory, verify it exists
    if (imageUri.startsWith(IMAGES_DIRECTORY)) {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (fileInfo.exists) {
        return imageUri;
      }
      // If the file doesn't exist, continue to save as new
    }

    // Generate a new filename with timestamp and random string for uniqueness
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const filename = `profile_${timestamp}_${randomString}.jpg`;
    const localUri = `${IMAGES_DIRECTORY}${filename}`;
    
    // Handle different types of URIs
    if (imageUri.startsWith('file://') || 
        imageUri.startsWith('content://') || 
        imageUri.startsWith('ph://') ||  // For iOS photos
        imageUri.startsWith('assets-library://')) { // For iOS assets
      await FileSystem.copyAsync({
        from: imageUri,
        to: localUri
      });
      
      // Verify the file was copied successfully
      const newFileInfo = await FileSystem.getInfoAsync(localUri);
      if (!newFileInfo.exists) {
        throw new Error('Failed to copy image file');
      }
      
      return localUri;
    }
    
    // For remote URLs (starting with http:// or https://)
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      const downloadResult = await FileSystem.downloadAsync(imageUri, localUri);
      if (downloadResult.status !== 200) {
        throw new Error('Failed to download image');
      }
      return localUri;
    }
    
    // If we can't handle the URI format, return null
    console.warn('Unhandled image URI format:', imageUri);
    return null;
  } catch (error) {
    console.error('Error saving image locally:', error);
    return null;
  }
};

// Clean up old profile images
export const cleanupOldImages = async (currentImageUri) => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIRECTORY);
    // Only proceed if the directory exists
    if (!dirInfo.exists) {
      return;
    }
    
    const files = await FileSystem.readDirectoryAsync(IMAGES_DIRECTORY);
    for (const file of files) {
      const uri = `${IMAGES_DIRECTORY}${file}`;
      if (uri !== currentImageUri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    }
  } catch (error) {
    console.error('Error cleaning up old images:', error);
  }
};

// Generate JSON export
export const exportAsJSON = async (profileData) => {
  try {
    const jsonString = JSON.stringify(profileData, null, 2);
    const filename = `${profileData.name.replace(/\s+/g, '_')}_portfolio.json`;
    const filePath = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(filePath, jsonString);
    return filePath;
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw error;
  }
};

// Generate markdown export
export const exportAsMarkdown = async (profileData) => {
  try {
    const markdown = `# ${profileData.name}
## ${profileData.title}

${profileData.bio}

## Education
${profileData.education.map(edu => `
### ${edu.institution}
- **Degree:** ${edu.degree}
- **Period:** ${edu.period}
${edu.details ? `- **Details:** ${edu.details}` : ''}`).join('\n')}

## Skills
${profileData.skills.map(skill => `- **${skill.name}** - ${skill.proficiency}`).join('\n')}

## Projects
${profileData.projects.map(project => `
### ${project.title}
${project.description}

**Technologies:** ${project.technologies.join(', ')}
${project.valueAdded ? `\n**Value Added:** ${project.valueAdded}` : ''}`).join('\n')}

## Certificates
${(profileData.certificates || []).map(cert => `
### ${cert.name}
- **Issuer:** ${cert.issuer}
- **Date:** ${cert.date}
${cert.description ? `- **Description:** ${cert.description}` : ''}
${cert.verifyUrl ? `- [Verify Certificate](${cert.verifyUrl})` : ''}`).join('\n')}

## Testimonials
${profileData.testimonials.map(testimonial => `
> "${testimonial.quote}"
> 
> — ${testimonial.author}, ${testimonial.relation}`).join('\n\n')}

## Contact
- Email: ${profileData.contactInfo.email}
${profileData.contactInfo.phone ? `- Phone: ${profileData.contactInfo.phone}` : ''}
${profileData.contactInfo.linkedin ? `- LinkedIn: ${profileData.contactInfo.linkedin}` : ''}
${profileData.contactInfo.github ? `- GitHub: ${profileData.contactInfo.github}` : ''}
    `;

    const filename = `${profileData.name.replace(/\s+/g, '_')}_portfolio.md`;
    const filePath = `${FileSystem.documentDirectory}${filename}`;
    
    await FileSystem.writeAsStringAsync(filePath, markdown);
    return filePath;
  } catch (error) {
    console.error('Error exporting markdown:', error);
    throw error;
  }
};

export const sharePortfolio = async (profileData, format = 'pdf') => {
  try {
    let fileUri;
    let mimeType;
    let filename;

    switch (format.toLowerCase()) {
      case 'pdf':
        fileUri = await generatePDF(profileData);
        mimeType = 'application/pdf';
        filename = 'portfolio.pdf';
        break;
      case 'json':
        fileUri = await exportAsJSON(profileData);
        mimeType = 'application/json';
        filename = 'portfolio.json';
        break;
      case 'markdown':
      case 'md':
        fileUri = await exportAsMarkdown(profileData);
        mimeType = 'text/markdown';
        filename = 'portfolio.md';
        break;
      default:
        throw new Error('Unsupported format');
    }
    
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle: `Share Portfolio as ${format.toUpperCase()}`,
      UTI: mimeType
    });
  } catch (error) {
    console.error('Error sharing portfolio:', error);
    throw error;
  }
}; 