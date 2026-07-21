document.addEventListener('DOMContentLoaded', function() {
            const principalSlider = document.getElementById('principal-slider');
            const interestSlider = document.getElementById('interest-slider');
            const tenureSlider = document.getElementById('tenure-slider');

            const principalInput = document.getElementById('principal-input');
            const interestInput = document.getElementById('interest-input');
            const tenureInput = document.getElementById('tenure-input');

            const principalResult = document.getElementById('result-principal');
            const interestResult = document.getElementById('result-interest');
            const totalResult = document.getElementById('result-total');

            const ctx = document.getElementById('depositChart').getContext('2d');
            let depositChart;

            const formatCurrency = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

            function calculateAndUpdate() {
                const P = parseFloat(principalSlider.value);
                const annualInterest = parseFloat(interestSlider.value);
                const N = parseFloat(tenureSlider.value);
                
                principalInput.value = P.toLocaleString('en-IN');
                interestInput.value = annualInterest.toFixed(1);
                tenureInput.value = N;

                const R = annualInterest / 100;

                if (P > 0 && R >= 0 && N > 0) {
                    const maturityValue = P * Math.pow(1 + R, N);
                    const totalInterest = maturityValue - P;

                    principalResult.textContent = formatCurrency(P);
                    interestResult.textContent = formatCurrency(totalInterest);
                    totalResult.textContent = formatCurrency(maturityValue);
                    updateChart(P, totalInterest);
                }
            }
            
            function updateChart(principalValue, interestValue) {
                const data = {
                    labels: ['Invested Amount', 'Total Interest'],
                    datasets: [{ data: [principalValue, interestValue], backgroundColor: ['#1A237E', '#FFC107'], borderWidth: 2 }]
                };
                if (depositChart) {
                    depositChart.data = data;
                    depositChart.update();
                } else {
                    depositChart = new Chart(ctx, {
                        type: 'doughnut', data: data,
                        options: { cutout: '70%', plugins: { legend: { position: 'top' } } }
                    });
                }
            }
            
            principalSlider.addEventListener('input', calculateAndUpdate);
            interestSlider.addEventListener('input', calculateAndUpdate);
            tenureSlider.addEventListener('input', calculateAndUpdate);

            principalInput.addEventListener('change', () => {
                principalSlider.value = parseFloat(principalInput.value.replace(/,/g, ''));
                calculateAndUpdate();
            });
            interestInput.addEventListener('change', () => {
                interestSlider.value = parseFloat(interestInput.value);
                calculateAndUpdate();
            });
            tenureInput.addEventListener('change', () => {
                tenureSlider.value = parseFloat(tenureInput.value);
                calculateAndUpdate();
            });

            calculateAndUpdate();
        });