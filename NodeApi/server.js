import express, { json } from "express";
import db from "./data/Database.js"

const PORT = 3034;

const app = express();
app.use(json());

app.get("/all", (req, res) => {
    var products = db.prepare("SELECT * FROM Products").all();
    return res.status(200).json(products);
});

app.get("/candy/:id", (req, res) => {
    var candy = db.prepare("SELECT * FROM Products WHERE id = ?").get(req.params.id);
    return res.status(200).json(candy);
});

app.post("/create", (req, res) => {
    const {name, price, stock} = req.body;
    if (!name || !price || !stock)
        return res.status(400).json({message: "nem adatad meg"});
    db.prepare("INSERT INTO Products (Name, Price, Stock) VALUES (?,?,?)").run(name,price,stock);
    return res.status(201).json({message: "siker"});
});

app.put("/update/:id", (req, res) => {
    const {name, price, stock} = req.body;
    if (!name || !price || !stock)
        return res.status(400).json({message: "nem adatad meg"});
    db.prepare("UPDATE Products SET Name = ?, Price = ?, Stock = ? WHERE Id = ?").run(name,price,stock,req.params.id);
    return res.status(200).json({message: "siker"});
});

app.delete("/delete/:id", (req, res) => {
    db.prepare("DELETE from Products WHERE id = ?").run(req.params.id);
    return res.status(200).json({m: "s"})
});

app.get("/mostExpensive", (req, res) => {
    var mostExpensive = db.prepare("SELECT * FROM Products ORDER BY Price DESC LIMIT 1").get();
    return res.status(200).json(mostExpensive);
});

app.get("/lessStock", (req, res) => {
    var lessStock = db.prepare("SELECT * FROM Products ORDER BY Stock ASC LIMIT 1").get();
    return res.status(200).json(lessStock);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});