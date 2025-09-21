const form = document.getElementById("transaction-form");
const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI() {
    list.innerHTML = "";
    let total = 0,
        income = 0,
        expense = 0;

    transactions.forEach((t, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${t.desc} - ${t.amount} ₹ 
      <span class="${t.type}">[${t.type}]</span>
      <button onclick="deleteTransaction(${index})">❌</button>
    `;
        list.appendChild(li);

        if (t.type === "income") {
            income += t.amount;
            total += t.amount;
        } else {
            expense += t.amount;
            total -= t.amount;
        }
    });

    balanceEl.innerText = total;

    // Update Chart
    budgetChart.data.datasets[0].data = [income, expense];
    budgetChart.update();

    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

form.addEventListener("submit", e => {
    e.preventDefault();
    const transaction = {
        desc: descInput.value,
        amount: Number(amountInput.value),
        type: typeInput.value
    };
    transactions.push(transaction);
    descInput.value = "";
    amountInput.value = "";
    updateUI();
});

// Chart.js setup
const ctx = document.getElementById("budgetChart").getContext("2d");
const budgetChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Income", "Expense"],
        datasets: [{
            data: [0, 0],
            backgroundColor: ["#28a745", "#dc3545"]
        }]
    }
});

// Initialize
updateUI();