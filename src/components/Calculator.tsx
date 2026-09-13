import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { cn } from '../utils/cn';
import { APP_CONFIG, getFinanceLocale } from '../config';
import { useLanguage } from '../context/LanguageContext';
import './CalculatorV3.css';

export type CalculatorDemoPreset = 'bookkeeping' | 'vat' | 'payroll' | 'reporting';

export type CalculatorHandle = {
  simulatePress: (key: string) => void;
  setDisplay: (val: string) => void;
  setDemo: (preset: CalculatorDemoPreset) => void;
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
    const [error, setError] = useState<string | null>(null);
    const [keyboardActive, setKeyboardActive] = useState(false);

    const rootRef = useRef<HTMLDivElement>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

    const toDisplayValue = (num: number) => {
      if (!Number.isFinite(num)) return '0';
      const rounded = Math.round((num + Number.EPSILON) * 100000000) / 100000000;
      return String(rounded);
    };

    const parseDisplay = () => {
      const value = Number(display);
      return Number.isFinite(value) ? value : 0;
    };

    const resetCore = () => {
      setDisplay('0');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(false);
      setReceipt([]);
      setError(null);
    };

    const addToReceipt = (kind: ReceiptEntryKind, amount: number, entryOperator?: string) => {
      setReceipt((current) => [
        ...current,
        { id: Date.now() + Math.random(), kind, amount, operator: entryOperator },
      ]);
    };

    const makeReceipt = (entries: Array<Omit<ReceiptEntry, 'id'>>) => {
      const base = Date.now();
      return entries.map((entry, index) => ({ ...entry, id: base + index }));
    };

    const formatCurrency = (num: number) => new Intl.NumberFormat(finance.locale, {
      style: 'currency',
      currency: finance.code,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);

    const formatLiveDisplay = (raw: string) => {
      if (error) return error;

      const negative = raw.startsWith('-');
      const unsigned = negative ? raw.slice(1) : raw;
      const hasDecimal = unsigned.includes('.');
      const [integerPart = '0', fractionPart = ''] = unsigned.split('.');
      const integerValue = Number(integerPart || '0');
      const grouped = new Intl.NumberFormat(finance.locale, {
        useGrouping: true,
        maximumFractionDigits: 0,
      }).format(Number.isFinite(integerValue) ? integerValue : 0);
      const decimal = language === 'tr' ? ',' : '.';

      return `${negative ? '-' : ''}${finance.symbol}${grouped}${hasDecimal ? `${decimal}${fractionPart}` : ''}`;
    };

    const getReceiptLabel = (entry: ReceiptEntry) => {
      switch (entry.kind) {
        case 'entry': return t('calc.entry');
        case 'operation': return entry.operator || '';
        case 'total': return t('calc.total');
        case 'vat-add': return `+ ${t('calc.vat')} ${APP_CONFIG.vatRate}%`;
        case 'vat-remove': return `− ${t('calc.vat')} ${APP_CONFIG.vatRate}%`;
        default: return '';
      }
    };

    const calculate = (a: number, b: number, op: string): number | null => {
      switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        case '÷': return b === 0 ? null : a / b;
        default: return b;
      }
    };

    const fail = () => {
      setError(language === 'tr' ? 'HATA' : 'ERROR');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);
    };

    const setDemo = (preset: CalculatorDemoPreset) => {
      setError(null);
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(true);

      if (preset === 'bookkeeping') {
        setDisplay('5795');
        setReceipt(makeReceipt([
          { kind: 'entry', amount: 4820 },
          { kind: 'operation', amount: 975, operator: '+' },
          { kind: 'total', amount: 5795 },
        ]));
        return;
      }

      if (preset === 'vat') {
        setDisplay('6954');
        setReceipt(makeReceipt([
          { kind: 'entry', amount: 5795 },
          { kind: 'vat-add', amount: 1159 },
          { kind: 'total', amount: 6954 },
        ]));
        return;
      }

      if (preset === 'payroll') {
        setDisplay('42000');
        setReceipt(makeReceipt([
          { kind: 'entry', amount: 32500 },
          { kind: 'operation', amount: 9500, operator: '+' },
          { kind: 'total', amount: 42000 },
        ]));
        return;
      }

      setDisplay('14750');
      setReceipt(makeReceipt([
        { kind: 'entry', amount: 34200 },
        { kind: 'operation', amount: 19450, operator: '−' },
        { kind: 'total', amount: 14750 },
      ]));
    };

    const handlePress = (key: string, source: 'user' | 'simulation' = 'user') => {
      if (source === 'user') onInteract?.();

      if (error) {
        if (key === 'C') {
          resetCore();
          return;
        }
        if (/[0-9]/.test(key) || key === '.') {
          setError(null);
          setPreviousValue(null);
          setOperator(null);
          setWaitingForNewValue(false);
          setReceipt([]);
          setDisplay(key === '.' ? '0.' : key);
        }
        return;
      }

      if (/[0-9]/.test(key)) {
        if (waitingForNewValue) {
          setDisplay(key);
          setWaitingForNewValue(false);
        } else {
          setDisplay(display === '0' ? key : display + key);
        }
        return;
      }

      if (key === '.') {
        if (waitingForNewValue) {
          setDisplay('0.');
          setWaitingForNewValue(false);
        } else if (!display.includes('.')) {
          setDisplay(display + '.');
        }
        return;
      }

      if (key === 'C') {
        resetCore();
        return;
      }

      if (key === '⌫') {
        if (!waitingForNewValue) setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
        return;
      }

      if (['+', '-', '×', '÷'].includes(key)) {
        const currentNum = parseDisplay();
        if (previousValue === null) {
          setPreviousValue(currentNum);
          addToReceipt('entry', currentNum);
        } else if (operator && !waitingForNewValue) {
          const result = calculate(previousValue, currentNum, operator);
          if (result === null) {
            fail();
            return;
          }
          setDisplay(toDisplayValue(result));
          setPreviousValue(result);
          addToReceipt('operation', currentNum, operator);
          addToReceipt('total', result);
        }
        setOperator(key);
        setWaitingForNewValue(true);
        return;
      }

      if (key === '=') {
        const currentNum = parseDisplay();
        if (operator && previousValue !== null) {
          const result = calculate(previousValue, currentNum, operator);
          if (result === null) {
            fail();
            return;
          }
          setDisplay(toDisplayValue(result));
          addToReceipt('operation', currentNum, operator);
          addToReceipt('total', result);
          setPreviousValue(null);
          setOperator(null);
          setWaitingForNewValue(true);
        }
        return;
      }

      if (key === '%') {
        const currentNum = parseDisplay();
        let percentageValue = currentNum / 100;
        if (previousValue !== null && operator && ['+', '-'].includes(operator)) {
          percentageValue = previousValue * (currentNum / 100);
        }
        setDisplay(toDisplayValue(percentageValue));
        setWaitingForNewValue(false);
        return;
      }

      if (key === 'VAT+') {
        const currentNum = parseDisplay();
        const vatAmount = currentNum * (APP_CONFIG.vatRate / 100);
        const total = currentNum + vatAmount;
        setDisplay(toDisplayValue(total));
        addToReceipt('entry', currentNum);
        addToReceipt('vat-add', vatAmount);
        addToReceipt('total', total);
        setWaitingForNewValue(true);
        return;
      }

      if (key === 'VAT-') {
        const currentNum = parseDisplay();
        const net = currentNum / (1 + APP_CONFIG.vatRate / 100);
        const vatAmount = currentNum - net;
        setDisplay(toDisplayValue(net));
        addToReceipt('entry', currentNum);
        addToReceipt('vat-remove', vatAmount);
        addToReceipt('total', net);
        setWaitingForNewValue(true);
      }
    };

    useImperativeHandle(ref, () => ({
      simulatePress: (key) => {
        setActiveKey(key);
        handlePress(key, 'simulation');
        window.setTimeout(() => setActiveKey(null), 140);
      },
      setDisplay: (value) => {
        setError(null);
        setDisplay(value);
      },
      setDemo,
    }));

    useEffect(() => {
      if (receiptRef.current) receiptRef.current.scrollTop = receiptRef.current.scrollHeight;
    }, [receipt]);

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.metaKey || event.ctrlKey || event.altKey) return;

        const root = rootRef.current;
        const activeElement = document.activeElement as HTMLElement | null;
        if (!root || !activeElement || !root.contains(activeElement)) return;
        if (activeElement.matches('input, textarea, select, [contenteditable="true"]')) return;
        if (activeElement instanceof HTMLButtonElement && (event.key === 'Enter' || event.key === ' ')) return;

        const keyMap: Record<string, string> = {
          Enter: '=',
          Escape: 'C',
          Backspace: '⌫',
          '*': '×',
          '/': '÷',
          ',': language === 'tr' ? '.' : ',',
        };
        const mappedKey = keyMap[event.key] || event.key;
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','×','÷','=','C','⌫','%'];

        if (validKeys.includes(mappedKey)) {
          event.preventDefault();
          setActiveKey(mappedKey);
          handlePress(mappedKey, 'user');
          window.setTimeout(() => setActiveKey(null), 140);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, previousValue, operator, waitingForNewValue, error, language]);

    const pressVisual = (key: string) => setActiveKey(key);
    const releaseVisual = () => setActiveKey(null);

    const renderKey = (
      label: string,
      colSpan: number = 1,
      variant: 'default' | 'accent' | 'operator' | 'equals' = 'default',
      actionKey: string = label,
      ariaLabel?: string,
    ) => (
      <button
        type="button"
        aria-label={ariaLabel || label}
        onPointerDown={() => pressVisual(actionKey)}
        onPointerUp={releaseVisual}
        onPointerCancel={releaseVisual}
        onPointerLeave={releaseVisual}
        onClick={() => handlePress(actionKey, 'user')}
        className={cn(
          'pc3-key',
          variant === 'operator' && 'pc3-key-operator',
          variant === 'accent' && 'pc3-key-accent',
          variant === 'equals' && 'pc3-key-equals',
          activeKey === actionKey && 'is-pressed',
          colSpan === 2 && 'pc3-key-wide'
        )}
      >
        {label}
      </button>
    );

    return (
      <div
        ref={rootRef}
        tabIndex={0}
        aria-label={language === 'tr' ? 'Sayısal hesap makinesi. Klavye kullanmak için odaklayın.' : 'Sayısal calculator. Focus to use the keyboard.'}
        onFocusCapture={() => setKeyboardActive(true)}
        onBlurCapture={() => window.requestAnimationFrame(() => setKeyboardActive(Boolean(rootRef.current?.contains(document.activeElement))))}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (!target.closest('button')) rootRef.current?.focus({ preventScroll: true });
        }}
        className={cn('native-cursor pc3-scene w-full max-w-[430px] mx-auto outline-none', className)}
      >
        <div className="pc3-ambient" aria-hidden="true" />

        <div className="pc3-device">
          <div className="pc3-receipt" aria-hidden="true">
            <div className="pc3-receipt-head">
              <span>{language === 'tr' ? 'İşlem fişi' : 'Calculation tape'}</span>
              <span>{finance.code}</span>
            </div>
            <div ref={receiptRef} className="pc3-receipt-lines no-scrollbar">
              {receipt.length === 0 ? (
                <div className="pc3-receipt-line is-empty">
                  <span>{language === 'tr' ? 'Hazır' : 'Ready'}</span>
                  <span>{formatCurrency(0)}</span>
                </div>
              ) : receipt.map((entry) => (
                <div key={entry.id} className={cn('pc3-receipt-line', entry.kind === 'total' && 'is-total')}>
                  <span>{getReceiptLabel(entry)}</span>
                  <span>{formatCurrency(entry.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pc3-topdeck" aria-hidden="true">
            <div className="pc3-slot" />
          </div>

          <div className="pc3-brandrow">
            <div>
              <p className="pc3-brand">SAYISAL / CALC</p>
              <p className="pc3-meta">{finance.code} · {APP_CONFIG.vatRate}% {t('calc.vat')}</p>
            </div>
            <div className="pc3-status" aria-hidden="true">
              <span className="pc3-statusdot pc3-statusdot-coral" />
              <span className="pc3-statusdot pc3-statusdot-lime" />
            </div>
          </div>

          <div className="pc3-console">
            <div className={cn('pc3-display', error && 'is-error')}>
              <div className="pc3-display-meta">
                <span>{keyboardActive ? (language === 'tr' ? 'Klavye aktif' : 'Keyboard active') : (language === 'tr' ? 'Hazır' : 'Ready')}</span>
                <span>{operator || ''}</span>
              </div>
              <div aria-live="polite" aria-atomic="true" className={cn('pc3-value', error && 'is-error')}>
                {formatLiveDisplay(display)}
              </div>
            </div>

            <div className="pc3-knob-panel" aria-hidden="true">
              <div className="pc3-knob" />
              <span>MODE</span>
            </div>
          </div>

          <div className="pc3-vat-row">
            <button
              type="button"
              onPointerDown={() => pressVisual('VAT+')}
              onPointerUp={releaseVisual}
              onPointerCancel={releaseVisual}
              onPointerLeave={releaseVisual}
              onClick={() => handlePress('VAT+', 'user')}
              className={cn('pc3-key pc3-vat-plus', activeKey === 'VAT+' && 'is-pressed')}
            >
              <span>+</span><span>{t('calc.vat')}</span><span>{APP_CONFIG.vatRate}%</span>
            </button>
            <button
              type="button"
              onPointerDown={() => pressVisual('VAT-')}
              onPointerUp={releaseVisual}
              onPointerCancel={releaseVisual}
              onPointerLeave={releaseVisual}
              onClick={() => handlePress('VAT-', 'user')}
              className={cn('pc3-key pc3-vat-minus', activeKey === 'VAT-' && 'is-pressed')}
            >
              <span>−</span><span>{t('calc.vat')}</span><span>{APP_CONFIG.vatRate}%</span>
            </button>
          </div>

          <div className="pc3-keypad">
            {renderKey('C', 1, 'accent', 'C', language === 'tr' ? 'Temizle' : 'Clear')}
            {renderKey('⌫', 1, 'default', '⌫', language === 'tr' ? 'Geri sil' : 'Backspace')}
            {renderKey('%', 1, 'operator')}
            {renderKey('÷', 1, 'operator')}

            {renderKey('7')}{renderKey('8')}{renderKey('9')}{renderKey('×', 1, 'operator')}
            {renderKey('4')}{renderKey('5')}{renderKey('6')}{renderKey('−', 1, 'operator', '-')}
            {renderKey('1')}{renderKey('2')}{renderKey('3')}{renderKey('+', 1, 'operator')}
            {renderKey('0', 2)}
            {renderKey(language === 'tr' ? ',' : '.', 1, 'default', '.', language === 'tr' ? 'Ondalık ayırıcı' : 'Decimal point')}
            {renderKey('=', 1, 'equals')}
          </div>

          <div className="pc3-reflection" aria-hidden="true" />
        </div>

        <p className="pc3-caption">
          {isInteractive
            ? (language === 'tr' ? 'Tıkla veya odakla · Klavye destekli' : 'Click or focus · Keyboard enabled')
            : (language === 'tr' ? 'Canlı demo çalışıyor' : 'Live demo running')}
        </p>
      </div>
    );
  }
);

Calculator.displayName = 'Calculator';
