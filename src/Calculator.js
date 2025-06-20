import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    if (result && ['+', '-', '*', '/'].includes(value)) {
      setInput(result + value);
      setResult('');
    } else if (result && value === '.') {
      setInput(result + value);
      setResult('');
    } else if (result) {
      setInput(value);
      setResult('');
    } else {
      setInput(input + value);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  const handleEquals = () => {
    try {
      // eslint-disable-next-line no-eval
      const evalResult = eval(input.replace(/\u00D7/g, '*').replace(/\u00F7/g, '/'));
      setResult(evalResult.toString());
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator-display">
        <div className="calculator-input">{input || '0'}</div>
        <div className="calculator-result">{result}</div>
      </div>
      <div className="calculator-buttons">
        <button onClick={handleClear} className="span-two">C</button>
        <button onClick={handleBackspace}>&larr;</button>
        <button onClick={() => handleClick('/')}>÷</button>
        <button onClick={() => handleClick('7')}>7</button>
        <button onClick={() => handleClick('8')}>8</button>
        <button onClick={() => handleClick('9')}>9</button>
        <button onClick={() => handleClick('*')}>×</button>
        <button onClick={() => handleClick('4')}>4</button>
        <button onClick={() => handleClick('5')}>5</button>
        <button onClick={() => handleClick('6')}>6</button>
        <button onClick={() => handleClick('-')}>−</button>
        <button onClick={() => handleClick('1')}>1</button>
        <button onClick={() => handleClick('2')}>2</button>
        <button onClick={() => handleClick('3')}>3</button>
        <button onClick={() => handleClick('+')}>+</button>
        <button onClick={() => handleClick('0')} className="span-two">0</button>
        <button onClick={() => handleClick('.')}>.</button>
        <button onClick={handleEquals}>=</button>
      </div>
    </div>
  );
};

export default Calculator; 