// ft35_048 day_02

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    applyCustomColors();
});

// Update Primary and Background Colors
const primaryColorPicker = document.getElementById('primaryColorPicker');
const bgColorPicker = document.getElementById('bgColorPicker');
const colorPicker = document.getElementById('colorPicker');
const lineThicknessSlider = document.getElementById('lineThickness');
const fontPicker = document.getElementById('fontPicker');

primaryColorPicker.addEventListener('input', (e) => {
    primaryColor = e.target.value;
    applyCustomColors();
});

bgColorPicker.addEventListener('input', (e) => {
    bgColor = e.target.value;
    applyCustomColors();
});

colorPicker.addEventListener('input', (e) => {
    penColor = e.target.value;
});

lineThicknessSlider.addEventListener('input', (e) => {
    lineThickness = e.target.value;
});

fontPicker.addEventListener('input', (e) => {
    font = e.target.value;
});

function applyCustomColors() {
    const isDarkMode = document.body.classList.contains('dark');
    
    // Update CSS variables
    document.body.style.setProperty('--primary-color', isDarkMode ? primaryColor : bgColor);
    document.body.style.setProperty('--bg-color', isDarkMode ? bgColor : primaryColor);
}

// Initialize the custom colors
applyCustomColors();