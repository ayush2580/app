const express = require("express");
const fs = require("fs");

const app = express(); // This defines 'app'
app.use(express.json());
app.use(express.static("."));

app.post("/saveTransaction", (req, res) => {
    const transactions = JSON.parse(fs.readFileSync("transactions.json"));
    const inventory = JSON.parse(fs.readFileSync("inventory.json"));

    transactions.transactions.push(req.body);

    // Update sold count in inventory
    req.body.product.forEach(item => {
        const product = inventory.products.find(p => p.name === item.name);
        if (product) {
            product.sold += parseInt(item.quantity);
        }
    });

    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));
    fs.writeFileSync("inventory.json", JSON.stringify(inventory, null, 2));

    res.status(200).send({ message: "Transaction saved and inventory updated!" });
});
