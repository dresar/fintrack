// ============== GLOBAL VARIABLES ==============
// Dummy data untuk simulasi
let transactions = [
    { id: 1, date: '2025-03-01', description: 'Gaji Bulanan', category: 'Pendapatan', type: 'income', amount: 5000000, balance: 5000000 },
    { id: 2, date: '2025-03-02', description: 'Belanja Bulanan', category: 'Kebutuhan', type: 'expense', amount: 1200000, balance: 3800000 },
    { id: 3, date: '2025-03-03', description: 'Bayar Listrik', category: 'Utilitas', type: 'expense', amount: 350000, balance: 3450000 },
    { id: 4, date: '2025-03-05', description: 'Freelance Project', category: 'Pendapatan', type: 'income', amount: 2000000, balance: 5450000 },
    { id: 5, date: '2025-03-07', description: 'Makan di Restoran', category: 'Makanan', type: 'expense', amount: 200000, balance: 5250000 },
    { id: 6, date: '2025-03-10', description: 'Bayar WiFi', category: 'Utilitas', type: 'expense', amount: 300000, balance: 4950000 },
    { id: 7, date: '2025-03-12', description: 'Bonus Proyek', category: 'Pendapatan', type: 'income', amount: 1000000, balance: 5950000 },
    { id: 8, date: '2025-03-15', description: 'Bayar Cicilan Motor', category: 'Cicilan', type: 'expense', amount: 750000, balance: 5200000 },
    { id: 9, date: '2025-03-18', description: 'Belanja Online', category: 'Belanja', type: 'expense', amount: 500000, balance: 4700000 },
    { id: 10, date: '2025-03-20', description: 'Terima Pembayaran Client', category: 'Pendapatan', type: 'income', amount: 3000000, balance: 7700000 }
];

let currentUser = null;
let isSidebarCollapsed = false;

// Format angka ke format Rupiah
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// ============== LOGIN FUNCTIONALITY ==============
function validateLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');
    const loginError = document.getElementById('login-error');
    
    // Reset error messages
    usernameError.textContent = '';
    passwordError.textContent = '';
    loginError.textContent = '';
    
    // Validate input
    let isValid = true;
    
    if (!username) {
        usernameError.textContent = 'Username tidak boleh kosong';
        isValid = false;
    }
    
    if (!password) {
        passwordError.textContent = 'Password tidak boleh kosong';
        isValid = false;
    }
    
    if (!isValid) return false;
    
    // Check credentials (username: admin, password: admin)
    if (username === 'admin' && password === 'admin') {
        // Store user information
        currentUser = {
            username: 'Admin',
            role: 'administrator',
            avatar: 'https://via.placeholder.com/40'
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        return true;
    } else {
        loginError.textContent = 'Username atau password salah!';
        return false;
    }
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
});

