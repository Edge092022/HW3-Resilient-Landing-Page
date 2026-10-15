# HW3 Verification Report

## Test context

- Test date: 2026-10-15
- Application commit: 94afcb4
- Method: Manual browser testing performed by the student.
- Evidence: Screenshots retained in the evidence directory.
- Results below are student-reported; screenshots were not independently
  inspected by the AI because attachment access failed.

## Results

| Test | Observed result | Status |
| --- | --- | --- |
| Input validation | Invalid input was rejected with feedback. | Pass |
| XSS payload rendering | The payload was displayed literally. The check for an injected image inside the status element returned true for absence. | Pass |
| Double-submit prevention | Rapid repeated submissions produced one mock request. | Pass |
| Error and retry | The error scenario allowed a successful retry. | Pass |
| Countdown tab recovery | The countdown updated correctly after returning to the tab. | Pass |
| Responsive layout | No horizontal scrolling was observed at 375px. | Pass |
| Console with extensions enabled | Fatkun extension errors were observed; no application errors were observed. | Recorded |
| Console with extensions disabled | No console errors were observed during testing. | Pass |
| Name length limit | A programmatically assigned 81-character name was rejected. | Pass |
| Email length limit | A programmatically assigned 255-character email was rejected. | Pass |
| Past deadline | Displayed zero units and the launch-arrived message. | Pass |
| Missing UTC suffix | Rejected the timestamp without Z. | Pass |
| Invalid calendar date | Rejected February 30. | Pass |
## Remaining checks

These checks have not yet been reported as completed:

- UTC timezone invariance.
- Countdown recovery after a JavaScript breakpoint pause.
- Near-future expiry and interval cleanup.
- Past and invalid deadline handling.
- Final keyboard and accessibility review.

## Limitations

The form uses a local simulated request. No signup data is sent to a server.
Countdown accuracy depends on the device clock.
The XSS result applies to the tested payload and reviewed output context;
it is not a universal security certification.