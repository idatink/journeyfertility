# Clinic data sharing terms

**Status:** Draft for legal review
**Version:** 0.1
**Date:** 20 July 2026
**Applies to:** enquiries passed from JourneyFertility to a listed clinic

> **Draft, not legal advice.** Written from the implemented system so the
> technical detail is accurate, but the contractual terms need review by
> qualified counsel before use. Items marked **[LEGAL]** need a lawyer's
> decision; items marked **[CONFIRM]** need facts from the business.
>
> **Not yet implemented:** there is currently no mechanism by which a clinic
> receives an enquiry (see §3). These terms define what must be built.

---

## 1. Parties

| Role | Party |
|---|---|
| Referrer | **[CONFIRM]** JourneyFertility legal entity and company number |
| Clinic | The licensed fertility clinic named in the schedule |

## 2. Relationship of the parties

**The parties are independent controllers. Neither is the other's processor.**

This is the foundational point and it should be stated explicitly in the signed
agreement, because it determines who answers for what.

JourneyFertility decides what it collects and why. On receipt, the clinic
decides for itself how to respond, what to record and how to treat the person as
a prospective patient. It does not act on JourneyFertility's instructions, which
is what would make it a processor.

Consequences:

- Each party is separately responsible for its own compliance
- Neither party may bind the other
- Article 28 processor terms do not apply; this is a controller-to-controller
  disclosure made on the individual's explicit consent
- **[LEGAL]** confirm this analysis, and confirm it is not joint controllership
  under Article 26. The assessment here is that it is not, because the parties do
  not jointly determine purposes and means — the handover is sequential, not
  shared

## 3. How enquiries are delivered

**To be implemented.** The agreement must name one method. Recommended:

| Option | Mechanism | Notes |
|---|---|---|
| **A — Pull (recommended to start)** | Clinic polls an authenticated endpoint for its open enquiries | Simplest, no clinic infrastructure required, no delivery-failure states |
| B — Webhook | JourneyFertility POSTs to a clinic endpoint, signed and retried | Faster, but requires the clinic to host and secure an endpoint |
| C — Email | Notification only, with details retrieved by logging in | Never send the enquiry contents by unencrypted email |

**Whichever is chosen, enquiry contents must not be sent in the body of an
email.** Email is not a controlled channel and this is health data.

Existing clinic-facing endpoint:

- `POST /enquiries/:reference/status` — clinic advances the enquiry. Authenticated
  per clinic; a clinic can only act on enquiries where the clinic matches its own
  key.

Still required: a retrieval endpoint, and the delivery method above.

## 4. What is shared

Exactly the fields in Schedule A, and nothing else. In particular
JourneyFertility does **not** collect or transmit medical history, diagnoses,
test results, medication or treatment history.

The clinic acknowledges that an enquiry constitutes **data concerning health**
under UK GDPR Article 9, because it reveals that the individual is seeking
fertility treatment, irrespective of any clinical detail.

## 5. Purpose limitation

The clinic may use an enquiry **only** to respond to it and, if the person
becomes a patient, to provide the care they ask for.

The clinic must **not**:

- Use the details for marketing, unless it obtains its own consent directly
- Add the person to any mailing list on the basis of the enquiry alone
- Share, sell or transfer the details to any third party
- Use the details to train or evaluate any model
- Combine the enquiry with other datasets to profile the individual
- Retain the enquiry for any purpose other than those above

**[LEGAL]** the marketing restriction is deliberately strict. A person consented
to being *contacted about their enquiry*, not to being marketed to.

## 6. Lawful basis and consent

JourneyFertility relies on Article 6(1)(a) consent and Article 9(2)(a) explicit
consent. Both consents are captured before any enquiry is created, are unticked
by default, and are enforced server side.

JourneyFertility provides the consent record — which consents were given, and
when — with each enquiry. The clinic may rely on it for the initial contact, but
must establish its own lawful basis for anything beyond that, including its own
basis for holding clinical records once the person becomes a patient.

## 7. Withdrawal and erasure

The individual can withdraw consent and request erasure at any time, and this
must propagate.

| Event | Obligation |
|---|---|
| Person withdraws or requests erasure via JourneyFertility | JourneyFertility notifies the clinic **within 3 working days** |
| Clinic receives such notice | Clinic erases the enquiry **within 7 working days** and confirms in writing |
| Person requests erasure directly from the clinic | Clinic notifies JourneyFertility within 3 working days |

**Exception:** where the person has become a patient, the clinic may retain
records it is required to keep for clinical or regulatory reasons. It must then
stop using the enquiry for any other purpose and say so in its confirmation.

