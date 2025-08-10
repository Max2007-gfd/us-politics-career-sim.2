import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Panel from '../components/Panel';
import { useGameStore } from '../state/useGame';
export default function Stakeholders() {
    const { state, meetStakeholder } = useGameStore();
    const actors = state.actors;
    return (_jsx(Panel, { title: "Stakeholders", children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { align: "left", children: "Name" }), _jsx("th", { align: "left", children: "Faction" }), _jsx("th", { children: "Disposition" }), _jsx("th", { children: "Leverage" }), _jsx("th", {})] }) }), _jsx("tbody", { children: actors.map(a => (_jsxs("tr", { style: { borderTop: '1px solid #2a2f55' }, children: [_jsx("td", { children: a.name }), _jsx("td", { children: a.faction }), _jsx("td", { align: "center", children: a.disposition }), _jsx("td", { align: "center", children: a.leverage }), _jsx("td", { align: "right", children: _jsx("button", { className: "btn", onClick: () => meetStakeholder(a.id), children: "Meet" }) })] }, a.id))) })] }) }));
}
