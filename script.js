document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

document.addEventListener("DOMContentLoaded", async () => {
    const inventoryTable = document.getElementById("inventoryTable");

    try {
        const response = await fetch("inventory.json");
        if (!response.ok) throw new Error("Failed to fetch inventory data");

        const inventory = await response.json();

        // Clear existing rows to avoid duplicates
        inventoryTable.innerHTML = `<tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Sold</th>
        </tr>`;

        inventory.products.forEach(product => {
            const row = inventoryTable.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>₹${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.sold}</td>
            `;
        });

    } catch (error) {
        console.error("Error loading inventory:", error);
    }
});

document.getElementById("invoiceForm").addEventListener("submit", async (event) => {
    
    event.preventDefault();
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    const product = productSelect.value;
    const customPrice = document.getElementById("customPrice").value || inventory.products.find(p => p.name === product).price;
    const quantity = document.getElementById("quantity").value;
    const total = customPrice * quantity;

        const invoiceData = { customerName, customerPhone, product, customPrice, quantity, total, date: new Date().toLocaleString() };
        document.getElementById("invoiceDisplay").innerHTML = `<p>${JSON.stringify(invoiceData, null, 2)}</p>`;

        await fetch("/saveTransaction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoiceData)
        });
    });
});
