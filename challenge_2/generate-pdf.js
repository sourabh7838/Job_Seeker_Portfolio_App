const fs = require('fs');
const path = require('path');
const markdown = require('markdown-pdf');
const options = {
  cssPath: path.join(__dirname, 'pdf-style.css'),
  remarkable: {
    html: true,
    breaks: true,
    plugins: ['remarkable-meta']
  }
};

// Read the README.md file
const readmePath = path.join(__dirname, 'README.md');
const outputPath = path.join(__dirname, 'README.pdf');

// Generate PDF
markdown()
  .from(readmePath)
  .to(outputPath, function () {
    console.log('PDF generated successfully!');
  }); 