# Bug Solutions

## BUG-01: Prefix Autocomplete Ranked in Wrong Order

- **Where to see it in app:** Type `auto` in the search box. Suggestions appear in ascending order (`82%` before `98%`).
- **File to change:** `src/service.cpp`
- **Line:** Line 67
- **Change:**
  Change `<` to `>`:
  ```cpp
  return left.popularity > right.popularity;
  ```

---

## BUG-02: Full Search Only Checks Beginning of Phrase

- **Where to see it in app:** Type `search` in the search box and press **Enter**. It only shows `search suggestions` and misses `binary search`.
- **File to change:** `src/service.cpp`
- **Line:** Line 77
- **Change:**
  Change `candidate.rfind(needle, 0) == 0` to substring search `candidate.find(needle) != std::string::npos`:
  ```cpp
  if (needle.empty() || candidate.find(needle) != std::string::npos) {
  ```

---

## BUG-03: Spell Autocorrect Does Not Recover Close Typo

- **Where to see it in app:** Type `autocorect` in the search box. The "Did you mean autocorrect?" notice does not appear.
- **File to change:** `src/service.cpp`
- **Line:** Line 100
- **Change:**
  Change `return query;` to:
  ```cpp
  return closest ? closest->word : query;
  ```

---

## BUG-04: Empty Queries Do Not Respect Result Limit

- **Where to see it in app:** Clear the search field or click the `×` button. It displays all `20 matches` instead of limiting results.
- **File to change:** `src/service.cpp`
- **Line:** Line 69 (inside `TrieService::autocomplete`, right before `return result;`)
- **Change:**
  Add this line before `return result;`:
  ```cpp
  if (result.size() > limit) result.resize(limit);
  ```

