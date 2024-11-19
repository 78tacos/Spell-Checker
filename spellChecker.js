// Utility functions for the spell checker
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const CONSONANTS = new Set(
    'bcdfghjklmnpqrstvwxyz'.split('')
);

// Function to calculate penalty using sequence alignment
function calculatePenalty(word1, word2) {
    const n = word1.length;
    const m = word2.length;

    // Initialize DP table
    const dp = Array.from({ length: n + 1 }, () =>
        Array(m + 1).fill(0)
    );

    // Gap penalties
    for (let i = 0; i <= n; i++) dp[i][0] = i * 2;
    for (let j = 0; j <= m; j++) dp[0][j] = j * 2;

    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const matchCost =
                word1[i - 1] === word2[j - 1]
                    ? 0
                    : VOWELS.has(word1[i - 1]) === VOWELS.has(word2[j - 1])
                    ? 1
                    : 3;

            dp[i][j] = Math.min(
                dp[i - 1][j - 1] + matchCost, // Match/mismatch
                dp[i - 1][j] + 2, // Gap in word2
                dp[i][j - 1] + 2 // Gap in word1
            );
        }
    }

    return dp[n][m];
}

// Get top 10 suggestions
function getSuggestions(inputWord, dictionary) {
    const scores = dictionary.map((word) => ({
        word,
        penalty: calculatePenalty(inputWord, word),
    }));

    scores.sort((a, b) => a.penalty - b.penalty);
    return scores.slice(0, 10).map((entry) => entry.word);
}

// Event listener for the button
document.getElementById('checkButton').addEventListener('click', () => {
    const inputWord = document.getElementById('wordInput').value.toLowerCase();
    if (!inputWord) return;

    const suggestions = getSuggestions(inputWord, dictionary);

    const suggestionsList = document.getElementById('suggestionsList');
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach((suggestion) => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
});
