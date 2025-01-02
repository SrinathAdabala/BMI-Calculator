document.getElementById('calculate').addEventListener('click', calculateBMI);
const maleButton = document.getElementById('male');
const femaleButton = document.getElementById('female');
const convertButton = document.getElementById('convert-ft-cm');
const searchButton = document.getElementById('search-perplexity');
let selectedGender = null;

maleButton.addEventListener('click', () => {
    maleButton.classList.add('selected-male');
    femaleButton.classList.remove('selected-female');
    selectedGender = 'male';
});

femaleButton.addEventListener('click', () => {
    femaleButton.classList.add('selected-female');
    maleButton.classList.remove('selected-male');
    selectedGender = 'female';
});

convertButton.addEventListener('click', () => {
    const feet = parseFloat(document.getElementById('height-ft').value) || 0;
    const inches = parseFloat(document.getElementById('height-in').value) || 0;
    const totalInches = (feet * 12) + inches;
    const cm = totalInches * 2.54;
    document.getElementById('height-cm').value = cm.toFixed(2);
});

searchButton.addEventListener('click', () => {
    const query = document.getElementById('perplexity-query').value;
    if (query.trim() !== "") {
        const perplexityUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(query)}`;
        window.open(perplexityUrl, '_blank');
    } else {
        alert("Please enter a question to search.");
    }
});

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height-cm').value);

    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        alert("Please enter valid weight and height.");
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    const resultDiv = document.getElementById('result');
    const bmiCategoryDiv = document.getElementById('bmi-category');
    const recommendationsDiv = document.getElementById('recommendations');

    resultDiv.textContent = `Your BMI: ${bmi.toFixed(2)}`;

    let bmiCategory = "";
    let bgColor = "";

    if (bmi < 18.5) {
        bmiCategory = "Underweight";
        bgColor = "#e0f2f7"; // Light Blue
    } else if (bmi < 25) {
        bmiCategory = "Normal";
        bgColor = "#dcedc8"; // Light Green
    } else if (bmi < 30) {
        bmiCategory = "Overweight";
        bgColor = "#fff9c4"; // Light Yellow
    } else {
        bmiCategory = "Obese";
        bgColor = "#ffcdd2"; // Light Red
    }

    document.body.style.backgroundColor = bgColor;
    bmiCategoryDiv.textContent = `BMI Category: ${bmiCategory}`;

    const recommendations = [
        `Based on my BMI of ${bmi.toFixed(2)}, give me a diet plan.`,
        `Based on my BMI of ${bmi.toFixed(2)}, suggest an exercise plan.`,
        `Based on my BMI of ${bmi.toFixed(2)}, what is a recommended sleep schedule?`
    ];

    recommendationsDiv.innerHTML = "<h3>Recommendations:</h3><ul>" + recommendations.map(rec => `<li><a href="https://www.perplexity.ai/?q=${encodeURIComponent(rec)}" target="_blank">${rec}</a></li>`).join("") + "</ul>";
}
