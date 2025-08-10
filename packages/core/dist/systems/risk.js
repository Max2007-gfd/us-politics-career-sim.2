export const scandalRisk = (integrity, aggressive) => {
    const base = 0.02 + (aggressive ? 0.03 : 0);
    const mod = (100 - integrity) / 100 * 0.2;
    return base + mod;
};
