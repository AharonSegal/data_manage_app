# Firestore Data Schema — Personal Business OS

this is not the final rulset this is just my thought but dont make anything entierly based on this just consider this 
## Read This First

This document defines the complete Firestore data schema for the application. It is the single source of truth for all collections, field names, field types, and relationships. When building any data layer, Firestore rules, TypeScript types, or DAL functions — reference this document.

**Design principles:**
- Flat top-level collections (no subcollections) — simplest to query in Firestore
- `entityId` links everything to a business bucket (But Better, Tal Livracha, Real Estate, etc.)
- `personId` links everything to a person — one person can hold multiple roles
- Documents are Drive URLs, not stored files
- Tasks are global — one collection, filtered by entity
- All collections include `createdAt` and `updatedAt` timestamps
- All document IDs are auto-generated strings unless noted otherwise

---

## Core Collections

### `/entities/{entityId}`

Business buckets that group all data. Examples: But Better, Tal Livracha, Real Estate, Investments, Certificates, Gimmel 200 LLC.

| Field | Type | Notes |
|---|---|---|
| `entityId` | `string` | Document ID |
| `name` | `string` | Display name |
| `type` | `string` | `business` \| `nonprofit` \| `personal` |
| `defaultPriority` | `number` | Lower = higher priority. Used as default for tasks under this entity |
| `isActive` | `boolean` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

---

### `/people/{personId}`

Central people directory. One person can be donor + investor + borrower + vendor + card owner, etc. All modules reference people by `personId`.

| Field | Type | Notes |
|---|---|---|
| `personId` | `string` | Document ID |
| `firstName` | `string` | |
| `lastName` | `string` | |
| `displayName` | `string` | Computed or manually set |
| `phones` | `string[]` | Multiple phone numbers |
| `emails` | `string[]` | Multiple email addresses |
| `roles` | `string[]` | `donor` \| `borrower` \| `investor` \| `avrech` \| `vendor` \| `contractor` \| `customer` \| `card_owner` |
| `tags` | `string[]` | Freeform tags for filtering |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

---

### `/tasks/{taskId}`

Global task system. Every task belongs to an entity and can optionally link to any record in any module.

| Field | Type | Notes |
|---|---|---|
| `taskId` | `string` | Document ID |
| `entityId` | `string` | Which business bucket |
| `title` | `string` | |
| `description` | `string` | |
| `status` | `string` | `not_started` \| `in_progress` \| `waiting` \| `done` |
| `priority` | `number` | 1–5 |
| `priorityOverride` | `boolean` | If true, urgent regardless of entity default |
| `ownerUserId` | `string` | Assigned to |
| `dueDate` | `timestamp?` | Optional |
| `reminders` | `timestamp[]?` | Optional array of reminder times |
| `recurrenceRule` | `string?` | RRULE or simple pattern, optional |
| `relatedType` | `string?` | `person` \| `re_deal` \| `tl_loan` \| `bb_wholesale_order` \| `card` \| `cert_request` etc. |
| `relatedId` | `string?` | ID of the related record |
| `lastTouchedAt` | `timestamp` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

---

### `/document_links/{docId}`

Links to Google Drive files. No files stored in Firestore — just URLs.

| Field | Type | Notes |
|---|---|---|
| `docId` | `string` | Document ID |
| `entityId` | `string` | |
| `relatedType` | `string` | What this doc belongs to (e.g. `re_deal`, `tl_loan`, `person`) |
| `relatedId` | `string` | ID of the related record |
| `label` | `string` | Human-readable name (e.g. "Signed Agreement", "Insurance Doc") |
| `driveUrl` | `string` | Full Google Drive URL |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

---

## But Better Module

### `/bb_expenses/{expenseId}`

| Field | Type | Notes |
|---|---|---|
| `expenseId` | `string` | Document ID |
| `entityId` | `string` | Always "but_better" |
| `lineItem` | `string` | Description of the expense |
| `category` | `string` | `COGS` \| `Marketing` \| `Legal` \| `Operations` \| `Travel` \| `Other` |
| `vendorName` | `string?` | |
| `vendorPersonId` | `string?` | FK → `/people` |
| `amount` | `number` | |
| `paymentDate` | `timestamp?` | |
| `paymentMethod` | `string` | `card` \| `zelle` \| `ach` \| `wire` \| `cash` \| `other` |
| `status` | `string` | `paid` \| `unpaid` \| `partial` |
| `paidPercent` | `number?` | For partial payments |
| `notes` | `string` | |
| `chargedOnCardId` | `string?` | FK → `/cards` |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/bb_fixed_costs/{fixedCostId}`

| Field | Type | Notes |
|---|---|---|
| `fixedCostId` | `string` | Document ID |
| `entityId` | `string` | Always "but_better" |
| `name` | `string` | |
| `amount` | `number` | |
| `frequency` | `string` | `monthly` \| `annual` |
| `category` | `string` | `Digital` \| `Operational` \| `Marketing` \| `Other` |
| `status` | `string` | `active` \| `cancelled` |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/bb_wholesale_accounts/{accountId}`

