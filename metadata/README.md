# Metadata Service
Store files metadata

```
{
  url: 'image src',
  title: 'text shown on hover',
  alt: 'description',
  **lowsrc**: 'low quality version url',
  id: 'mongo id'
}
```

### GET /api/meta
Get metadata for a user

### GET /api/meta/:imageUrl
Get metadata for an image

### POST /api/meta/
Create new metadata entry

### PUT /api/meta/:imageUrl
Update metadata for an image

### DELETE /api/meta/:imageUrl
Delete metadata for an image
