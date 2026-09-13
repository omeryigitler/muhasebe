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
  visualVariant?: 'standard' | 'hardware';
}

type ReceiptEntryKind = 'entry' | 'operation' | 'total' | 'vat-add' | 'vat-remove';

interface ReceiptEntry {
  id: number;
  kind: ReceiptEntryKind;
  amount: number;
  operator?: string;
}

export const Calculator = forwardRef<CalculatorHandle, CalculatorProps>(
  ({ className, onInteract, isInteractive = true, visualVariant = 'standard' }, ref) => {
    const { t, language } = useLanguage();
    const finance = getFinanceLocale(language);
    const hardware = visualVariant === 'hardware';
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
          Enter: '=', Escape: 'C', Backspace: '⌫', '*': '×', '/': '÷', ',': language === 'tr' ? '.' : ',',
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

    const renderKey = (
      label: string,
      colSpan: number = 1,
      variant: 'default' | 'accent' | 'operator' | 'equals' = 'default',
      actionKey: string = label,
      ariaLabel?: string,
    ) => {
      const standardVariants = {
        default: 'bg-[#292B31] text-warm-paper hover:bg-[#33363D]',
        operator: 'bg-electric-blue text-white hover:bg-[#6474FF]',
        accent: 'bg-acid-lime text-deep-ink hover:bg-[#E1FF69]',
        equals: 'bg-electric-blue text-white hover:bg-[#6474FF]',
      };
      const hardwareVariants = {
        default: 'bg-[#24262B] text-[#F1EEE7] hover:bg-[#2D3036]',
        operator: 'bg-[#202228] text-[#F6F2E9] hover:bg-[#2B2E35] border border-electric-blue/15',
        accent: 'bg-acid-lime text-deep-ink hover:bg-[#E5FF77]',
        equals: 'bg-coral text-white hover:bg-[#FF7868]',
      };
      const variants = hardware ? hardwareVariants : standardVariants;

      return (
        <button
          type="button"
          aria-label={ariaLabel || label}
          onClick={() => handlePress(actionKey, 'user')}
          className={cn(
            hardware
              ? 'min-h-[48px] sm:min-h-[54px] rounded-[14px] flex items-center justify-center font-mono text-base sm:text-lg select-none transition-[transform,box-shadow,background-color] duration-100 [box-shadow:0_5px_0_#111318,0_10px_18px_rgba(0,0,0,.28),inset_0_1px_1px_rgba(255,255,255,.10)] active:translate-y-[4px] active:[box-shadow:0_1px_0_#111318,0_4px_8px_rgba(0,0,0,.28),inset_0_1px_1px_rgba(255,255,255,.08)]'
              : 'calc-btn min-h-[52px] sm:min-h-[58px] rounded-xl flex items-center justify-center font-mono text-lg sm:text-xl select-none',
            variants[variant],
            activeKey === actionKey && (hardware ? 'translate-y-[4px]' : 'sim-active'),
            colSpan === 2 && 'col-span-2'
          )}
        >
          {label}
        </button>
      );
    };

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
        className={cn(
          'native-cursor calculator-root relative w-full perspective-1000 mx-auto outline-none',
          hardware ? 'max-w-[330px] sm:max-w-[365px]' : 'max-w-[300px] sm:max-w-[350px]',
          className
        )}
      >
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 bg-[#F4EFE5] text-deep-ink font-mono shadow-xl overflow-hidden flex flex-col uppercase',
            hardware
              ? '-top-[118px] w-[72%] h-[142px] p-4 rounded-t-sm rotate-[-0.6deg] [box-shadow:0_-8px_24px_rgba(0,0,0,.14),0_10px_24px_rgba(0,0,0,.24)]'
              : '-top-[102px] w-[84%] h-[122px] p-4 rounded-t-md shadow-md'
          )}
          style={{ zIndex: 0 }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-deep-ink/12 text-[8px] sm:text-[9px] tracking-[0.18em] opacity-50">
            <span>{language === 'tr' ? 'İşlem fişi' : 'Calculation tape'}</span>
            <span>{finance.code}</span>
          </div>
          <div ref={receiptRef} className="mt-auto overflow-y-auto no-scrollbar flex flex-col gap-1 w-full mask-image-bottom text-[9px] sm:text-[10px]">
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

        <div
          className={cn(
            'relative z-10 flex flex-col',
            hardware
              ? 'bg-transparent p-3 sm:p-4 gap-3'
              : 'calc-shadow bg-[#1A1C21] rounded-[28px] p-4 sm:p-5 border border-white/8 gap-3.5 sm:gap-4'
          )}
        >
          <div className={cn('flex items-center justify-between', hardware ? 'px-2 pb-1' : 'px-1')}>
            <div>
              <p className={cn('font-mono uppercase', hardware ? 'text-[8px] text-white/38 tracking-[0.24em]' : 'text-[9px] text-white/28 tracking-[0.18em]')}>Sayısal / Calc</p>
              <p className={cn('font-mono uppercase mt-0.5', hardware ? 'text-[7px] text-white/25 tracking-[0.18em]' : 'text-[8px] text-white/18 tracking-[0.12em]')}>{finance.code} · {APP_CONFIG.vatRate}% {t('calc.vat')}</p>
            </div>
            {!hardware && (
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-coral/60" />
                <span className="w-2 h-2 rounded-full bg-acid-lime/60" />
              </div>
            )}
          </div>

          {hardware ? (
            <div className="grid grid-cols-[1fr_62px] sm:grid-cols-[1fr_70px] gap-3 items-stretch">
              <div className={cn('bg-[#090A0D]/95 rounded-[20px] px-4 py-3 min-h-[104px] flex flex-col items-end justify-end border overflow-hidden [box-shadow:inset_0_10px_30px_rgba(0,0,0,.65),inset_0_0_0_1px_rgba(255,255,255,.025),0_6px_12px_rgba(0,0,0,.24)]', error ? 'border-coral/50' : 'border-white/[0.045]')}>
                <div className="w-full flex items-center justify-between min-h-5 mb-1 font-mono text-[8px] uppercase tracking-[0.17em]">
                  <span className="text-white/18">{keyboardActive ? (language === 'tr' ? 'Klavye' : 'Keyboard') : ''}</span>
                  <span className="text-acid-lime/50">{operator || ''}</span>
                </div>
                <div aria-live="polite" aria-atomic="true" className={cn('w-full text-right font-mono tabular-nums truncate', error ? 'text-2xl text-coral' : 'text-[2rem] sm:text-[2.35rem] text-[#E9FF7A]')} style={!error ? { textShadow: '0 0 18px rgba(217,255,67,.28)' } : undefined}>
                  {formatLiveDisplay(display)}
                </div>
              </div>
              <div className="relative flex flex-col items-center justify-center rounded-[22px] border border-white/[0.045] bg-black/10 min-h-[104px]">
                <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_50%_55%,rgba(154,106,255,.18),transparent_55%)]" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[3px] bg-[conic-gradient(from_0deg,#7B8089,#E5E7EA,#666B74,#F0F1F3,#777C85)] [box-shadow:0_0_0_5px_rgba(154,106,255,.10),0_0_24px_rgba(154,106,255,.34),0_8px_14px_rgba(0,0,0,.36)]">
                  <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_34%_30%,#646870,#272A30_46%,#111217_72%)] border border-white/10" />
                </div>
                <span className="relative mt-2 font-mono text-[6px] uppercase tracking-[0.2em] text-white/24">Mode</span>
              </div>
            </div>
          ) : (
            <div className={cn('bg-[#0E0F12] rounded-2xl px-4 py-3 min-h-[92px] flex flex-col items-end justify-end shadow-inner border transition-colors overflow-hidden', error ? 'border-coral/50' : 'border-white/5')}>
              <div className="w-full flex items-center justify-between min-h-5 mb-1 font-mono text-[9px] uppercase tracking-[0.16em]">
                <span className="text-white/20">{keyboardActive ? (language === 'tr' ? 'Klavye aktif' : 'Keyboard active') : ''}</span>
                <span className="text-acid-lime/55">{operator || ''}</span>
              </div>
              <div aria-live="polite" aria-atomic="true" className={cn('w-full text-right font-mono tracking-tight tabular-nums truncate', error ? 'text-2xl text-coral' : 'text-3xl sm:text-[2.15rem] text-acid-lime')} style={!error ? { textShadow: '0 0 12px rgba(217,255,67,0.24)' } : undefined}>
                {formatLiveDisplay(display)}
              </div>
            </div>
          )}

          <div className={cn('grid grid-cols-2', hardware ? 'gap-2.5 mt-1' : 'gap-2')}>
            <button
              type="button"
              onClick={() => handlePress('VAT+', 'user')}
              className={cn(
                hardware
                  ? 'min-h-[48px] rounded-[14px] bg-acid-lime text-deep-ink font-mono text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1.5 [box-shadow:0_5px_0_#708513,0_10px_18px_rgba(0,0,0,.22),inset_0_1px_1px_rgba(255,255,255,.45)] active:translate-y-[4px]'
                  : 'calc-btn min-h-11 rounded-xl bg-acid-lime text-deep-ink font-mono text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5',
                activeKey === 'VAT+' && (hardware ? 'translate-y-[4px]' : 'sim-active')
              )}
            >
              <span>+</span><span>{t('calc.vat')}</span><span>{APP_CONFIG.vatRate}%</span>
            </button>
            <button
              type="button"
              onClick={() => handlePress('VAT-', 'user')}
              className={cn(
                hardware
                  ? 'min-h-[48px] rounded-[14px] bg-electric-blue text-white font-mono text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-1.5 [box-shadow:0_5px_0_#2733A8,0_10px_18px_rgba(0,0,0,.22),inset_0_1px_1px_rgba(255,255,255,.20)] active:translate-y-[4px]'
                  : 'calc-btn min-h-11 rounded-xl bg-[#F5F1E8] text-deep-ink font-mono text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5',
                activeKey === 'VAT-' && (hardware ? 'translate-y-[4px]' : 'sim-active')
              )}
            >
              <span>−</span><span>{t('calc.vat')}</span><span>{APP_CONFIG.vatRate}%</span>
            </button>
          </div>

          <div className={cn('grid grid-cols-4', hardware ? 'gap-2.5 sm:gap-3' : 'gap-2 sm:gap-2.5')}>
            {renderKey('C', 1, 'accent', 'C', language === 'tr' ? 'Temizle' : 'Clear')}
            {renderKey('⌫', 1, 'default', '⌫', language === 'tr' ? 'Geri sil' : 'Backspace')}
            {renderKey('%', 1, hardware ? 'default' : 'operator')}
            {renderKey('÷', 1, 'operator')}
            {renderKey('7')}{renderKey('8')}{renderKey('9')}{renderKey('×', 1, 'operator')}
            {renderKey('4')}{renderKey('5')}{renderKey('6')}{renderKey('−', 1, 'operator', '-')}
            {renderKey('1')}{renderKey('2')}{renderKey('3')}{renderKey('+', 1, 'operator')}
            {renderKey('0', 2)}
            {renderKey(language === 'tr' ? ',' : '.', 1, 'default', '.', language === 'tr' ? 'Ondalık ayırıcı' : 'Decimal point')}
            {renderKey('=', 1, hardware ? 'equals' : 'operator')}
          </div>
        </div>

        <p className={cn('mt-3 text-center font-mono uppercase tracking-[0.16em]', hardware ? 'text-[7px] sm:text-[8px] text-white/18' : 'text-[8px] sm:text-[9px] text-white/24')}>
          {isInteractive
            ? (language === 'tr' ? 'Tıkla veya odakla · Klavye destekli' : 'Click or focus · Keyboard enabled')
            : (language === 'tr' ? 'Canlı demo çalışıyor' : 'Live demo running')}
        </p>
      </div>
    );
  }
);

Calculator.displayName = 'Calculator';
