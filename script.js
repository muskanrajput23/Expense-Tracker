// Global variables
let userIncome = 0;
let expenses = [];
let balance = 0;

// Navigation function
function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the requested page
  document.getElementById(pageId).classList.add('active');
  
  // If going to dashboard page, update username
  if (pageId === 'dashboard-page') {
    const username = document.getElementById('username').value || 'User';
    document.getElementById('dashboard-username').textContent = username;
    updateDashboard();
  }
  
  // If going to expense page from login, prevent default form submission
  if (pageId === 'expense-page') {
    event.preventDefault();
  }
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  navigateTo('dashboard-page');
});

// Show income modal
function showIncomeModal() {
  document.getElementById('income-modal').style.display = 'flex';
}

// Close income modal when clicking outside
document.getElementById('income-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
});

// Set income function
function setIncome() {
  const incomeInput = document.getElementById('income-input');
  userIncome = parseFloat(incomeInput.value) || 0;
  document.getElementById('income-amount').textContent = `$${userIncome.toFixed(2)}`;
  updateDashboard();
  document.getElementById('income-modal').style.display = 'none';
}

// Expense tracking functionality
function addExpense() {
  const category = document.getElementById('category').value;
  const amount = parseFloat(document.getElementById('amount').value) || 0;
  const date = document.getElementById('date').value;
  
  if (!amount || !date) {
    alert('Please fill in all fields');
    return;
  }
  
  // Add to expenses array
  expenses.push({ 
    category: category, 
    amount: amount, 
    time: formatDate(date) 
  });
  
  // Update dashboard
  updateDashboard();
  
  // Show in expense list
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <span>${category}: $${amount.toFixed(2)} (${formatDate(date)})</span>
    <button class="delete-btn" onclick="deleteExpense(${expenses.length-1})">Delete</button>
  `;
  
  document.getElementById('expenseList').appendChild(listItem);
  
  // Clear fields
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';
  
  // Navigate back to dashboard
  navigateTo('dashboard-page');
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateDashboard();
  renderExpenseList();
}

function updateDashboard() {
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  balance = userIncome - totalExpenses;
  
  // Update dashboard display
  document.getElementById('balance-amount').textContent = `$${balance.toFixed(2)}`;
  document.getElementById('expense-amount').textContent = `$${totalExpenses.toFixed(2)}`;
  
  // Render expense list
  renderExpenseList();
}

function renderExpenseList() {
  const expenseList = document.getElementById('expense-list');
  expenseList.innerHTML = '';
  
  if (expenses.length === 0) {
    expenseList.innerHTML = '<p style="text-align: center; color: #666;">No expenses added yet</p>';
    return;
  }
  
  // Show only the last 5 expenses (most recent)
  const recentExpenses = expenses.slice(-5).reverse();
  
  recentExpenses.forEach((exp, index) => {
    const div = document.createElement('div');
    div.className = 'expense-item';
    div.innerHTML = `
      <div class="expense-left">
        <span>${exp.category}</span>
        <small>${exp.time}</small>
      </div>
      <div class="expense-right">
        - $${exp.amount.toFixed(2)}
        <button onclick="deleteExpense(${expenses.length - 1 - index})">✖</button>
      </div>
    `;
    expenseList.appendChild(div);
  });
}

function generateReport() {
  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  alert(`Budget Report:\n\nIncome: $${userIncome.toFixed(2)}\nTotal Expenses: $${totalExpenses.toFixed(2)}\nRemaining Balance: $${balance.toFixed(2)}`);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}

// Set today's date as default
window.onload = function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  
  // Initialize with some sample data
  userIncome = 3000;
  expenses = [
    { category: 'Groceries', amount: 150, time: formatDate(today) },
    { category: 'Gas', amount: 45, time: formatDate(today) },
    { category: 'Entertainment', amount: 75, time: formatDate(today) }
  ];
  
  updateDashboard();
};