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
            // Save the logged-in user so dashboard.html and
            // pgsi-assessment.html can read it from localStorage
            localStorage.setItem('userData', JSON.stringify(data.user));

            alert('✅ Account created!\n\nYour monthly betting budget: R ' + data.user.monthly_budget.toLocaleString() +
                  '\n\nNext, you\'ll take a quick 2-minute screening so we can tailor your experience.');

            // New users go straight to the PGSI screening first,
            // not back to the login page — they're already authenticated.
            if (data.needs_pgsi) {
                window.location.href = '/pgsi-assessment';
            } else {
                window.location.href = '/dashboard';
            }
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