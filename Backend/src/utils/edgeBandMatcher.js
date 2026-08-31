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
    const rawQuery = (input || '').trim().toUpperCase();
    
    // Default listing when no query is provided
    if (!rawQuery) {
        const scores = [100, 90, 80, 70];
        return candidates.map((band, idx) => ({
            _id: band._id,
            brand: band.brand,
            code: band.code,
            name: band.name,
            finish: band.finish,
            material: band.material,
            match: scores[idx % scores.length],
            dimensions: band.dimensions
        }));
    }

    const cleanQuery = rawQuery.replace(/[^A-Z0-9]/g, '');
    const queryDigits = rawQuery.replace(/[^0-9]/g, '');
    const queryTokens = rawQuery.split(/[^A-Z0-9]+/).filter(Boolean);

    const scored = candidates.map(band => {
        const target = band.code.toUpperCase();
        const cleanTarget = target.replace(/[^A-Z0-9]/g, '');
        const targetDigits = target.replace(/[^0-9]/g, '');
        const targetTokens = target.split(/[^A-Z0-9]+/).filter(Boolean);

        let match = 0;

        if (rawQuery === target || (cleanQuery && cleanQuery === cleanTarget)) {
            match = 100;
        } else if (cleanTarget.startsWith(cleanQuery) || cleanQuery.startsWith(cleanTarget)) {
            const ratio = cleanQuery.length / cleanTarget.length;
            match = ratio >= 0.7 ? 90 : 80;
        } else if (cleanTarget.includes(cleanQuery) && cleanQuery.length >= 2) {
            match = 85;
        } else {
            // Check token overlap (e.g. sharing "EB" or "MER" or digit parts)
            const sharedTokens = queryTokens.filter(t => targetTokens.includes(t) || cleanTarget.includes(t));
            if (sharedTokens.length > 0) {
                match = 80;
            } else if (queryDigits && targetDigits && (targetDigits.includes(queryDigits) || queryDigits.includes(targetDigits))) {
                match = 75;
            } else {
                const dist = levenshtein(cleanQuery, cleanTarget);
                if (dist <= 1) match = 90;
                else if (dist <= 2) match = 80;
                else if (dist <= 4) match = 70;
                else match = 0; // ponytail: truly unrelated — drop it
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
        .filter(s => s.match >= 70)
        .sort((a, b) => b.match - a.match)
        .slice(0, 50);
}
