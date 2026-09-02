# Woodarua — Design Team Edge Band Feature
## Full Implementation Plan

### 1. Objective

Implement an Edge Band feature for the Woodarua Design Team.

The edge-band master data is already seeded in the database. The feature must **not** create a new edge-band master-data management system.

The feature will:

1. Allow the designer to select a brand.
2. Allow the designer to enter an edge-band code.
3. Search the existing seeded edge-band data.
4. Display matching seeded codes with match percentages such as 100%, 90%, 80%, etc.
5. Allow the designer to select the required matched code.
6. Display the available fixed dimensions for that edge band.
7. Allow quantity entry for each available dimension.
8. Add the confirmed requirement to a final result table.
9. Save the confirmed selection against the relevant design/project.

---

# 2. User Workflow

```text
Open Edge Band
      ↓
Select Brand
      ↓
Enter Edge Band Code
      ↓
Search Seeded Edge Band Data
      ↓
Display Matching Codes
      ↓
100% / 90% / 80% / ... Match
      ↓
Designer Selects Matched Code
      ↓
Show Available Dimensions
      ↓
Enter Quantity
      ↓
Add
      ↓
Final Edge Band Requirement Table
      ↓
Save to Design/Project
```

---

# 3. UI Structure

## 3.1 Search Section

Fields:

### Brand

A dropdown populated from the existing seeded edge-band data.

```text
Brand
[ Select Brand ▼ ]
```

### Edge Band Code

Text input for the code supplied by the designer.

```text
Edge Band Code
[ Enter code........................ ]
```

The search should happen automatically after the designer stops typing.

---

# 4. Matching Section

When the designer enters a code, search the existing seeded data.

Example:

| Code | Name | Match |
|---|---|---:|
| EB12345 | Walnut | 100% |
| EB12346 | Walnut | 90% |
| EB12347 | Walnut | 80% |

The designer must be able to select one of the returned matches.

### Matching Rules

The matching engine must return deterministic results.

Initial target:

```text
Exact match
→ 100%

Very close match
→ 90%

Close match
→ 80%

Weak but meaningful match
→ 70%

Below minimum threshold
→ Do not display
```

The exact calculation must be finalized after inspecting the real seeded edge-band code structure.

Do **not** blindly use character similarity if the edge-band code contains meaningful sections such as brand, series, color, finish, or variant.

---

# 5. Dimension Section

The feature uses four fixed dimensions:

```text
22 × 0.8
22 × 2
45 × 0.8
45 × 2
```

After selecting an edge band, the system determines which dimensions are actually available for that seeded edge-band record.

Example:

| Dimension | Quantity |
|---|---:|
| 22 × 0.8 | [ 5 ] |
| 22 × 2 | [ 2 ] |
| 45 × 0.8 | [ 8 ] |
| 45 × 2 | Not Available |

Do not allow designers to manually enter arbitrary dimensions.

If a dimension does not exist for the selected seeded edge band, it should be disabled or marked unavailable.

---

# 6. Quantity Rules

Quantity must be validated.

Valid:

```text
1
2
10
100
```

Invalid:

```text
0
-5
abc
```

If quantities must be integers, decimal quantities must also be rejected.

Before adding the selection, at least one dimension must have a quantity greater than zero.

---

# 7. Final Result

After clicking `Add`, show the confirmed selections.

Example:

| Brand | Code | Dimension | Qty |
|---|---|---|---:|
| Merino | EB12346 | 22 × 0.8 | 5 |
| Merino | EB12346 | 22 × 2 | 2 |
| Merino | EB12346 | 45 × 0.8 | 8 |

Internally retain:

- entered code
- matched code
- match percentage
- brand
- dimension
- quantity

Example object:

```js
{
  brand: "Merino",
  enteredCode: "EB12345",
  matchedCode: "EB12346",
  matchPercentage: 90,
  dimension: "22x0.8",
  quantity: 5
}
```

Keeping both `enteredCode` and `matchedCode` provides useful audit information.

---

# 8. Duplicate Handling

If the same:

```text
Brand + Matched Code + Dimension
```

is added more than once, do not create duplicate rows.

Example:

First:

```text
EB12346 | 22 × 0.8 | Qty 5
```

Second:

```text
EB12346 | 22 × 0.8 | Qty 3
```

Final:

```text
EB12346 | 22 × 0.8 | Qty 8
```

---

# 9. Backend Architecture

