# Record of Processing Activities

**Status:** Draft for review · **Version:** 0.1 · **Date:** 20 July 2026

Required by UK GDPR Article 30. Kept deliberately short: it should describe only
what actually happens, and be updated whenever that changes.

**[CONFIRM]** entries need facts only the business holds.

---

## 1. Controller

| Field | Value |
|---|---|
| Controller | **[CONFIRM]** registered name and company number |
| Address | **[CONFIRM]** |
| Contact for data protection | **[CONFIRM]** privacy@ address |
| DPO | **[CONFIRM]** — see DPIA §3.4, may be mandatory |

## 2. Processing activities

### 2.1 Clinic enquiries

| Field | Value |
|---|---|
| Purpose | Passing an enquiry to the clinic the person selected, so the clinic can contact them |
| Categories of data subject | Prospective fertility patients |
| Categories of personal data | Name, email, phone (optional), preferred contact method, treatment timing, funding route, optional free-text message |
| Special category data | Yes — data concerning health, Article 9(1). An enquiry reveals the person is seeking fertility care |
| Lawful basis | Article 6(1)(a) consent; Article 9(2)(a) explicit consent |
| Recipients | The clinic named at the point of consent; hosting provider as processor |
| Transfers outside the UK | **[CONFIRM]** hosting region. None to clinics — UK only listings |
| Retention | 12 months from submission, then automatic erasure. Erasure on request at any time |
| Security measures | See §3 |

### 2.2 Optional marketing

| Field | Value |
|---|---|
| Purpose | Sending guides and updates to people who asked for them |
| Categories of personal data | Name, email |
| Lawful basis | Article 6(1)(a) consent, separate from the enquiry consent, plus PECR |
| Retention | Until consent is withdrawn |

## 3. Security measures

Implemented in code and verified:

- Explicit consent enforced server side; unticked by default
- Server-authoritative validation, allow-listed enums, bounded lengths
- Records built field by field, so unknown payload fields cannot reach storage
- CORS restricted to an allow-list
- Rate limiting on all public endpoints
- Idempotency keys required and replayed
- Enquiry references redacted from logs; request bodies never logged
- Per-clinic authentication with ownership checks
- Lookups require reference and email together, with identical responses for
  unknown reference and wrong email
- Automated retention sweep, erasure confirmed by read-back

**[CONFIRM]** encryption at rest and in transit, and access control on the
hosting project.

## 4. Not processed

Recorded because the boundary matters:

- No medical history, diagnoses, test results or medication data is collected or
  stored
- Quiz answers stay in the browser and are never transmitted or persisted
- No date of birth, address or government identifier
- No analytics or advertising cookies

## 5. Review

Update when processing changes, and at minimum annually. See DPIA §10 for the
full list of review triggers.
