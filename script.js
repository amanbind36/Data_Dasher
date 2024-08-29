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

// // Zooming in and out
// function zoomIn() {
//     if (scaleFactor < maxScale) {
//         scaleFactor += scaleIncrement;
//         applyZoom();
//     }
// }

// function zoomOut() {
//     if (scaleFactor > minScale) {
//         scaleFactor -= scaleIncrement;
//         applyZoom();
//     }
// }

function applyZoom() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scaleFactor, scaleFactor);
    restoreContent(); // Restore the content after zooming
    ctx.restore();
}

// Toggle Lock Mode (View Mode)
function toggleLockMode() {
    isViewMode = !isViewMode;
    canvas.style.cursor = isViewMode ? 'default' : 'crosshair';
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.sticky-note').forEach(note => note.classList.toggle('dark-mode'));
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
