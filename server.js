const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("."));

// Save Transactions
app.post("/saveTransaction", (req, res) => {
    const transactions = JSON.parse(fs.readFileSync("transactions.json"));
    const inventory = JSON.parse(fs.readFileSync("inventory.json"));

    // Ensure transactions array exists
    transactions.transactions = transactions.transactions || [];

    // Push new transaction
    transactions.transactions.push(req.body);

    // Ensure req.body.product is an array before using .forEach()
    if (!req.body.product || !Array.isArray(req.body.product)) {
        return res.status(400).send({ message: "Invalid product data" });
    }

    req.body.product.forEach(item => {
        const product = inventory.products.find(p => p.name === item.name);
        if (product) {
            product.sold += parseInt(item.quantity) || 0;
            product.stock -= parseInt(item.quantity) || 0;
        }
    });

    fs.writeFileSync("transactions.json", JSON.stringify(transactions, null, 2));
    fs.writeFileSync("inventory.json", JSON.stringify(inventory, null, 2));

    res.status(200).send({ message: "Transaction saved and inventory updated!" });
});

// Update Inventory
app.post("/updateInventory", (req, res) => {
    const inventory = JSON.parse(fs.readFileSync("inventory.json"));
    inventory.products = inventory.products || []; // Ensure products array exists

    if (!req.body.name || !req.body.price || !req.body.stock) {
        return res.status(400).send({ message: "Invalid inventory data" });
    }

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