| Field | Type | Notes |
|---|---|---|
| `accountId` | `string` | Document ID |
| `entityId` | `string` | Always "but_better" |
| `name` | `string` | |
| `contactInfo` | `string?` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/bb_wholesale_orders/{orderId}`

| Field | Type | Notes |
|---|---|---|
| `orderId` | `string` | Document ID |
| `entityId` | `string` | Always "but_better" |
| `accountId` | `string` | FK → `/bb_wholesale_accounts` |
| `date` | `timestamp` | |
| `quantity` | `number` | |
| `saleAmount` | `number` | |
| `paymentMethod` | `string` | `zelle` \| `ach` \| `cash` \| `other` |
| `paidAmount` | `number` | |
| `balance` | `number` | |
| `status` | `string` | `paid` \| `unpaid` \| `partial` |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/bb_unit_cost_inputs/{docId}`

Simple point-in-time cost tracking.

| Field | Type | Notes |
|---|---|---|
| `asOfDate` | `timestamp` | |
| `costPerBag` | `number` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |

---

## Tal Livracha Module

### `/tl_donations/{donationId}`

| Field | Type | Notes |
|---|---|---|
| `donationId` | `string` | Document ID |
| `entityId` | `string` | Always "tal_livracha" |
| `donorPersonId` | `string?` | FK → `/people` |
| `donorName` | `string?` | Fallback if person not in system |
| `date` | `timestamp` | |
| `amount` | `number` | |
| `method` | `string` | `zelle` \| `check` \| `card` \| `other` |
| `reason` | `string` | |
| `recurring` | `boolean` | |
| `externalSource` | `string?` | `zeffy` if imported |
| `externalId` | `string?` | Zeffy transaction ID |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/tl_gemach_loans/{loanId}`

Interest-free loans.

| Field | Type | Notes |
|---|---|---|
| `loanId` | `string` | Document ID |
| `entityId` | `string` | Always "tal_livracha" |
| `borrowerPersonId` | `string` | FK → `/people` |
| `principal` | `number` | |
| `startDate` | `timestamp` | |
| `termMonths` | `number?` | |
| `expectedEndDate` | `timestamp?` | |
| `status` | `string` | `active` \| `late` \| `paid` \| `cancelled` |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/tl_gemach_payments/{paymentId}`

| Field | Type | Notes |
|---|---|---|
| `paymentId` | `string` | Document ID |
| `loanId` | `string` | FK → `/tl_gemach_loans` |
| `date` | `timestamp` | |
| `amount` | `number` | |
| `method` | `string` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |

### `/tl_kollel_batches/{batchId}`

Monthly payout batches.

| Field | Type | Notes |
|---|---|---|
| `batchId` | `string` | Document ID |
| `entityId` | `string` | Always "tal_livracha" |
| `month` | `string` | Format: `YYYY-MM` |
| `status` | `string` | `draft` \| `sent` \| `paid` \| `closed` |
| `wiredTotalUSD` | `number?` | |
| `wiredDate` | `timestamp?` | |
| `partnerOrgPersonId` | `string?` | FK → `/people` — the friend who distributes |
| `exchangeRateUsed` | `number?` | USD → NIS rate used |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/tl_kollel_entries/{entryId}`

Individual avrech entries per batch.

| Field | Type | Notes |
|---|---|---|
| `entryId` | `string` | Document ID |
| `batchId` | `string` | FK → `/tl_kollel_batches` |
| `avrechPersonId` | `string` | FK → `/people` |
| `hours` | `number` | |
| `ratePerHour` | `number` | |
| `amountNIS` | `number` | |
| `paidStatus` | `string` | `pending` \| `paid` \| `skipped` |
| `paidDate` | `timestamp?` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

---

## Investments Module (Private Credit Portfolio)

### `/pl_loans/{loanId}`

| Field | Type | Notes |
|---|---|---|
| `loanId` | `string` | Document ID |
| `entityId` | `string` | "investments" or "gimmel_200" |
| `counterpartyPersonId` | `string` | FK → `/people` |
| `direction` | `string` | `owed_to_you` \| `you_owe` |
| `principal` | `number` | |
| `rate` | `number` | Fixed interest rate |
| `startDate` | `timestamp` | |
| `maturityDate` | `timestamp?` | |
| `paymentType` | `string` | `monthly` \| `lump_sum` \| `mixed` |
| `status` | `string` | `active` \| `late` \| `paid` \| `cancelled` |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/pl_payments/{paymentId}`

