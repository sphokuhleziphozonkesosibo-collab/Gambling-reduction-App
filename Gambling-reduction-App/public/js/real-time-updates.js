// 🎯 R1 MILLION REAL-TIME WEBSOCKET SYSTEM
class RealTimeUpdateSystem {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.isConnected = false;
    }

    connect() {
        try {
            // For demo purposes, we'll simulate WebSocket with setInterval
            // In production, replace with actual WebSocket connection
            this.simulateRealTimeUpdates();
            
            this.isConnected = true;
            console.log('🔗 Real-time system: ACTIVE');
            
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.handleReconnection();
        }
    }

    simulateRealTimeUpdates() {
        // Simulate real-time balance updates
        setInterval(() => {
            if (window.dashboard && window.dashboard.userData) {
                // Simulate small balance fluctuations
                const fluctuation = (Math.random() - 0.5) * 10;
                const currentBalance = window.dashboard.userData.currentBalance + fluctuation;
                
                // Update dashboard in real-time
                window.dashboard.updateBalanceDisplay(currentBalance);
                
                // Check for real-time alerts
                this.checkRealTimeAlerts();
            }
        }, 30000); // Update every 30 seconds

        // Simulate emergency signal detection
        setInterval(() => {
            this.checkEmergencyConditions();
        }, 60000); // Check every minute
    }

    checkRealTimeAlerts() {
        const userData = window.dashboard.userData;
        if (!userData) return;

        // Real-time budget threshold alerts
        const budgetUsage = (userData.totalSpent / userData.monthlyBudget) * 100;
        
        if (budgetUsage > 80 && budgetUsage <= 100) {
            this.sendRealTimeAlert({
                type: 'BUDGET_WARNING',
                message: `You've used ${Math.round(budgetUsage)}% of your monthly budget`,
                priority: 'high'
            });
        }

        // Rapid spending detection (multiple transactions in short time)
        this.detectRapidSpending();
    }

    detectRapidSpending() {
        const recentTransactions = window.dashboard.getRecentTransactions(10); // Last 10 transactions
        if (recentTransactions.length < 3) return;

        const now = new Date();
        const recentTimeWindow = 2 * 60 * 60 * 1000; // 2 hours
        
        const recentInWindow = recentTransactions.filter(transaction => {
            const transactionTime = new Date(transaction.timestamp);
            return (now - transactionTime) < recentTimeWindow;
        });

        if (recentInWindow.length >= 3) {
            this.sendRealTimeAlert({
                type: 'RAPID_SPENDING',
                message: `You've made ${recentInWindow.length} bets in the last 2 hours`,
                priority: 'high'
            });
        }
    }

    checkEmergencyConditions() {
        const userData = window.dashboard.userData;
        if (!userData) return;

        // Check if budget exceeded in real-time
        if (userData.totalSpent > userData.monthlyBudget) {
            this.triggerRealTimeEmergency();
        }

        // Check payday cycle high-risk period
        this.checkPaydayRiskPeriod();
    }

    checkPaydayRiskPeriod() {
        const daysSincePayday = window.aiPatternDetection.getDaysSincePayday();
        
        // High risk: Last 5 days of month or first 3 days after payday
        const isEndOfMonthRisk = daysSincePayday > 25;
        const isPostPaydayRisk = daysSincePayday >= 0 && daysSincePayday <= 3;
        
        if (isEndOfMonthRisk || isPostPaydayRisk) {
            this.sendRealTimeAlert({
                type: 'HIGH_RISK_PERIOD',
                message: this.getRiskPeriodMessage(daysSincePayday, isEndOfMonthRisk, isPostPaydayRisk),
                priority: 'medium'
            });
        }
    }

    getRiskPeriodMessage(daysSincePayday, isEndOfMonth, isPostPayday) {
        if (isEndOfMonth) {
            return `High-risk period: End of month (${30 - daysSincePayday} days until payday)`;
        }
        if (isPostPayday) {
            return `High-risk period: Recent payday (${daysSincePayday} days ago)`;
        }
        return 'Period of elevated risk detected';
    }

    sendRealTimeAlert(alert) {
        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🎯 BetAware Alert', {
                body: alert.message,
                icon: '/icons/icon-192.png'
            });
        }

        // Update dashboard alert system
        if (window.dashboard) {
            window.dashboard.showRealTimeAlert(alert);
        }
    }

    triggerRealTimeEmergency() {
        // Use existing emergency system but trigger via real-time detection
        if (window.dashboard) {
            window.dashboard.triggerBudgetEmergency();
        }
    }

    // Family notification system (optional)
    sendFamilyNotification(message) {
        // In production, this would integrate with SMS/email services
        console.log('👨‍👩‍👧‍👦 Family Notification:', message);
        
        // Simulate family notification
        if (window.dashboard.userData.familyContacts && 
            window.dashboard.userData.familyContacts.length > 0) {
            
            // Show confirmation to user
            if (confirm('Send alert to your family contacts?')) {
                alert('Family has been notified of concerning spending pattern.');
            }
        }
    }

    handleReconnection() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), 5000 * this.reconnectAttempts);
        }
    }
}

// Initialize Real-Time System
window.realTimeSystem = new RealTimeUpdateSystem();