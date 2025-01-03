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


// Function to save data to local storage
function saveData(profileName, weightData) {
    localStorage.setItem(profileName, JSON.stringify(weightData));
}

// Function to load data from local storage
function loadData(profileName) {
    const storedData = localStorage.getItem(profileName);
    return storedData ? JSON.parse(storedData) : null;
}

// Function to download data as a JSON file
function downloadData(profileName, format = "json") { // Added format parameter
    const data = loadData(profileName);
    if (data) {
        let fileContent;
        let fileType;
        let fileName;

        if (format === "json") {
            fileContent = JSON.stringify(data, null, 2);
            fileType = 'application/json';
            fileName = `${profileName}_weights.json`;
        } else if (format === "csv") { // CSV format
            const header = "Date,Weight,Height\n"; // CSV header
            const rows = data.map(item => `${item.date},${item.weight},${item.height}`).join('\n');
            fileContent = header + rows;
            fileType = 'text/csv';
            fileName = `${profileName}_weights.csv`;
        } else if (format === "txt") { // Text format
            let textContent = `Weight Data for ${profileName}:\n`;
            data.forEach(item => {
                textContent += `Date: ${item.date}, Weight: ${item.weight}kg, Height: ${item.height}cm\n`;
            });
            fileContent = textContent;
            fileType = 'text/plain';
            fileName = `${profileName}_weights.txt`;
        }
        else {
            alert("Invalid download format.");
            return;
        }

        const blob = new Blob([fileContent], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert("No data found for this profile.");
    }
}

// Add event listener to the "Save Data" button
document.getElementById('save-data').addEventListener('click', () => {
    const profileName = prompt("Enter a profile name:");
    if (profileName) {
        const weight = parseFloat(document.getElementById('weight').value);
        const heightCm = parseFloat(document.getElementById('height-cm').value);
        if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
            alert("Please calculate BMI first and enter valid weight and height.");
            return;
        }

        let existingData = loadData(profileName) || [];
        const date = new Date().toLocaleDateString();
        existingData.push({ date: date, weight: weight, height: heightCm });

        saveData(profileName, existingData);
        alert(`Data saved for profile: ${profileName}`);
    }
});

// Add event listener to the "Download Data" button
document.getElementById('download-data').addEventListener('click', () => {
    const profileName = prompt("Enter the profile name to download:");
    if (profileName) {
        const format = prompt("Enter the download format (json, csv, txt):").toLowerCase(); // Get format
        downloadData(profileName, format); // Call downloadData with format
    }
});
