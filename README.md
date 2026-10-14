# Spell Checker

Suggests the closest dictionary words for whatever you type. Matches are ranked by a weighted edit distance: identical letters cost 0, a vowel-for-vowel or consonant-for-consonant swap costs 1, mixing a vowel and a consonant costs 3, and inserting or deleting a letter costs 2. The page lists the ten lowest scores.

The hosted page is https://78tacos.github.io/Spell-Checker/.

To run it locally, serve this directory over HTTP and open `index.html`. The word list is fetched from `dictionary.txt`, which a browser will not load from a `file://` URL.
