import express, { json } from "express";
import db from "./data/database.js";

const PORT = 2310;

const app = express();
app.use(json());

app.get("/all", (req, res) => {
    return res.status(200).json(db.prepare("SELECT * FROM Szemelyek").all());
});

app.post("/create", (req, res) => {
    const { Nev, Azonosito, Kora, Kperc, Vora, Vperc} = req.body;
    if (!Nev || !Azonosito || !Kora || !Kperc || !Vora || !Vperc)
        return res.status(400).json({message: "hiányos adatok"});
    db.prepare("INSERT INTO Szemelyek (Nev, Azonosito, Kora, Kperc, Vora, Vperc) VALUES (?,?,?,?,?,?)").run(Nev,Azonosito,Kora,Kperc,Vora,Vperc);
    return res.status(201).json({message: "létrehozva"});
});

app.put("/update/:id", (req, res) => {
    const { Nev, Azonosito, Kora, Kperc, Vora, Vperc} = req.body;
    if (!Nev || !Azonosito || !Kora || !Kperc || !Vora || !Vperc)
        return res.status(400).json({message: "hiányos adatok"});
    db.prepare("UPDATE Szemelyek SET Nev = ?, Azonosito = ?, Kora = ?, Kperc = ?, Vora = ?, Vperc = ? WHERE id = ?").run(Nev,Azonosito,Kora,Kperc,Vora,Vperc,req.params.id);
    return res.status(200).json({message: "modositva"});
});

app.delete("/delete/:id", (req, res) => {
    db.prepare("DELETE FROM Szemelyek WHERE id = ?").run(req.params.id);
    return res.status(200).json({message: "törölve"});
});

app.get("/stat", (req, res) => {
    //var adat = db.prepare("SELECT Azonosito, SUM((Vora-Kora)*60 + Kperc - Vperc) As percbe FROM Szemelyek GROUP BY Azonosito").all();
    var sql = ` 
        SELECT Azonosito, ROUND(SUM(percbe)/30)*1000 as bevetel
        FROM (
            SELECT Azonosito, (Vora-Kora)*60 + (Vperc-Kperc) AS percbe
            FROM Szemelyek
            WHERE Vora >= Kora

            UNION ALL

            SELECT Azonosito, (24+Vora-Kora)*60 + Kperc - Vperc AS percbe
            FROM Szemelyek
            WHERE Vora < Kora
        ) AS aha
        GROUP BY Azonosito
        ORDER BY SUM(percbe)
        LIMIT 1;
    `;
    var adat = db.prepare(sql).all();
    return res.status(200).json(adat);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});