// 🎯 R1 MILLION AI PATTERN DETECTION SYSTEM
class AIPatternDetection {
    constructor() {
        this.spendingPatterns = [];
        this.riskThresholds = {
            high: 0.7,
            medium: 0.4,
            low: 0.2
        };
        this.paydayPatterns = [];
    }

    // Analyze spending behavior in real-time
    analyzeSpendingPattern(expense) {
        const pattern = {
            timestamp: new Date(),
            amount: expense.amount,
            dayOfWeek: new Date().getDay(),
            timeOfDay: new Date().getHours(),
            daysSincePayday: this.getDaysSincePayday(),
            bettingSite: expense.site,
            riskLevel: this.calculateRiskLevel(expense)
        };

        this.spendingPatterns.push(pattern);
        this.detectRiskPatterns();
        this.predictNextSpending();
    }

    // Calculate risk level based on multiple factors
    calculateRiskLevel(expense) {
        let riskScore = 0;

        // Factor 1: Amount relative to budget
        const budgetPercentage = (expense.amount / window.dashboard.userData.monthlyBudget) * 100;
        if (budgetPercentage > 10) riskScore += 0.3;
        if (budgetPercentage > 25) riskScore += 0.4;

        // Factor 2: Time-based risk (evenings/weekends higher risk)
        const hour = new Date().getHours();
        if (hour >= 18 || hour <= 6) riskScore += 0.2; // Evening/night
        if ([5, 6].includes(new Date().getDay())) riskScore += 0.2; // Weekend

        // Factor 3: Days since payday (closer to next payday = higher risk)
        const daysSincePayday = this.getDaysSincePayday();
        if (daysSincePayday > 25) riskScore += 0.3; // End of month

        // Factor 4: Betting site risk level
        const siteRisk = window.bettingIntel.getRiskLevel(expense.site);
        if (siteRisk === 'high') riskScore += 0.3;
        if (siteRisk === 'medium') riskScore += 0.15;

        return Math.min(riskScore, 1.0);
    }

    // Detect problematic spending patterns
    detectRiskPatterns() {
        if (this.spendingPatterns.length < 3) return;

        const recentPatterns = this.spendingPatterns.slice(-5);
        
        // Pattern 1: Increasing amounts
        const amounts = recentPatterns.map(p => p.amount);
        const increasingTrend = this.isIncreasingTrend(amounts);
        
        // Pattern 2: Frequent spending
        const frequentSpending = this.isFrequentSpending(recentPatterns);
        
        // Pattern 3: Chasing losses pattern
        const chasingLosses = this.detectChasingLosses(recentPatterns);

        if (increasingTrend || frequentSpending || chasingLosses) {
            this.triggerPredictiveAlert(increasingTrend, frequentSpending, chasingLosses);
        }
    }

    // Predict when next spending might occur
    predictNextSpending() {
        if (this.spendingPatterns.length < 5) return;

        const averageInterval = this.calculateAverageSpendingInterval();
        const nextPredictedSpending = new Date(Date.now() + averageInterval);
        
        // Store prediction for proactive interventions
        localStorage.setItem('nextPredictedSpending', nextPredictedSpending.toISOString());
    }

    // Calculate average time between spending
    calculateAverageSpendingInterval() {
        const intervals = [];
        for (let i = 1; i < this.spendingPatterns.length; i++) {
            const interval = this.spendingPatterns[i].timestamp - this.spendingPatterns[i-1].timestamp;
            intervals.push(interval);
        }
        
        return intervals.length > 0 ? 
            intervals.reduce((a, b) => a + b) / intervals.length : 
            24 * 60 * 60 * 1000; // Default 1 day
    }

    // Get days since last payday (assuming 25th of month)
    getDaysSincePayday() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        // Assuming payday is 25th of each month
        const lastPayday = new Date(currentYear, currentMonth, 25);
        if (today.getDate() < 25) {
            lastPayday.setMonth(currentMonth - 1);
        }
        
        const daysSince = Math.floor((today - lastPayday) / (1000 * 60 * 60 * 24));
        return daysSince;
    }

    // Trend analysis algorithms
    isIncreasingTrend(amounts) {
        if (amounts.length < 3) return false;
        
        let increases = 0;
        for (let i = 1; i < amounts.length; i++) {
            if (amounts[i] > amounts[i-1]) increases++;
        }
        
        return increases >= amounts.length - 1;
    }

    isFrequentSpending(patterns) {
        if (patterns.length < 3) return false;
        
        const timeSpan = patterns[patterns.length-1].timestamp - patterns[0].timestamp;
        const hoursSpan = timeSpan / (1000 * 60 * 60);
        
        // More than 3 transactions in 24 hours is considered frequent
        return patterns.length >= 3 && hoursSpan <= 24;
    }

    detectChasingLosses(patterns) {
        // Simple chasing losses detection: consecutive losses followed by larger bet
        for (let i = 2; i < patterns.length; i++) {
            if (patterns[i].amount > patterns[i-1].amount && 
                patterns[i-1].amount > patterns[i-2].amount) {
                return true;
            }
        }
        return false;
    }

    // Trigger alerts before problem occurs
    triggerPredictiveAlert(increasingTrend, frequentSpending, chasingLosses) {
        let alertMessage = "🚨 AI PREDICTION: ";
        const reasons = [];
        
        if (increasingTrend) reasons.push("increasing bet amounts");
        if (frequentSpending) reasons.push("frequent betting activity");
        if (chasingLosses) reasons.push("potential chasing losses pattern");
        
        alertMessage += `We've detected ${reasons.join(', ')}. This often leads to overspending.`;
        
        // Show predictive warning
        if (window.dashboard) {
            window.dashboard.showPredictiveWarning(alertMessage);
        }
    }

    // Get risk assessment for dashboard
    getRiskAssessment() {
        if (this.spendingPatterns.length === 0) {
            return { level: 'low', message: 'No spending patterns detected' };
        }

        const recentRiskScores = this.spendingPatterns
            .slice(-3)
            .map(p => p.riskLevel);
            
        const averageRisk = recentRiskScores.reduce((a, b) => a + b) / recentRiskScores.length;
        
        if (averageRisk >= this.riskThresholds.high) {
            return { 
                level: 'high', 
                message: 'High-risk pattern detected. Consider taking a break.' 
            };
        } else if (averageRisk >= this.riskThresholds.medium) {
            return { 
                level: 'medium', 
                message: 'Moderate risk pattern. Monitor your spending.' 
            };
        } else {
            return { 
                level: 'low', 
                message: 'Spending patterns appear normal' 
            };
        }
    }
}

// Initialize AI System
window.aiPatternDetection = new AIPatternDetection();