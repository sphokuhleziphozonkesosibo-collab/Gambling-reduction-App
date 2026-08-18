// Live budget calculator
document.getElementById('monthly_salary').addEventListener('input', updateBudget);
document.getElementById('betting_percentage').addEventListener('change', updateBudget);

function updateBudget() {
    const salary = parseFloat(document.getElementById('monthly_salary').value) || 0;
    const percentage = parseFloat(document.getElementById('betting_percentage').value);
    const budget = salary * (percentage / 100);
    
    document.getElementById('budgetAmount').textContent = 'R ' + budget.toLocaleString();
}

// Registration form handler
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const monthly_salary = parseFloat(document.getElementById('monthly_salary').value);
    const betting_percentage = parseFloat(document.getElementById('betting_percentage').value);

    // Validation
    if (!monthly_salary || monthly_salary < 1000) {
        alert('❌ Please enter a valid monthly salary (minimum R1000)');
        return;
    }

    const formData = {
        name: name,
        email: email,
        password: password,
        monthly_salary: monthly_salary,
        betting_percentage: betting_percentage
    };

    console.log('Sending registration data:', formData);

    // Send to backend
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Registration response:', data);
        
        if (data.success) {
            alert('✅ ' + data.message + '\n\nYour monthly betting budget: R ' + data.user_budget.toLocaleString() + 
                  '\n\nRemember: This is your MAXIMUM spending limit for betting this month!');
            window.location.href = 'login.html';
        } else {
            alert('❌ ' + data.message);
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        alert('❌ Registration failed. Please check your connection and try again.');
    });
});

// Initialize budget preview when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateBudget();
});