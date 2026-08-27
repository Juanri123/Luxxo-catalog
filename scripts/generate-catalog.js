const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'catalog-data.json');

function getFolderMetadata(dirPath) {
    const metadataPath = path.join(dirPath, 'metadata.json');
    try {
        const content = fs.readFileSync(metadataPath, 'utf-8');
        return JSON.parse(content);
    } catch {
        return undefined;
    }
}

function getRecursiveImageCount(dirPath) {
    let count = 0;
    let preview = null;

    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const imageFiles = [];
        const subDirs = [];

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            try {
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    subDirs.push(entry.name);
                } else if (/\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
                    imageFiles.push(entry.name);
                }
            } catch { }
        }

        count += imageFiles.length;
        if (imageFiles.length > 0 && !preview) {
            const relativePath = path.relative(IMAGES_DIR, path.join(dirPath, imageFiles[0])).replace(/\\/g, '/');
            preview = `/images/${relativePath.split('/').map(encodeURIComponent).join('/')}`;
        }

        for (const dir of subDirs) {
            const subResult = getRecursiveImageCount(path.join(dirPath, dir));
            count += subResult.count;
            if (!preview) preview = subResult.preview;
        }
    } catch (e) {
        console.error(`Error reading ${dirPath}:`, e);
    }

    return { count, preview };
}

function generateCatalog() {
    console.log("Generating static catalog JSON...");
    const data = {
        categories: [],
        contents: {} // Maps slug path "-Hombre-/Cadenas" to the DirectoryContent object
    };

    if (!fs.existsSync(IMAGES_DIR)) {
        console.warn("No public/images folder found!");
        return data;
    }

    const rootEntries = fs.readdirSync(IMAGES_DIR, { withFileTypes: true });

    // First pass: generate root categories
    for (const entry of rootEntries) {
        const categoryPath = path.join(IMAGES_DIR, entry.name);
        try {
            const stats = fs.statSync(categoryPath);
            if (!stats.isDirectory()) continue;

            const { count, preview } = getRecursiveImageCount(categoryPath);
            const metadata = getFolderMetadata(categoryPath);

            data.categories.push({
                name: entry.name,
                slug: entry.name,
                imageCount: count,
                previewImage: preview,
                metadata
            });
        } catch { }
    }

    // Second pass recursive: build contents dictionary for all valid slug paths
    function buildDirectoryContents(dirPath, currentSlugs = []) {
        try {
            const stats = fs.statSync(dirPath);
            if (!stats.isDirectory()) return;

            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            const subcategories = [];
            const images = [];
            const currentMetadata = getFolderMetadata(dirPath);

            for (const entry of entries) {
                const entryPath = path.join(dirPath, entry.name);
                try {
                    const entryStats = fs.statSync(entryPath);

                    if (entryStats.isDirectory()) {
                        const { count, preview } = getRecursiveImageCount(entryPath);
                        const metadata = getFolderMetadata(entryPath);
                        subcategories.push({
                            type: 'category',
                            name: entry.name,
                            slug: entry.name,
                            count,
                            preview,
                            metadata
                        });

                        // Recurse into this subdirectory
                        buildDirectoryContents(entryPath, [...currentSlugs, entry.name]);
                    } else if (/\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
                        const relativePath = path.relative(IMAGES_DIR, entryPath).replace(/\\/g, '/');
                        images.push({
                            type: 'image',
                            name: entry.name.replace(/\.(png|jpg|jpeg|webp)$/i, ''),
                            src: `/images/${relativePath.split('/').map(encodeURIComponent).join('/')}`
                        });
                    }
                } catch { }
            }

            // Save content for this node
            const slugKey = currentSlugs.join('/');
            if (currentSlugs.length > 0) {
                data.contents[slugKey] = {
                    name: currentSlugs[currentSlugs.length - 1], // Just the final piece of the slug path
                    subcategories,
                    images,
                    metadata: currentMetadata
                };
            }
        } catch (err) {
            console.error(`Error processing path ${dirPath}:`, err);
        }
    }

    // Build for each root category
    for (const cat of data.categories) {
        buildDirectoryContents(path.join(IMAGES_DIR, cat.name), [cat.name]);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Generated ${OUTPUT_FILE} with size ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

generateCatalog();
