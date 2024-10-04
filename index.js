const expressionDisplay = document.getElementById(
  'calculator-expression'
);
const resultDisplay = document.getElementById('calculator-result');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let previousInput = '';
let operator = null;
let isCalculating = false; // Flag to control whether the calculator is in a calculating state

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.textContent;

    if (isCalculating && action !== 'clear') {
      // Do nothing if the calculator is in a calculating state and the button is not 'C'
      return;
    }

    // Handle number buttons
    if (action === undefined || action === 'number') {
      if (isCalculating) {
        // Reset current input if a new calculation is starting
        currentInput = value;
        isCalculating = false; // Allow further calculations
        operator = null;
        previousInput = '';
      } else {
        currentInput += value;
      }
      updateExpressionDisplay();
    } else if (action === 'decimal') {
      if (!currentInput.includes('.')) {
        currentInput += '.';
        updateExpressionDisplay();
      }
    } else if (action === 'clear') {
      // Clear the calculator state
      currentInput = '';
      previousInput = '';
      operator = null;
      resultDisplay.value = '';
      isCalculating = false; // Re-enable input
      updateExpressionDisplay();
      expressionDisplay.value = '0'; // Reset display
    } else if (action === 'delete') {
      currentInput = currentInput.slice(0, -1);
      updateExpressionDisplay();
    } else if (action === 'operation') {
      if (currentInput !== '') {
        if (previousInput && operator && !isCalculating) {
          // Calculate intermediate results for chained operations
          currentInput = calculate(
            previousInput,
            operator,
            currentInput
          ).toString();
        }
        operator = value;
        previousInput = currentInput;
        currentInput = '';
        updateExpressionDisplay();
      }
    } else if (action === 'calculate') {
      if (operator && currentInput) {
        const result = calculate(
          previousInput,
          operator,
          currentInput
        );
        resultDisplay.value = `= ${result}`;
        currentInput = result.toString(); // Keep the result as the new input for further calculations
        previousInput = currentInput; // Set the result as the previous input for the next operation
        operator = null;
        isCalculating = true; // Disable further input until 'C' is pressed
        // Do not update expressionDisplay with result; keep it as it was
      }
    }
  });
});

function updateExpressionDisplay() {
  // Only update expressionDisplay if no result was shown
  if (!isCalculating) {
    expressionDisplay.value = `${previousInput} ${
      operator || ''
    } ${currentInput}`;
  }
}

function calculate(num1, operator, num2) {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);

  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      return num1 / num2;
    case '%':
      return num1 % num2;
    default:
      return num2;
  }
}
