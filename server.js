const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

// ======================
// Database pool
// ======================
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promise-based queries (optional, but cleaner)
const promisePool = pool.promise();

// ======================
// READ – View all cards
// ======================
app.get("/cards", async (req, res) => {
    try {
        const [results] = await promisePool.query("SELECT * FROM cards");
        res.json(results);
    } catch (err) {
        console.error("MySQL error retrieving cards:", err);
        res.status(500).json({
            message: "Error retrieving cards",
            error: err.message
        });
    }
});

// ======================
// CREATE – Add new card
// ======================
app.post("/cards", async (req, res) => {
    const { card_name, card_pic } = req.body;
    try {
        await promisePool.query(
            "INSERT INTO cards (card_name, card_pic) VALUES (?, ?)",
            [card_name, card_pic]
        );
        res.status(201).json({ message: "Card added successfully" });
    } catch (err) {
        console.error("MySQL error adding card:", err);
        res.status(500).json({ message: "Error adding card", error: err.message });
    }
});

// ======================
// UPDATE – Update card
// ======================
app.put("/cards/:id", async (req, res) => {
    const { card_name, card_pic } = req.body;
    const cardId = req.params.id;

    try {
        const [result] = await promisePool.query(
            "UPDATE cards SET card_name = ?, card_pic = ? WHERE id = ?",
            [card_name, card_pic, cardId]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Card not found" });
        } else {
            res.json({ message: `Card ${cardId} updated successfully` });
        }
    } catch (err) {
        console.error("MySQL error updating card:", err);
        res.status(500).json({ message: "Error updating card", error: err.message });
    }
});

// ======================
// DELETE – Delete card
// ======================
app.delete("/cards/:id", async (req, res) => {
    const cardId = req.params.id;

    try {
        const [result] = await promisePool.query(
            "DELETE FROM cards WHERE id = ?",
            [cardId]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: "Card not found" });
        } else {
            res.json({ message: `Card ${cardId} deleted successfully` });
        }
    } catch (err) {
        console.error("MySQL error deleting card:", err);
        res.status(500).json({ message: "Error deleting card", error: err.message });
    }
});

// ======================
// Start server
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
