# Data Protection Impact Assessment — JourneyFertility enquiry funnel

**Status:** Draft for review
**Version:** 0.1
**Date:** 20 July 2026
**Scope:** The clinic enquiry funnel and the data it creates
**Prepared from:** the implemented system (`src/app/lib/enquiry.ts`, `src/app/components/EnquiryFlow.tsx`, `src/app/supabase/functions/server/`)

> **This is a draft, not legal advice.** It was written from the behaviour of the
> implemented code, so it describes the system accurately, but it has not been
> reviewed by a data protection professional. It must be reviewed and signed off
> by a qualified DPO or privacy counsel before processing real personal data.
> Fields marked **[CONFIRM]** need facts that only the business can supply.

---

## 1. Controller and contacts

| Field | Value |
|---|---|
| Data controller | **[CONFIRM]** registered legal entity name and company number |
| Registered address | **[CONFIRM]** |
| ICO registration number | **[CONFIRM]** — required before processing; controllers processing personal data generally must pay the data protection fee |
| DPO or responsible person | **[CONFIRM]** — a DPO is likely required, see §3.4 |
| Contact for data subjects | **[CONFIRM]** privacy@ address, referenced by the privacy notice |

## 2. Why a DPIA is required

Under UK GDPR Article 35(1) a DPIA is required where processing is likely to
result in a high risk to the rights and freedoms of individuals. Article 35(3)(b)
names processing on a large scale of special category data under Article 9.

This processing triggers the requirement on three counts:

1. **It is health data.** An enquiry about fertility treatment reveals that the
   person is seeking fertility care. The whole payload is data concerning health
   under Article 9(1) — not merely any clinical detail inside it. This is the
   single most important finding in this assessment and it shapes everything
   below.
2. **It concerns a sensitive life circumstance.** Fertility, infertility and
   family building are intimate. Disclosure could cause distress, and could
   reveal information to family, employers or insurers that the person has
   chosen not to share.
3. **Data is disclosed to a third party** — the clinic — as the purpose of the
   processing rather than as a side effect.

The ICO also lists "data concerning health" and "combining datasets" among its
high-risk indicators.

## 3. Description of the processing

### 3.1 What is collected

Collected in the enquiry form and transmitted to the clinic:

| Data | Purpose | Required |
|---|---|---|
| Full name | So the clinic can address the person | Yes |
| Email address | Sending the reference; clinic contact | Yes |
| Phone number | Clinic contact where preferred | Only if phone chosen |
| Preferred contact method | Respecting the person's choice | Yes |
| Treatment timing | Lets the clinic triage urgency | Yes |
| Funding route (NHS / private / undecided) | Determines what the clinic can offer | Yes |
| Free-text message | The person's own question | No |
| Consent flags and timestamp | Evidence of the lawful basis | Yes |
| Clinic, service type, surface, reference, idempotency key | Attribution and duplicate prevention | System generated |

Derived server side: submission timestamp, status, audit trail of transitions.

### 3.2 What is deliberately not collected

This is a data minimisation control, not an omission. The form does **not** ask
for, and the server does **not** accept into storage:

- Medical history, diagnoses or conditions
- Test results (AMH, FSH, antral follicle count or any other)
- Medication, treatment history or previous cycles
- Date of birth, address or any government identifier
- Partner or donor details

The free-text field explicitly asks the person not to include medical detail,
and `buildRecord` in `enquiry-core.ts` constructs the stored object field by
field, so unknown fields on the payload are dropped rather than passed through.

**Residual risk:** a person may still type clinical information into the free
text box. See R6 in §6.

### 3.3 Purposes

1. Passing the enquiry to the clinic the person selected, so the clinic can
   contact them. This is the primary purpose and the person's own objective.
2. Telling the person their enquiry's status.
3. Evidencing that a booking originated from JourneyFertility, in order to
   invoice the clinic a referral fee.
4. Optional marketing, only where separately consented.

### 3.4 Lawful basis

| Element | Basis |
|---|---|
| Article 6 | **6(1)(a) consent** |
| Article 9 | **9(2)(a) explicit consent** |
| Marketing | Separate 6(1)(a) consent, plus PECR for electronic marketing |
| Billing residue after erasure | **6(1)(f) legitimate interests** — see §5.3. Contains no personal data, so Article 9 does not apply |

