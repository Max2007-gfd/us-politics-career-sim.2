import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(err) { console.error('UI ErrorBoundary caught:', err); }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { className: "panel", children: [_jsx("h3", { children: "Something went wrong" }), _jsx("p", { className: "sub", children: "Please copy the diagnostics below when reporting the issue." }), _jsx("pre", { style: { whiteSpace: 'pre-wrap' }, children: String(this.state.error) })] }));
        }
        return this.props.children;
    }
}
