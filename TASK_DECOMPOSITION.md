# HW3 — Resilient Landing Page

## Scope and source

Source: the HW3 assignment text supplied by the student in this conversation.
Use vanilla HTML, CSS, and JavaScript only. Work in D:\WD_HW3. Do not modify HW1 or HW2.
Deliver one responsive landing page with three slices: a UTC countdown, a state-machine form, and safe single-submission handling.
This document is a plan. No implementation or browser verification has been completed.

## 1. Work Breakdown Structure (WBS)

```text
HW3: Resilient Landing Page
|-- T-00 Planning and repository setup
|   |-- Define contracts, acceptance criteria, and verification
|   `-- Initialize the actual AI failure audit
|-- T-01 Semantic landing page foundation
|   |-- Header, main, sections, countdown, and labeled form
|   `-- Responsive styles and keyboard focus
|-- T-02 Slice 1: Drift-free countdown
|   |-- Parse and validate an explicit UTC ISO timestamp
|   |-- Recompute remaining time on every render
|   `-- Handle expiry, background recovery, and timer cleanup
|-- T-03 Slice 2: State-machine form
|   |-- Define allowed transitions and state rendering
|   `-- Demonstrate deterministic success, error, and retry
|-- T-04 Slice 3: Submission safety
|   |-- Validate and normalize input
|   |-- Render user input safely
|   `-- Prevent duplicate submissions synchronously
`-- T-05 Review and submission
    |-- Execute checks and capture genuine evidence
    |-- Record observed AI defects and verified fixes
    `-- Review Git history and prepare live defense
