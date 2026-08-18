function login(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Send data to backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // ✅ STORE USER DATA FOR DASHBOARD
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            alert(data.message);
            // ✅ REDIRECT TO DASHBOARD ROUTE (NOT dashboard.html)
            window.location.href = '/dashboard';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login failed');
    });
    
    return false;
}