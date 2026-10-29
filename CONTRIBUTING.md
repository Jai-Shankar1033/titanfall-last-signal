# Contributing

1. Fork and clone the repo, then run `npm install`.
2. Open `index.html` in a browser, or run `npm start` to serve it locally.
3. Run `npm test` before every commit. All checks must pass.
4. Open a pull request using the template.

## Ground rules
- Keep the game a single self-contained `index.html` with no external asset URLs.
- Do not change the Signal Surge, combo or boss-immunity rules without discussing it in an issue first; the tests encode them.
- Add or extend a test for any new gameplay rule, input handling or save field.
- Report whether you tested on a real device. Headless tests are not a substitute.
