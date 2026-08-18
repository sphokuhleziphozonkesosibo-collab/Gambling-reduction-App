// 🎯 R1 MILLION ENHANCED DASHBOARD WITH AI & REAL-TIME PROTECTION
class Dashboard {
    constructor() {
        this.userData = null;
        this.recentExpenses = [];
        
        // ✅ GET USER ID FROM LOGIN STORAGE
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            this.userId = user.id;
            this.userData = user;
            console.log('✅ Loaded user:', user);
        } else {
            alert('❌ Please login first');
            window.location.href = '/';
            return;
        }
        
        // 🚀 MILLION-RAND AI & REAL-TIME SYSTEMS
        this.aiSystem = window.aiPatternDetection;
        this.realTimeSystem = window.realTimeSystem;
        this.bettingIntel = window.bettingIntel;
        
        this.init();
    }
    
    async init() {
        await this.loadUserData();
        this.updateDashboard();
        this.setupEventListeners();
        
        // 🚀 INITIALIZE ADVANCED PROTECTION SYSTEMS
        this.initAdvancedSystems();
    }

    // 🚀 INITIALIZE AI & REAL-TIME SYSTEMS
    initAdvancedSystems() {
        // Start real-time protection
        if (this.realTimeSystem) {
            this.realTimeSystem.connect();
        }
        
        // Load AI predictions and risk assessment
        this.loadAIPredictions();
        
        // Initialize betting intelligence
        if (this.bettingIntel) {
            console.log('🎯 Betting Intelligence: ACTIVE');
        }
        
        // Create risk assessment display
        this.createRiskAssessmentDisplay();
    }

    // 🎯 CREATE RISK ASSESSMENT DISPLAY
    createRiskAssessmentDisplay() {
        const welcomeSection = document.querySelector('.welcome-section');
        if (welcomeSection && !document.getElementById('riskAssessment')) {
            const riskHTML = `
                <div id="riskAssessment" class="risk-assessment-container">
                    <!-- AI Risk assessment will be inserted here -->
                </div>
            `;
            welcomeSection.insertAdjacentHTML('afterend', riskHTML);
        }
    }

    async loadUserData() {
        try {
            const response = await fetch(`/user-data/${this.userId}`);
            const data = await response.json();
            
            if (data.success) {
                this.userData = data.user;
                this.recentExpenses = data.recent_expenses || [];
                this.updateDashboard();
                
                // 🎯 ANALYZE EXISTING SPENDING PATTERNS
                this.analyzeHistoricalSpending();
            } else {
                console.error('Failed to load user data:', data.message);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    // 🎯 ANALYZE HISTORICAL SPENDING FOR AI
    analyzeHistoricalSpending() {
        if (this.recentExpenses.length > 0) {
            this.recentExpenses.forEach(expense => {
                const expenseData = {
                    amount: parseFloat(expense.amount),
                    site: expense.betting_site,
                    timestamp: new Date(expense.date_time)
                };
                
                if (this.aiSystem) {
                    this.aiSystem.analyzeSpendingPattern(expenseData);
                }
            });
            
            // Update risk assessment after analyzing history
            this.updateRiskAssessmentDisplay();
        }
    }

    updateDashboard() {
        if (!this.userData) return;

        const monthlyBudget = parseFloat(this.userData.monthly_budget) || 0;
        const currentBalance = parseFloat(this.userData.current_balance) || 0;
        const totalSpent = monthlyBudget - currentBalance;
        const progressPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
        
        const daysLeft = this.getDaysLeftInMonth();

        document.getElementById('userName').textContent = this.userData.name || 'User';
        document.getElementById('currentBalance').textContent = `R ${currentBalance.toLocaleString()}`;
        document.getElementById('monthlyBudget').textContent = `R ${monthlyBudget.toLocaleString()}`;
        document.getElementById('totalSpent').textContent = `R ${totalSpent.toLocaleString()}`;
        document.getElementById('daysLeft').textContent = daysLeft;

        const progressFill = document.getElementById('progressFill');
        const progressPercentageElement = document.getElementById('progressPercentage');
        const progressText = document.getElementById('progressText');
        
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        progressPercentageElement.textContent = `${Math.round(progressPercentage)}%`;
        progressText.textContent = `You have R ${currentBalance.toLocaleString()} left for this month`;

        if (progressPercentage >= 100) {
            progressFill.style.background = '#dc3545';
            this.showAlert('❌ BUDGET EXCEEDED! You have overspent your monthly budget!', 'danger');
        } else if (progressPercentage >= 80) {
            progressFill.style.background = '#ffc107';
            this.showAlert('⚠️ WARNING: You have used over 80% of your monthly budget!', 'warning');
        } else {
            progressFill.style.background = 'linear-gradient(135deg, #CF0A2C 0%, #9B0B23 100%)';
            this.hideAlert();
        }

        this.updateRecentActivity();
        
        // 🎯 UPDATE AI RISK ASSESSMENT
        this.updateRiskAssessmentDisplay();
    }

    getDaysLeftInMonth() {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return lastDay.getDate() - today.getDate();
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recentActivity');
        
        if (this.recentExpenses.length === 0) {
            activityList.innerHTML = `
                <div class="empty-state">
                    <p>No spending recorded yet</p>
                    <button onclick="showCustomAmount()">Add Your First Expense</button>
                </div>
            `;
            return;
        }

        activityList.innerHTML = this.recentExpenses.map(expense => {
            // 🎯 ADD RISK INDICATORS BASED ON BETTING SITE
            const siteRisk = this.bettingIntel ? this.bettingIntel.getRiskLevel(expense.betting_site) : 'unknown';
            const riskClass = siteRisk === 'high' ? 'high-risk' : siteRisk === 'medium' ? 'medium-risk' : '';
            
            return `
                <div class="activity-item ${riskClass}">
                    <div class="activity-details">
                        <strong>R ${parseFloat(expense.amount).toLocaleString()}</strong>
                        <span>at ${expense.betting_site || 'Unknown Site'}</span>
                        <small>${new Date(expense.date_time).toLocaleDateString()}</small>
                    </div>
                    <div class="activity-category">
                        ${expense.category || 'General'}
                        ${siteRisk === 'high' ? ' 🚨' : siteRisk === 'medium' ? ' ⚠️' : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    showAlert(message, type = 'danger') {
        const alertSection = document.getElementById('alertSection');
        const alertMessage = document.getElementById('alertMessage');
        
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type}`;
        alertSection.style.display = 'block';
    }

    hideAlert() {
        document.getElementById('alertSection').style.display = 'none';
    }

    setupEventListeners() {
        document.getElementById('customExpenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCustomExpense();
        });
    }

    // 🎯 ENHANCED ADD EXPENSE WITH AI ANALYSIS
    async addExpense(amount, bettingSite = 'Quick Add', category = 'General') {
        try {
            // 🚨 CHECK IF EXPENSES ARE BLOCKED
            if (this.checkExpenseBlock()) {
                return;
            }

            const currentBalance = parseFloat(this.userData.current_balance);
            
            // 🚨 GOVERNMENT-LEVEL OVERSEND PROTECTION
            if (currentBalance < amount) {
                this.triggerRedSirenProtection(amount, currentBalance);
                return;
            }

            // 🎯 AI RISK ANALYSIS BEFORE ADDING EXPENSE
            const riskLevel = this.aiSystem ? this.aiSystem.calculateRiskLevel({ amount, site: bettingSite }) : 0;
            if (riskLevel > 0.7) {
                this.showPredictiveWarning(`High-risk transaction detected. Consider reducing amount.`);
            }

            const expenseData = {
                user_id: this.userId,
                amount: amount,
                betting_site: bettingSite,
                category: category,
                notes: 'Added via quick action'
            };

            const response = await fetch('/add-expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData)
            });

            const data = await response.json();
            
            if (data.success) {
                this.userData.current_balance = data.new_balance;
                await this.loadUserData();
                
                // 🎯 AI PATTERN ANALYSIS AFTER SUCCESSFUL EXPENSE
                if (this.aiSystem) {
                    const expenseForAI = { 
                        amount: amount, 
                        site: bettingSite,
                        timestamp: new Date()
                    };
                    this.aiSystem.analyzeSpendingPattern(expenseForAI);
                }
                
                // 🚀 REAL-TIME ALERT CHECK
                if (this.realTimeSystem) {
                    this.realTimeSystem.checkRealTimeAlerts();
                }
                
                this.showAlert(`✅ Expense of R ${amount} added successfully!`, 'success');
                setTimeout(() => this.hideAlert(), 3000);
                
            } else {
                if (data.overspend) {
                    this.triggerRedSirenProtection(amount, currentBalance);
                } else {
                    this.showAlert(`❌ ${data.message}`, 'danger');
                }
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            this.showAlert('❌ Failed to add expense. Please try again.', 'danger');
        }
    }

    // 🎯 UPDATE RISK ASSESSMENT DISPLAY
    updateRiskAssessmentDisplay() {
        if (!this.aiSystem) return;
        
        const riskAssessment = this.aiSystem.getRiskAssessment();
        const riskElement = document.getElementById('riskAssessment');
        
        if (riskElement) {
            riskElement.innerHTML = `
                <div class="risk-indicator ${riskAssessment.level}">
                    <div class="risk-header">
                        <span class="risk-icon">${this.getRiskIcon(riskAssessment.level)}</span>
                        <strong>AI RISK ASSESSMENT: ${riskAssessment.level.toUpperCase()}</strong>
                    </div>
                    <p>${riskAssessment.message}</p>
                    ${this.getRiskAdvice(riskAssessment.level)}
                </div>
            `;
        }
    }

    getRiskIcon(level) {
        switch(level) {
            case 'high': return '🚨';
            case 'medium': return '⚠️';
            case 'low': return '✅';
            default: return '🔍';
        }
    }

    getRiskAdvice(level) {
        switch(level) {
            case 'high':
                return `<div class="risk-advice">Consider taking a 24-hour break from betting</div>`;
            case 'medium':
                return `<div class="risk-advice">Monitor your spending closely today</div>`;
            case 'low':
                return `<div class="risk-advice">Your spending patterns are healthy</div>`;
            default:
                return '';
        }
    }

    // 🎯 PREDICTIVE WARNING SYSTEM
    showPredictiveWarning(message) {
        const warningHTML = `
            <div class="predictive-warning">
                <div class="warning-icon">🤖</div>
                <div class="warning-content">
                    <strong>AI PREDICTIVE ALERT</strong>
                    <p>${message}</p>
                    <button onclick="this.parentElement.parentElement.style.display='none'" class="dismiss-btn">Dismiss</button>
                </div>
            </div>
        `;
        
        // Insert at top of dashboard
        const dashboardMain = document.querySelector('.dashboard-main .container');
        const existingWarning = dashboardMain.querySelector('.predictive-warning');
        
        if (!existingWarning) {
            dashboardMain.insertAdjacentHTML('afterbegin', warningHTML);
            
            // Auto-dismiss after 15 seconds
            setTimeout(() => {
                const warning = dashboardMain.querySelector('.predictive-warning');
                if (warning) warning.style.display = 'none';
            }, 15000);
        }
    }

    // 🚨 ENHANCED REAL-TIME ALERT SYSTEM
    showRealTimeAlert(alert) {
        const alertHTML = `
            <div class="real-time-alert ${alert.priority}">
                <div class="alert-icon">🔔</div>
                <div class="alert-content">
                    <strong>REAL-TIME UPDATE</strong>
                    <p>${alert.message}</p>
                    <small>${new Date().toLocaleTimeString()}</small>
                </div>
                <button class="alert-dismiss" onclick="this.parentElement.style.display='none'">×</button>
            </div>
        `;
        
        // Add to alert section
        const alertSection = document.getElementById('alertSection');
        if (alertSection) {
            alertSection.style.display = 'block';
            alertSection.innerHTML = alertHTML;
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                alertSection.style.display = 'none';
            }, 10000);
        }
    }

    // 🎯 GET RECENT TRANSACTIONS FOR AI ANALYSIS
    getRecentTransactions(count = 5) {
        return this.recentExpenses.slice(0, count).map(expense => ({
            amount: parseFloat(expense.amount),
            timestamp: new Date(expense.date_time),
            site: expense.betting_site
        }));
    }

    // 🚨 GOVERNMENT EMERGENCY INTERVENTION SYSTEM
    triggerRedSirenProtection(attemptedAmount, currentBalance) {
        document.body.classList.add('red-siren-active');
        document.getElementById('sirenOverlay').style.display = 'block';
        document.getElementById('emergencyModal').style.display = 'block';

        const overspendAmount = attemptedAmount - currentBalance;
        const totalSpent = this.userData.monthly_budget - currentBalance;
        const percentageSpent = Math.round((totalSpent / this.userData.monthly_budget) * 100);
        
        // 🎯 ADD AI RISK CONTEXT TO EMERGENCY MESSAGE
        const riskContext = this.aiSystem ? this.getEmergencyRiskContext() : '';
        
        const modal = document.getElementById('emergencyModal');
        modal.innerHTML = `
            <h3>🚨 BUDGET EXCEEDED 🚨</h3>
            <div class="motivational-message">
                "Your family needs this R${overspendAmount} more than any bet. 
                This money could buy food, pay electricity, or save for your future."
            </div>
            
            ${riskContext}
            
            <div class="helpline-numbers">
                <p><strong>🇿🇦 SOUTH AFRICAN HELP LINES:</strong></p>
                <p>💙 SA Gambling Helpline: <strong>0800 006 008</strong></p>
                <p>💚 LifeLine SA: <strong>0861 322 322</strong></p>
                <p>🧡 Debt Rescue: <strong>0861 111 636</strong></p>
            </div>

            <div class="motivational-message">
                "You've spent R${totalSpent} (${percentageSpent}%) of your R${this.userData.monthly_budget} budget. 
                That's enough for ${Math.round(totalSpent/50)} family meals."
            </div>

            <button onclick="window.dashboard.closeEmergencyModal()" 
                    class="emergency-close-btn">
                I Understand - Close Alert
            </button>
        `;

        localStorage.setItem('expenseBlockedUntil', Date.now() + 30 * 60 * 1000);
        
        // 🎯 TRIGGER FAMILY NOTIFICATION IF ENABLED
        if (this.realTimeSystem) {
            this.realTimeSystem.sendFamilyNotification(
                `Budget exceeded by R${overspendAmount}. User attempted to spend beyond means.`
            );
        }
    }

    // 🎯 GET AI RISK CONTEXT FOR EMERGENCY
    getEmergencyRiskContext() {
        if (!this.aiSystem) return '';
        
        const riskAssessment = this.aiSystem.getRiskAssessment();
        const daysSincePayday = this.aiSystem.getDaysSincePayday();
        
        return `
            <div class="ai-risk-context">
                <p><strong>AI RISK ANALYSIS:</strong> ${riskAssessment.level.toUpperCase()} risk pattern detected</p>
                <p><strong>PAYDAY CYCLE:</strong> ${daysSincePayday} days since last payday</p>
                <p><strong>RECOMMENDATION:</strong> Take a 48-hour break from all betting activities</p>
            </div>
        `;
    }

    closeEmergencyModal() {
        document.body.classList.remove('red-siren-active');
        document.getElementById('sirenOverlay').style.display = 'none';
        document.getElementById('emergencyModal').style.display = 'none';
    }

    checkExpenseBlock() {
        const blockedUntil = localStorage.getItem('expenseBlockedUntil');
        if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
            const minutesLeft = Math.ceil((parseInt(blockedUntil) - Date.now()) / (60 * 1000));
            this.showAlert(`🚨 Expenses blocked for ${minutesLeft} more minutes. Take time to reconsider.`, 'danger');
            return true;
        }
        return false;
    }

    async addCustomExpense() {
        const amount = parseFloat(document.getElementById('customAmount').value);
        const bettingSite = document.getElementById('bettingSite').value;

        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        if (!bettingSite) {
            alert('Please select a betting site');
            return;
        }

        await this.addExpense(amount, bettingSite, 'Manual');
        this.hideCustomAmount();
    }

    // 🎯 LOAD AI PREDICTIONS
    loadAIPredictions() {
        // Load any stored AI predictions
        const nextPredictedSpending = localStorage.getItem('nextPredictedSpending');
        if (nextPredictedSpending) {
            console.log('🎯 Next predicted spending:', new Date(nextPredictedSpending));
        }
    }
}