Assuming the existing Woodarua backend follows a modular structure:

```text
backend/
└── modules/
    └── edgeBand/
        ├── edgeBand.routes.js
        ├── edgeBand.controller.js
        ├── edgeBand.service.js
        ├── edgeBand.model.js
        └── edgeBand.matcher.js
```

### Responsibilities

#### `edgeBand.routes.js`

Defines API endpoints.

#### `edgeBand.controller.js`

Handles HTTP requests and responses.

#### `edgeBand.service.js`

Contains business logic and database operations.

#### `edgeBand.model.js`

Only needed if the existing architecture requires a dedicated model. The implementation should reuse the existing seeded Edge Band model rather than duplicating master data.

#### `edgeBand.matcher.js`

Contains the edge-band code matching algorithm.

Keep matching logic isolated from controllers.

---

# 10. API Design

## 10.1 Get Brands

```http
GET /api/design/edge-bands/brands
```

Example response:

```json
[
  "Merino",
  "Greenlam",
  "Century"
]
```

Prefer deriving brands from the existing seeded data rather than maintaining a second brand list unless the current database already has a dedicated Brand master.

---

## 10.2 Search Edge Bands

```http
GET /api/design/edge-bands/search?brand=Merino&code=EB12345
```

Example response:

```json
{
  "results": [
    {
      "code": "EB12345",
      "name": "Walnut",
      "match": 100
    },
    {
      "code": "EB12346",
      "name": "Walnut",
      "match": 90
    },
    {
      "code": "EB12347",
      "name": "Walnut",
      "match": 80
    }
  ]
}
```

The backend should calculate the match percentage.

The frontend should not be trusted to calculate or submit the match percentage.

---

## 10.3 Get Edge Band Details

```http
GET /api/design/edge-bands/:code
```

Example response:

```json
{
  "brand": "Merino",
  "code": "EB12346",
  "name": "Walnut",
  "dimensions": [
    {
      "dimension": "22x0.8",
      "available": true
    },
    {
      "dimension": "22x2",
      "available": true
    },
    {
      "dimension": "45x0.8",
      "available": true
    },
    {
      "dimension": "45x2",
      "available": false
    }
  ]
}
```

If codes are only unique within a brand, the endpoint should include the brand or use the existing edge-band ID instead of assuming the code is globally unique.

---

## 10.4 Save Edge Band Selection

```http
POST /api/design/edge-bands
```

Example payload:

```json
{
  "projectId": "PROJECT_ID",
  "designId": "DESIGN_ID",
  "items": [
    {
      "brand": "Merino",
      "enteredCode": "EB12345",
      "matchedCode": "EB12346",
      "matchPercentage": 90,
      "dimension": "22x0.8",
      "quantity": 5
    }
  ]
}
```

The backend must validate the referenced edge band and dimension before saving.

---

# 11. Database Strategy

The existing seeded Edge Band collection is the **master/reference data**.

Do not duplicate it.

Conceptually:

```text
Existing Seeded Edge Bands
            │
            │ reference
            ↓
Design Edge Band Selections
```

The saved design selection should contain only what the designer actually chose.

Possible saved record:

```js
{
  projectId,
  designId,

  brand,
  enteredCode,
  matchedCode,
  matchPercentage,

  dimension,
  quantity,

  createdBy,
  createdAt,
  updatedAt
}
```

Before creating a new collection, inspect the existing Design/Project schema. If edge-band selections already belong naturally inside an existing design document, embedding them may be preferable.

Avoid unnecessary database duplication.

---

# 12. Frontend Architecture

For a React application:

```text
src/
└── modules/
    └── edgeBand/
        ├── EdgeBandPage.jsx
        ├── EdgeBandSearch.jsx
        ├── EdgeBandMatches.jsx
        ├── EdgeBandDimensions.jsx
        ├── EdgeBandResultTable.jsx
        ├── edgeBandApi.js
        └── edgeBand.css
```

### `EdgeBandPage.jsx`

Owns the overall workflow and state.

### `EdgeBandSearch.jsx`

Brand selector and code input.

### `EdgeBandMatches.jsx`

Displays matching seeded codes.

### `EdgeBandDimensions.jsx`

Displays available dimensions and quantity inputs.

### `EdgeBandResultTable.jsx`

Displays confirmed selections.

### `edgeBandApi.js`

Contains API calls.

---

# 13. Frontend State

A simple state model is sufficient:

