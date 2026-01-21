const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(express.json());

// ======================
// Database connection
// ======================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to DB
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// ======================
// READ – View all cards
// ======================
app.get("/cards", (req, res) => {
    const sql = "SELECT * FROM cards";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("MySQL error retrieving cards:", err); // <-- detailed log
            res.status(500).json({ 
                message: "Error retrieving cards", 
                error: err.message // <-- send the actual error in response temporarily
            });
        } else {
            console.log("Cards retrieved:", results);
            res.json(results);
        }
    });
});


// ======================
// CREATE – Add new card
// ======================
app.post("/cards", (req, res) => {
    const { card_name, card_pic } = req.body;
    const sql = "INSERT INTO cards (card_name, card_pic) VALUES (?, ?)";

    db.query(sql, [card_name, card_pic], (err) => {
        if (err) {
            res.status(500).json({ message: "Error adding card" });
        } else {
            res.status(201).json({ message: "Card added successfully" });
        }
    });
});

// ======================
// UPDATE – Update card
// ======================
app.put("/cards/:id", (req, res) => {
    const { card_name, card_pic } = req.body;
    const cardId = req.params.id;

    const sql =
        "UPDATE cards SET card_name = ?, card_pic = ? WHERE id = ?";

    db.query(sql, [card_name, card_pic, cardId], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error updating card" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "Card not found" });
        } else {
            res.json({ message: `Card ${cardId} updated successfully` });
        }
    });
});

// ======================
// DELETE – Delete card
// ======================
app.delete("/cards/:id", (req, res) => {
    const cardId = req.params.id;
    const sql = "DELETE FROM cards WHERE id = ?";

    db.query(sql, [cardId], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error deleting card" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "Card not found" });
        } else {
            res.json({ message: `Card ${cardId} deleted successfully` });
        }
    });
});

// ======================
// Start server
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
