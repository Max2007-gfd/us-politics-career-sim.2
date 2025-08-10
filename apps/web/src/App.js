import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Stakeholders from './pages/Stakeholders';
import PolicyLab from './pages/PolicyLab';
import Casework from './pages/Casework';
import { ErrorBoundary } from './ErrorBoundary';
import SaveMenu from './components/SaveMenu';
export default function App() {
    const [tab, setTab] = useState('dash');
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { children: [_jsx("div", { style: { fontWeight: 700 }, children: "US Politics Career Sim" }), _jsxs("nav", { style: { display: 'flex', gap: 8 }, children: [_jsx("button", { className: "btn", onClick: () => setTab('dash'), children: "Dashboard" }), _jsx("button", { className: "btn", onClick: () => setTab('stake'), children: "Stakeholders" }), _jsx("button", { className: "btn", onClick: () => setTab('policy'), children: "Policy Lab" }), _jsx("button", { className: "btn", onClick: () => setTab('case'), children: "Casework" }), _jsx(SaveMenu, {})] })] }), _jsxs(ErrorBoundary, { children: [tab === 'dash' && _jsx(Dashboard, {}), tab === 'stake' && _jsx(Stakeholders, {}), tab === 'policy' && _jsx(PolicyLab, {}), tab === 'case' && _jsx(Casework, {})] }), _jsxs("footer", { children: [_jsx("div", { className: "sub", children: "v0.1.0 \u2014 governance-first vertical slice \u00B7 no elections" }), _jsx("div", { className: "sub", children: "\u00A9 You" })] })] }));
}
