import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

app.use(cors());
app.use(express.json());

// Helper to notify clients
function notifyClients(event: string, data?: any) {
  io.emit(event, data);
}

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket");
});

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
        image TEXT,
        packageCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure default settings exist
    const [rows]: any = await p.query("SELECT * FROM settings WHERE id = 'global'");
    if (rows.length === 0) {
      await p.query(
        "INSERT INTO settings (id, whatsappNumber, defaultMessage) VALUES ('global', '919876543210', 'Hello Shashwa Holidays,')"
      );
    }

    console.log("MySQL Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing MySQL tables:", err);
  }
}

// API Routes
app.get("/api/packages", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const [rows]: any = await p.query("SELECT * FROM packages ORDER BY createdAt DESC");
    const formatted = rows.map((row: any) => ({
      ...row,
      gallery: JSON.parse(row.gallery || '[]'),
      itinerary: JSON.parse(row.itinerary || '[]'),
      inclusions: JSON.parse(row.inclusions || '[]'),
      exclusions: JSON.parse(row.exclusions || '[]'),
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
    if (!p) return res.status(500).json({ error: "Database not configured" });
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
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const [rows]: any = await p.query("SELECT * FROM settings WHERE id = 'global'");
    res.json(rows[0] || {});
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/settings", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const sett = req.body;
    await p.query(
      "UPDATE settings SET whatsappNumber=?, defaultMessage=? WHERE id='global'",
      [sett.whatsappNumber, sett.defaultMessage]
    );
    notifyClients("settings_updated");
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/packages", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const pkg = req.body;
    const id = pkg.id || `pkg_${Date.now()}`;
    await p.query(
      "INSERT INTO packages (id, name, description, category, price, days, duration, location, image, bannerImage, gallery, itinerary, highlights, inclusions, exclusions, groupSize, languages, isFeatured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id, 
        pkg.name, 
        pkg.description, 
        pkg.category, 
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

app.put("/api/packages/:id", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const pkg = req.body;
    await p.query(
      "UPDATE packages SET name=?, description=?, category=?, price=?, days=?, duration=?, location=?, image=?, bannerImage=?, gallery=?, itinerary=?, highlights=?, inclusions=?, exclusions=?, groupSize=?, languages=?, isFeatured=? WHERE id=?",
      [
        pkg.name, 
        pkg.description, 
        pkg.category, 
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

app.delete("/api/packages/:id", async (req, res) => {
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
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const [rows] = await p.query("SELECT * FROM banners ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/banners", async (req, res) => {
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

app.delete("/api/banners/:id", async (req, res) => {
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
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const [rows] = await p.query("SELECT * FROM destinations ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/destinations", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const dest = req.body;
    const id = dest.id || `dest_${Date.now()}`;
    await p.query(
      "INSERT INTO destinations (id, name, image, packageCount) VALUES (?, ?, ?, ?)",
      [id, dest.name, dest.image, dest.packageCount || 0]
    );
    notifyClients("destination_added", { id });
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/destinations/:id", async (req, res) => {
  try {
    const p = await getPool();
    if (!p) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const dest = req.body;
    await p.query(
      "UPDATE destinations SET name=?, image=?, packageCount=? WHERE id=?",
      [dest.name, dest.image, dest.packageCount || 0, id]
    );
    notifyClients("destination_updated", { id });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/destinations/:id", async (req, res) => {
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
    if (!p) return res.status(500).json({ error: "Database not configured" });
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

app.post("/api/cars", async (req, res) => {
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

app.put("/api/cars/:id", async (req, res) => {
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

app.delete("/api/cars/:id", async (req, res) => {
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
