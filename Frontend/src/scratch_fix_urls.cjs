const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const frontendSrc = path.join(__dirname, '..');

walkDir(frontendSrc, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Add getImageUrl to imports if BASE_IMAGE_URL is imported and getImageUrl is not
        if (content.includes('BASE_IMAGE_URL') && !content.includes('getImageUrl')) {
            content = content.replace(/BASE_IMAGE_URL(\s*\} from)/g, 'BASE_IMAGE_URL, getImageUrl$1');
            content = content.replace(/BASE_IMAGE_URL(,\s*)/g, 'BASE_IMAGE_URL, getImageUrl$1');
            modified = true;
        }

        // Replace `${BASE_IMAGE_URL}${variable}` with getImageUrl(variable)
        // Example 1: `${BASE_IMAGE_URL}${visit.images[0]}` -> getImageUrl(visit.images[0])
        const regex1 = /`\$\{BASE_IMAGE_URL\}\$\{([^}]+)\}`/g;
        if (regex1.test(content)) {
            content = content.replace(regex1, 'getImageUrl($1)');
            modified = true;
        }

        // Replace `${BASE_IMAGE_URL}/something` with getImageUrl('/something')
        const regex2 = /`\$\{BASE_IMAGE_URL\}([^`$]+)`/g;
        if (regex2.test(content)) {
            content = content.replace(regex2, (match, p1) => `getImageUrl('${p1}')`);
            modified = true;
        }
        
        // Handle `${BASE_IMAGE_URL}${variable}/something`
        const regex3 = /`\$\{BASE_IMAGE_URL\}\$\{([^}]+)\}([^`]+)`/g;
        if (regex3.test(content)) {
            content = content.replace(regex3, (match, p1, p2) => `getImageUrl(${p1} + '${p2}')`);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
