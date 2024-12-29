const Database = require('better-sqlite3');

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new Database('shops.db');

// Create the `shops` table
db.prepare(`
CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
`).run();

// Create the `items` table
db.prepare(`
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    affiliate_link TEXT,
    image BLOB,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);
`).run();

console.log('Database setup complete.');

// Insert a shop
const insertShop = db.prepare('INSERT INTO shops (name) VALUES (?)');
const shopExists = db.prepare('SELECT 1 FROM shops WHERE name = ?').get('Awesome Shop');

if (!shopExists) {
    insertShop.run('Awesome Shop');
}

const shopId = db.prepare('SELECT id FROM shops WHERE name = ?').get('Awesome Shop').id;

// Insert items for the shop
const insertItem = db.prepare(`
  INSERT INTO items (shop_id, name, description, affiliate_link, image)
  VALUES (?, ?, ?, ?, ?)
`);

// Example: Inserting an item
const fs = require('fs');
const imageData = fs.readFileSync('public/product4.jpg'); // Load image as binary
const Link1 = "https://amzn.to/3Xhm2PC"
const Link2 = "https://amzn.to/3DHlOtW"
const placeHOLText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, arcu a pharetra vehicula, nulla purus posuere lorem, eget fermentum purus justo eget ligula. Nullam aliquet odio in nisl condimentum, sed sagittis nisl facilisis. Vestibulum mattis dolor sit amet nulla facilisis ultrices."

insertItem.run(
  shopId,
  'Good Product',
  placeHOLText,
  Link1,
  imageData
);

console.log('Data inserted successfully.');