// ============== DASHBOARD FUNCTIONALITY ==============
function initDashboard() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    
    // Update username display
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username;
    }
    
    // Calculate summary data
    const totalIncome = transactions
        .filter(trans => trans.type === 'income')
        .reduce((sum, trans) => sum + trans.amount, 0);
    
    const totalExpense = transactions
        .filter(trans => trans.type === 'expense')
        .reduce((sum, trans) => sum + trans.amount, 0);
    
    const finalBalance = totalIncome - totalExpense;
    
    // Update summary cards
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const finalBalanceEl = document.getElementById('final-balance');
    
    if (totalIncomeEl) totalIncomeEl.textContent = formatRupiah(totalIncome);
    if (totalExpenseEl) totalExpenseEl.textContent = formatRupiah(totalExpense);
    if (finalBalanceEl) finalBalanceEl.textContent = formatRupiah(finalBalance);
    
    // Populate recent transactions
    const recentTransactionsBody = document.getElementById('recent-transactions-body');
    if (recentTransactionsBody) {
        // Get 5 most recent transactions
        const recentTransactions = [...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        recentTransactionsBody.innerHTML = '';
        
        recentTransactions.forEach(trans => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(trans.date)}</td>
                <td>${trans.description}</td>
                <td class="${trans.type === 'income' ? 'income-text' : 'expense-text'}">
                    ${trans.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </td>
                <td class="${trans.type === 'income' ? 'income-text' : 'expense-text'}">
                    ${trans.type === 'income' ? '+' : '-'} ${formatRupiah(trans.amount)}
                </td>
            `;
            recentTransactionsBody.appendChild(row);
        });
    }
    
    // Initialize charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
        initIncomeExpenseChart();
        initBalanceTrendChart();
    }
}

// Format date to Indonesian format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Initialize Income vs Expense chart
function initIncomeExpenseChart() {
    const ctx = document.getElementById('income-expense-chart');
    if (!ctx) return;
    
    // Group transactions by month
    const monthlyData = {};
    
    transactions.forEach(trans => {
        const month = trans.date.substring(0, 7); // Format: YYYY-MM
        
        if (!monthlyData[month]) {
            monthlyData[month] = {
                income: 0,
                expense: 0
            };
        }
        
        if (trans.type === 'income') {
            monthlyData[month].income += trans.amount;
        } else {
            monthlyData[month].expense += trans.amount;
        }
    });
    
    // Convert to arrays for Chart.js
    const labels = Object.keys(monthlyData).sort();
    const incomeData = labels.map(month => monthlyData[month].income);
    const expenseData = labels.map(month => monthlyData[month].expense);
    
    // Format labels to be more readable
    const formattedLabels = labels.map(month => {
        const [year, monthNum] = month.split('-');
        const date = new Date(year, monthNum - 1, 1);
        return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: formattedLabels,
            datasets: [
                {
                    label: 'Pemasukan',
                    data: incomeData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Pengeluaran',
                    data: expenseData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatRupiah(value).split(',')[0];
                        }
                    }
                }
            }
        }
    });
}

// Initialize Balance Trend chart
function initBalanceTrendChart() {
    const ctx = document.getElementById('balance-trend-chart');
    if (!ctx) return;
    
    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    // Extract labels and data
    const labels = sortedTransactions.map(trans => formatDate(trans.date));
    const data = sortedTransactions.map(trans => trans.balance);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Saldo',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatRupiah(value).split(',')[0];
                        }
                    }
                }
            }
        }
    });
}

// ============== DATA KEUANGAN FUNCTIONALITY ==============
function initDataKeuangan() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    
    // Update username display
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username;
    }
    
    // Initialize custom date range toggle
    const dateRange = document.getElementById('date-range');
    const customDateContainer = document.getElementById('custom-date-container');
    
    if (dateRange && customDateContainer) {
        dateRange.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateContainer.style.display = 'flex';
            } else {
                customDateContainer.style.display = 'none';
            }
        });
    }
    
    // Populate financial data table
    populateFinancialTable();
    
    // Initialize sort functionality
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortBy = this.getAttribute('data-sort');
            sortFinancialData(sortBy);
        });
    });
    
    // Update summary
    updateFinancialSummary();
}

// Populate financial data table
function populateFinancialTable() {
    const financialDataBody = document.getElementById('financial-data-body');
    if (!financialDataBody) return;
    
    financialDataBody.innerHTML = '';
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedTransactions.forEach(trans => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(trans.date)}</td>
            <td>${trans.description}</td>
            <td>${trans.category}</td>
            <td class="${trans.type === 'income' ? 'income-text' : 'expense-text'}">
                ${trans.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </td>
            <td class="${trans.type === 'income' ? 'income-text' : 'expense-text'}">
                ${formatRupiah(trans.amount)}
            </td>
            <td>${formatRupiah(trans.balance)}</td>
            <td class="action-buttons">
                <button class="btn-edit" data-id="${trans.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-delete" data-id="${trans.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        financialDataBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            // Edit transaction functionality (will be implemented)
            alert(`Edit transaksi dengan ID: ${id}`);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                // Delete transaction (will be implemented)
                alert(`Hapus transaksi dengan ID: ${id}`);
            }
        });
    });
    
    // Update pagination
    updatePagination(sortedTransactions.length);
}

// Sort financial data
function sortFinancialData(sortBy) {
    // Implementation of sorting (will be added)
    alert(`Urutkan berdasarkan: ${sortBy}`);
}

// Update pagination
function updatePagination(totalItems) {
    const showingStart = document.getElementById('showing-start');
    const showingEnd = document.getElementById('showing-end');
    const totalEntries = document.getElementById('total-entries');
    
    if (showingStart && showingEnd && totalEntries) {
        showingStart.textContent = 1;
        showingEnd.textContent = totalItems;
        totalEntries.textContent = totalItems;
    }
}

// Update financial summary
function updateFinancialSummary() {
    const totalIncome = transactions
        .filter(trans => trans.type === 'income')
        .reduce((sum, trans) => sum + trans.amount, 0);
    
    const totalExpense = transactions
        .filter(trans => trans.type === 'expense')
        .reduce((sum, trans) => sum + trans.amount, 0);
    
    const finalBalance = totalIncome - totalExpense;
    
    const summaryIncome = document.getElementById('summary-income');
    const summaryExpense = document.getElementById('summary-expense');
    const summaryBalance = document.getElementById('summary-balance');
    
    if (summaryIncome) summaryIncome.textContent = formatRupiah(totalIncome);
    if (summaryExpense) summaryExpense.textContent = formatRupiah(totalExpense);
    if (summaryBalance) summaryBalance.textContent = formatRupiah(finalBalance);
}

// ============== COMMON FUNCTIONALITY ==============
// Toggle sidebar (responsive)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        initDashboard();
    } else if (currentPage === 'data-keuangan.html' || currentPage === 'transaksi.html') {
        initDataKeuangan();
    }
    
    // Sidebar toggle
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
    }
    
    // Handle window resize for responsive design
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    
    // Logout functionality
    const logoutButtons = document.querySelectorAll('.logout a');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        });
    });
});

// Toggle sidebar for mobile view
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        isSidebarCollapsed = !isSidebarCollapsed;
        
        if (isSidebarCollapsed) {
            sidebar.style.transform = 'translateX(-100%)';
            mainContent.style.marginLeft = '0';
        } else {
            sidebar.style.transform = 'translateX(0)';
            mainContent.style.marginLeft = 'var(--sidebar-width)';
        }
    }
}

// Handle window resize
function handleWindowResize() {
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        // Mobile view
        if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'block';
        if (sidebar) sidebar.style.transform = 'translateX(-100%)';
        if (mainContent) mainContent.style.marginLeft = '0';
        isSidebarCollapsed = true;
    } else {
        // Desktop view
        if (toggleSidebarBtn) toggleSidebarBtn.style.display = 'none';
        if (sidebar) sidebar.style.transform = 'translateX(0)';
        if (mainContent) mainContent.style.marginLeft = 'var(--sidebar-width)';
        isSidebarCollapsed = false;
    }
}