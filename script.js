document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

document.addEventListener("DOMContentLoaded", async () => {
    const productSelect = document.getElementById("productSelect");
    const response = await fetch("inventory.json");
    const inventory = await response.json();

    inventory.products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.name;
        option.textContent = `${product.name} - ₹${product.price}`;
        productSelect.appendChild(option);
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