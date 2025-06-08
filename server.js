const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("."));

// Save Transactions
app.post("/saveTransaction", (req, res) => {
    const transactions = JSON.parse(fs.readFileSync("transactions.json"));
    const inventory = JSON.parse(fs.readFileSync("inventory.json"));

    transactions.transactions.push(req.body);

    req.body.product.forEach(item => {
        const product = inventory.products.find(p => p.name === item.name);
        if (product) {
            product.sold += parseInt(item.quantity);
            product.stock -= parseInt(item.quantity); // Reduce stock
        }
    });

    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));
    fs.writeFileSync("inventory.json", JSON.stringify(inventory, null, 2));

    res.status(200).send({ message: "Transaction saved and inventory updated!" });
});

// Update Inventory
app.post("/updateInventory", (req, res) => {
    const inventory = JSON.parse(fs.readFileSync("inventory.json"));

    const product = inventory.products.find(p => p.name === req.body.name);
    if (product) {
        product.price = req.body.price;
        product.stock = req.body.stock;
    } else {
        inventory.products.push({ name: req.body.name, price: req.body.price, stock: req.body.stock, sold: 0 });
    }

    fs.writeFileSync("inventory.json", JSON.stringify(inventory, null, 2));
    res.status(200).send({ message: "Inventory updated!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
