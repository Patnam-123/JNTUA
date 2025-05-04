const Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    modulus: (a, b) => a % b
};
function add() {
    const num1 = document.querySelector('input[name="num1"]').value;
    const num2 = document.querySelector('input[name="num2"]').value;
    console.log(`Result: ${Calculator.add(+num1, +num2)}`);
}
function subtract() {
    const num1 = document.querySelector('input[name="num1"]').value;
    const num2 = document.querySelector('input[name="num2"]').value;
    console.log(`Result: ${Calculator.add(+num1, +num2)}`);
}  
function multiply() {
    const num1 = document.querySelector('input[name="num1"]').value;
    const num2 = document.querySelector('input[name="num2"]').value;
    console.log(`Result: ${Calculator.add(+num1, +num2)}`);
}
function divide() {
    const num1 = document.querySelector('input[name="num1"]').value;
    const num2 = document.querySelector('input[name="num2"]').value;
    console.log(`Result: ${Calculator.add(+num1, +num2)}`);
}  
function modulus() {
    const num1 = document.querySelector('input[name="num1"]').value;
    const num2 = document.querySelector('input[name="num2"]').value;
    console.log(`Result: ${Calculator.add(+num1, +num2)}`);
}
