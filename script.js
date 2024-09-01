const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
let signBtn = document.getElementById('SignUP')
let logBtn = document.getElementById('logout')
let data = JSON.parse(localStorage.getItem('register'))
if (data.registered){
    signBtn.style.display = "none"
    logBtn.style.display = "block"}
logBtn.addEventListener('click',()=>{
    localStorage.clear("register")
    window.location.href = "login.html"
})


// State variables
let drawing = false;
let tool = 'pen';
let color = '#000000';
let lineWidth = 2;
let fontSize = 16;
let font = 'Arial';
let textColor = '#000000';
let startX, startY;
let scaleFactor = 1;
const scaleIncrement = 0.1;
const maxScale = 3;
const minScale = 0.5;
let isViewMode = false;
let isTextMode = false;
let currentText = '';
let textX, textY;
let currentContent = null; // Store current canvas content

// Toolbar elements (assuming they are defined)
const penBtn = document.getElementById('pen');
const eraserBtn = document.getElementById('eraser');
const lineBtn = document.getElementById('line');
const rectBtn = document.getElementById('rect');
const circleBtn = document.getElementById('circle');
const arrowBtn = document.getElementById('arrow');
const colorPicker = document.getElementById('colorPicker');
const lineThickness = document.getElementById('lineThickness');
const clearBtn = document.getElementById('clear');
const bgColorBtn = document.getElementById('bgColor');
const addStickyNoteBtn = document.getElementById('addStickyNote');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const toggleLockBtn = document.getElementById('toggleLock');
const themeToggleBtn = document.getElementById('themeToggle');
const downloadBtn = document.getElementById('download');
const textBtn = document.getElementById('text');
const textOptions = document.getElementById('textOptions');
const textColorPicker = document.getElementById('textColorPicker');
const fontSelect = document.getElementById('fontSelect');
const fontSizeInput = document.getElementById('fontSize');

// Tool selection event listeners
penBtn.addEventListener('click', () => tool = 'pen');
eraserBtn.addEventListener('click', () => tool = 'eraser');
lineBtn.addEventListener('click', () => tool = 'line');
rectBtn.addEventListener('click', () => tool = 'rect');
circleBtn.addEventListener('click', () => tool = 'circle');
arrowBtn.addEventListener('click', () => tool = 'arrow');

// Change color and line thickness
colorPicker.addEventListener('input', (e) => color = e.target.value);
lineThickness.addEventListener('input', (e) => lineWidth = e.target.value);

// Clear canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentContent = null; // Reset current content
});

// Change background color
bgColorBtn.addEventListener('click', () => canvas.style.backgroundColor = color);

// Add Sticky Note button
addStickyNoteBtn.addEventListener('click', addStickyNote);


// Event listener for Lock and View mode
toggleLockBtn.addEventListener('click', toggleLockMode);

// Event listener for theme toggle
themeToggleBtn.addEventListener('click', toggleTheme);

// Event listener for download button
downloadBtn.addEventListener('click', showDownloadOptions);

// Event listener for text button
textBtn.addEventListener('click', () => {
    isTextMode = !isTextMode;
    textOptions.style.display = isTextMode ? 'block' : 'none';
    canvas.style.cursor = isTextMode ? 'text' : 'crosshair';
});

// Functions for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('click', placeText);

function startDrawing(e) {
    if (isViewMode || isTextMode) return; // Prevent drawing if in view mode or text mode
    drawing = true;
    [startX, startY] = [e.offsetX / scaleFactor, e.offsetY / scaleFactor];
    saveCurrentContent(); // Save current canvas content before drawing
    if (tool === 'pen' || tool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
    }
}

function stopDrawing() {
    if (isViewMode || isTextMode) return; // Prevent ending drawing path if in view mode or text mode
    drawing = false;
    ctx.closePath();
}

function draw(e) {
    if (!drawing || isViewMode || isTextMode) return; // Prevent drawing if not active or in view mode or text mode
    const [x, y] = [e.offsetX / scaleFactor, e.offsetY / scaleFactor];

    restoreContent(); // Restore canvas content before drawing new shape

    if (tool === 'pen') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (tool === 'eraser') {
        ctx.clearRect(x, y, lineWidth, lineWidth);
    } else if (tool === 'line') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (tool === 'rect') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(startX, startY, Math.sqrt((x - startX) ** 2 + (y - startY) ** 2), 0, 2 * Math.PI);
        ctx.stroke();
    } else if (tool === 'arrow') {
        drawArrow(startX, startY, x, y);
    }
}