| Field | Type | Notes |
|---|---|---|
| `paymentId` | `string` | Document ID |
| `loanId` | `string` | FK → `/pl_loans` |
| `date` | `timestamp` | |
| `amount` | `number` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |

---

## Real Estate Module

### `/re_deals/{dealId}`

| Field | Type | Notes |
|---|---|---|
| `dealId` | `string` | Document ID |
| `entityId` | `string` | Always "real_estate" |
| `address` | `string` | |
| `status` | `string` | `lead` \| `under_contract` \| `renovation` \| `listed` \| `sold` \| `dead` |
| `purchaseDate` | `timestamp?` | |
| `holdStartDate` | `timestamp?` | |
| `notes` | `string` | |
| `lockboxCode` | `string?` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/re_investors/{dealInvestorId}`

Investors per deal (typically 2–3).

| Field | Type | Notes |
|---|---|---|
| `dealInvestorId` | `string` | Document ID |
| `dealId` | `string` | FK → `/re_deals` |
| `personId` | `string` | FK → `/people` |
| `amountContributed` | `number` | |
| `structure` | `string` | `debt` \| `equity` |
| `terms` | `string` | Free text |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/re_expenses/{expenseId}`

| Field | Type | Notes |
|---|---|---|
| `expenseId` | `string` | Document ID |
| `dealId` | `string` | FK → `/re_deals` |
| `category` | `string` | `purchase` \| `closing` \| `renovation` \| `holding` \| `listing` \| `other` |
| `vendorPersonId` | `string?` | FK → `/people` |
| `vendorName` | `string?` | |
| `amount` | `number` | |
| `date` | `timestamp` | |
| `method` | `string` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/re_assumptions/{dealId}`

One document per deal. Document ID = dealId.

| Field | Type | Notes |
|---|---|---|
| `dealId` | `string` | Document ID (same as the deal) |
| `purchasePrice` | `number` | |
| `purchaseCost` | `number` | |
| `downPayment` | `number` | |
| `loanAmount` | `number` | |
| `interestRateCurrent` | `number` | Can be updated over time |
| `loanCost` | `number` | |
| `rehabBudget` | `number` | |
| `investorAmount` | `number` | |
| `arv` | `number` | After Repair Value |
| `expectedSalePrice` | `number` | |
| `sellingCostsPercent` | `number` | |
| `taxesMonthly` | `number?` | |
| `insuranceMonthly` | `number?` | |
| `utilitiesMonthly` | `number?` | |
| `hoaMonthly` | `number?` | |
| `lawnMonthly` | `number?` | |
| `otherHoldingMonthly` | `number?` | |
| `redLineDays` | `number?` | Warning threshold for days held |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/re_snapshots/{dealId}`

Computed summary — refreshed periodically or on demand. Document ID = dealId (latest snapshot overwrites).

| Field | Type | Notes |
|---|---|---|
| `dealId` | `string` | Document ID |
| `asOfDate` | `timestamp` | |
| `daysHeld` | `number` | |
| `holdingCostToDate` | `number` | |
| `interestAccruedToDate` | `number` | Based on current rate × time |
| `netSale` | `number` | |
| `profit` | `number` | |
| `profitMargin` | `number` | |
| `warningLevel` | `string` | `ok` \| `watch` \| `redline` |
| `suggestion` | `string?` | e.g. "Consider price drop / refi" |
| `updatedAt` | `timestamp` | |

---

## Certificates Module

### `/cert_requests/{certId}`

| Field | Type | Notes |
|---|---|---|
| `certId` | `string` | Document ID |
| `entityId` | `string` | Always "certificates" |
| `collectorPersonId` | `string?` | FK → `/people` |
| `collectorLastName` | `string?` | |
| `collectorFirstName` | `string?` | |
| `collectorType` | `string` | `mosad` \| `self` \| `other` |
| `certificateNumber` | `string?` | |
| `daysGiven` | `number` | |
| `issuedDate` | `timestamp` | |
| `status` | `string` | `draft` \| `approved` \| `submitted` \| `failed` |
| `submittedAt` | `timestamp?` | |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

