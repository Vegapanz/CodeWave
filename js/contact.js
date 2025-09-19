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
});
