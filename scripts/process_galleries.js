import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const STAGING_DIR = path.join(process.cwd(), '_staging_photos');
const GALLERY_PUBLIC_DIR = path.join(process.cwd(), 'public', 'images', 'gallery');
const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'gallery');

const GROUP_MAP = {
    'flooring': 'Flooring',
    'bathrooms': 'Bathrooms',
    'stairs': 'Stairs and Handrails',
    'railings': 'Stairs and Handrails'
};

async function processGalleries() {
    // Clear existing output directories (optional but good for clean runs)
    if (fs.existsSync(GALLERY_PUBLIC_DIR)) {
        fs.rmSync(GALLERY_PUBLIC_DIR, { recursive: true, force: true });
    }
    if (fs.existsSync(CONTENT_DIR)) {
        fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
    }

    fs.mkdirSync(GALLERY_PUBLIC_DIR, { recursive: true });
    fs.mkdirSync(CONTENT_DIR, { recursive: true });

    if (!fs.existsSync(STAGING_DIR)) {
        console.error("Staging directory not found:", STAGING_DIR);
        return;
    }

    const folders = fs.readdirSync(STAGING_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const folder of folders) {
        console.log(`Processing ${folder}...`);

        // Parse group and order
        const match = folder.match(/^([a-z]+)-(\d+)$/);
        if (!match) {
            console.warn(`Skipping ${folder}: Does not match expected pattern (prefix-number).`);
            continue;
        }

        const prefix = match[1];
        const order = parseInt(match[2], 10);
        const group = GROUP_MAP[prefix];

        if (!group) {
            console.warn(`Skipping ${folder}: Unknown prefix '${prefix}'.`);
            continue;
        }

        const sourceFolder = path.join(STAGING_DIR, folder);
        const destPublicFolder = path.join(GALLERY_PUBLIC_DIR, folder);
        fs.mkdirSync(destPublicFolder, { recursive: true });

        const files = fs.readdirSync(sourceFolder).filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp'));

        let befores = {};
        let afters = {};
        let progresses = [];
        let allAfters = [];

        // Categorize files
        for (const file of files) {
            const numMatch = file.match(/^[a-zA-Z]+-(\d+)\./);
            const num = numMatch ? numMatch[1] : null;

            if (file.startsWith('before-') && num) {
                befores[num] = file;
            } else if (file.startsWith('after-')) {
                allAfters.push(file);
                if (num) afters[num] = file;
            } else if (file.startsWith('progress-')) {
                progresses.push(file);
            }
        }

        // Sort naturally
        allAfters.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        progresses.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        let finalImages = [];
        let coverImage = "";

        // Ensure "after-1" exists for the cover
        const after1File = allAfters.find(f => f.startsWith('after-1.'));
        if (after1File) {
            const destName = `cover.jpg`;
            await processImage(path.join(sourceFolder, after1File), path.join(destPublicFolder, destName));
            coverImage = `/images/gallery/${folder}/${destName}`;
        } else if (allAfters.length > 0) {
            // Fallback if no explicit after-1
            const destName = `cover.jpg`;
            await processImage(path.join(sourceFolder, allAfters[0]), path.join(destPublicFolder, destName));
            coverImage = `/images/gallery/${folder}/${destName}`;
        }

        // Process all strictly after images and generate composites
        for (const afterFile of allAfters) {
            const baseName = path.basename(afterFile, path.extname(afterFile));
            const destName = `${baseName}.jpg`;
            await processImage(path.join(sourceFolder, afterFile), path.join(destPublicFolder, destName));
            finalImages.push({ src: `/images/gallery/${folder}/${destName}`, alt: "Finished result" });

            // Check if there is a matching before image to create a composite
            const numMatch = afterFile.match(/^after-(\d+)\./);
            if (numMatch) {
                const num = numMatch[1];
                if (befores[num]) {
                    console.log(`  Generating Before/After composite for ${num}...`);
                    const compositeName = `before-after-${num}.jpg`;
                    const compositePath = path.join(destPublicFolder, compositeName);

                    await createBeforeAfterComposite(
                        path.join(sourceFolder, befores[num]),
                        path.join(sourceFolder, afterFile),
                        compositePath
                    );

                    finalImages.push({ src: `/images/gallery/${folder}/${compositeName}`, alt: "Before and After comparison" });
                }
            }
        }

        // Copy progress photos
        for (const progFile of progresses) {
            const baseName = path.basename(progFile, path.extname(progFile));
            const destName = `${baseName}.jpg`;
            await processImage(path.join(sourceFolder, progFile), path.join(destPublicFolder, destName));
            finalImages.push({ src: `/images/gallery/${folder}/${destName}`, alt: "Work in progress" });
        }

        // Generate JSON
        const jsonContent = {
            group: group,
            order: order,
            coverImage: coverImage,
            images: finalImages
        };

        const jsonPath = path.join(CONTENT_DIR, `${folder}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 4));
    }

    console.log("Processing complete!");
}

async function createBeforeAfterComposite(beforePath, afterPath, outPath) {
    const COMPOSITE_WIDTH = 1200;
    const COMPOSITE_HEIGHT = 800; // 3:2 ratio
    const HALF_WIDTH = COMPOSITE_WIDTH / 2;

    try {
        // Resize and crop both images to exactly half the width and full height
        const beforeBuf = await sharp(beforePath)
            .resize(HALF_WIDTH, COMPOSITE_HEIGHT, { fit: 'cover', position: 'center' })
            .toBuffer();

        const afterBuf = await sharp(afterPath)
            .resize(HALF_WIDTH, COMPOSITE_HEIGHT, { fit: 'cover', position: 'center' })
            .toBuffer();

        // Create text overlays
        const svgBefore = `
        <svg width="${HALF_WIDTH}" height="${COMPOSITE_HEIGHT}">
          <rect x="20" y="20" width="120" height="40" fill="rgba(0,0,0,0.7)" rx="5"/>
          <text x="80" y="47" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">BEFORE</text>
        </svg>`;

        const svgAfter = `
        <svg width="${HALF_WIDTH}" height="${COMPOSITE_HEIGHT}">
          <rect x="${HALF_WIDTH - 140}" y="20" width="120" height="40" fill="rgba(0,0,0,0.7)" rx="5"/>
          <text x="${HALF_WIDTH - 80}" y="47" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">AFTER</text>
        </svg>`;

        // Composite them together
        await sharp({
            create: {
                width: COMPOSITE_WIDTH,
                height: COMPOSITE_HEIGHT,
                channels: 3,
                background: { r: 255, g: 255, b: 255 }
            }
        })
            .composite([
                { input: beforeBuf, top: 0, left: 0 },
                { input: afterBuf, top: 0, left: HALF_WIDTH },
                { input: Buffer.from(svgBefore), top: 0, left: 0 },
                { input: Buffer.from(svgAfter), top: 0, left: HALF_WIDTH },
                // Add a 4px white dividing line down the middle
                {
                    input: { create: { width: 4, height: COMPOSITE_HEIGHT, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } },
                    top: 0, left: HALF_WIDTH - 2
                }
            ])
            .jpeg({ quality: 85 })
            .toFile(outPath);

    } catch (error) {
        console.error("Error creating composite:", error);
    }
}

async function processImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(outputPath);
    } catch (error) {
        console.error(`Error processing image ${inputPath}:`, error);
    }
}

processGalleries().catch(console.error);
