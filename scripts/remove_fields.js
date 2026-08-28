const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/USUARIO/OneDrive/Desktop/Luxxo/Luxxo-catalog';

function processJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let data = JSON.parse(content);
        let modified = false;

        if (Array.isArray(data)) {
            for (let item of data) {
                if (item.material !== undefined) { delete item.material; modified = true; }
                if (item.isFreeShipping !== undefined) { delete item.isFreeShipping; modified = true; }
                if (item.variants && Array.isArray(item.variants)) {
                    for (let variant of item.variants) {
                        if (variant.material !== undefined) { delete variant.material; modified = true; }
                        if (variant.isFreeShipping !== undefined) { delete variant.isFreeShipping; modified = true; }
                    }
                }
            }
        } else if (typeof data === 'object' && data !== null) {
            if (data.material !== undefined) { delete data.material; modified = true; }
            if (data.isFreeShipping !== undefined) { delete data.isFreeShipping; modified = true; }
            if (data.variants && Array.isArray(data.variants)) {
                for (let variant of data.variants) {
                    if (variant.material !== undefined) { delete variant.material; modified = true; }
                    if (variant.isFreeShipping !== undefined) { delete variant.isFreeShipping; modified = true; }
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
            console.log(`Updated ${filePath}`);
        }
    } catch (e) {
        console.error(`Error processing ${filePath}: ${e.message}`);
    }
}

function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else if (file === 'metadata.json' || file === 'catalog-data.json') {
            processJsonFile(fullPath);
        }
    }
}

console.log('Starting field removal...');
scanDir(path.join(projectRoot, 'public', 'images'));
scanDir(path.join(projectRoot, 'src', 'lib'));
console.log('Done.');
