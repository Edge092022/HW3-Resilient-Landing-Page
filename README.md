# HW3 — Resilient Landing Page

A classroom project built with vanilla HTML, CSS, and JavaScript.

## Run locally

Open index.html in a modern browser, or serve the project using
the IDE's local development server. No installation or build step is required.

## Features

### Slice 1: UTC countdown

The deadline is defined by the datetime attribute of #launch-deadline
in index.html.

Accepted format: YYYY-MM-DDTHH:mm:ssZ.
Current deadline: 2026-12-31T17:00:00Z.

Each update derives the remaining duration from the deadline and Date.now().
The countdown refreshes when the tab becomes visible and clears its interval
when stopped or expired.

### Slice 2: Form state machine

Allowed transitions:

- Idle -> Submitting
- Submitting -> Success
- Submitting -> Error
- Error -> Submitting

Success is terminal until the page reloads.

Requests are simulated locally with a delay of approximately 1.5 seconds.
Use error@example.com to simulate failure.
Use another valid email address to simulate success.

### Slice 3: Submission safety

- Trim surrounding whitespace before validation.
- Validate required values, email format, and input lengths.
- Render user-controlled output using textContent.
- Set the Submitting state before asynchronous work.
- Reject repeated submissions while Submitting or Success.
- Disable controls while pending or successful.

## Project files

- index.html: Semantic page structure.
- styles.css: Responsive layout and visual styling.
- countdown.js: UTC countdown engine.
- form.js: State machine, validation, and simulated submission.
- TASK_DECOMPOSITION.md: Work breakdown, contracts, and acceptance criteria.
- VERIFICATION.md: Actual reported test results and remaining checks.
- AI_FAILURE_AUDIT.md: Genuine AI-induced defect records.
- evidence/: Captured test evidence.

## Verification

See VERIFICATION.md for observed results and outstanding checks.

## AI assistance

AI assistance was requested separately for planning, HTML, CSS,
countdown behavior, form states, and validation.

AI conversation link: https://chatgpt.com/share/6ad0cdcb-dd4c-83ec-9f4f-ebc3d93338f9

## Known limitations

- No backend or persistent signup storage is provided.
- Countdown accuracy depends on the device clock.
- Client-side duplicate prevention applies to the current page instance.
- The required three AI-induced defect records remain outstanding.