> Automation-specific fields (portal form payload, confirmation text, retry count) will be added once portal details are finalized.

---

## Credit Cards Module

### `/cards/{cardId}`

| Field | Type | Notes |
|---|---|---|
| `cardId` | `string` | Document ID |
| `entityId` | `string` | Who benefits (personal / business entity) |
| `ownerPersonId` | `string` | FK → `/people` — can be third party |
| `issuer` | `string` | |
| `nickname` | `string` | |
| `last4` | `string` | |
| `limit` | `number` | |
| `statementCloseDay` | `number` | 1–31 |
| `dueDay` | `number` | 1–31 |
| `promo0EndDate` | `timestamp?` | 0% APR promo end date |
| `active` | `boolean` | |
| `ownerCompAnnual` | `number?` | Annual compensation if using someone else's card limit |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

### `/card_reward_rules/{ruleId}`

| Field | Type | Notes |
|---|---|---|
| `ruleId` | `string` | Document ID |
| `cardId` | `string` | FK → `/cards` |
| `spendCategory` | `string` | `general` \| `ads` \| `travel` \| `shipping` \| `other` |
| `rewardType` | `string` | `cashback` \| `points` |
| `rewardRate` | `number` | Decimal (e.g. `0.02` = 2%) |
| `notes` | `string` | |

### `/swipes/{swipeId}`

| Field | Type | Notes |
|---|---|---|
| `swipeId` | `string` | Document ID |
| `cardId` | `string` | FK → `/cards` |
| `date` | `timestamp` | |
| `amount` | `number` | |
| `processorOwnerPersonId` | `string?` | FK → `/people` — whose processor was used |
| `settlementMethod` | `string` | `zelle` \| `transfer` \| `internal` \| `other` |
| `settled` | `boolean` | |
| `settledDate` | `timestamp?` | |
| `notes` | `string` | |

### `/card_recommendations/{docId}`

Computed — daily snapshot or on-demand.

| Field | Type | Notes |
|---|---|---|
| `asOfDate` | `timestamp` | |
| `recommendedCardId` | `string` | FK → `/cards` |
| `floatDays` | `number` | Days until payment due |
| `estimatedRewardsValue` | `number` | |
| `reason` | `string` | Human-readable explanation |

---

## Bank Accounts (Light v1)

### `/bank_accounts/{bankAccountId}`

| Field | Type | Notes |
|---|---|---|
| `bankAccountId` | `string` | Document ID |
| `entityId` | `string` | Which entity owns this account |
| `name` | `string` | |
| `currency` | `string` | `USD` \| `NIS` |
| `notes` | `string` | |
| `createdAt` | `timestamp` | |
| `updatedAt` | `timestamp` | |

---

## Action Logs (Email + WhatsApp History)

### `/action_logs/{logId}`

Every email or WhatsApp sent through the app is logged here for the activity feed.

| Field | Type | Notes |
|---|---|---|
| `logId` | `string` | Document ID |
| `type` | `string` | `email` \| `whatsapp` |
| `entityId` | `string?` | Which entity this action relates to |
| `relatedType` | `string?` | e.g. `cert_request`, `tl_loan`, `re_deal` |
| `relatedId` | `string?` | ID of the related record |
| `to` | `string` | Recipient email or phone |
| `subject` | `string?` | Email only |
| `body` | `string?` | Message preview |
| `status` | `string` | `sent` \| `failed` |
| `messageId` | `string?` | Email message ID or Twilio SID |
| `error` | `string?` | Error message if failed |
| `userId` | `string` | Who triggered it |
| `timestamp` | `timestamp` | |

---

## Collection Index (Quick Reference)

