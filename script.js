document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');
    const signupSection = document.getElementById('signup-form');
    const signinSection = document.getElementById('signin-form');
    const dashboard = document.getElementById('dashboard');
    const dashboardName = document.getElementById('dashboard-name');
    const showSignin = document.getElementById('show-signin');
    const showSignup = document.getElementById('show-signup');
    const backToSignin = document.getElementById('back-to-signin');

    // Toggle between forms
    showSignin.addEventListener('click', (e) => {
        e.preventDefault();
        signupSection.classList.add('hidden');
        signinSection.classList.remove('hidden');
        signupForm.reset();
        clearAllErrors('signup');
    });

    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signinSection.classList.add('hidden');
        signupSection.classList.remove('hidden');
        signinForm.reset();
        clearAllErrors('signin');
    });

    backToSignin.addEventListener('click', () => {
        dashboard.classList.add('hidden');
        signinSection.classList.remove('hidden');
        signinForm.reset();
        clearAllErrors('signin');
    });

    // Password toggle function
    window.togglePassword = (id) => {
        const input = document.getElementById(id);
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
    };

    // Validation functions
    const validateName = (name) => /^[A-Za-z\s]{2,}$/.test(name);
    const validatePhone = (phone) => /^\d{10}$/.test(phone);
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    const passwordsMatch = (password, confirmPassword) => password === confirmPassword;

    // Sanitize input
    const sanitizeInput = (input) => input.replace(/[<>"'&]/g, '');

    // Show error message
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        errorElement.style.display = 'block';
        errorElement.textContent = message;
        errorElement.classList.add('shake');
        setTimeout(() => errorElement.classList.remove('shake'), 500);
    };

    // Clear error message
    const clearError = (elementId) => {
        const errorElement = document.getElementById(elementId);
        errorElement.style.display = 'none';
    };

    // Clear all errors for a form
    const clearAllErrors = (formType) => {
        const errors = document.querySelectorAll(`#${formType}-form .error`);
        errors.forEach(error => {
            error.style.display = 'none';
            error.classList.remove('shake');
        });
    };

    // Sign Up Form Submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = sanitizeInput(document.getElementById('signup-name').value.trim());
        const phone = sanitizeInput(document.getElementById('signup-phone').value.trim());
        const countryCode = document.getElementById('country-code').value;
        const email = sanitizeInput(document.getElementById('signup-email').value.trim());
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Validate inputs
        if (!validateName(name)) {
            showError('signup-name-error', 'Name must be at least 2 characters and contain only letters.');
            isValid = false;
        } else {
            clearError('signup-name-error');
        }

        if (!validatePhone(phone)) {
            showError('signup-phone-error', 'Enter a valid 10-digit phone number.');
            isValid = false;
        } else {
            clearError('signup-phone-error');
        }

        if (!validateEmail(email)) {
            showError('signup-email-error', 'Enter a valid email address.');
            isValid = false;
        } else {
            clearError('signup-email-error');
        }

        if (!validatePassword(password)) {
            showError('signup-password-error', 'Password must be at least 8 characters with one uppercase, one lowercase, one number, and one special character.');
            isValid = false;
        } else {
            clearError('signup-password-error');
        }

        if (!passwordsMatch(password, confirmPassword)) {
            showError('signup-confirm-password-error', 'Passwords do not match.');
            isValid = false;
        } else {
            clearError('signup-confirm-password-error');
        }

        if (isValid) {
            const user = {
                name,
                phone: `${countryCode}${phone}`,
                email,
                password // In production, hash the password
            };
            localStorage.setItem('user', JSON.stringify(user));
            signupSection.classList.add('hidden');
            signinSection.classList.remove('hidden');
            signupForm.reset();
            clearAllErrors('signup');
        }
    });

    // Sign In Form Submission
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const name = sanitizeInput(document.getElementById('signin-name').value.trim());
        const phone = sanitizeInput(document.getElementById('signin-phone').value.trim());
        const countryCode = document.getElementById('signin-country-code').value;
        const password = document.getElementById('signin-password').value;

        // Validate inputs
        if (!validateName(name)) {
            showError('signin-name-error', 'Enter your name.');
            isValid = false;
        } else {
            clearError('signin-name-error');
        }

        if (!validatePhone(phone)) {
            showError('signin-phone-error', 'Enter a valid 10-digit phone number.');
            isValid = false;
        } else {
            clearError('signin-phone-error');
        }

        if (!password) {
            showError('signin-password-error', 'Enter your password.');
            isValid = false;
        } else {
            clearError('signin-password-error');
        }

        if (isValid) {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (storedUser.name === name && storedUser.phone === `${countryCode}${phone}` && storedUser.password === password) {
                signinSection.classList.add('hidden');
                dashboard.classList.remove('hidden');
                dashboardName.textContent = name;
                signinForm.reset();
                clearAllErrors('signin');
            } else {
                showError('signin-password-error', 'Invalid credentials.');
            }
        }
    });
});