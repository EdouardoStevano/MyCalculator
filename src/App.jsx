import React, { useState, useEffect } from 'react';
// import { saveAs } from 'file-saver';
import './App.css';

function Calculatrice() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [operator, setOperator] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);


  const handleButtonClick = (value) => {
    if (!isNaN(value) || value === '.') {
      setCurrentValue(currentValue + value);
      setDisplay(currentValue + value);
    } else if (value === 'C') {
      setCurrentValue('');
      setDisplay('0');
      setOperator('');
      setResult(null);
    } else if (value === '=') {
      if (result !== null && operator !== '' && currentValue !== '') {
        const newResult = evaluateExpression(parseFloat(result), parseFloat(currentValue), operator);
        addToHistory(`${result} ${operator} ${currentValue} = ${newResult}`);
        setResult(null);
        setDisplay(newResult.toString());
        setCurrentValue(newResult.toString());
        setOperator('');
      }
    } else if (value === 'Backspace') {
      setCurrentValue(currentValue.slice(0, -1));
      setDisplay(currentValue.slice(0, -1));
    } else if (value === 'Copy') {
      navigator.clipboard.writeText(display);
    } else if (value === 'Export excel') {
      exportToExcel();
    } else if (value === 'Export notes') {
      exportToNotepad();
    } else {
      if (result !== null && operator !== '' && currentValue !== '') {
        const newResult = evaluateExpression(parseFloat(result), parseFloat(currentValue), operator);
        addToHistory(`${result} ${operator} ${currentValue} = ${newResult}`);
        setDisplay(newResult + value);
        setCurrentValue('');
        setResult(newResult);
        setOperator(value);
      } else {
        setResult(parseFloat(display));
        setDisplay(display + value);
        setCurrentValue('');
        setOperator(value);
      }
    }
  };

  const evaluateExpression = (prevValue, currentValue, op) => {
    switch (op) {
      case '+':
        return prevValue + currentValue;
      case '-':
        return prevValue - currentValue;
      case '*':
        return prevValue * currentValue;
      case '/':
        return prevValue / currentValue;
      case '**':
        return Math.pow(prevValue, currentValue);
      case '√':
        return Math.sqrt(prevValue);
      case 'exp':
        return Math.exp(prevValue);
      default:
        return currentValue;
    }
  };

  const addToHistory = (operation) => {
    setHistory([...history, operation]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace') {
      handleButtonClick('Backspace');
    }
    // ... (le reste de votre gestion des touches)
  };

  const exportToExcel = () => {
    const csvContent = `data:text/csv;charset=utf-8,${history.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'calculator_history.csv');
    document.body.appendChild(link);
    link.click();
  };

  const exportToNotepad = () => {
    const csvContent = `data:text/text;charset=utf-8,${history.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'calculator_history.txt');
    document.body.appendChild(link);
    link.click();
  };

  const copyDisplay = () => {
    navigator.clipboard.writeText(display);
    alert('Valeur à l\'ecran copié')
  };

  const exportToDocx = () => {
    // Logique pour exporter vers DOCX (Word)
    // Exemple : Utilisation de bibliothèques tierces comme docx
    // https://docx.js.org/
    // Exemple simple : Non inclus ici pour la concision, mais vous pouvez utiliser docx.js pour générer un fichier DOCX
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div className='calculator-container'>
    <div className="calculator">
      <div className="display">{display} <button type="button" onClick={()=>copyDisplay()}>Copier</button> </div>
      <div className="buttons">
        {[7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 'C', 0, '.', '+', '=', '**', '√', 'exp'].map((value) => (
          <button key={value} onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>

    <div className="history">
        <h3>Historique des opérations :</h3>
        <small>vous pouvez voir içi les historiques des opérations que vous avez faites.</small>
        <ul>
          {history.map((operation, index) => (
            <li key={index}>{operation}</li>
          ))}
        </ul>
        <div className="btn-history">
          <small>Exporter : </small>
        <button type="button" onClick={()=>exportToExcel()}>Excel</button>
        <button type="button" onClick={()=>exportToNotepad()}>Bloc notes</button>
      </div>
      </div>

      
    </div>
  );
}

export default Calculatrice;