```

## 2. Contracts

### C-01: Structure and accessibility

- Use semantic landmarks, one h1, ordered heading levels, explicit form labels, and a real submit button.
- Use external CSS and JavaScript files, without frameworks, libraries, or CDNs.
- Support keyboard operation, visible focus, and a 375px viewport without horizontal scrolling.
- Announce form feedback through an appropriate live status region. Do not announce every countdown tick.

### C-02: Countdown / Slice 1

- Store one explicit UTC ISO 8601 deadline ending in Z, such as 2026-12-31T17:00:00Z. The final deadline is a configuration choice, not an assignment fact.
- Reject invalid configuration; never display NaN or silently interpret a local timestamp as UTC.
- On each update compute remaining milliseconds as max(0, deadlineEpochMs - Date.now()). Do not decrement a stored seconds counter.
- Derive displayed units from the newly computed duration; define rounding consistently.
- Render immediately, then refresh periodically. Timer callbacks schedule rendering; they are not the source of elapsed time.
- Resume accurately after tab throttling by recomputing when the page becomes visible.
- Own at most one countdown interval. Clear it on expiry and cleanup; restarting must not accumulate intervals or listeners.
- At expiry display zero and a clear expired message. Past deadlines must not start a repeating timer.
- Browser clock accuracy is assumed; this static exercise has no trusted server time.

### C-03: Form state machine / Slice 2

- States: Idle, Submitting, Success, Error.
- Allowed transitions: Idle -> Submitting; Submitting -> Success or Error; Error -> Submitting.
- Invalid input stays in Idle or Error, produces accessible field feedback, and starts no request.
- Success is terminal for this page session; reload starts a new session.
- A single state-rendering function controls status text, busy indication, and button availability.
- Use one form submit listener so click and Enter follow the same path.
- A local asynchronous mock transport must provide deterministic success and error scenarios. Label it as simulated; do not claim data was delivered to a server.
- Errors must leave the form usable for retry. A failed request must never show success.

### C-04: Validation and safe output / Slice 3

- Proposed fields: name (trimmed, 1–80 characters) and email (trimmed, required, valid email input, maximum 254 characters).
- Normalize surrounding whitespace before checking and using values. Do not remove arbitrary punctuation or claim that character stripping prevents XSS.
- Render all user-controlled values through textContent or text nodes. Never insert them using innerHTML, outerHTML, insertAdjacentHTML, document.write, eval, or inline event handlers.
- Keep user input out of executable code and dynamic URL/HTML contexts.
- At the start of the submit handler, reject requests while Submitting or Success. Enter Submitting synchronously before any asynchronous work.
- Disable the submit button while pending as an additional UI safeguard; the state guard is authoritative.
- One accepted pending submission must invoke the mock transport exactly once, including under rapid click/Enter attempts.
- Client validation is a browser UX check. A real backend would require independent validation and idempotency; neither is claimed by this static demo.
- The assignment's zero-XSS target is evaluated through code review of output sinks and recorded payload checks, not asserted as an unlimited security guarantee.

### C-05: Evidence and AI audit

- Never mark a check Passed until it has been executed and its result observed.
- Keep screenshots, logs, tested commit hashes, and exact reproduction steps where relevant.
- Record only genuine AI-induced defects in AI_FAILURE_AUDIT.md, including the original suggestion, observation, diagnosis, fix, and verification result.
- The assignment requires three documented AI-induced defects. This remains incomplete until three genuine defects are found and documented. Do not manufacture vulnerable implementations or relabel hypothetical risks as observed defects.
- Request implementation one subtask at a time. Review and test each change before committing and advancing.

## 3. Acceptance criteria and verification

All checks below are Not run.

| ID | Acceptance criterion | Verification steps | Status |
| --- | --- | --- | --- |
| V-01 | Semantic, responsive, keyboard-usable page | Inspect landmarks and labels; Tab through controls; inspect at 375px and desktop for overflow and focus | Not run |
| V-02 | Correct UTC deadline interpretation | Inspect the Z timestamp; compare its epoch value and remaining duration; change DevTools timezone and confirm the same deadline instant | Not run |
| V-03 | No accumulated countdown drift | Pause JS at a breakpoint for several seconds; resume and compare display with deadline minus current time, allowing display rounding and refresh latency | Not run |
| V-04 | Accurate background recovery | Background the tab, return, and compare the first refreshed display with the current timestamp calculation | Not run |
| V-05 | Safe expiry and configuration handling | Test near-future, past, and invalid deadlines; confirm zero at expiry, clear errors for invalid input, and no NaN or negative values | Not run |
| V-06 | No countdown resource accumulation | Review timer ownership and listener registration; use breakpoints to confirm expired timers stop and repeated initialization does not multiply callbacks | Not run |
| V-07 | Correct success path | Submit valid values in success mode; observe Idle -> Submitting -> Success and the terminal disabled control | Not run |
| V-08 | Correct error and retry path | Use error mode; observe Submitting -> Error; retry in success mode and observe Success | Not run |
| V-09 | Invalid inputs do not submit | Try empty/whitespace name, malformed email, and over-limit values; inspect field feedback and confirm zero mock calls | Not run |
| V-10 | No duplicate pending submission | Add a mock-transport breakpoint or counter; rapidly click and press Enter; verify exactly one transport invocation until completion | Not run |
| V-11 | User input stays inert | Enter <img src=x onerror=alert(1)> as the name in the local demo; confirm literal text output, no injected img node, and no alert; inspect every user-data output sink | Not run |
| V-12 | Clean runtime and truthful submission | Check console, review Git diffs/history, and verify evidence and audit statements against actual observations | Not run |

## 4. Atomic commit plan

Commit only the listed scope after its checks. These are planned messages, not existing commits.

| Order | Subtask | Commit message | Intended scope |
| --- | --- | --- | --- |
| 1 | T-00 | docs: define HW3 contracts and audit template | TASK_DECOMPOSITION.md and AI_FAILURE_AUDIT.md |
| 2 | T-01 HTML | feat(html): add semantic landing page structure | index.html only |
| 3 | T-01 CSS | feat(css): add responsive landing page styles | styles.css and its stylesheet link only |
| 4 | T-02 / Slice 1 | feat(countdown): derive UTC countdown from current time | Countdown JavaScript and script wiring |
| 5 | T-03 / Slice 2 | feat(form): add explicit submission state machine | Form state transitions and mock transport |
| 6 | T-04 / Slice 3 | feat(form): validate input and guard safe submissions | Validation, safe text rendering, duplicate guard |
| 7 | T-05 | docs: record verification evidence and AI defect audit | Verified report, evidence, and submission notes |

Essential safety guards should already be present in the state-machine draft; Slice 3 reviews and completes them. Do not deliberately commit unsafe code to create audit entries. If a real defect is found, use a separate specific fix commit and record its actual hash. Do not split unchanged work or fabricate defects merely to increase the commit count.

## 5. Evidence and submission checklist

- [ ] Record browser, viewport, test date, tested commit, expected result, actual result, and evidence path for each executed check.
- [ ] Capture desktop and mobile views, countdown recovery/expiry, success/error/retry, duplicate-submit invocation count, and inert user-input rendering.
- [ ] Complete three genuine AI defect records, or explicitly report the current shortfall without inventing evidence.
- [ ] Add README.md with local run instructions, UTC deadline, mock behavior, verification results, limitations, and AI conversation link.
- [ ] Ensure Git history contains at least five meaningful atomic commits, including all three slices.
- [ ] Check git status and git log; push to the HW3 repository and verify the repository link.
- [ ] Confirm the instructor's required submission channel and artifacts; no specific channel was supplied in the pasted HW3 text.

## 6. Live defense preparation

Explain Date.now(), UTC Z, timestamp subtraction, rounding, background throttling, timer cleanup, allowed form transitions, the synchronous submission guard, textContent versus HTML parsing, and why browser validation does not replace server validation.
For every commit, explain what changed, why it belongs to that slice, and which observed checks support it.