Consent was chosen over legitimate interests because the processing is of health
data disclosed to a third party, where the person's expectation and control must
be paramount. Consequences implemented:

- All three consent boxes default to unchecked, so consent is a clear
  affirmative act (Article 4(11)). Verified: submitting with only the optional
  marketing box ticked is rejected.
- The two required consents are enforced **server side** in
  `hasRequiredConsent`, so a modified client cannot bypass them.
- Consent is granular: processing, sharing with the named clinic, and marketing
  are separate. Marketing is never a condition of the enquiry.
- The consent timestamp is stored as the record that permission was given.

**[CONFIRM]** Because the core activity involves large-scale processing of
special category data, a DPO may be mandatory under Article 37(1)(c). This needs
a decision recorded either way.

### 3.5 Recipients

| Recipient | What they receive | Basis |
|---|---|---|
| The selected clinic | Contact details, timing, funding route, message | Explicit consent, named at the point of consent |
| Supabase (processor) | All stored data, as hosting provider | **[CONFIRM]** processor agreement under Article 28 |
| **[CONFIRM]** email provider | Reference and status emails | **[CONFIRM]** Article 28 agreement |

The clinic is named in the consent text, so consent is specific rather than
blanket. Clinics authenticate individually and can only act on their own
enquiries.

**[CONFIRM]** Whether each clinic is a separate controller or a joint
controller. The likely analysis is that the clinic becomes an independent
controller on receipt, which must be documented in the clinic contract along
with each party's responsibilities for responding to data subject requests.

### 3.6 International transfers

The MVP is **UK only**, so no routine transfer outside the UK is expected.

Two live risks:

1. **[CONFIRM]** Supabase project region. If data is hosted outside the UK, a
   transfer mechanism is required (UK IDTA, or the Addendum to the EU SCCs) plus
   a transfer risk assessment.
2. **If international clinics are reintroduced** — the product previously listed
   clinics in Turkey, and the site still describes treatment abroad — sending an
   enquiry to a clinic outside the UK is a restricted transfer requiring its own
   mechanism and TRA. This DPIA must be updated before any non-UK clinic is
   listed.

### 3.7 Retention

12 months from submission, then erasure. Enforced by a scheduled sweep
(`retention-core.ts`), not by policy alone. A person can request erasure at any
time via the erasure endpoint.

On erasure, the enquiry and its idempotency mapping are destroyed. A billing
residue survives containing clinic, service type, final status and dates, with
no personal data. Erasure is confirmed by reading the key back, so a partial
deletion is never reported as success.

## 4. Consultation

| Party | Status |
|---|---|
| DPO / privacy counsel | **Not yet consulted — required before go-live** |
| Data subjects | **[CONFIRM]** — Article 35(9) expects the controller to seek the views of data subjects where appropriate. Consider testing the consent wording with prospective users |
| Processors | **[CONFIRM]** Supabase Article 28 terms reviewed |
| Clinics | **[CONFIRM]** data sharing terms agreed |

## 5. Necessity and proportionality

### 5.1 Is the processing necessary?

Yes. The person's objective is for a clinic to contact them, which cannot be
achieved without passing contact details to that clinic. No less intrusive route
achieves the same outcome.

### 5.2 Is it proportionate?

The assessment is that it is, on these grounds:

- Only what a clinic needs to make contact and triage is collected. Clinical
  data is refused by design; the clinic can gather it under its own clinical
  basis once the person is in its care.
- The person chooses the clinic. Data is not broadcast to multiple clinics.
- Consent is specific, granular and revocable.
- Retention is bounded and enforced automatically.

### 5.3 The tension between erasure and billing

Article 17 requires erasure; the business needs durable evidence to invoice a
referral fee. Retaining the full enquiry to protect revenue would be
disproportionate.

Resolution: the record is split. Personal data is erased. A residue with no
personal data survives for billing. Because the residue cannot identify anyone,
it falls outside UK GDPR, and legitimate interests covers its retention as
business records.

**[CONFIRM]** Retention period for the billing residue, aligned to the
limitation period for contractual claims and to accounting requirements.

## 6. Risks to data subjects

Scored before mitigation. Likelihood and severity: Low / Medium / High.

