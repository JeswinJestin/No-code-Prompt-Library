# Changelog

## Unreleased

- Standardized skill invocation syntax to `/skill` across the UI and copy actions.
- Added backward-compatible parsing so older `@skill` input can still be used in search where applicable.
- Fixed the embedded Assistant back button so it exits the iframe correctly (uses `target=_top`).
- Added button audit tests to prevent regressions.
