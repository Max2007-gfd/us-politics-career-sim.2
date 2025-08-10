import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Panel({ title, children, right }) {
    return (_jsxs("div", { className: "panel", children: [_jsxs("div", { className: "row", style: { justifyContent: 'space-between' }, children: [_jsx("h3", { children: title }), right] }), _jsx("div", { style: { marginTop: 8 }, children: children })] }));
}
