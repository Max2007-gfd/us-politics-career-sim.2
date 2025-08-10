import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Panel from '../components/Panel';
import { useGameStore } from '../state/useGame';
export default function PolicyLab() {
    const { state, draftPolicy } = useGameStore();
    const [issueId, setIssueId] = useState(state.issues[0]?.id ?? 'issue:housing');
    const [instrument, setInstrument] = useState('program');
    const issue = state.issues.find(i => i.id === issueId);
    return (_jsxs(Panel, { title: "Policy Lab", children: [_jsxs("div", { className: "row", style: { gap: 10 }, children: [_jsx("select", { value: issueId, onChange: e => setIssueId(e.target.value), children: state.issues.map(i => _jsx("option", { value: i.id, children: i.name }, i.id)) }), _jsx("select", { value: instrument, onChange: e => setInstrument(e.target.value), children: ['tax', 'regulation', 'subsidy', 'zoning', 'program'].map(x => _jsx("option", { value: x, children: x }, x)) }), _jsx("button", { className: "btn", onClick: () => draftPolicy(issueId, instrument), children: "Draft" })] }), issue && (_jsxs("div", { style: { marginTop: 10 }, className: "sub", children: ["Cost: ", issue.cost, " \u00B7 Controversy: ", issue.controversy, " \u00B7 Expertise: ", issue.expertiseNeeded] }))] }));
}
