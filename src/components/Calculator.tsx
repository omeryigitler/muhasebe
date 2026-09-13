import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { cn } from '../utils/cn';
import { APP_CONFIG, getFinanceLocale } from '../config';
import { useLanguage } from '../context/LanguageContext';

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

    const resetCore = () => {
      setDisplay('0');
      setPreviousValue(null);
      setOperator(null);
      setWaitingForNewValue(false);
      setReceipt([]);
      setError(null);
    };

    const addToReceipt = (kind: ReceiptEntryKind, amount: number, entryOperator?: string) => {
      setReceipt((prev) => [...prev, {
        id: Date.now() + Math.random(),
        kind,
        amount,
        operator: entryOperator,
      }]);
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
      } else if (preset === 'vat') {
        setDisplay('6954');
        setReceipt(makeReceipt([
          { kind: 'entry', amount: 5795 },
          { kind: 'vat-add', amount: 1159 },
          { kind: 'total', amount: 6954 },
        ]));
      } else if (preset === 'payroll') {
        setDisplay('42000');
        setReceipt(makeReceipt([
          { kind: 'entry', amount: 32500 },
          { kind: 'operation', amount: 9500, operator: '+' },
          { kind: 'total', amount: 42000 },
        ]));
      } else {
        setDisplay('14750');
        setReceipt(makeReceipt([
          { kind: 'entry', amount: 34200 },
          { kind: 'operation', amount: 19450, operator: '−' },
          { kind: 'total', amount: 14750 },
        ]));
      }
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
        if (waitingForNewValue) return;
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
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
        window.setTimeout(() => setActiveKey(null), 150);
      },
      setDisplay: (val) => {
        setError(null);
        setDisplay(val);
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
          window.setTimeout(() => setActiveKey(null), 150);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [display, previousValue, operator, waitingForNewValue, error, language]);

    const handleTilt = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      event.currentTarget.style.setProperty('--tilt-x', `${(-y * 5 + 2.4).toFixed(2)}deg`);
      event.currentTarget.style.setProperty('--tilt-y', `${(x * 7 - 4).toFixed(2)}deg`);
    };

    const resetTilt = (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.style.setProperty('--tilt-x', '2.4deg');
      event.currentTarget.style.setProperty('--tilt-y', '-4deg');
    };

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
        onClick={() => handlePress(actionKey, 'user')}
        className={cn(
          'physical-key',
          variant === 'operator' && 'physical-key-operator',
          variant === 'accent' && 'physical-key-accent',
          variant === 'equals' && 'physical-key-equals',
          activeKey === actionKey && 'sim-active',
          colSpan === 2 && 'col-span-2'
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
        onPointerMove={handleTilt}
        onPointerLeave={resetTilt}
        className={cn('native-cursor physical-calc-scene w-full max-w-[430px] mx-auto outline-none', className)}
      >
        <div className="physical-calc-glow" aria-hidden="true" />

        <div className="physical-calc-receipt" aria-hidden={receipt.length === 0 ? undefined : undefined}>
          <div className="flex items-center justify-between pb-2 border-b border-deep-ink/12 text-[8px] sm:text-[9px] tracking-[0.18em] opacity-50">
            <span>{language === 'tr' ? 'İşlem fişi' : 'Calculation tape'}</span>
            <span>{finance.code}</span>
          </div>
          <div ref={receiptRef} className="mt-auto overflow-y-auto no-scrollbar flex flex-col gap-1 w-full mask-image-bottom">
            {receipt.length === 0 ? (
              <div className="flex justify-between opacity-30"><span>—</span><span>{formatCurrency(0)}</span></div>
            ) : receipt.map((entry) => (
              <div key={entry.id} className={cn('flex justify-between gap-3 w-full', entry.kind === 'total' && 'border-t border-dashed border-deep-ink/30 pt-1 font-bold mt-1')}>
                <span className="opacity-70 truncate">{getReceiptLabel(entry)}</span>
                <span className="tabular-nums shrink-0">{formatCurrency(entry.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="physical-calc-device">
          <div className="physical-calc-slot" aria-hidden="true" />

          <div className="physical-calc-brandrow">
            <div>
              <p className="font-mono text-[9px] text-white/32 tracking-[0.18em] uppercase">Sayısal / Calc</p>
              <p className="font-mono text-[8px] text-white/18 tracking-[0.12em] uppercase mt-0.5">{finance.code} · {APP_CONFIG.vatRate}% {t('calc.vat')}</p>
            </div>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="physical-led bg-coral" />
              <span className="physical-led bg-acid-lime" />
            </div>
          </div>

          <div className="physical-calc-console">
            <div className={cn('physical-calc-display', error && 'is-error')}>
              <div className="flex items-center justify-between min-h-5 mb-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em]">
                <span className="text-white/18">{keyboardActive ? (language === 'tr' ? 'Klavye aktif' : 'Keyboard active') : (language === 'tr' ? 'Hazır' : 'Ready')}</span>
                <span className="text-acid-lime/55">{operator || ''}</span>
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className={cn('w-full text-right font-mono tracking-[-0.04em] tabular-nums truncate', error ? 'text-2xl text-coral' : 'text-[2rem] sm:text-[2.45rem] text-acid-lime')}
              >
                {formatLiveDisplay(display)}
              </div>
            </div>

            <div className="physical-knob-panel" aria-hidden="true">
              <div className="physical-knob"><span /></div>
              <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/22">Mode</span>
            </div>
          </div>

          <div className="physical-calc-vat-row">
            <button
              type="button"
              onClick={() => handlePress('VAT+', 'user')}
              className={cn('physical-key physical-key-vat-plus', activeKey === 'VAT+' && 'sim-active')}
            >
              <span>+</span><span>{t('calc.vat')}</span><span>{APP_CONFIG.vatRate}%</span>
            </button>
            <button
              type="button"
              onClick={() => handlePress('VAT-', 'user')}
              className={cn('physical-key physical-key-vat-minus', activeKey === 'VAT-' && 'sim-active')}
            >
              <span>−</span><span>{t('calc.vat')}</span><span>{APP_CONFIG.vatRate}%</span>
            </button>
          </div>

          <div className="physical-calc-keypad">
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

          <div className="physical-calc-footlight" aria-hidden="true" />
        </div>

        <p className="mt-4 text-center font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-white/24">
          {isInteractive
            ? (language === 'tr' ? 'Tıkla veya odakla · Klavye destekli' : 'Click or focus · Keyboard enabled')
            : (language === 'tr' ? 'Canlı demo çalışıyor' : 'Live demo running')}
        </p>
      </div>
    );
  }
);

Calculator.displayName = 'Calculator';
