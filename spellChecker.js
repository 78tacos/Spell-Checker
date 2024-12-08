const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const CONSONANTS = new Set(
    'bcdfghjklmnpqrstvwxyz'.split('')
);

let dictionary = [];

function calculatePenalty(word1, word2) {
    const n = word1.length;
    const m = word2.length;

    // Initialize DP table
    const dp = Array.from({ length: n + 1 }, () =>
        Array(m + 1).fill(0)
    );

    // Gap penalties, O(nm)
    for (let i = 0; i <= n; i++) dp[i][0] = i * 2;
    for (let j = 0; j <= m; j++) dp[0][j] = j * 2;

    // Fill DP table
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const matchCost = 
                word1[i - 1] === word2[j - 1]
                ? 0 // Exact match
                : (VOWELS.has(word1[i - 1]) && VOWELS.has(word2[j - 1])) ||
                (CONSONANTS.has(word1[i - 1]) && CONSONANTS.has(word2[j - 1])) // Only vowels and consonants are handled
                ? 1 // Both are vowels or both are consonants
                : 3; // Mismatch between a vowel and a consonant

            dp[i][j] = Math.min(
                dp[i - 1][j - 1] + matchCost, // Match/mismatch
                dp[i - 1][j] + 2, // Gap in word2
                dp[i][j - 1] + 2 // Gap in word1
            );
        }
    }

    return dp[n][m];
}

function getSuggestions(inputWord) {
    const scores = dictionary.map((word) => ({
        word,
        penalty: calculatePenalty(inputWord, word),
    }));

    scores.sort((a, b) => a.penalty - b.penalty);
    return scores.slice(0, 10).map((entry) => entry.word);
}

// Load dictionary
function loadDictionary(filePath) {
    fetch(filePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load dictionary: ${response.statusText}`);
            }
            return response.text();
        })
        .then((text) => {
            // Process dictionary.txt file
            dictionary = text
                .split('\n')
                .map((line) => line.trim().toLowerCase())
                .filter((word) => word); // in case there are empty lines
            
            console.log('Dictionary loaded successfully');
            document.getElementById('checkButton').disabled = false;
        })
}

function handleSpellCheck() {
    const inputWord = document.getElementById('wordInput').value.toLowerCase();
    if (!inputWord) return;

    const suggestions = getSuggestions(inputWord);

        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = ''; // Clear previous suggestions (but it doesn't seem to work)

    suggestions.forEach((suggestion) => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        suggestionsList.appendChild(li);
    });
}

// The spell checker
document.addEventListener('DOMContentLoaded', () => {
    loadDictionary('dictionary.txt'); // Load dictionary

    // click
    document.getElementById('checkButton').addEventListener('click', handleSpellCheck);

    // enter key
    document.getElementById('wordInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSpellCheck();
        }
    });
});
