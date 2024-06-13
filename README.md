# Account

## API Routes Documentation

<details>
<summary>GET /accounts</summary>

### Response

```json
{
  "totalItems": 1,
  "items": [
    {
      "uuid": "6df1446c-6ccf-4cc0-8f8d-c71c4c9d2baa",
      "email": "test@test.test",
      "firstname": "Test",
      "lastname": "Test",
      "phone": "+33600000000",
      "karma": 0,
      "global_bantime": "0",
      "validated": true
    }
  ],
  "page": 0,
  "size": 15
}
```

### Query Parameters

#### Pagination

- page: Page number (default: 0) (e.g. page=2)
- size: Number of items per page (default: 15) (e.g. size=20)

#### Sorting

- sort: Setting for sorting the results. Format = property:direction (e.g. sort=email:asc)

  - property: Property to sort by
  - direction: Sorting direction (asc or desc)

#### Filtering

- filter: Setting for filtering the results. Format = property:method:value (e.g. filter=email:eq:test@test.com)

  - property: Property to filter by
  - value: Value to filter by
  - method: Filtering method (eq, ne, gt, gte, lt, lte, like, nlike, in, nin, isnull, isnotnull)

#### Available properties

- uuid: string
- email: string
- firstname: string
- lastname: string
- karma: number
- global_bantime: Timestamp
- validated: boolean

#### Available filtering methods

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

#### Available sorting methods

- asc: Ascending
- desc: Descending

</details>
<details>
<summary>GET /accounts/info/me</summary>

### Response

```json
{
  "uuid": "6df1446c-6ccf-4cc0-c71c4c9d2baa",
  "email": "test.test@test.com",
  "firstname": "Test",
  "lastname": "Test",
  "phone": "+33600000000",
  "karma": 0,
  "global_bantime": "0",
  "validated": false
}
```

### Query Parameters

#### Headers

- Authorization: Bearer + valid JWT Token

</details>
<details>
<summary>POST /accounts/create</summary>

### Response

```json
{
  "message": "Bienvenue ! Votre compte a été créé avec succès.",
  "newAccount": {
    "email": "test@test.fr",
    "firstname": "Test",
    "lastname": "Test",
    "phone": "+33600000000",
    "uuid": "6df1446c-6ccf-4cc0-c71c4c9d2baa",
    "karma": 0,
    "global_bantime": "0",
    "validated": false
  }
}
```

### Query parameters

#### Body

```json
{
  "email": "valid@address.com",
  "password": "password",
  "firstname": "Test",
  "lastname": "Test",
  "phone": "+33600000000"
}
```

</details>
<details>
<summary>PATCH /accounts/update/uuid/:uuid</summary>
  
### Response

```json
{
  "message": "Utilisateur mis à jour avec succès.",
  "updatedAccount": {
    "uuid": "6df1446c-6ccf-4cc0-c71c4c9d2baa",
    "email": "new-valid@address.com",
    "firstname": "Test",
    "lastname": "Test",
    "phone": "+33600000000",
    "karma": 0,
    "global_bantime": "0",
    "validated": true
  }
}
```

### Query parameters

#### Body

**All properties are optional, you may only specify what you'd like to change.**

```json
{
  "email": "test@test.fr",
  "firstname": "Test",
  "lastname": "Test",
  "phone": "+33600000000"
}
```

</details>
<details>
<summary>PATCH /accounts/update/me</summary>

### Response

```json
{
  "message": "Utilisateur mis à jour avec succès.",
  "updatedAccount": {
    "uuid": "6df1446c-6ccf-4cc0-c71c4c9d2baa",
    "email": "new-valid@address.com",
    "firstname": "Test",
    "lastname": "Test",
    "phone": "+33600000000",
    "karma": 0,
    "global_bantime": "0",
    "validated": true
  }
}
```

### Query parameters

#### Headers

- Authorization: Bearer + valid JWT Token

#### Body

**All properties are optional, you may only specify what you'd like to change.**

```json
{
  "email": "test@test.fr",
  "firstname": "Test",
  "lastname": "Test",
  "phone": "+33600000000"
}
```

</details>
<details>
<summary>DELETE /accounts/delete/uuid/:uuid</summary>

### Response

```json
{
  "message": "Utilisateur supprimé avec succès."
}
```

### Query parameters

#### URL Parameter

- uuid (string): The uuid of the user

</details>
<details>
<summary>DELETE /accounts/delete/me/ </summary>
### Response

```json
{
  "message": "Utilisateur supprimé avec succès."
}
```

### Query parameters

#### Headers

- Authorization: Bearer + valid JWT Token

</details>
<details>
<summary>POST /login </summary>

### Query Parameters

#### Body

```json
{
  "email": "valid@email.com",
  "password": "password"
}
```

### Response

```json
{
  "token": "eyJhbRBUr1ru-D6VwUDxuDsXE"
}
```

</details>
