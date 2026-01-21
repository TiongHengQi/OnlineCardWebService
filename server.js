// READ – View all cards
app.get("/cards", (req, res) => {
  const sql = "SELECT * FROM cards";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving cards:", err);
      res.status(500).json({ message: "Error retrieving cards" });
    } else {
      res.json(results);
    }
  });
});

// CREATE – Add new card
app.post("/cards", (req, res) => {
  const { card_name, card_pic } = req.body;
  const sql = "INSERT INTO cards (card_name, card_pic) VALUES (?, ?)";
  db.query(sql, [card_name, card_pic], (err) => {
    if (err) {
      console.error("Error adding card:", err);
      res.status(500).json({ message: "Error adding card" });
    } else {
      res.json({ message: "Card added successfully" });
    }
  });
});

// UPDATE – Update card
app.put("/cards/:id", (req, res) => {
  const { card_name, card_pic } = req.body;
  const cardId = req.params.id;
  const sql = "UPDATE cards SET card_name = ?, card_pic = ? WHERE id = ?";
  db.query(sql, [card_name, card_pic, cardId], (err, result) => {
    if (err) {
      console.error("Error updating card:", err);
      res.status(500).json({ message: "Error updating card" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Card not found" });
    } else {
      res.json({ message: `Card ${cardId} updated successfully` });
    }
  });
});

// DELETE – Delete card
app.delete("/cards/:id", (req, res) => {
  const cardId = req.params.id;
  const sql = "DELETE FROM cards WHERE id = ?";
  db.query(sql, [cardId], (err, result) => {
    if (err) {
      console.error("Error deleting card:", err);
      res.status(500).json({ message: "Error deleting card" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Card not found" });
    } else {
      res.json({ message: `Card ${cardId} deleted successfully` });
    }
  });
});