| # | Risk | Likelihood | Severity | Mitigation | Residual |
|---|---|---|---|---|---|
| R1 | Enquiry disclosed to the wrong clinic | Low | **High** — reveals fertility treatment to an unintended party | Clinic named in the consent text; clinics authenticate individually; a clinic can only read and act on enquiries where `attribution.clinicSlug` matches its own key | Low |
| R2 | Health data exposed by a cross-site request | Medium | High | CORS wildcard removed; origins allow-listed via `ALLOWED_ORIGINS` | Low |
| R3 | Enquiries discovered by guessing references | Medium | High | Status and erasure require reference **and** the submitting email; identical response for unknown reference and wrong email, so it cannot be used as an existence oracle; rate limiting per IP | Low |
| R4 | Health data leaked through logs | Medium | High | Request bodies never logged; enquiry references stripped from log lines by `redactPath`; validation errors return field names only, never submitted values | Low |
| R5 | Data kept longer than promised | **High** without automation | Medium | Automatic 12 month sweep; erasure confirmed by read-back; client and server constants cross-referenced | Low–Medium — see §8 |
| R6 | Person volunteers clinical detail in free text | Medium | Medium | Field explicitly asks them not to; 2000 character cap; the whole record is treated as Article 9 data regardless, so protections apply either way | Medium |
| R7 | Duplicate enquiries from a retry, causing repeated clinic contact | Medium | Low | `Idempotency-Key` required and replayed server side | Low |
| R8 | Consent not freely given or not evidenced | Low | High — removes the lawful basis | Unticked defaults; server-side enforcement; granular consents; timestamp stored; marketing never a condition | Low |
| R9 | Processor or hosting region non-compliant | **[CONFIRM]** | High | Article 28 agreement and region confirmation outstanding | **[CONFIRM]** |
| R10 | Data of a person under 18 | Low | High | **[CONFIRM]** — no age gate exists. Consider stating the service is for adults and confirming age, given consent is the basis |
| R11 | Comparison ranking influences a health decision | Medium | Medium | Ranking is deterministic and explainable, not inferred from personal data; no profiling of the individual. Article 22 is not engaged as no solely automated decision produces legal or similarly significant effects | Low |

## 7. Measures already implemented

Technical, in code:

- Explicit consent enforced server side, defaulting to unchecked
- Server-authoritative validation with allow-listed enums and bounded lengths
- Record built field by field, so unknown payload fields cannot reach storage
- CORS restricted to an allow-list
- Rate limiting per IP on all public endpoints
- Idempotency keys required and replayed
- Log redaction of enquiry references; bodies never logged
- Per-clinic authentication and ownership checks
- Enumeration-resistant lookup requiring reference plus email
- Automated retention sweep with erasure verified by read-back
- Erasure endpoint for the right to be forgotten
- Append-only audit trail holding no personal data

Organisational, **outstanding**:

- Privacy notice published and linked from the consent screen
- Article 28 processor agreements
- Data sharing terms with clinics, including controller roles
- Procedure for data subject requests, with response within one month
- Personal data breach procedure, 72 hour notification
- Record of Processing Activities under Article 30
- Staff training and access control
- **[CONFIRM]** encryption at rest and in transit, and access controls on the
  Supabase project

## 8. Residual risks accepted

| Risk | Residual | Why accepted |
|---|---|---|
| R6 free-text clinical detail | Medium | Cannot be prevented outright without removing a field that has genuine value. The record is protected as Article 9 data regardless |
| R5 retention drift | Low–Medium | The retention window is defined in two runtimes that cannot share a module. They match today, but nothing enforces it in CI. **Recommend a CI assertion before go-live** |

## 9. Sign-off

| Role | Name | Date | Decision |
|---|---|---|---|
| Prepared by | Engineering (draft) | 20 Jul 2026 | Draft |
| DPO / privacy counsel | **[CONFIRM]** | | **Required before go-live** |
| Controller / director | **[CONFIRM]** | | |

**This assessment does not authorise processing.** Real personal data must not
be processed until the outstanding organisational measures in §7 are in place
and this DPIA is signed off.

## 10. Review triggers

Revisit whenever any of the following occur:

- A non-UK clinic is listed, or the hosting region changes
- Quiz answers, test results or any clinical data are persisted. They are
  currently held in the browser only and never sent to a server; persisting them
  is new Article 9 processing and requires this DPIA to be updated first
- Journey AI launches, which is separately out of scope here and needs its own
  assessment, including whether it constitutes a medical device
- Patient-submitted invoices are introduced
- Ranking begins to use personal data, which could engage Article 22
- Any personal data breach
- Annually in any case
