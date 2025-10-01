document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    
    if (!form) {
        console.error('Form with ID "contactForm" not found.');
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const inputs = form.querySelectorAll('.form-control');

       
        let isValid = true;

        clearErrors();

 
        
      
        inputs.forEach(input => input.classList.remove('is-invalid'));

        inputs.forEach(input => {
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            }
            
            
            if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value.trim())) {
                isValid = false;
                input.classList.add('is-invalid');
            }
        });

        if (!validateForm()) {
            return; 
        }

        if (isValid) {
            
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
            submitBtn.disabled = true;

      
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
                    
                    submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Sent Successfully!';
                    submitBtn.classList.add('btn-success');
                    form.reset();
                    
                    inputs.forEach(input => input.classList.remove('is-invalid')); 
                } else {
                  
                    console.error('API Error:', jsonResponse);
                    submitBtn.innerHTML = 'Submission Failed!';
                    submitBtn.classList.add('btn-danger');
                }
            })
            .catch(error => {
              
                console.error('Network Error:', error);
                submitBtn.innerHTML = 'Submission Failed!';
                submitBtn.classList.add('btn-danger');
            })
            .finally(() => {
               
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('btn-success', 'btn-danger');
                    submitBtn.disabled = false;
                }, 3000); 
            });
        }
    });

    
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

        
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required.');
            isValid = false;
        }

        
        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required.');
            isValid = false;
        }

     
        if (email.value.trim() === '') {
            showError(email, 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address.');
            isValid = false;
        }

        
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


