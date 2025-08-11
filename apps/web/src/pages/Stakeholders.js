import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Panel from '../components/Panel';
import { useGameStore } from '../state/useGame';
export default function Stakeholders() {
    const { state, meetStakeholder, requestEndorsement } = useGameStore();
    const rows = state.actors;
    return (_jsx("div", { style: { maxWidth: 1000 }, children: _jsx(Panel, { title: "Stakeholders", children: _jsx("div", { className: "scroll-x", children: _jsxs("table", { className: "table table-stakeholders", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Faction" }), _jsx("th", { children: "Disposition" }), _jsx("th", { children: "Leverage" }), _jsx("th", { style: { width: 90 } }), _jsx("th", { style: { width: 140 } })] }) }), _jsx("tbody", { children: rows.map(a => {
                                const weeksSince = a.lastEndorseAskWeek == null ? 99 : state.week - a.lastEndorseAskWeek;
                                const onCooldown = weeksSince < 4;
                                const canAsk = !a.endorsed && !onCooldown && state.calendar.blocksLeft > 0;
                                const cooldownText = onCooldown ? ` (${4 - weeksSince}w)` : '';
                                return (_jsxs("tr", { children: [_jsxs("td", { className: "name", children: [a.name, ' ', a.endorsed && _jsx("span", { className: "badge badge-good", title: "They have endorsed you", children: "Endorsed" })] }), _jsx("td", { children: a.faction }), _jsx("td", { children: a.disposition }), _jsx("td", { children: a.leverage }), _jsx("td", { style: { textAlign: 'right' }, children: _jsx("button", { className: "btn", onClick: () => meetStakeholder(a.id), children: "Meet" }) }), _jsx("td", { style: { textAlign: 'right' }, children: _jsx("button", { className: "btn", onClick: () => requestEndorsement(a.id), disabled: !canAsk, title: a.endorsed ? 'Already endorsed'
                                                    : onCooldown ? `Asked recently${cooldownText}`
                                                        : state.calendar.blocksLeft <= 0 ? 'No time blocks left'
                                                            : a.disposition < 5 ? 'Relationship too weak'
                                                                : 'Ask for endorsement', children: a.endorsed ? 'Endorsed' : onCooldown ? `Wait${cooldownText}` : 'Ask Endorsement' }) })] }, a.id));
                            }) })] }) }) }) }));
}