| Collection | Module | Count Pattern |
|---|---|---|
| `/entities` | Core | ~6-8 fixed docs |
| `/people` | Core | Grows over time |
| `/tasks` | Core | Grows, filtered by entity + status |
| `/document_links` | Core | Grows, filtered by relatedType + relatedId |
| `/bb_expenses` | But Better | Filtered by entityId |
| `/bb_fixed_costs` | But Better | Small set, filtered by status |
| `/bb_wholesale_accounts` | But Better | Small set |
| `/bb_wholesale_orders` | But Better | Filtered by accountId, status |
| `/bb_unit_cost_inputs` | But Better | Append-only, small |
| `/tl_donations` | Tal Livracha | Filtered by donorPersonId, date |
| `/tl_gemach_loans` | Tal Livracha | Filtered by status |
| `/tl_gemach_payments` | Tal Livracha | Filtered by loanId |
| `/tl_kollel_batches` | Tal Livracha | Filtered by month, status |
| `/tl_kollel_entries` | Tal Livracha | Filtered by batchId |
| `/pl_loans` | Investments | Filtered by direction, status |
| `/pl_payments` | Investments | Filtered by loanId |
| `/re_deals` | Real Estate | Filtered by status |
| `/re_investors` | Real Estate | Filtered by dealId |
| `/re_expenses` | Real Estate | Filtered by dealId |
| `/re_assumptions` | Real Estate | 1 doc per deal (docId = dealId) |
| `/re_snapshots` | Real Estate | 1 doc per deal (docId = dealId) |
| `/cert_requests` | Certificates | Filtered by status, issuedDate |
| `/cards` | Credit Cards | Filtered by active, entityId |
| `/card_reward_rules` | Credit Cards | Filtered by cardId |
| `/swipes` | Credit Cards | Filtered by cardId, settled |
| `/card_recommendations` | Credit Cards | Latest snapshot |
| `/bank_accounts` | Bank Accounts | Small set |
| `/action_logs` | Actions | Append-only, filtered by type, entityId |

---

## Relationship Map

```
entities ──────────────────────────────────────────────┐
  │                                                     │
  │ entityId referenced by:                             │
  ├── tasks                                             │
  ├── document_links                                    │
  ├── bb_expenses, bb_fixed_costs                       │
  ├── bb_wholesale_accounts, bb_wholesale_orders        │
  ├── tl_donations, tl_kollel_batches                   │
  ├── tl_gemach_loans                                   │
  ├── pl_loans                                          │
  ├── re_deals                                          │
  ├── cert_requests                                     │
  ├── cards                                             │
  ├── bank_accounts                                     │
  └── action_logs                                       │
                                                        │
people ────────────────────────────────────────────────┐│
  │                                                    ││
  │ personId referenced by:                            ││
  ├── bb_expenses (vendorPersonId)                     ││
  ├── tl_donations (donorPersonId)                     ││
  ├── tl_gemach_loans (borrowerPersonId)               ││
  ├── tl_kollel_batches (partnerOrgPersonId)           ││
  ├── tl_kollel_entries (avrechPersonId)               ││
  ├── pl_loans (counterpartyPersonId)                  ││
  ├── re_investors (personId)                          ││
  ├── re_expenses (vendorPersonId)                     ││
  ├── cert_requests (collectorPersonId)                ││
  ├── cards (ownerPersonId)                            ││
  └── swipes (processorOwnerPersonId)                  ││
                                                       ││
tasks.relatedType + tasks.relatedId ───────────────────┘│
  Can point to any record in any collection              │
  (person, re_deal, tl_loan, card, cert_request, etc.)  │
                                                         │
document_links.relatedType + document_links.relatedId ───┘
  Can point to any record in any collection
```

---

## Firestore Indexes Needed

Composite indexes to create (Firestore requires these for multi-field queries):

| Collection | Fields | Purpose |
|---|---|---|
| `tasks` | `entityId` + `status` + `dueDate` | Dashboard: tasks by entity, filtered by status, sorted by due date |
| `tasks` | `ownerUserId` + `status` + `dueDate` | My tasks view |
| `bb_expenses` | `entityId` + `category` + `paymentDate` | Expense breakdown by category and time |
| `bb_wholesale_orders` | `accountId` + `status` | Accounts receivable |
| `tl_gemach_loans` | `status` + `expectedEndDate` | Overdue loans |
| `tl_kollel_entries` | `batchId` + `paidStatus` | Batch payout status |
| `pl_loans` | `direction` + `status` | Who owes you vs. you owe |
| `re_deals` | `status` + `holdStartDate` | Active deals sorted by hold time |
| `swipes` | `cardId` + `settled` + `date` | Unsettled swipes per card |
| `cert_requests` | `status` + `issuedDate` | Certificate queue |
| `action_logs` | `entityId` + `type` + `timestamp` | Activity feed filtered by entity and channel |

---

## TypeScript Type Generation Note

When building the data layer, generate TypeScript interfaces directly from this schema. Every collection should have a corresponding interface in `src/shared/types/`. Example:

```ts
// src/shared/types/person.types.ts
export interface Person {
  personId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phones: string[];
  emails: string[];
  roles: PersonRole[];
  tags: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PersonRole =
  | 'donor'
  | 'borrower'
  | 'investor'
  | 'avrech'
  | 'vendor'
  | 'contractor'
  | 'customer'
  | 'card_owner';
```

Follow this pattern for all collections. Union types for all string enums. Optional fields marked with `?`.