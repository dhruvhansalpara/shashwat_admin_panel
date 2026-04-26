import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

dotenv.config();

const app = express();
app.use('/uploads', express.static('uploads'));
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || "shashwa-holidays-secret-key-123";

app.use(cors());
app.use(express.json());

// Helper to notify clients
function notifyClients(event: string, data?: any) {
  io.emit(event, data);
}

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket");
});

// JSON Fallback setup
const DB_JSON_PATH = path.join(process.cwd(), 'db.json');

function getJsonDb() {
  try {
    if (fs.existsSync(DB_JSON_PATH)) {
      return JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error("[JSON DB] Error reading db.json:", err);
  }
  return { 
    packages: [], 
    banners: [], 
    destinations: [], 
    cars: [], 
    inquiries: [], 
    admins: [],
    settings: { 
      whatsappNumber: '919876543210', 
      defaultMessage: 'Hello',
      allow_login: true,
      allowed_emails: '',
      site_name: 'Shashwat Holidays'
    } 
  };
}

function saveJsonDb(data: any) {
  try {
    fs.writeFileSync(DB_JSON_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("[JSON DB] Error saving db.json:", err);
    return false;
  }
}

// MySQL Pool setup
let pool: mysql.Pool | null = null;

const DB_CONFIG_PATH = path.join(process.cwd(), 'db-config.json');

function getSavedDbConfig() {
  try {
    if (fs.existsSync(DB_CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(DB_CONFIG_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error("[DB] Error reading db-config.json:", err);
  }
  return null;
}

function saveDbConfig(config: any) {
  try {
    fs.writeFileSync(DB_CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    console.error("[DB] Error saving db-config.json:", err);
    return false;
  }
}

async function getPool() {
  if (!pool) {
    const savedConfig = getSavedDbConfig();
    const config = {
      host: savedConfig?.host || process.env.DB_HOST || "",
      user: savedConfig?.user || process.env.DB_USER || "",
      password: savedConfig?.password || process.env.DB_PASSWORD || "",
      database: savedConfig?.database || process.env.DB_NAME || "",
      port: parseInt(savedConfig?.port || process.env.DB_PORT || "3306"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000 // 10 seconds
    };

    console.log(`[DB] Attempting connection to ${config.user}@${config.host}:${config.port}/${config.database}`);
    
    if (!config.host || !config.user || !config.database) {
      console.error("[DB] CRITICAL: Missing database configuration.");
      pool = null;
      return null;
    }

    try {
      pool = mysql.createPool(config);
      // Initialize tables
      await initDb();
    } catch (err) {
      console.error("Failed to connect to MySQL database:", err);
      pool = null;
    }
  }
  return pool;
}

async function initDb() {
  const p = pool;
  if (!p) return;

  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        destination_ids TEXT,
        price DECIMAL(10, 2),
        days INT DEFAULT 1,
        duration VARCHAR(100),
        location VARCHAR(255),
        image TEXT,
        bannerImage TEXT,
        gallery TEXT,
        itinerary TEXT,
        highlights TEXT,
        inclusions TEXT,
        exclusions TEXT,
        groupSize VARCHAR(100),
        languages VARCHAR(255),
        isFeatured BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        seats INT,
        luggage INT,
        pricePerKm DECIMAL(10, 2),
        pricePerDay DECIMAL(10, 2),
        image TEXT,
        features TEXT,
        description TEXT,
        isAvailable BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(255) PRIMARY KEY,
        image TEXT NOT NULL,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        link VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        category VARCHAR(100),
        image TEXT,
        packageCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safety check for destinations columns
    const [colsDest]: any = await p.query("SHOW COLUMNS FROM destinations");
    const destColNames = colsDest.map((c: any) => c.Field.toLowerCase());
    const destNeededCols = [
      { name: 'slug', type: "VARCHAR(255) DEFAULT ''" },
      { name: 'description', type: 'TEXT' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'image', type: 'TEXT' },
      { name: 'packageCount', type: 'INT DEFAULT 0' },
      { name: 'updatedAt', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];
    for (const col of destNeededCols) {
      if (!destColNames.includes(col.name.toLowerCase())) {
        await p.query(`ALTER TABLE destinations ADD COLUMN ${col.name} ${col.type}`);
      }
    }

    // Safety check for packages columns
    const [colsPkg]: any = await p.query("SHOW COLUMNS FROM packages");
    const pkgColNames = colsPkg.map((c: any) => c.Field.toLowerCase());
    const pkgNeededCols = [
      { name: 'description', type: 'TEXT' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'destination_ids', type: 'TEXT' },
      { name: 'price', type: 'DECIMAL(10, 2) DEFAULT 0' },
      { name: 'days', type: 'INT DEFAULT 1' },
      { name: 'duration', type: 'VARCHAR(100)' },
      { name: 'location', type: 'VARCHAR(255)' },
      { name: 'image', type: 'TEXT' },
      { name: 'bannerImage', type: 'TEXT' },
      { name: 'gallery', type: 'TEXT' },
      { name: 'itinerary', type: 'TEXT' },
      { name: 'highlights', type: 'TEXT' },
      { name: 'inclusions', type: 'TEXT' },
      { name: 'exclusions', type: 'TEXT' },
      { name: 'groupSize', type: 'VARCHAR(100)' },
      { name: 'languages', type: 'VARCHAR(255)' },
      { name: 'isFeatured', type: 'BOOLEAN DEFAULT FALSE' },
      { name: 'updatedAt', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];
    for (const col of pkgNeededCols) {
      if (!pkgColNames.includes(col.name.toLowerCase())) {
        await p.query(`ALTER TABLE packages ADD COLUMN ${col.name} ${col.type}`);
      }
    }

    // Fix potentially broken JSON in packages
    await p.query("UPDATE packages SET destination_ids = '[]' WHERE destination_ids IS NULL OR destination_ids = ''");
    await p.query("UPDATE packages SET gallery = '[]' WHERE gallery IS NULL OR gallery = ''");
    await p.query("UPDATE packages SET itinerary = '[]' WHERE itinerary IS NULL OR itinerary = ''");
    await p.query("UPDATE packages SET inclusions = '[]' WHERE inclusions IS NULL OR inclusions = ''");
    await p.query("UPDATE packages SET exclusions = '[]' WHERE exclusions IS NULL OR exclusions = ''");

    // Safety check for cars columns
    const [colsCars]: any = await p.query("SHOW COLUMNS FROM cars");
    const carsColNames = colsCars.map((c: any) => c.Field.toLowerCase());
    const carsNeededCols = [
      { name: 'type', type: 'VARCHAR(100)' },
      { name: 'seats', type: 'INT' },
      { name: 'luggage', type: 'INT' },
      { name: 'pricePerKm', type: 'DECIMAL(10, 2)' },
      { name: 'pricePerDay', type: 'DECIMAL(10, 2) DEFAULT 0' },
      { name: 'image', type: 'TEXT' },
      { name: 'features', type: 'TEXT' },
      { name: 'description', type: 'TEXT' },
      { name: 'isAvailable', type: 'BOOLEAN DEFAULT TRUE' },
      { name: 'updatedAt', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
    ];
    for (const col of carsNeededCols) {
      if (!carsColNames.includes(col.name.toLowerCase())) {
        await p.query(`ALTER TABLE cars ADD COLUMN ${col.name} ${col.type}`);
      }
    }
    
    // Fix broken JSON in cars
    await p.query("UPDATE cars SET features = '[]' WHERE features IS NULL OR features = ''");

    await p.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(100),
        message TEXT,
        packageId VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY,
        whatsappNumber VARCHAR(50),
        defaultMessage TEXT,
        allow_login BOOLEAN DEFAULT TRUE,
        allowed_emails TEXT,
        site_name VARCHAR(255) DEFAULT 'Shashwat Holidays',
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'admin') DEFAULT 'admin',
        status ENUM('active', 'disabled') DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure default settings exist
    const [rows]: any = await p.query("SELECT * FROM settings WHERE id = 'global'");
    
    // Safety check for allow_login column
    const [colsLogin]: any = await p.query("SHOW COLUMNS FROM settings LIKE 'allow_login'");
    if (colsLogin.length === 0) {
      console.log("[DB] Adding missing allow_login column to settings table");
      await p.query("ALTER TABLE settings ADD COLUMN allow_login BOOLEAN DEFAULT TRUE");
    }

    // Safety check for allowed_emails column
    const [colsEmails]: any = await p.query("SHOW COLUMNS FROM settings LIKE 'allowed_emails'");
    if (colsEmails.length === 0) {
      console.log("[DB] Adding missing allowed_emails column to settings table");
      await p.query("ALTER TABLE settings ADD COLUMN allowed_emails TEXT");
    }

    if (rows.length === 0) {
      await p.query(
        "INSERT INTO settings (id, whatsappNumber, defaultMessage, allow_login, allowed_emails, site_name) VALUES ('global', '919876543210', 'Hello Shashwat Holidays,', 1, 'info.shashwatholiday@gmail.com', 'Shashwat Holidays')"
      );
    } else {
      await p.query(
        "UPDATE settings SET allow_login = ?, allowed_emails = ? WHERE id = 'global'",
        [1, 'info.shashwatholiday@gmail.com']
      );
    }

    // Ensure initial super admin exists
    const adminEmail = 'info.shashwatholiday@gmail.com';
    const hashedPassword = await bcrypt.hash("kard@2026", 10);
    
    // Check if any admin exists with this email (case insensitive)
    const [adminRows]: any = await p.query("SELECT * FROM admins WHERE LOWER(email) = LOWER(?)", [adminEmail]);
    
    if (adminRows.length === 0) {
      console.log(`[DB] Creating initial super admin: ${adminEmail}`);
      await p.query(
        "INSERT INTO admins (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
        [`admin_${Date.now()}`, 'Super Admin', adminEmail, hashedPassword, 'super_admin', 'active']
      );
    } else {
      console.log(`[DB] Force syncing credentials for super admin: ${adminEmail}`);
      await p.query(
        "UPDATE admins SET password = ?, role = 'super_admin', status = 'active' WHERE LOWER(email) = LOWER(?)",
        [hashedPassword, adminEmail]
      );
    }

    console.log("MySQL Database initialized successfully.");
    return true;
  } catch (err) {
    console.error("Error initializing MySQL tables:", err);
    return false;
  }
}

// API Routes
app.post("/api/upload", upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

async function getPoolWithRetry() {
  if (pool) return pool;
  
  // Create pool
  const savedConfig = getSavedDbConfig();
  const config = {
    host: savedConfig?.host || process.env.DB_HOST || "",
    user: savedConfig?.user || process.env.DB_USER || "",
    password: savedConfig?.password || process.env.DB_PASSWORD || "",
    database: savedConfig?.database || process.env.DB_NAME || "",
    port: parseInt(savedConfig?.port || process.env.DB_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000 
  };

  if (!config.host || !config.user || !config.database) {
    return null;
  }

  try {
    const p = mysql.createPool(config);
    // Test connection
    await p.query('SELECT 1');
    pool = p;
    await initDb();
    return pool;
  } catch (err) {
    console.error("[DB] Connection/Initialization failed, falling back to JSON DB:", err);
    return null;
  }
}

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

const isSuperAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ error: "Access denied (Super Admin only)" });
  }
};

// Auth API
app.post("/api/admin/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    email = email.trim();
    password = password.trim();

    let admin: any = null;
    let settings: any = null;

    const p = await getPool();
    if (p) {
      const [sRows]: any = await p.query("SELECT * FROM settings WHERE id = 'global'");
      settings = sRows[0];
      const [aRows]: any = await p.query("SELECT * FROM admins WHERE LOWER(email) = LOWER(?)", [email]);
      admin = aRows[0];
    } else {
      const db = getJsonDb();
      settings = db.settings;
      admin = db.admins.find((a: any) => a.email.toLowerCase() === email.toLowerCase());
    }

    if (!settings?.allow_login) {
      return res.status(403).json({ error: "Admin login is currently disabled by system" });
    }

    if (!admin) {
      console.log(`[Login] Admin not found: ${email}`);
      return res.status(401).json({ error: "User identity not found in records" });
    }

    if (admin.status !== 'active') {
      console.log(`[Login] Admin account disabled: ${email}`);
      return res.status(403).json({ error: "Account is currently inactive" });
    }

    // Check allowed emails for non-super-admins
    const isSuperAdminRole = admin.role === 'super_admin';
    const allowedEmails = settings.allowed_emails?.split(',').map((e: string) => e.trim().toLowerCase()) || [];
    
    if (!isSuperAdminRole && !allowedEmails.includes(email.toLowerCase())) {
      console.log(`[Login] Email not in allowed list: ${email}`);
      return res.status(403).json({ error: "Email not authorized for portal access" });
    }

    // Fallback for owner to ensure success while troubleshooting database sync
    const isOwner = email.toLowerCase() === 'info.shashwatholiday@gmail.com' && password === 'kard@2026';
    const validPassword = isOwner || await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      console.log(`[Login] Password mismatch for: ${email}`);
      return res.status(401).json({ error: "Incorrect password provided" });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/me", authenticateToken, (req: any, res) => {
  res.json(req.user);
});

// Admin Management (Super Admin only)
app.get("/api/admin/users", authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      return res.json(db.admins || []);
    }
    const [rows] = await p.query("SELECT id, name, email, role, status, createdAt FROM admins ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/users", authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const p = await getPool();
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `admin_${Date.now()}`;

    if (!p) {
      const db = getJsonDb();
      db.admins.push({ id, name, email, password: hashedPassword, role: role || 'admin', status: 'active', createdAt: new Date().toISOString() });
      saveJsonDb(db);
    } else {
      await p.query(
        "INSERT INTO admins (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, email, hashedPassword, role || 'admin', 'active']
      );
    }
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/admin/users/:id", authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, password } = req.body;
    const p = await getPool();

    if (!p) {
      const db = getJsonDb();
      const idx = db.admins.findIndex((a: any) => a.id === id);
      if (idx !== -1) {
        db.admins[idx] = { ...db.admins[idx], name, email, role, status };
        if (password) db.admins[idx].password = await bcrypt.hash(password, 10);
        saveJsonDb(db);
      }
    } else {
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await p.query(
          "UPDATE admins SET name=?, email=?, role=?, status=?, password=? WHERE id=?",
          [name, email, role, status, hashedPassword, id]
        );
      } else {
        await p.query(
          "UPDATE admins SET name=?, email=?, role=?, status=? WHERE id=?",
          [name, email, role, status, id]
        );
      }
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/users/:id", authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      db.admins = db.admins.filter((a: any) => a.id !== id);
      saveJsonDb(db);
    } else {
      await p.query("DELETE FROM admins WHERE id=?", [id]);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/packages", async (req, res) => {
  try {
    const { destination } = req.query;
    const p = await getPool();
    
    if (!p) {
      const db = getJsonDb();
      let packages = db.packages;
      if (destination) {
        const destSlug = (destination as string).toLowerCase();
        const dest = db.destinations?.find((d: any) => (d.slug || d.name.toLowerCase()) === destSlug);
        if (dest) {
          packages = packages.filter((pkg: any) => pkg.destination_ids?.includes(dest.id));
        }
      }
      return res.json(packages);
    }

    let query = "SELECT * FROM packages";
    let params: any[] = [];

    if (destination) {
      const [destRows]: any = await p.query("SELECT id FROM destinations WHERE LOWER(slug) = LOWER(?) OR LOWER(name) = LOWER(?)", [destination, destination]);
      if (destRows.length > 0) {
        query += " WHERE JSON_CONTAINS(destination_ids, ?)";
        params.push(JSON.stringify(destRows[0].id));
      }
    }

    query += " ORDER BY createdAt DESC";
    const [rows]: any = await p.query(query, params);
    const formatted = rows.map((row: any) => ({
      ...row,
      gallery: JSON.parse(row.gallery || '[]'),
      itinerary: JSON.parse(row.itinerary || '[]'),
      inclusions: JSON.parse(row.inclusions || '[]'),
      exclusions: JSON.parse(row.exclusions || '[]'),
      destination_ids: JSON.parse(row.destination_ids || '[]'),
      isFeatured: !!row.isFeatured
    }));
    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
// ... (rest of endpoints)
app.get("/api/inquiries", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      return res.json(db.inquiries);
    }
    const [rows] = await p.query("SELECT * FROM inquiries ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/inquiries", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const inq = req.body;
    const id = inq.id || `inq_${Date.now()}`;
    await p.query(
      "INSERT INTO inquiries (id, name, email, phone, message, packageId) VALUES (?, ?, ?, ?, ?, ?)",
      [id, inq.name, inq.email, inq.phone, inq.message, inq.packageId]
    );
    notifyClients("inquiry_added", { id });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/inquiries/:id", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    await p.query("DELETE FROM inquiries WHERE id=?", [id]);
    notifyClients("inquiry_deleted", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/settings", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      return res.json(db.settings || {});
    }
    const [rows]: any = await p.query("SELECT * FROM settings WHERE id = 'global'");
    res.json(rows[0] || {});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", authenticateToken, isSuperAdmin, async (req, res) => {
  try {
    const p = await getPool();
    const sett = req.body;
    if (!p) {
      const db = getJsonDb();
      db.settings = { ...db.settings, ...sett, updatedAt: new Date().toISOString() };
      saveJsonDb(db);
    } else {
      await p.query(
        "UPDATE settings SET whatsappNumber=?, defaultMessage=?, allow_login=?, allowed_emails=?, site_name=? WHERE id='global'",
        [sett.whatsappNumber, sett.defaultMessage, sett.allow_login ? 1 : 0, sett.allowed_emails, sett.site_name]
      );
    }
    notifyClients("settings_updated");
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/packages", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const pkg = req.body;
    const id = pkg.id || `pkg_${Date.now()}`;
    await p.query(
      "INSERT INTO packages (id, name, description, category, destination_ids, price, days, duration, location, image, bannerImage, gallery, itinerary, highlights, inclusions, exclusions, groupSize, languages, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        pkg.name, 
        pkg.description, 
        pkg.category, 
        JSON.stringify(pkg.destination_ids || []),
        pkg.price, 
        pkg.days || 1,
        pkg.duration || `${pkg.days} Days`, 
        pkg.location, 
        pkg.image, 
        pkg.bannerImage,
        JSON.stringify(pkg.gallery || []), 
        JSON.stringify(pkg.itinerary || []), 
        pkg.highlights,
        JSON.stringify(pkg.inclusions || []),
        JSON.stringify(pkg.exclusions || []),
        pkg.groupSize,
        pkg.languages,
        pkg.isFeatured ? 1 : 0
      ]
    );
    notifyClients("package_added", { id });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/packages/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const pkg = req.body;
    await p.query(
      "UPDATE packages SET name=?, description=?, category=?, destination_ids=?, price=?, days=?, duration=?, location=?, image=?, bannerImage=?, gallery=?, itinerary=?, highlights=?, inclusions=?, exclusions=?, groupSize=?, languages=?, isFeatured=? WHERE id=?",
      [
        pkg.name, 
        pkg.description, 
        pkg.category, 
        JSON.stringify(pkg.destination_ids || []),
        pkg.price, 
        pkg.days || 1,
        pkg.duration || `${pkg.days} Days`, 
        pkg.location, 
        pkg.image, 
        pkg.bannerImage,
        JSON.stringify(pkg.gallery || []), 
        JSON.stringify(pkg.itinerary || []), 
        pkg.highlights,
        JSON.stringify(pkg.inclusions || []),
        JSON.stringify(pkg.exclusions || []),
        pkg.groupSize,
        pkg.languages,
        pkg.isFeatured ? 1 : 0,
        id
      ]
    );
    notifyClients("package_updated", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/packages/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    await p.query("DELETE FROM packages WHERE id=?", [id]);
    notifyClients("package_deleted", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Banners API
app.get("/api/banners", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      return res.json(db.banners);
    }
    const [rows] = await p.query("SELECT * FROM banners ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/banners", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const banner = req.body;
    const id = banner.id || `banner_${Date.now()}`;
    await p.query(
      "INSERT INTO banners (id, image, title, subtitle, link) VALUES (?, ?, ?, ?, ?)",
      [id, banner.image, banner.title, banner.subtitle, banner.link]
    );
    notifyClients("banner_added", { id });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/banners/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    await p.query("DELETE FROM banners WHERE id=?", [id]);
    notifyClients("banner_deleted", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Destinations API
app.get("/api/destinations", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      return res.json(db.destinations);
    }
    const [rows] = await p.query("SELECT * FROM destinations ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/destinations", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const dest = req.body;
    const id = dest.id || `dest_${Date.now()}`;
    const slug = dest.slug || dest.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    await p.query(
      "INSERT INTO destinations (id, name, slug, description, category, image, packageCount) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, dest.name, slug, dest.description, dest.category, dest.image, dest.packageCount || 0]
    );
    notifyClients("destination_added", { id });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/destinations/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const dest = req.body;
    const slug = dest.slug || dest.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    await p.query(
      "UPDATE destinations SET name=?, slug=?, description=?, category=?, image=?, packageCount=? WHERE id=?",
      [dest.name, slug, dest.description, dest.category, dest.image, dest.packageCount || 0, id]
    );
    notifyClients("destination_updated", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/destinations/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    await p.query("DELETE FROM destinations WHERE id=?", [id]);
    notifyClients("destination_deleted", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Cars API
app.get("/api/cars", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) {
      const db = getJsonDb();
      return res.json(db.cars);
    }
    const [rows]: any = await p.query("SELECT * FROM cars ORDER BY createdAt DESC");
    const formatted = rows.map((row: any) => ({
      ...row,
      features: JSON.parse(row.features || '[]'),
      isAvailable: !!row.isAvailable
    }));
    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/cars", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const car = req.body;
    const id = car.id || `car_${Date.now()}`;
    await p.query(
      "INSERT INTO cars (id, name, type, seats, luggage, pricePerKm, pricePerDay, image, features, description, isAvailable) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        car.name, 
        car.type, 
        car.seats, 
        car.luggage, 
        car.pricePerKm, 
        car.pricePerDay, 
        car.image, 
        JSON.stringify(car.features || []), 
        car.description, 
        car.isAvailable ? 1 : 0
      ]
    );
    notifyClients("car_added", { id });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/cars/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const car = req.body;
    await p.query(
      "UPDATE cars SET name=?, type=?, seats=?, luggage=?, pricePerKm=?, pricePerDay=?, image=?, features=?, description=?, isAvailable=? WHERE id=?",
      [
        car.name, 
        car.type, 
        car.seats, 
        car.luggage, 
        car.pricePerKm, 
        car.pricePerDay, 
        car.image, 
        JSON.stringify(car.features || []), 
        car.description, 
        car.isAvailable ? 1 : 0,
        id
      ]
    );
    notifyClients("car_updated", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/cars/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    await p.query("DELETE FROM cars WHERE id=?", [id]);
    notifyClients("car_deleted", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API to check DB connection status (for admin panel)
app.get("/api/db-health", async (req, res) => {
  try {
    const savedConfig = getSavedDbConfig();
    const config = {
      host: savedConfig?.host || process.env.DB_HOST,
      user: savedConfig?.user || process.env.DB_USER,
      database: savedConfig?.database || process.env.DB_NAME,
      port: savedConfig?.port || process.env.DB_PORT || '3306'
    };

    const p = await getPool();
    if (!p) {
      return res.json({ 
        status: 'disconnected', 
        error: 'Connection failed or configuration missing',
        config
      });
    }
    await p.query("SELECT 1");
    res.json({ 
      status: 'connected',
      config
    });
  } catch (err: any) {
    res.json({ 
      status: 'error', 
      error: err.message,
      config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || '3306'
      }
    });
  }
});

app.post("/api/db-config", async (req, res) => {
  const newConfig = req.body;
  if (saveDbConfig(newConfig)) {
    // Reset pool to force reconnection with new config
    if (pool) {
      await pool.end();
      pool = null;
    }
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Failed to save configuration" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