```js
const [brand, setBrand] = useState("");
const [code, setCode] = useState("");
const [matches, setMatches] = useState([]);
const [selectedBand, setSelectedBand] = useState(null);
const [quantities, setQuantities] = useState({});
const [results, setResults] = useState([]);
```

Workflow:

```text
brand
  ↓
code
  ↓
matches
  ↓
selectedBand
  ↓
quantities
  ↓
results
```

Avoid creating unnecessary independent state variables.

---

# 14. Search Debouncing

Do not send an API request for every keystroke.

Bad:

```text
E
EB
EB1
EB12
EB123
EB1234
EB12345
```

Use approximately 300–500 ms debounce.

```text
User types
    ↓
Wait
    ↓
No additional typing?
    ↓
Search API
```

Also define a minimum search length appropriate for the real code format.

---

# 15. Search Result Behavior

Recommended behavior:

1. Designer selects brand.
2. Designer enters code.
3. Search begins after debounce.
4. Loading state appears.
5. Matching codes appear.
6. Designer selects one.
7. Selected match becomes active.
8. Dimensions are loaded/displayed.
9. Designer enters quantities.
10. Designer clicks Add.

Do not automatically replace the entered code with a suggested match without designer confirmation.

The system should recommend; the designer should confirm.

---

# 16. Loading and Error States

Implement all important states.

### Loading

```text
Finding matching edge bands...
```

### No match

```text
No matching edge band found.
Try another code.
```

### API failure

```text
Unable to load matching edge bands.
Please try again.
```

### Invalid input

```text
Enter a valid edge band code.
```

### No available dimension

```text
No available dimensions found for this edge band.
```

### Save failure

```text
Unable to save edge band selection.
Please try again.
```

Do not leave blank screens for API failures.

---

# 17. Backend Validation and Security

The backend must not trust frontend values.

Do not trust:

```text
brand
matchedCode
matchPercentage
dimension
quantity
```

The backend should verify:

- Brand exists.
- Edge-band code exists.
- Matched code belongs to the selected brand.
- Dimension is valid for the selected edge band.
- Quantity is valid.
- User has permission to modify the design/project.
- Match percentage corresponds to the actual matching result if it is stored.

A malicious client must not be able to send:

```json
{
  "matchPercentage": 100
}
```

and force the system to store a false 100% match.

---

# 18. Database Indexing

Inspect the existing seeded data first.

At minimum, investigate indexes on:

```text
brand
code
```

If code uniqueness is guaranteed within a brand:

```js
{ brand: 1, code: 1 }
```

may be appropriate.

Do not introduce a search engine such as Elasticsearch unless the actual data size and search requirements justify it.

---

# 19. Matching Algorithm

This is the most important technical part.

The exact algorithm must be based on real seeded code examples.

Before implementation, collect representative examples:

```text
Exact match
Near match
Different series
Different color
Different finish
Completely different code
Invalid code
```

Then define the matching rules.

Possible structure:

```text
Exact
→ 100%

Very close
→ 90%

Close
→ 80%

Weak meaningful match
→ 70%

Below threshold
→ Hidden
```

If the code contains meaningful segments, compare those segments separately.

For example:

```text
Brand
Series
Color
Finish
Variant
```

can be weighted differently.

Do not use an arbitrary similarity score that produces misleading percentages.

---

# 20. Performance Requirements

The search endpoint should be fast enough for interactive designer use.

Target:

```text
Typing
↓
Debounce
↓
API
↓
Results
```

should feel near-instantaneous on normal network conditions.

Avoid returning the entire edge-band collection.

Return only the top relevant matches.

Recommended initial limit:

```text
5–10 matches
```

depending on actual data quality.

---

# 21. Testing Plan

## Matching Tests

Test:

```text
Exact code → 100%
One-character variation → expected percentage
Two-character variation → expected percentage
Completely different code → no result
Lowercase input → correct handling
Uppercase input → correct handling
Leading/trailing spaces → normalized
Invalid code → no result
```

## Dimension Tests

```text
Available dimension → accepted
Unavailable dimension → disabled
Quantity = 0 → rejected
Negative quantity → rejected
Text quantity → rejected
Duplicate item → merged
```

## API Tests

```text
Valid brand
Invalid brand
Valid code
Invalid code
Unauthorized request
Invalid project ID
Invalid design ID
Invalid quantity
Invalid dimension
Invalid edge-band code
```

