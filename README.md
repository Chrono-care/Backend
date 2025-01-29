# API Routes Documentation

## Account

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

#### URL Parameters

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

### Options documentation

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

<details><summary>GET /accounts/subscriptions/me</summary>
  
### Response

```json
[
    {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    }
]
```

### Query parameters

#### Headers

- Authorization: Bearer + valid JWT Token

</details>
<details><summary>GET /accounts/subscriptions/:uuid</summary>
  
### Response

```json
[
    {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    }
]
```

</details>
<details>
<summary>POST /login </summary>

### Response

```json
{
  "token": "eyJhbRBUr1ru-D6VwUDxuDsXE"
}
```

### Query Parameters

#### Body

```json
{
  "email": "valid@email.com",
  "password": "password"
}
```

</details>

## Forum

<details>
<summary>GET /forum</summary>

### Response

```json
{
  "totalItems": 1,
  "items": [
    {
      "id": 1,
      "title": "Test 1",
      "description": "Lorem Ipsum Dolor",
      "img_url": "https://test.test.ts/blabla.png",
      "creation_date": "2024-10-29T15:12:05.260Z",
      "is_archived": false
    }
  ],
  "page": 0,
  "size": 15
}
```

### Query Parameters

#### URL Parameters

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

### Options documentation

#### Available properties

- id: number
- title: string
- description: string
- is_archived: boolean

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
<summary>POST /forum/create</summary>

### Response

```json
{
  "title": "Test 1",
  "description": "Lorem Ipsum Dolor",
  "img_url": "https://test.test.ts/blabla.png",
  "is_archived": false,
  "id": 13,
  "creation_date": "2024-10-29T15:12:05.260Z"
}
```

### Query parameters

#### Body

```json
{
  "title": "Test 1",
  "description": "Lorem Ipsum Dolor",
  "img_url": "https://test.test.ts/blabla.png"
}
```

</details>
<details>
<summary>PATCH /forum/update/:id</summary>
  
### Response

```json
{
  "title": "Test 1",
  "description": "Lorem Ipsum Dolor",
  "img_url": "https://test.test.ts/blabla.png",
  "is_archived": false,
  "id": 13,
  "creation_date": "2024-10-29T15:12:05.260Z"
}
```

### Query parameters

#### Body

**All properties are optional, you may only specify what you'd like to change.**

```json
{
  "title": "Test 1",
  "description": "Lorem Ipsum Dolor",
  "img_url": "https://test.test.ts/blabla.png",
  "is_archived": false
}
```

</details>
<details>
<summary>PATCH /forum/archive/:id</summary>

### Response

```json
{
  "id": 1,
  "title": "Test 1",
  "description": "Lorem Ipsum Dolor",
  "img_url": "https://test.test.ts/blabla.png",
  "creation_date": "2024-10-29T15:12:05.260Z",
  "is_archived": true
}
```

### Query Parameters

#### URL Parameters

- set (optional, true by default): boolean used to specify a value to is_archived.

</details>
<details><summary>GET /forum/subscribers/:forumId</summary>
  
### Response

```json
[
    {
        "uuid": "0790ad06-6c39-4196-9ffc-6776eaae839a",
        "email": "pascal.test@test.bla",
        "firstname": "Pascal",
        "lastname": "Test",
        "phone": "+33609090909",
        "karma": 0,
        "global_bantime": "0",
        "validated": false
    }
]
```

</details>
<details><summary>POST /forum/subscribe/me/:forumId</summary>
  
### Response

{
    "account": {
        "uuid": "0790ad06-6c39-4196-9ffc-6776eaae839a",
        "email": "pascal.test@test.bla",
        "firstname": "Pascal",
        "lastname": "Test",
        "phone": "+33609090909",
        "karma": 0,
        "global_bantime": "0",
        "validated": false
    },
    "forum": {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    },
    "id": 1,
    "creation_date": "2025-01-29T13:50:40.148Z"
}

### Query parameters

#### Headers

- Authorization: Bearer + valid JWT Token

</details>
<details><summary>POST /forum/subscribe/:forumId/:accountId</summary>
  
### Response

{
    "account": {
        "uuid": "0790ad06-6c39-4196-9ffc-6776eaae839a",
        "email": "pascal.test@test.bla",
        "firstname": "Pascal",
        "lastname": "Test",
        "phone": "+33609090909",
        "karma": 0,
        "global_bantime": "0",
        "validated": false
    },
    "forum": {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    },
    "id": 1,
    "creation_date": "2025-01-29T13:50:40.148Z"
}
</details>
<details><summary>DELETE /forum/subscribe/me/:forumId</summary>
  
