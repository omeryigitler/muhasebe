import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { cn } from '../utils/cn';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../context/LanguageContext';

export type CalculatorHandle = {
  simulatePress: (key: string) => void;
  setDisplay: (val: string) => void;
};

interface CalculatorProps {
  className?: string;
  onInteract?: () => void;
  isInteractive?: boolean;
}

interface ReceiptEntry {
  id: number;
  label: string;
  amount: string;
}

export const Calculator = forwardRef<CalculatorHandle, CalculatorProps>(
  ({ className, onInteract, isInteractive = true }, ref) => {
    const { t } = useLanguage();
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);
    const [receipt, setReceipt] = useState<ReceiptEntry[]>([]);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const receiptRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      simulatePress: (key) => {
        setActiveKey(key);
        handlePress(key);
        setTimeout(() => setActiveKey(null), 150);
      },
      setDisplay: (val) => {
        setDisplay(val);
      }
    }));

    // Auto-scroll receipt
    useEffect(() => {
      if (receiptRef.current) {
        receiptRef.current.scrollTop = receiptRef.current.scrollHeight;
      }
    }, [receipt]);

    const addToReceipt = (label: string, amount: string) => {
      setReceipt((prev) => [...prev, { id: Date.now() + Math.random(), label, amount }]);
    };

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(num);
    };

    const calculate = (a: number, b: number, op: string) => {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return b === 0 ? 0 : a / b;
        default: return b;
      }
    };

    const handlePress = (key: string) => {
      if (isInteractive && onInteract) {
        onInteract();
      }

      if (/[0-9]/.test(key)) {
        if (waitingForNewValue) {
          setDisplay(key);
          setWaitingForNewValue(false);
        } else {
          setDisplay(display === '0' ? key : display + key);
        }
      } else if (key === '.') {
        if (waitingForNewValue) {
          setDisplay('0.');
          setWaitingForNewValue(false);
        } else if (!display.includes('.')) {
          setDisplay(display + '.');
        }
      } else if (key === 'C') {
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForNewValue(false);
        setReceipt([]);
      } else if (key === '⌫') {
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
      } else if (['+', '-', '×', '÷'].includes(key)) {
        const currentNum = parseFloat(display.replace(/\./g, '').replace(/,/g, '.')); // basic parse
        if (previousValue === null) {
          setPreviousValue(currentNum);
          addToReceipt(t('calc.entry'), formatNumber(currentNum));
        } else if (operator && !waitingForNewValue) {
          const result = calculate(previousValue, currentNum, operator);
          setDisplay(formatNumber(result));
          setPreviousValue(result);
          addToReceipt(operator, formatNumber(currentNum));
          addToReceipt(t('calc.total'), formatNumber(result));
        }
        setOperator(key);
        setWaitingForNewValue(true);
      } else if (key === '=') {
        const currentNum = parseFloat(display.replace(/\./g, '').replace(/,/g, '.'));
        if (operator && previousValue !== null) {
          const result = calculate(previousValue, currentNum, operator);
          setDisplay(formatNumber(result));
          addToReceipt(operator, formatNumber(currentNum));
          addToReceipt(t('calc.total'), formatNumber(result));
          setPreviousValue(null);
          setOperator(null);
          setWaitingForNewValue(true);
        }
      } else if (key === 'VAT') {
        const currentNum = parseFloat(display.replace(/\./g, '').replace(/,/g, '.'));
        const vatAmount = currentNum * (APP_CONFIG.vatRate / 100);
        const total = currentNum + vatAmount;
        setDisplay(formatNumber(total));
        addToReceipt(`+ ${t('calc.vat')} ${APP_CONFIG.vatRate}%`, formatNumber(vatAmount));
        addToReceipt(t('calc.total'), formatNumber(total));
        setWaitingForNewValue(true);
      } else if (key === '%') {
        const currentNum = parseFloat(display.replace(/\./g, '').replace(/,/g, '.'));
        setDisplay(formatNumber(currentNum / 100));
        setWaitingForNewValue(true);
      }
    };

    // Keyboard support
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isInteractive) return;
        const keyMap: Record<string, string> = {
          'Enter': '=',
          'Escape': 'C',
          'Backspace': '⌫',
          '*': '×',
          '/': '÷',
        };
        const mappedKey = keyMap[e.key] || e.key;
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','×','÷','=','C','⌫','%','VAT'];
        if (validKeys.includes(mappedKey)) {
          e.preventDefault();
          setActiveKey(mappedKey);
          handlePress(mappedKey);
          setTimeout(() => setActiveKey(null), 150);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, previousValue, operator, waitingForNewValue, isInteractive]);

    const renderKey = (label: string, colSpan: number = 1, variant: 'default' | 'accent' | 'operator' = 'default') => {
      const baseClass = "calc-btn relative flex items-center justify-center rounded-lg text-lg sm:text-xl font-mono select-none overflow-hidden active:translate-y-[2px]";
      const variants = {
        default: "bg-[#2A2B30] text-warm-paper hover:bg-[#32343A]",
        operator: "bg-electric-blue text-white hover:bg-opacity-90",
        accent: "bg-acid-lime text-deep-ink hover:bg-opacity-90",
      };
      
      const isSimActive = activeKey === label;
      
      // Use localized label for VAT button if it's 'VAT'
      const displayLabel = label === 'VAT' ? t('calc.vat') : label;

      return (
        <div
          onClick={() => handlePress(label)}
          className={cn(
            baseClass,
            variants[variant],
            isSimActive && "sim-active",
            colSpan === 2 && "col-span-2",
            isInteractive ? "cursor-pointer" : "cursor-default"
          )}
          style={{ paddingBottom: '100%', height: 0 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {displayLabel}
          </div>
        </div>
      );
    };

    return (
      <div className={cn("relative w-full max-w-[280px] sm:max-w-[340px] perspective-1000 mx-auto", className)}>
        
        {/* Receipt Tape */}
        <div 
          className="absolute left-1/2 -top-24 w-3/4 -translate-x-1/2 h-32 bg-[#F9F7F1] text-deep-ink font-mono text-xs p-4 rounded-t-sm shadow-md overflow-hidden flex flex-col justify-end uppercase"
          style={{ transformOrigin: 'bottom center', zIndex: 0 }}
        >
          <div ref={receiptRef} className="overflow-y-auto no-scrollbar flex flex-col gap-1 w-full mask-image-bottom">
            {receipt.map((entry) => (
              <div key={entry.id} className={cn(
                "flex justify-between w-full",
                entry.label === t('calc.total') && "border-t border-dashed border-deep-ink/30 pt-1 font-bold mt-1"
              )}>
                <span className="opacity-70">{entry.label}</span>
                <span>{APP_CONFIG.currency}{entry.amount}</span>
              </div>
            ))}
          </div>
          {/* Tape edge styling */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white/50 to-transparent" />
        </div>

        {/* Calculator Body */}
        <div className="calc-shadow relative z-10 bg-[#1A1C21] rounded-3xl p-4 sm:p-6 border border-white/5 flex flex-col gap-4 sm:gap-6 backdrop-blur-xl">
          
          {/* Header & Display */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">Sayisal Pro</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-coral/50"></div>
                <div className="w-2 h-2 rounded-full bg-acid-lime/50"></div>
              </div>
            </div>
            
            <div className="bg-[#101114] rounded-xl p-4 flex flex-col items-end shadow-inner border border-white/5 h-24 justify-end relative overflow-hidden">
               <div className="absolute top-2 left-3 text-xs text-acid-lime/50 font-mono">
                  {operator ? operator : ''}
               </div>
               <div className="text-3xl sm:text-4xl font-mono text-acid-lime tracking-tight tabular-nums truncate w-full text-right" style={{ textShadow: '0 0 10px rgba(217,255,67,0.3)' }}>
                 {display}
               </div>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {renderKey('C', 1, 'accent')}
            {renderKey('⌫', 1, 'default')}
            {renderKey('%', 1, 'operator')}
            {renderKey('÷', 1, 'operator')}

            {renderKey('7')}
            {renderKey('8')}
            {renderKey('9')}
            {renderKey('×', 1, 'operator')}

            {renderKey('4')}
            {renderKey('5')}
            {renderKey('6')}
            {renderKey('-', 1, 'operator')}

            {renderKey('1')}
            {renderKey('2')}
            {renderKey('3')}
            {renderKey('+', 1, 'operator')}

            {renderKey('VAT', 1, 'accent')}
            {renderKey('0')}
            {renderKey('.')}
            {renderKey('=', 1, 'operator')}
          </div>
        </div>
      </div>
    );
  }
);
Calculator.displayName = 'Calculator';