function drawArrow(x1, y1, x2, y2) {
    const headLength = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

// Function to save current canvas content
function saveCurrentContent() {
    currentContent = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Function to restore saved canvas content
function restoreContent() {
    if (currentContent) {
        ctx.putImageData(currentContent, 0, 0);
    }
}

// Function to add a new sticky note
function addStickyNote() {
    const stickyNote = document.createElement('div');
    stickyNote.className = 'sticky-note light-mode';
    stickyNote.style.top = '50px';
    stickyNote.style.left = '50px';

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
        stickyNote.remove();
    });

    // Create the textarea
    const textarea = document.createElement('textarea');
    textarea.textContent = 'Note';

    // Append the close button and textarea to the sticky note
    stickyNote.appendChild(closeButton);
    stickyNote.appendChild(textarea);

    makeDraggable(stickyNote);
    document.body.appendChild(stickyNote);
}

// Function to make sticky notes draggable
function makeDraggable(element) {
    let offsetX, offsetY;

    element.addEventListener('mousedown', startDrag);
    element.addEventListener('mouseup', stopDrag);
    element.addEventListener('mousemove', drag);

    function startDrag(e) {
        offsetX = e.clientX - parseInt(window.getComputedStyle(element).left);
        offsetY = e.clientY - parseInt(window.getComputedStyle(element).top);
        element.style.zIndex = 1000;
    }

    function drag(e) {
        if (e.buttons === 1) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function stopDrag() {
        element.style.zIndex = 0;
    }
}

// Function to place text on canvas
function placeText(e) {
    if (isTextMode) {
        const text = prompt('Enter your text:');
        if (text) {
            ctx.fillStyle = textColor;
            ctx.font = `${fontSize}px ${font}`;
            ctx.fillText(text, e.offsetX / scaleFactor, e.offsetY / scaleFactor);
        }
    }
}



let scaleFactora = 1;
document.getElementById('zoomIn').addEventListener('click', () => {
    scaleFactora += 0.1;
    console.log("sdfgh")
    canvas.style.transform = `scale(${scaleFactora})`;
});

document.getElementById('zoomOut').addEventListener('click', () => {
    if (scaleFactora > 0.2) {
        scaleFactora -= 0.1;
        canvas.style.transform = `scale(${scaleFactora})`;
    }
});


function applyZoom() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scaleFactor, scaleFactor);
    restoreContent(); // Restore the content after zooming
    ctx.restore();
}

// Toggle Lock Mode (View Mode)
function toggleLockMode() {
    const editIcon = document.getElementById('editIcon');
    const viewIcon = document.getElementById('viewIcon');

    isViewMode = !isViewMode;
    canvas.style.cursor = isViewMode ? 'default' : 'crosshair';

    if (isViewMode) {
        editIcon.style.display = 'none';
        viewIcon.style.display = 'block';
    } else {
        editIcon.style.display = 'block';
        viewIcon.style.display = 'none';
    }
}


// Toggle theme
function toggleTheme() {
    const body = document.body;
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');

    body.classList.toggle('dark-mode');
    document.querySelectorAll('.sticky-note').forEach(note => note.classList.toggle('dark-mode'));

    if (body.classList.contains('dark-mode')) {
        lightIcon.style.display = 'block';
        darkIcon.style.display = 'none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'block';
    }
}


// Download Options
function showDownloadOptions() {
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'canvas.png';
    downloadLink.click();
}

// Handle text options changes
textColorPicker.addEventListener('input', (e) => textColor = e.target.value);
fontSelect.addEventListener('change', (e) => font = e.target.value);
fontSizeInput.addEventListener('input', (e) => fontSize = e.target.value);
// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (isViewMode) return;

    switch (e.key) {
        case 'p':
            tool = 'pen';
            break;
        case 'e':
            tool = 'eraser';
            break;
        case 'l':
            tool = 'line';
            break;
        case 'r':
            tool = 'rect';
            break;
        case 'c':
            tool = 'circle';
            break;
        case 'a':
            tool = 'arrow';
            break;
        case '+':
            zoomIn();
            break;
        case '-':
            zoomOut();
            break;
        case 'Escape':
            toggleLockMode();
            break;
        case 'd':
            toggleTheme();
            break;
    }
});

// Function to place text directly on canvas
function placeText(e) {
    if (!isTextMode) return;

    const x = e.offsetX / scaleFactor;
    const y = e.offsetY / scaleFactor;

    const text = prompt("Enter text:");
    if (text) {
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(text, x, y);
    }

    isTextMode = false;
    textOptions.style.display = 'none';
    canvas.style.cursor = 'crosshair';
}

// Function to show download options
function showDownloadOptions() {
    const format = prompt("Enter format to download (png, pdf, csv):").toLowerCase();

    switch (format) {
        case 'png':
            downloadImage();
            break;
        case 'pdf':
            downloadPDF();
            break;
        case 'csv':
            downloadCSV();
            break;
        default:
            alert("Invalid format.");
    }
}

// Function to download canvas as image
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Function to download canvas as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('whiteboard.pdf');
}

// Function to download canvas as CSV
function downloadCSV() {
    // CSV download not directly feasible for image data; provide image download instead
    alert("CSV download is not supported for image data.");
}