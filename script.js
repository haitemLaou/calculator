const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');
const keypad = document.getElementById('keypad');
const modeToggle = document.getElementById('mode-toggle');

let isScientific = false;
let currentExpression = '';

const standardKeys = [
    'AC', '%', '⌫', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '00', '0', '.', '='
];

const scientificKeys = [
    'sin', 'cos', 'tan', 'rad', 'deg',
    'log', 'ln', '(', ')', 'inv',
    '!', 'AC', '%', '⌫', '÷',
    '^', '7', '8', '9', '×',
    '√', '4', '5', '6', '-',
    'π', '1', '2', '3', '+',
    'e', '00', '0', '.', '='
];

function renderKeys() {
    keypad.innerHTML = '';
    keypad.className = isScientific ? 'buttons scientific-mode' : 'buttons standard-mode';
    const keys = isScientific ? scientificKeys : standardKeys;

    keys.forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = key;
        btn.className = 'key';
        
        if (['÷', '×', '-', '+'].includes(key)) btn.classList.add('operator');
        if (key === '=') btn.classList.add('equals');
        if (['sin', 'cos', 'tan', 'log', 'ln', 'inv', '!', '^', '√', 'π', 'e', 'rad', 'deg', '(', ')'].includes(key)) btn.classList.add('sci');
        if (key === 'deg') btn.classList.add('active-mode');

        btn.onclick = () => handleInput(key);
        keypad.appendChild(btn);
    });
}

function updateDisplay() {
    expressionDiv.textContent = currentExpression;
    try {
        let evalStr = currentExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/\^/g, '**');

        if (evalStr === '') {
            resultDiv.textContent = '';
        } else {
            let res = new Function('return ' + evalStr)();
            if (res !== undefined && !Number.isNaN(res)) {
                resultDiv.textContent = Number.isInteger(res) ? res.toLocaleString() : res.toLocaleString(undefined, { maximumFractionDigits: 6 });
            }
        }
    } catch {
        resultDiv.textContent = '';
    }
}

function handleInput(key) {
    if (key === 'AC') {
        currentExpression = '';
    } else if (key === '⌫') {
        currentExpression = currentExpression.slice(0, -1);
    } else if (key === '=') {
        currentExpression = resultDiv.textContent.replace(/,/g, ''); 
        resultDiv.textContent = '';
    } else if (key === 'sin' || key === 'cos' || key === 'tan' || key === 'log') {
        currentExpression += `Math.${key}(`;
    } else if (key === '√') {
        currentExpression += 'Math.sqrt(';
    } else {
        currentExpression += key;
    }
    updateDisplay();
}

modeToggle.onclick = () => {
    isScientific = !isScientific;
    modeToggle.innerHTML = isScientific ? '+ -<br>× =' : '√π<br>e=';
    renderKeys();
};

document.addEventListener('keydown', (e) => {
    const keyMap = { 'Enter': '=', 'Backspace': '⌫', 'Escape': 'AC', '*': '×', '/': '÷' };
    const mappedKey = keyMap[e.key] || e.key;
    if (standardKeys.includes(mappedKey) || scientificKeys.includes(mappedKey)) {
        handleInput(mappedKey);
    }
});

renderKeys();