const fs = require('fs');
const https = require('https');
const path = require('path');

// Image placeholders (using placeholder.com for demonstration)
const images = {
    // Hero image - warm luxury background
    'hero.jpg': 'https://via.placeholder.com/1920x1080/a38a5e/ffffff?text=Smell+of+Luxury',
    
    // Featured perfumes
    'perfume1.jpg': 'https://via.placeholder.com/600x800/e4d2b7/362e21?text=Midnight+Essence',
    'perfume2.jpg': 'https://via.placeholder.com/600x800/c8a97e/ffffff?text=Golden+Aura',
    'perfume3.jpg': 'https://via.placeholder.com/600x800/362e21/c8a97e?text=Royal+Oud',
    'perfume4.jpg': 'https://via.placeholder.com/600x800/d1c0a5/362e21?text=Velvet+Dreams',
    
    // Categories
    'category1.jpg': 'https://via.placeholder.com/600x600/c8a97e/ffffff?text=Perfumes',
    'category2.jpg': 'https://via.placeholder.com/600x600/d1c0a5/362e21?text=Deodorants',
    'category3.jpg': 'https://via.placeholder.com/600x600/e4d2b7/362e21?text=Body+Mists',
    'category4.jpg': 'https://via.placeholder.com/600x600/362e21/c8a97e?text=Gift+Sets',
    
    // New arrivals
    'new1.jpg': 'https://via.placeholder.com/600x800/c8a97e/ffffff?text=Celestial+Notes',
    'new2.jpg': 'https://via.placeholder.com/600x800/d1c0a5/362e21?text=Whispers+of+Rose',
    'new3.jpg': 'https://via.placeholder.com/600x800/e4d2b7/362e21?text=Amber+Elegance',
    'new4.jpg': 'https://via.placeholder.com/600x800/362e21/c8a97e?text=Ocean+Breeze',
    'new5.jpg': 'https://via.placeholder.com/600x800/a38a5e/ffffff?text=Silk+Pathway',
    
    // Best sellers
    'best1.jpg': 'https://via.placeholder.com/600x800/a38a5e/ffffff?text=Misty+Noir',
    'best2.jpg': 'https://via.placeholder.com/600x800/e4d2b7/362e21?text=Ethereal+Blend',
    'best3.jpg': 'https://via.placeholder.com/600x800/c8a97e/ffffff?text=Regal+Musk',
    
    // Brands
    'brand1.jpg': 'https://via.placeholder.com/200x100/ffffff/362e21?text=Luxury+Brand+1',
    'brand2.jpg': 'https://via.placeholder.com/200x100/ffffff/362e21?text=Luxury+Brand+2',
    'brand3.jpg': 'https://via.placeholder.com/200x100/ffffff/362e21?text=Luxury+Brand+3',
    'brand4.jpg': 'https://via.placeholder.com/200x100/ffffff/362e21?text=Luxury+Brand+4',
    'brand5.jpg': 'https://via.placeholder.com/200x100/ffffff/362e21?text=Luxury+Brand+5',
    
    // Random picks
    'random1.jpg': 'https://via.placeholder.com/600x800/d1c0a5/362e21?text=Eternal+Sands',
    'random2.jpg': 'https://via.placeholder.com/600x800/c8a97e/ffffff?text=Mystic+Elixir',
    'random3.jpg': 'https://via.placeholder.com/600x800/e4d2b7/362e21?text=Serene+Delight',
    'random4.jpg': 'https://via.placeholder.com/600x800/362e21/c8a97e?text=Royal+Essence',
    'random5.jpg': 'https://via.placeholder.com/600x800/a38a5e/ffffff?text=Midnight+Opulence',
    'random6.jpg': 'https://via.placeholder.com/600x800/d1c0a5/362e21?text=Golden+Harmony',
    'random7.jpg': 'https://via.placeholder.com/600x800/c8a97e/ffffff?text=Velvet+Whisper',
    'random8.jpg': 'https://via.placeholder.com/600x800/e4d2b7/362e21?text=Exotic+Dreams'
};

// Create directory if it doesn't exist
const imagesDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Download images
const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imagesDir, filename);
        const file = fs.createWriteStream(filepath);
        
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(filepath, () => {}); // Delete the file if there was an error
            console.error(`Error downloading ${filename}: ${err.message}`);
            reject(err);
        });
    });
};

// Download all images sequentially
const downloadAllImages = async () => {
    for (const [filename, url] of Object.entries(images)) {
        try {
            await downloadImage(url, filename);
        } catch (error) {
            console.error(`Failed to download ${filename}`);
        }
    }
    console.log('All images downloaded successfully!');
};

// Start downloading
downloadAllImages(); 