import { Expression } from "./expression";

document.addEventListener('DOMContentLoaded', setup);

function symbolicDiff(expression, variable) {
    let terms = expression.replace(/\s+/g, '').split(/(?=[+-])/);
    let derivedTerms = [];

    terms.forEach(term => {
        let coefficient = 1;
        let power = 1;

        if (term.includes(variable)) {
            let coefficientMatch = term.match(new RegExp(`([+-]?\\d*\\.?\\d*)\\*?${variable}`));
            coefficient = coefficientMatch ? parseFloat(coefficientMatch[1] || 1) : 1;

            let powerMatch = term.match(new RegExp(`\\${variable}\\^(\\d+)`));
            power = powerMatch ? parseInt(powerMatch[1]) : 1;

            let derivedCoefficient = coefficient * power;
            let newPower = power - 1;

            if (newPower === 0) {
                derivedTerms.push(`${derivedCoefficient}`);
            } else if (newPower === 1) {
                derivedTerms.push(`${derivedCoefficient}*${variable}`);
            } else {
                derivedTerms.push(`${derivedCoefficient}*${variable}^${newPower}`);
            }
        } else {
            derivedTerms.push('0');
        }
    });

    return derivedTerms.filter(term => term !== '0').join(' + ');
}

function setup() {
    const newExprButton = document.getElementById('newExprButton');
    newExprButton.onclick = addExpression;

    const calculateButton = document.getElementById('calculateButton');
    calculateButton.onclick = calculateDerivative;
}

function addExpression() {
    const expression = new Expression('3*x');
    const container = document.getElementById('mathContainer');
    const expressionElement = document.createElement('div');
    expressionElement.innerHTML = expression.toString();
    container.appendChild(expressionElement);
}

function calculateDerivative() {
    const expressionInput = document.getElementById('expressionInput').value;
    const variableInput = document.getElementById('variableInput').value;
    const resultContainer = document.getElementById('resultContainer');

    if (!expressionInput || !variableInput) {
        resultContainer.innerText = "Please enter an expression and a variable!";
        return;
    }

    const derivedExpression = symbolicDiff(expressionInput, variableInput);
    resultContainer.innerText = `The derivative of the expression ${expressionInput} with respect to ${variableInput} is: ${derivedExpression}`;
}