**[CONFIRM]** these timescales, which must be short enough for both parties to
meet the one month statutory deadline for responding to the individual.

## 8. Data subject rights

A person may approach either party. Neither may refuse on the grounds that the
other holds the data.

- Each party handles requests relating to data it holds
- Each provides the other with reasonable assistance **within 5 working days** of
  being asked
- Neither charges the individual

## 9. Security

The clinic must have appropriate technical and organisational measures under
Article 32, including at minimum:

- Encryption in transit and at rest
- Access limited to staff who need it to respond to enquiries
- Individual named accounts, no shared logins
- The ability to erase a specific enquiry on request

### API credentials

The clinic's API key authenticates it and is confidential. The clinic must not
share it, embed it in client-side code, or reuse it across systems, and must
notify JourneyFertility immediately if it may have been exposed, so it can be
revoked. Keys are per clinic; a key only grants access to that clinic's own
enquiries.

## 10. Personal data breach

A breach affecting shared enquiry data must be notified to the other party
**within 24 hours** of becoming aware — not 72. The 72 hour limit is the
deadline for notifying the ICO, and the notifying party needs time inside it to
assess and report.

Notification must state what happened, which enquiry references are affected,
what data, and what is being done. Neither party may make a public statement
naming the other without prior consultation, except where legally required.

## 11. Retention

- **Enquiry that does not become a patient:** the clinic erases it once the
  enquiry is closed, and no later than **[CONFIRM]** months from receipt
- **Enquiry that becomes a patient:** the clinic's own clinical retention
  applies, under its own lawful basis, and this agreement ceases to govern it
- JourneyFertility erases its copy after 12 months, or earlier on request

## 12. International transfers

The clinic must not transfer enquiry data outside the UK without first notifying
JourneyFertility and putting a valid transfer mechanism in place. The current
listings are UK only and no routine international transfer is expected.

## 13. Attribution and disputes

JourneyFertility maintains an append-only audit trail of enquiry status changes,
which is the evidence for any referral fee. The clinic reports outcomes honestly
and promptly through the status endpoint (Schedule B).

Where attribution is disputed, the audit trail is the reference record.
**[CONFIRM]** the dispute process and the reconciliation period.

Note: the audit trail contains status and timestamps only, no personal data, so
it survives erasure of the enquiry itself.

## 14. Assurance

Either party may ask the other, no more than once a year, for written
confirmation that it is meeting these terms. **[LEGAL]** decide whether a right
of audit is proportionate or whether written assurance suffices.

## 15. Term and termination

On termination, the clinic must, within 30 days, erase all enquiry data received
and not yet erased — except records it must retain for patients under §11 — and
confirm in writing. API credentials are revoked on termination.

## 16. For legal to complete

- Liability and indemnity, particularly for a breach caused by one party
- Governing law and jurisdiction
- Warranties on regulatory standing, including HFEA licensing
- Insurance requirements
- Whether the clinic must name a data protection contact
- Consequences of repeated failure to respond to enquiries

---

## Schedule A — data transferred

| Field | Type | Notes |
|---|---|---|
| `reference` | string | Patient-facing enquiry reference |
| `createdAt` | ISO 8601 | Submission time |
| `contact.fullName` | string | |
| `contact.email` | string | Normalised to lower case |
| `contact.phone` | string or null | Only if given |
| `contact.preferredContact` | `email` or `phone` | Must be respected |
| `enquiry.timing` | enum | `asap`, `within-3-months`, `within-6-months`, `just-researching` |
| `enquiry.fundingRoute` | enum | `nhs`, `private`, `undecided` |
| `enquiry.message` | string or null | Free text, max 2000 characters |
| `consent.processEnquiry` | boolean | Always true; enquiry cannot exist otherwise |
| `consent.shareWithClinic` | boolean | Always true |
| `consent.marketing` | boolean | **If false, the clinic must not market** |
| `consent.givenAt` | ISO 8601 | Evidence of consent |
| `attribution.serviceType` | string | Which service was being compared |

**Not transferred, because never collected:** medical history, diagnoses, test
results, medication, treatment history, date of birth, address, any government
identifier, partner or donor details.

## Schedule B — status the clinic must report

| Status | Meaning | When |
|---|---|---|
| `acknowledged` | Clinic has the enquiry and will respond | Within 48 hours |
| `responded` | Clinic has contacted the individual | On contact |
| `booked` | Consultation booked | On booking |
| `declined` | Clinic cannot help | With a brief reason |

Transitions are validated server side and rejected if out of order, so a status
cannot be skipped. Each is appended to the audit trail with a timestamp.
