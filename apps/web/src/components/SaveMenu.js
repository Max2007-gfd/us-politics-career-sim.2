import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../state/useGame';
const AUTO_KEY = 'usp:autoSave';
const NOTES_KEY = 'usp:notes';
const AUTO_EVT = 'usp:autoSaveChanged';
export default function SaveMenu() {
    const { exportSave, importSave, quickSave, quickLoad } = useGameStore();
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState('');
    const [autoSave, setAutoSave] = useState(false);
    const [notes, setNotes] = useState('');
    const rootRef = useRef(null);
    const fileRef = useRef(null);
    const saveTimer = useRef(null);
    // Load persisted settings on mount
    useEffect(() => {
        const rawAuto = localStorage.getItem(AUTO_KEY);
        if (rawAuto !== null)
            setAutoSave(rawAuto === '1');
        const rawNotes = localStorage.getItem(NOTES_KEY);
        if (rawNotes !== null)
            setNotes(rawNotes);
    }, []);
    // Close dropdown on outside click / Esc
    useEffect(() => {
        const onDocClick = (e) => {
            if (!rootRef.current)
                return;
            if (!rootRef.current.contains(e.target))
                setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape')
                setOpen(false);
        };
        document.addEventListener('click', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);
    const handleExport = () => {
        const raw = exportSave();
        const blob = new Blob([raw], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        a.href = url;
        a.download = `usp-save-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToast('Exported');
        window.setTimeout(() => setToast(''), 1000);
    };
    const handleImportClick = () => {
        fileRef.current?.click();
    };
    const handleImportFile = async (e) => {
        const f = e.target.files?.[0];
        if (!f)
            return;
        try {
            const text = await f.text();
            const res = importSave(text);
            if (res.ok) {
                setToast('Imported');
                window.setTimeout(() => setToast(''), 1000);
            }
            else {
                alert(res.error || 'Import failed');
            }
        }
        catch {
            alert('Import failed');
        }
        finally {
            if (fileRef.current)
                fileRef.current.value = '';
        }
    };
    return (_jsxs("div", { ref: rootRef, style: { position: 'relative' }, children: [_jsx("button", { className: "btn", onClick: () => setOpen(v => !v), children: "Save" }), open && (_jsxs("div", { className: "menu", style: {
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    minWidth: 300,
                    background: 'var(--panel, #fff)',
                    border: '1px solid var(--border, #e5e5e5)',
                    borderRadius: 10,
                    padding: 10,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 20,
                }, children: [toast && (_jsx("div", { style: {
                            position: 'absolute',
                            top: -8,
                            right: 8,
                            transform: 'translateY(-100%)',
                            background: 'var(--panel, #fff)',
                            border: '1px solid var(--border, #e5e5e5)',
                            borderRadius: 8,
                            padding: '4px 8px',
                            fontSize: 12,
                            opacity: 0.9,
                        }, children: toast })), _jsxs("div", { className: "col", style: { gap: 8, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { className: "row", style: { gap: 8, display: 'flex' }, children: [_jsx("button", { className: "btn", onClick: handleExport, children: "Export Save" }), _jsx("button", { className: "btn", onClick: handleImportClick, children: "Import Save" }), _jsx("button", { className: "btn", onClick: () => {
                                            quickSave();
                                            setToast('Quick Saved');
                                            window.setTimeout(() => setToast(''), 1000);
                                        }, children: "Quick Save" }), _jsx("button", { className: "btn", onClick: () => {
                                            const res = quickLoad();
                                            if (!res.ok) {
                                                alert(res.error || 'No quick save found');
                                                return;
                                            }
                                            setToast('Quick Loaded');
                                            window.setTimeout(() => setToast(''), 1000);
                                        }, children: "Quick Load" })] }), _jsxs("label", { className: "row", style: { gap: 8, marginTop: 6, display: 'flex', alignItems: 'center' }, children: [_jsx("input", { type: "checkbox", checked: autoSave, onChange: e => {
                                            const checked = e.target.checked;
                                            setAutoSave(checked);
                                            try {
                                                localStorage.setItem(AUTO_KEY, checked ? '1' : '0');
                                            }
                                            catch { }
                                            window.dispatchEvent(new CustomEvent(AUTO_EVT, { detail: checked }));
                                            setToast(checked ? 'Autosave ON' : 'Autosave OFF');
                                            window.setTimeout(() => setToast(''), 1200);
                                        } }), _jsx("span", { className: "sub", children: "Autosave weekly" })] }), _jsx("hr", { style: { margin: '10px 0', opacity: 0.2 } }), _jsxs("div", { className: "col", style: { gap: 6, display: 'flex', flexDirection: 'column' }, children: [_jsxs("div", { className: "row", style: { justifyContent: 'space-between', alignItems: 'center', display: 'flex' }, children: [_jsx("span", { className: "sub", style: { fontWeight: 600 }, children: "Personal Notes" }), _jsxs("span", { className: "sub", title: "Character count", children: [notes.length, " chars"] })] }), _jsx("textarea", { value: notes, onChange: (e) => {
                                            const v = e.target.value;
                                            setNotes(v);
                                            if (saveTimer.current !== null)
                                                window.clearTimeout(saveTimer.current);
                                            saveTimer.current = window.setTimeout(() => {
                                                try {
                                                    localStorage.setItem(NOTES_KEY, v);
                                                }
                                                catch { }
                                                setToast('Saved');
                                                window.setTimeout(() => setToast(''), 900);
                                            }, 250);
                                        }, rows: 6, placeholder: "Jot down campaign ideas, TODOs, or state-specific thoughts\u2026", style: {
                                            width: '100%',
                                            resize: 'vertical',
                                            padding: 8,
                                            border: '1px solid var(--border, #ddd)',
                                            borderRadius: 8,
                                            fontFamily: 'inherit',
                                        } }), _jsxs("div", { className: "row", style: { gap: 8, justifyContent: 'flex-end', display: 'flex' }, children: [_jsx("button", { className: "btn", onClick: () => {
                                                    if (!notes)
                                                        return;
                                                    const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    const ts = new Date().toISOString().replace(/[:.]/g, '-');
                                                    a.download = `usp-notes-${ts}.txt`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                    URL.revokeObjectURL(url);
                                                }, children: "Export .txt" }), _jsx("button", { className: "btn", onClick: () => {
                                                    if (!notes)
                                                        return;
                                                    if (!confirm('Clear all notes? This cannot be undone.'))
                                                        return;
                                                    setNotes('');
                                                    try {
                                                        localStorage.setItem(NOTES_KEY, '');
                                                    }
                                                    catch { }
                                                    setToast('Saved');
                                                    window.setTimeout(() => setToast(''), 900);
                                                }, children: "Clear" })] })] })] })] })), _jsx("input", { ref: fileRef, type: "file", accept: "application/json,.json", style: { display: 'none' }, onChange: handleImportFile })] }));
}
