import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Panel from '../components/Panel';
import { useGameStore } from '../state/useGame';
export default function Stakeholders() {
    const state = useGameStore(s => s.state);
    const meet = useGameStore(s => s.meetStakeholder);
    const askEndorse = useGameStore(s => s.askForEndorsement);
    const actors = state.actors ?? [];
    return (_jsx(Panel, { title: "Stakeholders", children: _jsx("div", { className: "table-scroll", children: _jsxs("table", { className: "table-fixed", children: [_jsxs("colgroup", { children: [_jsx("col", { style: { width: '38%' } }), _jsx("col", { style: { width: '18%' } }), _jsx("col", { style: { width: '14%' } }), _jsx("col", { style: { width: '14%' } }), _jsx("col", { style: { width: '16%' } })] }), _jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { align: "left", children: "Name" }), _jsx("th", { align: "left", children: "Faction" }), _jsx("th", { children: "Disposition" }), _jsx("th", { children: "Leverage" }), _jsx("th", {})] }) }), _jsx("tbody", { children: actors.map((a) => {
                            const disp = typeof a.disposition === 'number' ? a.disposition : 0;
                            const lev = typeof a.leverage === 'number' ? a.leverage : 0;
                            const endorsed = a.endorsed === true;
                            const eligible = !endorsed && disp + lev >= 8; // UI gate; store does final check
                            return (_jsxs("tr", { style: { borderTop: '1px solid #2a2f55' }, children: [_jsxs("td", { className: "td-ellipsis", children: [a.name, endorsed && (_jsx("span", { style: {
                                                    marginLeft: 8,
                                                    fontSize: 12,
                                                    padding: '2px 6px',
                                                    borderRadius: 999,
                                                    border: '1px solid #22c55e',
                                                    color: '#22c55e',
                                                    background: 'rgba(34,197,94,0.08)',
                                                }, title: "This stakeholder has endorsed you", children: "\u2713 Endorsed" }))] }), _jsx("td", { className: "td-ellipsis", children: a.faction }), _jsx("td", { align: "center", children: disp }), _jsx("td", { align: "center", children: lev }), _jsx("td", { align: "right", children: _jsxs("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' }, children: [_jsx("button", { className: "btn", onClick: () => meet(a.id), title: "Meet to build relationship", children: "Meet" }), _jsx("button", { className: "btn", disabled: !eligible, onClick: () => askEndorse(a.id), title: eligible ? 'Ask for Endorsement' : 'Build disposition/leverage first', children: "Ask Endorsement" })] }) })] }, a.id));
                        }) })] }) }) }));
}
