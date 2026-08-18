let userEmail = ''; // Store email between steps

function requestOTP(){
    const email = document.getElementById('email').value;
    userEmail = email;
    
    // Send OTP request to backend
    fetch('/request-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message + " Check console for OTP: " + data.otp);
            // Show reset password form
            document.getElementById('resetPasswordForm').style.display = 'block';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send OTP');
    });
    
    return false;
}

function resetPassword(){
    const otp = document.getElementById('otp').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if(newPassword !== confirmPassword){
        alert("Passwords do not match");
        return false;
    }
    
    // Send reset request to backend
    fetch('/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            email: userEmail, 
            otp: otp, 
            newPassword: newPassword 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Redirect to login
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Password reset failed');
    });
    
    return false;
}
