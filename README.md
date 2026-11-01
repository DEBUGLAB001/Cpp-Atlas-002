# Atlas Search — Product Discovery & Trie Autocomplete Engine

## 1. Your Mission: Investigate & Fix the Bugs

You are a C++ Developer working on Atlas Search, a product discovery application designed to help users find relevant resources through instant autocomplete, ranked search results, and typo recovery. The QA team has identified four critical issues affecting autocomplete ranking, substring search discovery, spell autocorrect, and unbounded empty-query results.

Your responsibility is to investigate the existing codebase, reproduce each issue, identify its root cause, and implement reliable fixes without disrupting existing functionality.

All bug demonstration captures are also archived together in the Catbox Album: https://catbox.moe/c/a9fy9w

### BUG-01: Prefix Autocomplete Is Ranked in the Wrong Order

Problem: Prefix autocomplete returns matching suggestions in ascending popularity order instead of descending relevance order, surfacing lower-popularity results first.

How to identify it: Open the Live Preview and type `auto` in the search field. Do not press Enter; this is the autocomplete view. Observe that the three matching suggestions appear in ascending relevance order (`autocomplete api` at 82%, `autocorrect` at 96%, and `autocomplete` at 98%).

Your task: Ensure autocomplete suggestions are sorted in descending order of popularity so that the highest relevance match appears first (`autocomplete` at 98%, `autocorrect` at 96%, and `autocomplete api` at 82%).

<p align="center">
  <img src="https://files.catbox.moe/tv4p4b.png" alt="BUG-01: Prefix Autocomplete Is Ranked in the Wrong Order" width="720" />
</p>

### BUG-02: Full Search Only Checks the Beginning of a Phrase

Problem: Full search matching only inspects whether the query matches the beginning of an indexed phrase (`rfind(needle, 0) == 0`), failing to discover matching resources where the search term appears later in the phrase.

How to identify it: Enter `search` in the search field and press Enter (or click Search ↵) to switch from autocomplete to full search. Observe that the search results show only one match (`search suggestions` at 94%) and completely miss `binary search` (91%), even though the word `search` appears in that phrase.

Your task: Ensure search evaluates whether the query occurs anywhere within indexed terms, returning both `search suggestions` and `binary search` in descending relevance order.

<p align="center">
  <img src="https://files.catbox.moe/aag14z.png" alt="BUG-02: Full Search Only Checks the Beginning of a Phrase" width="720" />
</p>

### BUG-03: Spell Autocorrect Does Not Recover a Close Typo

Problem: When an input query contains a close misspelling of an indexed term, the autocorrect routine identifies the closest match via edit distance but inadvertently returns the original misspelled query string instead of the suggested correction, preventing the "Did you mean" recovery prompt from rendering.

How to identify it: Type the misspelled word `autocorect` (single `r` after `o`) into the search field. Observe that the search interface displays no matching resources and fails to show a "Did you mean autocorrect?" correction suggestion.

Your task: Ensure the autocorrect routine returns the closest matching catalog term, enabling the UI to surface the `Did you mean autocorrect?` suggestion and allow users to recover their intended search term.

<p align="center">
  <img src="https://files.catbox.moe/mium1m.png" alt="BUG-03: Spell Autocorrect Does Not Recover a Close Typo" width="720" />
</p>

### BUG-04: Empty-Query Suggestions Ignore the Result Limit

Problem: When a query is cleared or empty, the prefix autocomplete function returns all 20 indexed resources from the catalog at once, completely ignoring the configured suggestion limit.

How to identify it: Type any search query and then click the `×` clear control (or delete all query text). Observe that the results counter reports `20 matches` and renders the entire unfiltered catalog in an unnecessarily long, unbounded list.

Your task: Ensure empty-query autocomplete requests respect the configured result limit (e.g. maximum 6 items), returning a bounded suggestion list ranked consistently by relevance rather than rendering the entire catalog.

<p align="center">
  <img src="https://files.catbox.moe/pkeorv.png" alt="BUG-04: Empty-Query Suggestions Ignore the Result Limit" width="720" />
</p>

## 2. Get Familiar With the Application

Atlas Search is a lightweight product search workspace for discovering relevant content quickly. It demonstrates instant autocomplete, ranked search suggestions, spell checking, and autocorrect through an interactive web interface backed by a fast in-memory search index.

Core Features:

Prefix Autocomplete: Instant typeahead suggestions powered by an in-memory prefix trie data structure.

Full Search: Comprehensive substring search across resource titles and categories.

Spell Checking & Typo Recovery: Dynamic programming Levenshtein edit-distance calculation suggesting corrections for close typos.

Relevance Ranking: Score and sort search results and suggestions by popularity and relevance.

Resource Catalog: Pre-indexed catalog spanning Algorithms, Search, Learning, Productivity, Infrastructure, and Engineering.

Interactive Search Workspace: Live suggestions, keyboard navigation, clear controls, and index statistics.

## 3. Expected Behaviour After Fixing the Bugs

Once all reported issues have been resolved, the application should behave as follows:

Prefix Autocomplete: Typing a prefix immediately shows only matching autocomplete suggestions ranked with the highest relevance first.

Full Search: Searching for a term matches any phrase containing the query substring anywhere, returning all matching resources ranked by relevance.

Spell Autocorrect: Entering a close typo surfaces a clickable `Did you mean <word>?` suggestion without replacing the user's input until clicked.

Empty Input & Limits: Clearing the search input or requesting suggestions for an empty prefix safely respects the configured limit and presents bounded suggestions without dumping the entire catalog.

All existing application functionality must continue working as expected.

## 4. Integrated Terminal Commands

Your workspace provides an integrated terminal to execute the following commands:

Start the Development Server

```bash
sh start.sh
```

Starts the Atlas Search application locally so you can interact with it through the Live Preview. (On Windows: run `.\build\server.exe` or `.\start.sh`).

Run Automated Tests

```bash
bash tests/run_tests.sh
```

Executes the available automated test suite to verify your implementation and identify unresolved issues. (On Windows: run `.\build\challenge_tests.exe` or compile `tests/test_service.cpp`).

Use the Live Preview alongside the terminal to observe application behaviour and verify your changes.

## 5. Workspace Guidelines & Submission

You have access to the complete application codebase, an interactive Live Preview, an integrated terminal, and an AI-powered coding assistant.

Available Workspace Tools:

Code Editor: Explore and modify the existing source code.

Live Preview: Interact with the application and reproduce the four reported bugs.

Integrated Terminal: Start the development server and execute automated tests.

AI Assistant: Ask for explanations, debugging guidance, and help understanding unfamiliar code.

Hard Reset Policy:

The workspace includes a Hard Reset option that restores the challenge to its original state.

Maximum of 2 Hard Reset activations.

A minimum cooldown of 10 minutes between consecutive activations.

Resetting discards your current code changes and restores the original challenge files.

Use Hard Reset carefully, as your progress will be lost.

Before Submission:

Resolve all four reported bugs.

Verify the fixes through the Live Preview.

Run the automated tests.

Ensure existing application functionality remains intact.

Once satisfied, submit your implementation through DEBUG//LAB.

Your solution will be evaluated using automated test cases, including hidden test cases that verify the correctness of your implementation.
