import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { cn } from '../utils/cn';
import { APP_CONFIG, getFinanceLocale } from '../config';
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

type ReceiptEntryKind = 'entry' | 'operation' | 'total' | 'vat-add' | 'vat-remove';

interface ReceiptEntry {
  id: number;
  kind: ReceiptEntryKind;
  amount: number;
  operator?: string;
}

export const Calculator = forwardRef<CalculatorHandle, CalculatorProps>(
  ({ className, onInteract, isInteractive = true }, ref) => {
    const { t, language } = useLanguage();
    const finance = getFinanceLocale(language);
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForNewValue, setWaitingForNewValue] = useState(false);
    const [receipt, setReceipt] = useState<ReceiptEntry[]>([]);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const receiptRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const toDisplayValue = (num: number) => {
      if (!Number.isFinite(num)) return '0';
      const rounded = Math.round((num + Number.EPSILON) * 100000000) / 100000000;
      return String(rounded);
    };

    const parseDisplay = () => {
      const parsed = Number(display);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const addToReceipt = (kind: ReceiptEntryKind, amount: number, entryOperator?: string) => {
      setReceipt((prev) => [...prev, {
        id: Date.now() + Math.random(),
        kind,
        amount,
        operator: entryOperator,
      }]);
    };

    const formatCurrency = (num: number) => {
      return new Intl.NumberFormat(finance.locale, {
        style: 'currency',
        currency: finance.code,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(num);
    };

    const getReceiptLabel = (entry: ReceiptEntry) => {
      switch (entry.kind) {
        case 'entry':
          return t('calc.entry');
        case 'operation':
          return entry.operator || '';
        case 'total':
          return t('calc.total');
        case 'vat-add':
          return `+ ${t('calc.vat')} ${APP_CONFIG.vatRate}%`;
        case 'vat-remove':
          return `− ${t('calc.vat')} ${APP_CONFIG.vatRate}%`;
        default:
          return '';
      }
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

    const handlePress = (key: string, source: 'user' | 'simulation' = 'user') => {
      if (source === 'user') {
        onInteract?.();
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
        if (waitingForNewValue) return;
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
      } else if (['+', '-', '×', '÷'].includes(key)) {
        const currentNum = parseDisplay();
        if (previousValue === null) {
          setPreviousValue(currentNum);
          addToReceipt('entry', currentNum);
        } else if (operator && !waitingForNewValue) {
          const result = calculate(previousValue, currentNum, operator);
          setDisplay(toDisplayValue(result));
          setPreviousValue(result);
          addToReceipt('operation', currentNum, operator);
          addToReceipt('total', result);
        }
        setOperator(key);
        setWaitingForNewValue(true);
      } else if (key === '=') {
        const currentNum = parseDisplay();
        if (operator && previousValue !== null) {
          const result = calculate(previousValue, currentNum, operator);
          setDisplay(toDisplayValue(result));
          addToReceipt('operation', currentNum, operator);
          addToReceipt('total', result);
          setPreviousValue(null);
          setOperator(null);
          setWaitingForNewValue(true);
        }
      } else if (key === 'VAT+') {
        const currentNum = parseDisplay();
        const vatAmount = currentNum * (APP_CONFIG.vatRate / 100);
        const total = currentNum + vatAmount;
        setDisplay(toDisplayValue(total));
        addToReceipt('vat-add', vatAmount);
        addToReceipt('total', total);
        setWaitingForNewValue(true);
      } else if (key === 'VAT-') {
        const currentNum = parseDisplay();
        const net = currentNum / (1 + APP_CONFIG.vatRate / 100);
        const vatAmount = currentNum - net;
        setDisplay(toDisplayValue(net));
        addToReceipt('vat-remove', vatAmount);
        addToReceipt('total', net);
        setWaitingForNewValue(true);
      } else if (key === '%') {
        const currentNum = parseDisplay();
        setDisplay(toDisplayValue(currentNum / 100));
        setWaitingForNewValue(true);
      }
    };

    useImperativeHandle(ref, () => ({
      simulatePress: (key) => {
        setActiveKey(key);
        handlePress(key, 'simulation');
        window.setTimeout(() => setActiveKey(null), 150);
      },
      setDisplay: (val) => {
        setDisplay(val);
      }
    }));

    useEffect(() => {
      if (receiptRef.current) {
        receiptRef.current.scrollTop = receiptRef.current.scrollHeight;
      }
    }, [receipt]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;

        const target = e.target as HTMLElement | null;
        if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

        const root = rootRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
        if (!isVisible) return;

        const keyMap: Record<string, string> = {
          Enter: '=',
          Escape: 'C',
          Backspace: '⌫',
          '*': '×',
          '/': '÷',
          ',': language === 'tr' ? '.' : ',',
        };
        const mappedKey = keyMap[e.key] || e.key;
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','×','÷','=','C','⌫','%'];
        if (validKeys.includes(mappedKey)) {
          e.preventDefault();
          setActiveKey(mappedKey);
          handlePress(mappedKey, 'user');
          window.setTimeout(() => setActiveKey(null), 150);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, previousValue, operator, waitingForNewValue, isInteractive, language]);

    const renderKey = (
      label: string,
      colSpan: number = 1,
      variant: 'default' | 'accent' | 'operator' = 'default',
      actionKey: string = label,
      ariaLabel?: string,
    ) => {
      const baseClass = 'calc-btn relative flex items-center justify-center rounded-lg text-lg sm:text-xl font-mono select-none overflow-hidden active:translate-y-[2px]';
      const variants = {
        default: 'bg-[#2A2B30] text-warm-paper hover:bg-[#32343A]',
        operator: 'bg-electric-blue text-white hover:bg-opacity-90',
        accent: 'bg-acid-lime text-deep-ink hover:bg-opacity-90',
      };
      const isSimActive = activeKey === actionKey;

      return (
        <button
          type="button"
          aria-label={ariaLabel || label}
          onClick={() => handlePress(actionKey, 'user')}
          className={cn(
            baseClass,
            variants[variant],
            isSimActive && 'sim-active',
            colSpan === 2 && 'col-span-2',
            isInteractive ? 'cursor-pointer' : 'cursor-default'
          )}
          style={{ paddingBottom: '100%', height: 0 }}
        >
          <span className="absolute inset-0 flex items-center justify-center">
            {label}
          </span>
        </button>
      );
    };

    const renderVatKey = () => (
      <div className="grid grid-rows-2 gap-1 rounded-lg overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        {(['VAT+', 'VAT-'] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-label={key === 'VAT+'
              ? (language === 'tr' ? `${t('calc.vat')} ekle` : `Add ${t('calc.vat')}`)
              : (language === 'tr' ? `${t('calc.vat')} çıkar` : `Remove ${t('calc.vat')}`)}
            onClick={() => handlePress(key, 'user')}
            className={cn(
              'calc-btn bg-acid-lime text-deep-ink font-mono text-[10px] sm:text-xs font-bold select-none',
              activeKey === key && 'sim-active'
            )}
          >
            {t('calc.vat')}{key.endsWith('+') ? '+' : '−'}
          </button>
        ))}
      </div>
    );

    return (
      <div ref={rootRef} className={cn('relative w-full max-w-[280px] sm:max-w-[340px] perspective-1000 mx-auto', className)}>
        <div
          className="absolute left-1/2 -top-24 w-3/4 -translate-x-1/2 h-32 bg-[#F9F7F1] text-deep-ink font-mono text-xs p-4 rounded-t-sm shadow-md overflow-hidden flex flex-col justify-end uppercase"
          style={{ transformOrigin: 'bottom center', zIndex: 0 }}
        >
          <div ref={receiptRef} className="overflow-y-auto no-scrollbar flex flex-col gap-1 w-full mask-image-bottom">
            {receipt.map((entry) => (
              <div key={entry.id} className={cn(
                'flex justify-between w-full',
                entry.kind === 'total' && 'border-t border-dashed border-deep-ink/30 pt-1 font-bold mt-1'
              )}>
                <span className="opacity-70">{getReceiptLabel(entry)}</span>
                <span>{formatCurrency(entry.amount)}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-white/50 to-transparent" />
        </div>

        <div className="calc-shadow relative z-10 bg-[#1A1C21] rounded-3xl p-4 sm:p-6 border border-white/5 flex flex-col gap-4 sm:gap-6 backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">Sayisal Pro</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-coral/50" />
                <div className="w-2 h-2 rounded-full bg-acid-lime/50" />
              </div>
            </div>

            <div className="bg-[#101114] rounded-xl p-4 flex flex-col items-end shadow-inner border border-white/5 h-24 justify-end relative overflow-hidden">
              <div className="absolute top-2 left-3 text-xs text-acid-lime/50 font-mono">
                {operator || ''}
              </div>
              <div
                className="text-3xl sm:text-4xl font-mono text-acid-lime tracking-tight tabular-nums truncate w-full text-right"
                style={{ textShadow: '0 0 10px rgba(217,255,67,0.3)' }}
              >
                {language === 'tr' ? display.replace('.', ',') : display}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {renderKey('C', 1, 'accent')}
            {renderKey('⌫')}
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

            {renderVatKey()}
            {renderKey('0')}
            {renderKey(
              language === 'tr' ? ',' : '.',
              1,
              'default',
              '.',
              language === 'tr' ? 'Ondalık ayırıcı' : 'Decimal point'
            )}
            {renderKey('=', 1, 'operator')}
          </div>
        </div>
      </div>
    );
  }
);

Calculator.displayName = 'Calculator';