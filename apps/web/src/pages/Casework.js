import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import Panel from '../components/Panel';
import { useGameStore } from '../state/useGame';
import { fmtMoney } from '../lib/format';
export default function Dashboard() {
    const { state, nextWeek, doAction, clearLog, exportSave, importSave, quickSave, quickLoad } = useGameStore();
    const [showLog, setShowLog] = useState(true);
    const [filter, setFilter] = useState('all');
    const [autoSave, setAutoSave] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const logRef = useRef(null);
    const fileRef = useRef(null);
    // Remember toggle + autosave prefs
    useEffect(() => {
        const rawShow = localStorage.getItem('usp:showLog');
        if (rawShow !== null)
            setShowLog(rawShow === '1');
        const rawAuto = localStorage.getItem('usp:autoSave');
        if (rawAuto !== null)
            setAutoSave(rawAuto === '1');
    }, []);
    useEffect(() => {
        localStorage.setItem('usp:showLog', showLog ? '1' : '0');
    }, [showLog]);
    useEffect(() => {
        localStorage.setItem('usp:autoSave', autoSave ? '1' : '0');
    }, [autoSave]);
    // Auto-scroll to newest entry
    useEffect(() => {
        if (!showLog || !logRef.current)
            return;
        logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [state.log.length, showLog]);
    // Optional: autosave every time the week number changes
    useEffect(() => {
        if (!autoSave)
            return;
        quickSave();
        flash('Autosaved');
    }, [state.week]); // eslint-disable-line react-hooks/exhaustive-deps
    const filteredLog = filter === 'all' ? state.log : state.log.filter(l => l.level === filter);
    // File export/import
    const handleExport = () => {
        const json = exportSave();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
        a.href = url;
        a.download = `usp-save-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        flash('Exported save');
    };
    const handleImportClick = () => fileRef.current?.click();
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const text = await file.text();
        const res = importSave(text);
        if (!res.ok)
            alert(`Import failed: ${res.error}`);
        else
            flash('Imported save');
        e.target.value = '';
    };
    // Quick save/load
    const doQuickSave = () => { quickSave(); flash('Quick saved'); };
    const doQuickLoad = () => {
        const res = quickLoad();
        if (!res.ok)
            alert(res.error);
        else
            flash('Quick loaded');
    };
    // Tiny “toast” helper
    const flash = (msg) => {
        setSaveMsg(msg);
        setTimeout(() => setSaveMsg(''), 1600);
    };
    return (_jsxs("div", { className: "row", style: { gap: 12 }, children: [_jsxs("div", { style: { width: 300, display: 'grid', gap: 12 }, children: [_jsxs(Panel, { title: "Candidate", right: _jsxs("span", { className: "sub", children: ["Seed: ", state.seed] }), children: [_jsx("div", { className: "row", children: _jsxs("div", { className: "grow", children: [_jsxs("div", { className: "sub", children: [state.player.name, " \u00B7 ", state.player.party] }), _jsxs("div", { className: "sub", children: ["District: ", state.district.name] })] }) }), _jsxs("div", { style: { display: 'grid', gap: 6, marginTop: 6 }, children: [_jsxs("div", { className: "stat", children: ["Goodwill: ", state.stats.goodwill] }), _jsxs("div", { className: "stat", children: ["Integrity: ", state.stats.integrity] }), _jsxs("div", { className: "stat", children: ["Capital: ", state.stats.capital] }), _jsxs("div", { className: "stat", children: ["Favor Chips: ", state.favors.chips] }), _jsxs("div", { className: "stat", children: ["Funds: ", fmtMoney(state.funds)] })] })] }), _jsxs(Panel, { title: "Calendar", children: [_jsxs("div", { className: "sub", children: ["Week ", state.week, " \u2014 Blocks left: ", state.calendar.blocksLeft] }), _jsxs("div", { style: { display: 'grid', gap: 8, marginTop: 8 }, children: [_jsx("button", { className: "btn", onClick: () => doAction('meet-stakeholder'), children: "Meet Stakeholder" }), _jsx("button", { className: "btn", onClick: () => doAction('solve-case'), children: "Solve Casework" }), _jsx("button", { className: "btn", onClick: () => doAction('draft-policy'), children: "Draft Policy" }), _jsx("button", { className: "btn", onClick: () => doAction('redeem-favor'), children: "Redeem Favor" }), _jsx("button", { className: "btn", onClick: () => doAction('fundraise-lite'), children: "Fundraise (Lite)" }), _jsx("button", { className: "btn", onClick: nextWeek, children: "End Week" })] })] })] }), _jsxs("div", { className: "grow", style: { display: 'grid', gap: 12 }, children: [_jsx(Panel, { title: "Activity Log", right: _jsxs("div", { className: "row", style: { gap: 8 }, children: [_jsxs("select", { className: "btn", value: filter, onChange: e => setFilter(e.target.value), children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "good", children: "Good" }), _jsx("option", { value: "warn", children: "Warnings" }), _jsx("option", { value: "error", children: "Errors" })] }), _jsx("button", { className: "btn", onClick: clearLog, children: "Clear" }), _jsx("button", { className: "btn", onClick: () => setShowLog(s => !s), children: showLog ? 'Hide' : 'Show' })] }), children: _jsx("div", { ref: logRef, className: "log", style: {
                                height: showLog ? 360 : 0,
                                overflowY: showLog ? 'auto' : 'hidden',
                                padding: showLog ? 10 : 0,
                                transition: 'height 180ms ease'
                            }, "aria-hidden": !showLog, children: filteredLog.slice().reverse().map(l => (_jsxs("div", { className: `log-line level-${l.level}`, children: [_jsx("span", { className: "ts", children: new Date(l.t).toLocaleTimeString() }), l.tag && _jsx("span", { className: "tag", children: l.tag }), _jsx("span", { className: "msg", children: l.msg })] }, l.id))) }) }), _jsx(Panel, { title: "Notes", children: _jsx("div", { className: "sub", children: "This is a governance-first career sim vertical slice. No elections in v0.1.0." }) }), _jsxs(Panel, { title: "Save / Load", children: [_jsxs("div", { className: "row", style: { gap: 8, flexWrap: 'wrap', alignItems: 'center' }, children: [_jsx("button", { className: "btn", onClick: handleExport, children: "Export Save" }), _jsx("button", { className: "btn", onClick: handleImportClick, children: "Import Save" }), _jsx("button", { className: "btn", onClick: doQuickSave, children: "Quick Save" }), _jsx("button", { className: "btn", onClick: doQuickLoad, children: "Quick Load" }), _jsxs("label", { className: "row", style: { gap: 6 }, children: [_jsx("input", { type: "checkbox", checked: autoSave, onChange: e => setAutoSave(e.target.checked) }), _jsx("span", { className: "sub", children: "Autosave weekly" })] }), _jsx("input", { ref: fileRef, type: "file", accept: "application/json", style: { display: 'none' }, onChange: handleFileChange })] }), !!saveMsg && _jsx("div", { className: "sub", style: { marginTop: 8 }, children: saveMsg })] })] })] }));
}
