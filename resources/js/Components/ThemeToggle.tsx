import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';
const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'system', label: 'Sistem', icon: Monitor },
    { value: 'light', label: 'Terang', icon: Sun },
    { value: 'dark', label: 'Gelap', icon: Moon },
];

function readMode(): ThemeMode {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === 'light' || v === 'dark') return v;
    } catch {}
    return 'system';
}

function applyMode(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    try {
        if (mode === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
}

export default function ThemeToggle({ className = '' }: { className?: string }) {
    const [mode, setMode] = useState<ThemeMode>('system');

    useEffect(() => setMode(readMode()), []);

    const choose = (value: ThemeMode) => {
        setMode(value);
        applyMode(value);
    };

    return (
        <div
            role="radiogroup"
            aria-label="Tema tampilan"
            className={`theme-light flex rounded-xl border border-slate-700/80 bg-slate-800/60 p-1 ${className}`}
        >
            {OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={mode === value}
                    onClick={() => choose(value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                        mode === value
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-slate-300 hover:bg-slate-700/80'
                    }`}
                >
                    <Icon size={14} />
                    {label}
                </button>
            ))}
        </div>
    );
}
