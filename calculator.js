// Script untuk halaman kalkulator
document.addEventListener('DOMContentLoaded', function() {
    // Fungsi format Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }
    
    // Kalkulator Tabungan
    const calculateSavings = document.getElementById('calculate-savings');
    if (calculateSavings) {
        calculateSavings.addEventListener('click', function() {
            // Tampilkan loading spinner
            document.getElementById('savings-loading').style.display = 'block';
            document.getElementById('savings-result').style.display = 'none';
            
            // Simulasi proses perhitungan (dalam kasus nyata tidak perlu setTimeout)
            setTimeout(function() {
                const initialSavings = parseFloat(document.getElementById('initial-savings').value) || 0;
                const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
                const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
                const savingsPeriod = parseInt(document.getElementById('savings-period').value) || 0;
                
                let totalSavings = initialSavings;
                let totalContribution = initialSavings;
                let totalInterest = 0;
                
                const monthlyRate = interestRate / 100 / 12;
                const months = savingsPeriod * 12;
                
                // Data untuk grafik
                const labels = [];
                const savingsData = [];
                const contributionData = [];
                const interestData = [];
                
                // Perhitungan tabungan per tahun
                for (let year = 0; year <= savingsPeriod; year++) {
                    if (year === 0) {
                        labels.push('Awal');
                        savingsData.push(initialSavings);
                        contributionData.push(initialSavings);
                        interestData.push(0);
                    } else {
                        let yearlyInterest = 0;
                        for (let month = 1; month <= 12; month++) {
                            const monthlyInterest = totalSavings * monthlyRate;
                            yearlyInterest += monthlyInterest;
                            totalSavings += monthlyInterest + monthlyContribution;
                            totalContribution += monthlyContribution;
                        }
                        
                        totalInterest += yearlyInterest;
                        labels.push(`Tahun ${year}`);
                        savingsData.push(totalSavings);
                        contributionData.push(totalContribution);
                        interestData.push(totalInterest);
                    }
                }
                
                // Tampilkan hasil
                document.getElementById('total-contribution').textContent = formatRupiah(totalContribution);
                document.getElementById('total-interest').textContent = formatRupiah(totalInterest);
                document.getElementById('total-savings').textContent = formatRupiah(totalSavings);
                document.getElementById('savings-loading').style.display = 'none';
                document.getElementById('savings-result').style.display = 'block';
                
                // Buat grafik
                const ctx = document.getElementById('savings-chart').getContext('2d');
                
                // Hapus grafik lama jika ada
                if (window.savingsChart) {
                    window.savingsChart.destroy();
                }
                
                window.savingsChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Tabungan',
                                data: savingsData,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 2,
                                tension: 0.1
                            },
                            {
                                label: 'Total Setoran',
                                data: contributionData,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 2,
                                tension: 0.1,
                                borderDash: [5, 5]
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return formatRupiah(value).split(',')[0];
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': ' + formatRupiah(context.raw);
                                    }
                                }
                            }
                        }
                    }
                });
            }, 800); // Simulasi delay untuk loading effect
        });
    }
    
    // Kalkulator KPR
    const calculateMortgage = document.getElementById('calculate-mortgage');
    if (calculateMortgage) {
        calculateMortgage.addEventListener('click', function() {
            // Tampilkan loading spinner
            document.getElementById('mortgage-loading').style.display = 'block';
            document.getElementById('mortgage-result').style.display = 'none';
            
            setTimeout(function() {
                const propertyPrice = parseFloat(document.getElementById('property-price').value) || 0;
                const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
                const mortgageInterest = parseFloat(document.getElementById('mortgage-interest').value) || 0;
                const mortgageTerm = parseInt(document.getElementById('mortgage-term').value) || 0;
                
                const loanAmount = propertyPrice - downPayment;
                const monthlyRate = mortgageInterest / 100 / 12;
                const months = mortgageTerm * 12;
                
                // Hitung cicilan bulanan
                const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
                
                const totalPayment = monthlyPayment * months;
                const totalInterest = totalPayment - loanAmount;
                
                // Tampilkan hasil
                document.getElementById('loan-amount').textContent = formatRupiah(loanAmount);
                document.getElementById('monthly-payment').textContent = formatRupiah(monthlyPayment);
                document.getElementById('total-mortgage-interest').textContent = formatRupiah(totalInterest);
                document.getElementById('total-payment').textContent = formatRupiah(totalPayment);
                document.getElementById('mortgage-loading').style.display = 'none';
                document.getElementById('mortgage-result').style.display = 'block';
                
                // Data untuk grafik
                const labels = ['Pinjaman Pokok', 'Total Bunga'];
                const data = [loanAmount, totalInterest];
                const backgroundColors = [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ];
                
                // Buat grafik
                const ctx = document.getElementById('mortgage-chart').getContext('2d');
                
                // Hapus grafik lama jika ada
                if (window.mortgageChart) {
                    window.mortgageChart.destroy();
                }
                
                window.mortgageChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: backgroundColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.label + ': ' + formatRupiah(context.raw);
                                    }
                                }
                            }
                        }
                    }
                });
            }, 800);
        });
    }
    
    // Kalkulator Investasi
    const calculateInvestment = document.getElementById('calculate-investment');
    if (calculateInvestment) {
        calculateInvestment.addEventListener('click', function() {
            // Tampilkan loading spinner
            document.getElementById('investment-loading').style.display = 'block';
            document.getElementById('investment-result').style.display = 'none';
            
            setTimeout(function() {
                const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
                const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value) || 0;
                const investmentReturn = parseFloat(document.getElementById('investment-return').value) || 0;
                const investmentPeriod = parseInt(document.getElementById('investment-period').value) || 0;
                
                let totalInvestment = initialInvestment;
                let totalContribution = initialInvestment;
                let totalReturn = 0;
                
                const monthlyRate = investmentReturn / 100 / 12;
                const months = investmentPeriod * 12;
                
                // Data untuk grafik
                const labels = [];
                const investmentData = [];
                const contributionData = [];
                const returnData = [];
                
                // Perhitungan investasi per tahun
                for (let year = 0; year <= investmentPeriod; year++) {
                    if (year === 0) {
                        labels.push('Awal');
                        investmentData.push(initialInvestment);
                        contributionData.push(initialInvestment);
                        returnData.push(0);
                    } else {
                        let yearlyReturn = 0;
                        for (let month = 1; month <= 12; month++) {
                            const monthlyReturn = totalInvestment * monthlyRate;
                            yearlyReturn += monthlyReturn;
                            totalInvestment += monthlyReturn + monthlyInvestment;
                            totalContribution += monthlyInvestment;
                        }
                        
                        totalReturn += yearlyReturn;
                        labels.push(`Tahun ${year}`);
                        investmentData.push(totalInvestment);
                        contributionData.push(totalContribution);
                        returnData.push(totalReturn);
                    }
                }
                
                // Tampilkan hasil
                document.getElementById('total-investment').textContent = formatRupiah(totalContribution);
                document.getElementById('total-return').textContent = formatRupiah(totalReturn);
                document.getElementById('final-investment-value').textContent = formatRupiah(totalInvestment);
                document.getElementById('investment-loading').style.display = 'none';
                document.getElementById('investment-result').style.display = 'block';
                
                // Buat grafik
                const ctx = document.getElementById('investment-chart').getContext('2d');
                
                // Hapus grafik lama jika ada
                if (window.investmentChart) {
                    window.investmentChart.destroy();
                }
                
                window.investmentChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Total Investasi',
                                data: investmentData,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 2,
                                tension: 0.1
                            },
                            {
                                label: 'Total Kontribusi',
                                data: contributionData,
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 2,
                                tension: 0.1,
                                borderDash: [5, 5]
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return formatRupiah(value).split(',')[0];
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': ' + formatRupiah(context.raw);
                                    }
                                }
                            }
                        }
                    }
                });
            }, 800);
        });
    }
    
    // Kalkulator Anggaran
    const calculateBudget = document.getElementById('calculate-budget');
    if (calculateBudget) {
        calculateBudget.addEventListener('click', function() {
            // Tampilkan loading spinner
            document.getElementById('budget-loading').style.display = 'block';
            document.getElementById('budget-result').style.display = 'none';
            
            setTimeout(function() {
                const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
                const housingExpense = parseFloat(document.getElementById('housing-expense').value) || 0;
                const livingExpense = parseFloat(document.getElementById('living-expense').value) || 0;
                const savingsPercentage = parseFloat(document.getElementById('savings-percentage').value) || 0;
                const otherExpense = parseFloat(document.getElementById('other-expense').value) || 0;
                
                // Hitung jumlah masing-masing kategori
                const housingAmount = monthlyIncome * (housingExpense / 100);
                const livingAmount = monthlyIncome * (livingExpense / 100);
                const savingsAmount = monthlyIncome * (savingsPercentage / 100);
                const otherAmount = monthlyIncome * (otherExpense / 100);
                
                // Periksa jika total persentase melebihi 100%
                const totalPercentage = housingExpense + livingExpense + savingsPercentage + otherExpense;
                if (totalPercentage !== 100) {
                    alert(`Total persentase: ${totalPercentage}%. Pastikan total persentase adalah 100%.`);
                }
                
                // Tampilkan hasil
                document.getElementById('housing-amount').textContent = formatRupiah(housingAmount);
                document.getElementById('living-amount').textContent = formatRupiah(livingAmount);
                document.getElementById('savings-amount').textContent = formatRupiah(savingsAmount);
                document.getElementById('other-amount').textContent = formatRupiah(otherAmount);
                document.getElementById('budget-loading').style.display = 'none';
                document.getElementById('budget-result').style.display = 'block';
                
                // Data untuk grafik
                const labels = ['Rumah', 'Hidup Sehari-hari', 'Tabungan', 'Lainnya'];
                const data = [housingAmount, livingAmount, savingsAmount, otherAmount];
                const backgroundColors = [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ];
                
                // Buat grafik
                const ctx = document.getElementById('budget-chart').getContext('2d');
                
                // Hapus grafik lama jika ada
                if (window.budgetChart) {
                    window.budgetChart.destroy();
                }
                
                window.budgetChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: backgroundColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const percentage = (value / monthlyIncome * 100).toFixed(1);
                                        return `${context.label}: ${formatRupiah(value)} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }, 800);
        });
    }
    
    // Kalkulator Biaya Pendidikan
    const calculateEducation = document.getElementById('calculate-education');
    if (calculateEducation) {
        calculateEducation.addEventListener('click', function() {
            // Tampilkan loading spinner
            document.getElementById('education-loading').style.display = 'block';
            document.getElementById('education-result').style.display = 'none';
            
            setTimeout(function() {
                const currentCost = parseFloat(document.getElementById('current-education-cost').value) || 0;
                const inflationRate = parseFloat(document.getElementById('education-inflation').value) || 0;
                const yearsUntilStart = parseInt(document.getElementById('years-until-education').value) || 0;
                const educationDuration = parseInt(document.getElementById('education-duration').value) || 0;
                
                // Menghitung biaya tahun pertama (dengan inflasi)
                const firstYearCost = currentCost * Math.pow(1 + inflationRate / 100, yearsUntilStart);
                
                let totalCost = 0;
                const yearlyData = [];
                
                // Perhitungan biaya tahunan selama masa pendidikan
                for (let year = 0; year < educationDuration; year++) {
                    const yearCost = firstYearCost * Math.pow(1 + inflationRate / 100, year);
                    totalCost += yearCost;
                    yearlyData.push({
                        year: yearsUntilStart + year,
                        cost: yearCost
                    });
                }
                
                // Tampilkan hasil
                document.getElementById('first-year-cost').textContent = formatRupiah(firstYearCost);
                document.getElementById('last-year-cost').textContent = formatRupiah(yearlyData[educationDuration - 1].cost);
                document.getElementById('total-education-cost').textContent = formatRupiah(totalCost);
                document.getElementById('education-loading').style.display = 'none';
                document.getElementById('education-result').style.display = 'block';
                
                // Data untuk grafik
                const labels = yearlyData.map(data => `Tahun ${data.year}`);
                const costs = yearlyData.map(data => data.cost);
                
                // Buat grafik
                const ctx = document.getElementById('education-chart').getContext('2d');
                
                // Hapus grafik lama jika ada
                if (window.educationChart) {
                    window.educationChart.destroy();
                }
                
                window.educationChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Biaya Pendidikan',
                            data: costs,
                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return formatRupiah(value).split(',')[0];
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return 'Biaya: ' + formatRupiah(context.raw);
                                    }
                                }
                            }
                        }
                    }
                });
            }, 800);
        });
    }
    
    // Kalkulator Pensiun
    const calculateRetirement = document.getElementById('calculate-retirement');
    if (calculateRetirement) {
        calculateRetirement.addEventListener('click', function() {
            // Tampilkan loading spinner
            document.getElementById('retirement-loading').style.display = 'block';
            document.getElementById('retirement-result').style.display = 'none';
            
            setTimeout(function() {
                const currentAge = parseInt(document.getElementById('current-age').value) || 0;
                const retirementAge = parseInt(document.getElementById('retirement-age').value) || 0;
                const lifeExpectancy = parseInt(document.getElementById('life-expectancy').value) || 0;
                const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
                const inflationRate = parseFloat(document.getElementById('inflation-rate').value) || 0;
                const investmentRate = parseFloat(document.getElementById('investment-rate').value) || 0;
                const currentSavings = parseFloat(document.getElementById('current-savings').value) || 0;
                
                // Menghitung waktu dalam tahun
                const yearsToRetirement = retirementAge - currentAge;
                const yearsInRetirement = lifeExpectancy - retirementAge;
                
                // Menghitung pengeluaran bulanan saat pensiun (dengan efek inflasi)
                const monthlyExpensesAtRetirement = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
                
                // Menghitung total dana pensiun yang dibutuhkan
                // Asumsi bahwa dana pensiun akan terus diinvestasikan dengan rate yang sama
                const effectiveMonthlyRate = (investmentRate - inflationRate) / 100 / 12;
                const retirementMonths = yearsInRetirement * 12;
                
                // Formula present value of an annuity
                let requiredRetirementFund;
                if (effectiveMonthlyRate === 0) {
                    requiredRetirementFund = monthlyExpensesAtRetirement * retirementMonths;
                } else {
                    requiredRetirementFund = monthlyExpensesAtRetirement * (1 - Math.pow(1 + effectiveMonthlyRate, -retirementMonths)) / effectiveMonthlyRate;
                }
                
                // Menghitung tabungan bulanan yang diperlukan
                // Formula future value of an annuity
                const monthlyInvestmentRate = investmentRate / 100 / 12;
                const monthsToRetirement = yearsToRetirement * 12;
                
                const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + monthlyInvestmentRate, monthsToRetirement);
                const additionalFundsNeeded = requiredRetirementFund - futureValueOfCurrentSavings;
                
                let requiredMonthlySavings;
                if (additionalFundsNeeded <= 0) {
                    requiredMonthlySavings = 0;
                } else if (monthlyInvestmentRate === 0) {
                    requiredMonthlySavings = additionalFundsNeeded / monthsToRetirement;
                } else {
                    requiredMonthlySavings = additionalFundsNeeded * monthlyInvestmentRate / (Math.pow(1 + monthlyInvestmentRate, monthsToRetirement) - 1);
                }
                
                // Tampilkan hasil
                document.getElementById('retirement-monthly-expenses').textContent = formatRupiah(monthlyExpensesAtRetirement);
                document.getElementById('required-retirement-fund').textContent = formatRupiah(requiredRetirementFund);
                document.getElementById('required-monthly-savings').textContent = formatRupiah(requiredMonthlySavings);
                document.getElementById('retirement-loading').style.display = 'none';
                document.getElementById('retirement-result').style.display = 'block';
                
                // Data untuk grafik
                const labels = ['Dana yang Sudah Ada', 'Dana Tambahan yang Diperlukan'];
                const data = [
                    futureValueOfCurrentSavings > requiredRetirementFund ? requiredRetirementFund : futureValueOfCurrentSavings,
                    additionalFundsNeeded > 0 ? additionalFundsNeeded : 0
                ];
                const backgroundColors = [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ];
                
                // Buat grafik
                const ctx = document.getElementById('retirement-chart').getContext('2d');
                
                // Hapus grafik lama jika ada
                if (window.retirementChart) {
                    window.retirementChart.destroy();
                }
                
                window.retirementChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                            backgroundColor: backgroundColors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.label + ': ' + formatRupiah(context.raw);
                                    }
                                }
                            }
                        }
                    }
                });
            }, 800);
        });
    }
    
    // Reset handlers
    document.querySelectorAll('.btn-reset').forEach(btn => {
        btn.addEventListener('click', function() {
            const form = this.closest('form');
            const formId = form.id;
            
            // Reset form fields
            form.reset();
            
            // Hide result section
            if (formId === 'savings-calculator') {
                document.getElementById('savings-result').style.display = 'none';
            } else if (formId === 'mortgage-calculator') {
                document.getElementById('mortgage-result').style.display = 'none';
            } else if (formId === 'investment-calculator') {
                document.getElementById('investment-result').style.display = 'none';
            } else if (formId === 'budget-calculator') {
                document.getElementById('budget-result').style.display = 'none';
            } else if (formId === 'education-calculator') {
                document.getElementById('education-result').style.display = 'none';
            } else if (formId === 'retirement-calculator') {
                document.getElementById('retirement-result').style.display = 'none';
            }
        });
    });
    
    // Cek login dan inisialisasi username display
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
        // Jika bukan halaman login, redirect ke login
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    } else {
        // Update username display
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            const currentUser = JSON.parse(storedUser);
            usernameDisplay.textContent = currentUser.username;
        }
    }
    
    // Toggle sidebar functionality
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (sidebar.style.transform === 'translateX(0px)') {
                sidebar.style.transform = 'translateX(-100%)';
                mainContent.style.marginLeft = '0';
            } else {
                sidebar.style.transform = 'translateX(0)';
                mainContent.style.marginLeft = 'var(--sidebar-width)';
            }
        });
    }
    
    // Responsive handler for window resize
    function handleResize() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            if (sidebar) sidebar.style.transform = 'translateX(-100%)';
            if (mainContent) mainContent.style.marginLeft = '0';
        } else {
            if (sidebar) sidebar.style.transform = 'translateX(0)';
            if (mainContent) mainContent.style.marginLeft = 'var(--sidebar-width)';
        }
    }
    
    window.addEventListener('resize', handleResize);
    // Inisialisasi tampilan berdasarkan ukuran layar saat ini
    handleResize();
    
    // Tooltip functionality for all calculators
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Menutup tooltip jika mengklik di luar
    document.addEventListener('click', function() {
        tooltips.forEach(tooltip => {
            const tooltipText = tooltip.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
    });
});