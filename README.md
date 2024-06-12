# Account API Routes

<details>
<summary>GET /accounts</summary>

## Query Parameters

### Response

```json
[{}]
```

### Query params

- page: Page number (default: 0) (e.g. page=2)
- size: Number of items per page (default: 15) (e.g. size=20)

#### Sorting params

- sort: Setting for sorting the results. Format = property:direction (e.g. sort=email:asc)

  - property: Property to sort by
  - direction: Sorting direction (asc or desc)

#### filtering params

- filter: Setting for filtering the results. Format = property:value:method (e.g. filter=email:test@test.fr:eq)

  - property: Property to filter by
  - value: Value to filter by
  - method: Filtering method (eq, ne, gt, gte, lt, lte, like, nlike, in, nin, isnull, isnotnull)

#### Account properties

- uuid: string
- email: string
- firstname: string
- lastname: string
- karma: number
- global_bantime: Timestamp
- validated: boolean

#### Filtering Methods

- eq: Equals
- neq: Not equals
- gt: Greater than
- gte: Greater than or equals
- lt: Less than
- lte: Less than or equals
- like: Like
- nlike: Not like
- in: In
- nin: Not in
- isnull: Is null
- isnotnull: Is not null

#### Sorting Methods

- asc: Ascending
- desc: Descending

</details>
<details>
<summary>GET /accounts/info/me</summary>

- Requires authentication
- Response: Account object
</details>
<details>
<summary>POST /accounts/create</summary>
- Request Body: CreateAccountDto object
- Response: Object with message and newAccount properties
</details>
<details>
  <summary>PATCH /accounts/update/uuid/:uuid</summary>
- URL Parameter: uuid (string)
- Request Body: UpdateAccountDto object
- Response: Object with message and updatedAccount properties
</details>
<details>
<summary>PATCH /accounts/update/me</summary>
- Requires authentication
- Request Body: UpdateAccountDto object
- Response: Object with message and updatedAccount properties
</details>
<details>
<summary>DELETE /accounts/delete/uuid/:uuid</summary>
- URL Parameter: uuid (string)
- Response: Object with message property
</details>
<details>
<summary>DELETE /accounts/delete/me/<summary>
- Requires authentication
- Response: Object with message property
</details>
