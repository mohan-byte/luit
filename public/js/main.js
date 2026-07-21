document.addEventListener("DOMContentLoaded", function() {

    // --- Animated Counter for Stats Section ---
    const counters = document.querySelectorAll('.counter-value');
    if (counters.length > 0) {
        const speed = 200;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / speed;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => observer.observe(counter));
    }

    // --- Dynamic Content Toggle for Products & Districts ---
    const toggleButtons = document.querySelectorAll('button[data-target-id]');
    if (toggleButtons.length > 0) {
        const allHiddenContents = document.querySelectorAll('.product-category-content');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const isAlreadyActive = this.classList.contains('active');
                const targetId = this.dataset.targetId;
                const targetContent = document.getElementById(targetId);
                const mainContentSection = targetContent ? targetContent.closest('section') : null;
                toggleButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.service-card').forEach(card => card.classList.remove('active'));
                allHiddenContents.forEach(content => content.classList.add('d-none'));
                document.querySelectorAll('#product-categories, #districts-list').forEach(section => {
                    if (section) section.classList.add('d-none');
                });
                if (!isAlreadyActive && targetContent && mainContentSection) {
                    this.classList.add('active');
                    this.closest('.service-card').classList.add('active');
                    targetContent.classList.remove('d-none');
                    mainContentSection.classList.remove('d-none');
                }
            });
        });
    }

    // --- Chatbot Logic ---
    const toggleButton = document.getElementById('chat-toggle-button');
    if (toggleButton) {
        const closeButton = document.getElementById('chat-close-button');
        const chatWidget = document.getElementById('chat-widget');
        const chatOptions = document.getElementById('chat-options');
        const messagesContainer = document.getElementById('chat-messages');

        const toggleChat = () => chatWidget.classList.toggle('d-none');
        toggleButton.addEventListener('click', toggleChat);
        closeButton.addEventListener('click', toggleChat);

        if(chatOptions) {
            chatOptions.addEventListener('click', async function(e) {
                if (e.target.matches('.chat-option')) {
                    const option = e.target.dataset.option;
                    const userText = e.target.textContent;
                    appendMessage(userText, 'user-message');
                    try {
                        const response = await fetch('/api/chatbot', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ option: option })
                        });
                        if (!response.ok) throw new Error('Network response was not ok');
                        const data = await response.json();
                        appendMessage(data.reply, 'bot-message');
                    } catch (error) {
                        console.error('Chatbot Error:', error);
                        appendMessage('Sorry, something went wrong. Please try again.', 'bot-message');
                    }
                }
            });
        }

        function appendMessage(text, className) {
            if (!messagesContainer) return;
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${className}`;
            const p = document.createElement('p');
            p.textContent = text;
            messageDiv.appendChild(p);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // --- Navbar Dropdown on Hover ---
    const hoverDropdowns = document.querySelectorAll('.hover-dropdown');
    if (hoverDropdowns.length > 0) {
        hoverDropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) menu.classList.add('show');
            });
            dropdown.addEventListener('mouseleave', function() {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('show');
            });
        });
    }
    
    // --- Multi-Step Form Logic ---
    const multiStepForm = document.getElementById('multi-step-form');
    if (multiStepForm) {
        const nextBtns = multiStepForm.querySelectorAll('.next-btn');
        const prevBtns = multiStepForm.querySelectorAll('.prev-btn');
        const formSteps = multiStepForm.querySelectorAll('.form-step');
        const stepIndicators = document.querySelectorAll('.step');
        let currentStep = 0;

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    currentStep++;
                    updateFormSteps();
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentStep--;
                updateFormSteps();
            });
        });

        function validateStep(stepIndex) {
            let isValid = true;
            const currentFormStep = formSteps[stepIndex];
            const requiredInputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
            requiredInputs.forEach(input => {
                let isInputValid = (input.type === 'checkbox') ? input.checked : !!input.value.trim();
                if (!isInputValid) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });
            if (!isValid) alert('Please fill out all required fields.');
            return isValid;
        }

        function updateFormSteps() {
            formSteps.forEach((step, index) => step.classList.toggle('active', index === currentStep));
            stepIndicators.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index < currentStep) {
                    step.classList.add('completed');
                } else if (index === currentStep) {
                    step.classList.add('active');
                }
            });
        }
        if (formSteps.length > 0) {
            formSteps[0].classList.add('active');
        }
    }

    // --- Dependent Dropdown for State & District ---
    const stateSelect = document.getElementById('state-select');
    const districtSelect = document.getElementById('district-select');
    if (stateSelect && districtSelect) {
        const districtData = {
            "Assam": ["Tinsukia", "Dibrugarh", "Sivasagar", "Jorhat", "Guwahati"],
            "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro"]
        };
        stateSelect.addEventListener('change', function() {
            const selectedState = this.value;
            districtSelect.innerHTML = '<option value="">Select District *</option>';
            if (selectedState && districtData[selectedState]) {
                districtSelect.disabled = false;
                districtData[selectedState].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
            } else {
                districtSelect.disabled = true;
            }
        });
    }

    // --- Initialize Bootstrap Popovers ---
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    if (popoverTriggerList.length > 0) {
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
});
