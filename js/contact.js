document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    // Make sure the form exists before adding an event listener
    if (!form) {
        console.error('Form with ID "contactForm" not found.');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default browser submission

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const inputs = form.querySelectorAll('.form-control');

        // --- 1. Form Validation ---
        let isValid = true;

        clearErrors();

 
        
        // Clear previous invalid states
        inputs.forEach(input => input.classList.remove('is-invalid'));

        inputs.forEach(input => {
            // Check for empty fields
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            }
            
            // Specifically check the email field for valid format
            if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value.trim())) {
                isValid = false;
                input.classList.add('is-invalid');
            }
        });

        if (!validateForm()) {
            return; // Stop if validation fails
        }

        if (isValid) {
            // --- 2. Change Button to Loading State ---
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
            submitBtn.disabled = true;

            // --- 3. Prepare and Send Data with Fetch ---
            const formData = new FormData(form);
            const jsonObject = {};
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jsonObject)
            })
            .then(async (response) => {
                let jsonResponse = await response.json();
                if (response.status == 200) {
                    // --- 4a. Handle Success ---
                    submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sent Successfully!';
                    submitBtn.classList.add('btn-success');
                    form.reset();
                    // Clear validation classes on reset
                    inputs.forEach(input => input.classList.remove('is-invalid')); 
                } else {
                    // --- 4b. Handle API Error ---
                    console.error('API Error:', jsonResponse);
                    submitBtn.innerHTML = 'Submission Failed!';
                    submitBtn.classList.add('btn-danger');
                }
            })
            .catch(error => {
                // --- 4c. Handle Network Error ---
                console.error('Network Error:', error);
                submitBtn.innerHTML = 'Submission Failed!';
                submitBtn.classList.add('btn-danger');
            })
            .finally(() => {
                // --- 5. Reset Button After a Delay ---
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('btn-success', 'btn-danger');
                    submitBtn.disabled = false;
                }, 3000); // Reset after 3 seconds
            });
        }
    });

    // Helper function to validate email format
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validateForm() {
        let isValid = true;
        const firstName = document.getElementById('first-name');
        const lastName = document.getElementById('last-name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Check First Name
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required.');
            isValid = false;
        }

        // Check Last Name
        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required.');
            isValid = false;
        }

        // Check Email
        if (email.value.trim() === '') {
            showError(email, 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        // Check Message
        if (message.value.trim() === '') {
            showError(message, 'Message cannot be empty.');
            isValid = false;
        }

        return isValid;
    }

    function showError(inputElement, message) {
        const formGroup = inputElement.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        
        inputElement.classList.add('error');
        errorDiv.textContent = message;
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(div => div.textContent = '');

        const errorInputs = document.querySelectorAll('.form-control.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }
});


