const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('./shops.db');


// Set up the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes for serving the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/index_cs', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index_cs.html'));
});

// Route for serving privacy policy
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'privacy-policy.html'));
});

// Route to generate a shop recommendations page
app.get('/shop/:id/:language?', (req, res) => {
    const shopId = req.params.id; // Shop ID from the URL
    const language = req.params.language || 'en'; // Language code from the URL, default is 'en'

    // Supported languages        // Add more languages as needed
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'cs', 'sk', 'pl', 'ru', 'vi'];

    // SQL queries
    const shopQuery = `SELECT * FROM shops WHERE id = ?`;
    const itemsQuery = `
        SELECT id, name, description, affiliate_link, image, type
        FROM items
        WHERE shop_id = ?
        ORDER BY name;
    `;

    try {
        // Fetch shop details
        const shop = db.prepare(shopQuery).get(shopId);

        if (!shop) {
            return res.status(404).send('Shop not found');
        }

        // Fetch items for the shop
        const items = db.prepare(itemsQuery).all(shopId);

        // Example grouping logic on the server
        const groupedByType = items.reduce((acc, item) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type].push(item);
            return acc;
        }, {});


        // Render the shop page with data
        res.render('shop', {
            shop,          // Shop details
            groupedByType,         // Items list
            lang_codes: supportedLanguages, // Supported languages
            defaultLanguage: language,      // Current language
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Database error.');
    }
});

// For invalid URLs
app.use((req, res) => {
    console.log("URL Not Found!");
    res.status(404).sendFile(path.join(__dirname, 'views', 'index.html')); // Serve the landing page
});


// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