// 🎯 INJECT ADVANCED STYLES
const advancedStyles = `
.risk-assessment-container {
    margin: 20px 0;
}

.risk-indicator {
    padding: 15px;
    border-radius: 10px;
    margin: 10px 0;
    border-left: 5px solid;
}

.risk-indicator.high { 
    background: #ffebee; 
    border-left-color: #f44336; 
}

.risk-indicator.medium { 
    background: #fff3e0; 
    border-left-color: #ff9800; 
}

.risk-indicator.low { 
    background: #e8f5e8; 
    border-left-color: #4caf50; 
}

.risk-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.risk-icon {
    font-size: 1.2em;
}

.risk-advice {
    background: rgba(255,255,255,0.7);
    padding: 8px 12px;
    border-radius: 5px;
    margin-top: 8px;
    font-weight: bold;
}

.predictive-warning {
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    animation: pulse 2s infinite;
}

.warning-icon {
    font-size: 1.5em;
}

.warning-content {
    flex: 1;
}

.dismiss-btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

.real-time-alert {
    background: #e3f2fd;
    border-left: 4px solid #2196f3;
    padding: 12px 15px;
    margin: 10px 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.real-time-alert.high {
    background: #ffebee;
    border-left-color: #f44336;
}

.alert-icon {
    font-size: 1.2em;
}

.alert-content {
    flex: 1;
}

.alert-dismiss {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #666;
}

.activity-item.high-risk {
    border-left: 4px solid #f44336;
    background: #ffebee;
}

.activity-item.medium-risk {
    border-left: 4px solid #ff9800;
    background: #fff3e0;
}

.ai-risk-context {
    background: #fff3cd;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    border-left: 4px solid #ffc107;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

.emergency-close-btn {
    background: #ff0000; 
    color: white; 
    border: none; 
    padding: 12px 30px; 
    border-radius: 25px; 
    cursor: pointer; 
    font-weight: bold; 
    margin-top: 15px;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = advancedStyles;
document.head.appendChild(styleSheet);

// Global functions (keep existing)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userData');
        localStorage.removeItem('expenseBlockedUntil');
        localStorage.removeItem('nextPredictedSpending');
        window.location.href = '/';
    }
}

function quickAddExpense(amount) {
    if (window.dashboard) {
        window.dashboard.addExpense(amount, 'Quick Add', 'General');
    }
}

function showCustomAmount() {
    document.getElementById('customAmountModal').style.display = 'flex';
    document.getElementById('customAmount').value = '';
    document.getElementById('bettingSite').selectedIndex = 0;
}

function hideCustomAmount() {
    document.getElementById('customAmountModal').style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('customAmountModal');
    if (e.target === modal) {
        hideCustomAmount();
    }
});

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});