### Response

{
    "creation_date": "2025-01-29T13:50:40.148Z"
}

### Query parameters

#### Headers

- Authorization: Bearer + valid JWT Token

</details>
<details><summary>DELETE /forum/subscribe/:forumId/:accountId</summary>
  
### Response

{
    "creation_date": "2025-01-29T13:50:40.148Z"
}

</details>

## Thread
<details><summary>GET /thread</summary>
  
### Response

```json
{
  "totalItems": 1,
  "items": [
        {
            "id": 1,
            "title": "Thread Test",
            "content": "Thread content",
            "imageUrl": "https://blablatest12312.fr/test/img.png",
            "ratio": null,
            "is_archived": false,
            "createdAt": "2025-01-29T14:27:19.629Z",
            "updatedAt": "2025-01-29T14:27:19.629Z"
        }
  ],
  "page": 0,
  "size": 15
}
```

### Query Parameters

#### URL Parameters

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

### Options documentation

#### Available properties

- id: number
- title: string
- content: string
- is_archived: boolean

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
<details><summary>POST /thread/create</summary>
  
### Response

```json
{
    "title": "Thread Test1",
    "content": "Thread content",
    "imageUrl": "https://blablatest12312.fr/test/img.png",
    "author": {
        "uuid": "0790ad06-6c39-4196-9ffc-6776eaae839a",
        "email": "pascal.test@test.bla",
        "firstname": "Pascal",
        "lastname": "Test",
        "phone": "+33609090909",
        "karma": 0,
        "global_bantime": "0",
        "validated": false
    },
    "forum": {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    },
    "ratio": null,
    "id": 2,
    "is_archived": false,
    "createdAt": "2025-01-29T14:37:24.011Z",
    "updatedAt": "2025-01-29T14:37:24.011Z"
}
```

### Query parameters

#### Body

```json
{
    "title": "Thread Test1",
    "content": "Thread content",
    "imageUrl": "https://blablatest12312.fr/test/img.png",
    "is_archived": false,
    "forumId": 1
}
```

</details>
<details><summary>PATCH /thread/update/:id</summary>
  
### Response

```json
{
    "title": "Thread Test1",
    "content": "Thread content",
    "imageUrl": "https://blablatest12312.fr/test/img.png",
    "author": {
        "uuid": "0790ad06-6c39-4196-9ffc-6776eaae839a",
        "email": "pascal.test@test.bla",
        "firstname": "Pascal",
        "lastname": "Test",
        "phone": "+33609090909",
        "karma": 0,
        "global_bantime": "0",
        "validated": false
    },
    "forum": {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    },
    "ratio": null,
    "id": 2,
    "is_archived": false,
    "createdAt": "2025-01-29T14:37:24.011Z",
    "updatedAt": "2025-01-29T14:37:24.011Z"
}
```

### Query parameters

#### Body

**All properties are optional, you may only specify what you'd like to change.**

```json
{
    "title": "Thread Test1",
    "content": "Thread content",
    "imageUrl": "https://blablatest12312.fr/test/img.png",
    "is_archived": false,
    "forumId": 1
}
```
</details>
<details><summary>DELETE /thread/archive/:id</summary>
  
### Response

```json
{
    "title": "Thread Test1",
    "content": "Thread content",
    "imageUrl": "https://blablatest12312.fr/test/img.png",
    "author": {
        "uuid": "0790ad06-6c39-4196-9ffc-6776eaae839a",
        "email": "pascal.test@test.bla",
        "firstname": "Pascal",
        "lastname": "Test",
        "phone": "+33609090909",
        "karma": 0,
        "global_bantime": "0",
        "validated": false
    },
    "forum": {
        "id": 1,
        "title": "Test 15",
        "description": "Lorem Ipsum Dolor",
        "img_url": "https://test.test.ts/blabla.png",
        "creation_date": "2025-01-29T13:36:51.802Z",
        "is_archived": false
    },
    "ratio": null,
    "id": 2,
    "is_archived": true,
    "createdAt": "2025-01-29T14:37:24.011Z",
    "updatedAt": "2025-01-29T14:37:24.011Z"
}
```

### Query Parameters

#### URL Parameters

- set (optional, true by default): boolean used to specify a value to is_archived.

</details>

