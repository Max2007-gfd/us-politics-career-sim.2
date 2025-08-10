import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import Panel from '../components/Panel';
import { useGameStore } from '../state/useGame';
export default function Casework() {
    const { state, solveCase } = useGameStore();
    const q = state.caseworkQueue;
    return (_jsxs(Panel, { title: "Casework", children: [_jsxs("div", { className: "sub", children: ["Tickets in queue: ", q.length] }), _jsxs("div", { style: { display: 'grid', gap: 8, marginTop: 8 }, children: [q.map(t => (_jsxs("div", { className: "panel", style: { padding: 8 }, children: [_jsxs("div", { className: "row", children: [_jsx("div", { className: "grow", children: _jsx("b", { children: t.title }) }), _jsxs("span", { className: "sub", children: ["Urgency: ", t.urgency] })] }), _jsx("div", { className: "sub", children: t.description }), _jsx("div", { style: { marginTop: 8 }, children: _jsx("button", { className: "btn", onClick: () => solveCase(t.id), children: "Resolve" }) })] }, t.id))), q.length === 0 && _jsx("div", { className: "sub", children: "All caught up." })] })] }));
}
