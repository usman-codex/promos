

document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    const body = document.body;

    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true' || false;
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.classList.toggle('active');
            body.classList.toggle('nav-open'); 
        });

        // Close mobile nav when a link is clicked
        const navLinks = primaryNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (body.classList.contains('nav-open')) {
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    primaryNav.classList.remove('active');
                    body.classList.remove('nav-open');
                }
            });
        });

        // Close mobile nav if clicked outside
        document.addEventListener('click', function(event) {
            if (body.classList.contains('nav-open') &&
                !primaryNav.contains(event.target) && 
                !mobileNavToggle.contains(event.target)) {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('active');
                body.classList.remove('nav-open');
            }
        });
    }

    // --- Auth Modal & Form Logic ---
    const authModal = document.getElementById('authModal');
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navSignupBtn = document.getElementById('navSignupBtn');
    
    // Check if authModal exists before querying its children
    let closeModalBtn, loginRadio, signupRadio, titleTextContainer, formInnerContainer, loginLabel, signupLabel, switchToSignupLink, switchToLoginLink;

    if (authModal) {
        closeModalBtn = authModal.querySelector('.close-modal-btn');
        loginRadio = authModal.querySelector('#login-radio');
        signupRadio = authModal.querySelector('#signup-radio');
        titleTextContainer = authModal.querySelector(".title-text");
        formInnerContainer = authModal.querySelector(".form-inner");
        loginLabel = authModal.querySelector("label.slide.login[for='login-radio']");
        signupLabel = authModal.querySelector("label.slide.signup[for='signup-radio']");
        switchToSignupLink = authModal.querySelector("form.login-form-actual .signup-link a");
        switchToLoginLink = authModal.querySelector("form.signup-form-actual .login-link a");
    }


    function openModal() {
        if (authModal) {
            authModal.classList.add('active');
            body.style.overflow = 'hidden'; g
        }
    }

    function closeModal() {
        if (authModal) {
            authModal.classList.remove('active');
            body.style.overflow = ''; 
        }
    }

    function showLoginFormInModal() {
        if (loginRadio) loginRadio.checked = true; 
        if (formInnerContainer) formInnerContainer.style.marginLeft = "0%"; 
        if (titleTextContainer) titleTextContainer.style.marginLeft = "0%"; 
         // Clear any previous messages
        const loginMessageDiv = document.getElementById('loginMessage');
        if (loginMessageDiv) loginMessageDiv.className = 'form-message'; loginMessageDiv.textContent = '';
    }

    function showSignupFormInModal() {
        if (signupRadio) signupRadio.checked = true; 
        if (formInnerContainer) formInnerContainer.style.marginLeft = "-100%";
        if (titleTextContainer) titleTextContainer.style.marginLeft = "-100%"; 
         // Clear any previous messages
        const signupMessageDiv = document.getElementById('signupMessage');
        if (signupMessageDiv) signupMessageDiv.className = 'form-message'; signupMessageDiv.textContent = '';
    }

    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (body.classList.contains('nav-open')) mobileNavToggle.click(); 
            openModal();
            showLoginFormInModal();
        });
    }

    if (navSignupBtn) {
        navSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (body.classList.contains('nav-open')) mobileNavToggle.click(); 
            openModal();
            showSignupFormInModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeModal();
            }
        });
    }

    // --- Form's internal switching logic (Login/Signup tabs) ---
    if (signupLabel) {
        signupLabel.onclick = (() => {
            showSignupFormInModal(); 
        });
    }

    if (loginLabel) {
        loginLabel.onclick = (() => {
            showLoginFormInModal(); 
        });
    }

    if (switchToSignupLink) {
        switchToSignupLink.onclick = ((e) => {
            e.preventDefault();
            if (signupLabel) signupLabel.click(); 
            return false;
        });
    }

    if (switchToLoginLink) {
        switchToLoginLink.onclick = ((e) => {
            e.preventDefault();
            if (loginLabel) loginLabel.click(); 
            return false;
        });
    }
    
   
    if (loginRadio && signupRadio) {
        loginRadio.addEventListener('change', () => {
            if (loginRadio.checked) showLoginFormInModal();
        });
        signupRadio.addEventListener('change', () => {
            if (signupRadio.checked) showSignupFormInModal();
        });
    }

    // --- Signup Form Submission Logic ---
    const actualSignupForm = document.getElementById('actualSignupForm');
    const signupMessageDiv = document.getElementById('signupMessage'); 

    if (actualSignupForm && signupMessageDiv) {
        actualSignupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            // Get form field values
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value; 
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            // --- Client-side validation ---
            signupMessageDiv.className = 'form-message'; 
            signupMessageDiv.textContent = ''; 

            if (!email || !password || !confirmPassword) {
                signupMessageDiv.textContent = 'Please fill in all fields.';
                signupMessageDiv.className = 'form-message error';
                return; 
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                signupMessageDiv.textContent = 'Please enter a valid email address.';
                signupMessageDiv.className = 'form-message error';
                return;
            }
            if (password !== confirmPassword) {
                signupMessageDiv.textContent = 'Passwords do not match.';
                signupMessageDiv.className = 'form-message error';
                return;
            }
            if (password.length < 6) { 
                signupMessageDiv.textContent = 'Password must be at least 6 characters long.';
                signupMessageDiv.className = 'form-message error';
                return;
            }

            // Prepare data to send to PHP
            const signupData = {
                email: email,
                password: password,
                confirm_password: confirmPassword 
            };
            
            signupMessageDiv.textContent = 'Processing...'; 
            signupMessageDiv.className = 'form-message'; 

            try {
               
                const response = await fetch('php/signup_process.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(signupData) 
                });

                const result = await response.json(); 

                if (response.ok) {
                    signupMessageDiv.textContent = result.message || 'Signup successful!';
                    signupMessageDiv.className = 'form-message success'; 
                    actualSignupForm.reset(); 

                    
                } else { 
                    signupMessageDiv.textContent = result.error || `Signup failed (Error: ${response.status})`;
                    signupMessageDiv.className = 'form-message error'; 
                }
            } catch (error) { 
                console.error('Signup fetch error:', error);
                signupMessageDiv.textContent = 'A network error occurred. Please try again.';
                signupMessageDiv.className = 'form-message error';
            }
        });
    }

    // --- Login Form Submission Logic (Placeholder - Implement this similarly to signup) ---
    const actualLoginForm = document.getElementById('actualLoginForm');
    const loginMessageDiv = document.getElementById('loginMessage');

    if (actualLoginForm && loginMessageDiv) {
        actualLoginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 
            
            

            loginMessageDiv.textContent = 'Login functionality is not yet implemented.';
            loginMessageDiv.className = 'form-message error'; 
            console.log("Login form submitted - PHP backend for login needs to be implemented.");
        });
    }

}); 