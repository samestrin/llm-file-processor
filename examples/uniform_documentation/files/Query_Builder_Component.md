### Query Builder Component

A flexible component for building complex database queries without writing raw SQL.

# Features

- Object-oriented query construction
- Support for MySQL, PostgreSQL, and SQLite
- Automatic parameter binding for security
- Query optimization suggestions

## Methods

### select(columns)
Specifies which columns to retrieve.

```javascript
queryBuilder.select(['id', 'name', 'email']);
```

### where(conditions)
Adds WHERE conditions to the query.

```javascript
queryBuilder.where({
  status: 'active',
  role: ['admin', 'editor']
});
```

### Examples

Creating a basic query:

```javascript
const query = new QueryBuilder()
  .select(['id', 'title', 'created_at'])
  .from('posts')
  .where({ status: 'published' })
  .orderBy('created_at', 'DESC')
  .limit(10);

const results = await query.execute();
```

## Error Handling

```javascript
try {
  const results = await query.execute();
} catch (error) {
  console.error('Query execution failed:', error.message);
}
```