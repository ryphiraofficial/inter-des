/**
 * Edge band code matching engine.
 *
 * Normalizes hyphens, spaces, and special characters to compare alphanumeric strings.
 * Scores:
 *   100% — Exact code match (with or without hyphens/spaces)
 *    90% — Very close match (prefix match or 1 character diff)
 *    80% — Close match (substring/number match or 2 character diff)
 *    70% — Partial match (3 character diff or segment match)
 *   <70% — Filtered out
 */

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

/**
 * @param {string} input — designer-entered code
 * @param {Array<{code, name, brand, finish, material, dimensions, _id}>} candidates — full EdgeBand docs for a brand
 * @returns {Array<{code, name, brand, finish, material, match, dimensions, _id}>} sorted desc by match, filtered ≥70
 */
export function matchEdgeBands(input, candidates) {
    const rawQuery = input.trim().toUpperCase();
    if (!rawQuery) return [];

    const cleanQuery = rawQuery.replace(/[^A-Z0-9]/g, '');

    const scored = candidates.map(band => {
        const target = band.code.toUpperCase();
        const cleanTarget = target.replace(/[^A-Z0-9]/g, '');

        let match = 0;

        if (rawQuery === target || (cleanQuery && cleanQuery === cleanTarget)) {
            match = 100;
        } else if (cleanTarget.startsWith(cleanQuery) || cleanQuery.startsWith(cleanTarget)) {
            const ratio = cleanQuery.length / cleanTarget.length;
            if (ratio >= 0.7) {
                match = 90;
            } else {
                match = 80;
            }
        } else if (cleanTarget.includes(cleanQuery) && cleanQuery.length >= 3) {
            match = 80;
        } else {
            const dist = levenshtein(cleanQuery, cleanTarget);
            if (dist <= 1) {
                match = 90;
            } else if (dist <= 2) {
                match = 80;
            } else if (dist <= 3) {
                match = 70;
            } else {
                match = 0;
            }
        }

        return {
            _id: band._id,
            brand: band.brand,
            code: band.code,
            name: band.name,
            finish: band.finish,
            material: band.material,
            match,
            dimensions: band.dimensions
        };
    });

    return scored
        .filter(r => r.match >= 70)
        .sort((a, b) => b.match - a.match)
        .slice(0, 10);
}