## UI Tests

Test:

- Desktop
- Laptop
- Different screen sizes
- Keyboard navigation
- Slow network
- API failure
- Empty results
- Loading state
- Duplicate additions

---

# 22. Development Sequence

## Phase 1 — Inspect Existing Data

Before writing feature code:

- Inspect existing Edge Band model.
- Inspect 10–20 real seeded records.
- Understand brand structure.
- Understand code format.
- Understand dimensions.
- Check existing indexes.
- Inspect existing Design/Project schema.
- Identify where selections should be stored.

This phase is mandatory.

---

## Phase 2 — Build Matching Engine

Create:

```text
edgeBand.matcher.js
```

Test the matcher using real seeded codes.

Do not move to UI until the match results make sense.

---

## Phase 3 — Backend API

Implement:

```text
GET /brands
GET /search
GET /:code
POST /design/edge-bands
```

Test using Postman/Thunder Client or the project's existing API testing method.

---

## Phase 4 — Frontend

Build in this order:

```text
Brand selector
      ↓
Code input
      ↓
Matching results
      ↓
Selected code
      ↓
Dimensions
      ↓
Quantity inputs
      ↓
Add
      ↓
Final table
```

---

## Phase 5 — Integration

Connect:

```text
React
  ↓
API
  ↓
Service
  ↓
Existing Edge Band Data
  ↓
Design/Project Storage
```

Test using real seeded records.

---

## Phase 6 — Validation and Security

Verify:

- Backend validation.
- Authorization.
- Dimension validation.
- Edge-band existence.
- Quantity validation.
- Match verification.
- Duplicate handling.

---

## Phase 7 — UX Polish

Only after the feature works correctly:

- Loading indicators.
- Empty states.
- Error states.
- Responsive design.
- Keyboard navigation.
- Clear selection states.
- Confirmation feedback.
- Clean result table.

---

# 23. Final Architecture

```text
                         WOODARUA
                            │
                       DESIGN TEAM
                            │
                        EDGE BAND
                            │
             ┌──────────────┴──────────────┐
             │                             │
        Brand Select                  Code Input
             │                             │
             └──────────────┬──────────────┘
                            ↓
                       Search API
                            ↓
                  Seeded Edge Band Data
                            ↓
                      Match Engine
                            ↓
              ┌─────────────┼─────────────┐
              ↓             ↓             ↓
            100%           90%            80%
              │             │             │
              └─────────────┼─────────────┘
                            ↓
                    Designer Selects
                            ↓
                  Available Dimensions
                            ↓
                  Quantity per Dimension
                            ↓
                           ADD
                            ↓
                  Final Requirements
                            ↓
                       Save Design
                            ↓
                    BOQ / Production
```

---

# 24. Important Implementation Constraints

1. **Do not create duplicate edge-band master data.**
2. **Do not allow arbitrary dimensions.**
3. **Do not let the frontend determine the authoritative match percentage.**
4. **Do not automatically replace the designer's entered code without confirmation.**
5. **Do not save every search; save confirmed selections.**
6. **Do not create a new collection until the existing Design/Project schema is inspected.**
7. **Do not finalize the matching algorithm until real seeded codes have been analyzed.**
8. **Do not return low-quality fuzzy matches just to fill the result list.**
9. **Do not build the UI around fake/mock edge-band data; integrate against the real seeded records as early as possible.**

---

# 25. Definition of Done

The feature is complete when:

- [ ] Brand dropdown loads from existing data.
- [ ] Designer can enter an edge-band code.
- [ ] Search is debounced.
- [ ] Existing seeded data is searched.
- [ ] Matching codes are returned.
- [ ] Match percentage is calculated consistently.
- [ ] Poor matches are filtered out.
- [ ] Designer can select a match.
- [ ] Available dimensions are displayed.
- [ ] Unavailable dimensions cannot be selected.
- [ ] Quantity validation works.
- [ ] Designer can add the requirement.
- [ ] Duplicate selections are merged.
- [ ] Final requirement table is displayed.
- [ ] Confirmed selections are saved to the correct Design/Project record.
- [ ] Backend validates all submitted values.
- [ ] Authorization is enforced.
- [ ] API errors are handled.
- [ ] Loading states are handled.
- [ ] No-match states are handled.
- [ ] Feature works with real seeded data.
- [ ] Unit/API/UI tests pass.
- [ ] Existing Woodarua functionality remains unaffected.
