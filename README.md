# Node project

A Node project made with Express, where it is carried out thanks to the React course from Coderhouse

## Screenshots

[//]: # (![WoT App Screenshot]&#40;src/public/images/3.png&#41;)

[//]: # ()
[//]: # (![WoT App Screenshot]&#40;src/public/images/2.png&#41;)

[//]: # ()
[//]: # (![WoT App Screenshot]&#40;src/public/images/1.png&#41;)


## Tools Used

- Node
- Express
- Handlebars
- Express Session
- JWT
- Mongoose
- Mongoose Paginate V2
- Passport
- Passport JWT
- Passport Local
- Connect Mongo
- Cookie Parser
- Dotenv
- Bcrypt
- Body Parser

## Installation and Testing

Modify the [.env](.env.example) file with your configuration.

* Install: `npm install`

## Testing

```bash
  npm start
```

## In the browser

```http
  http://localhost:<your-port>
```

# In Postman:

## Users

| Parameter    | Type       | Description                        |
|:-------------|:-----------|:-----------------------------------|
| `_id`        | `ObjectId` | **Not required**. Your user id key |
| `first_name` | `string`   | **Required**. Your first name      |
| `last_name`  | `string`   | **Required**. Your last name       |
| `email`      | `string`   | **Required**. Your email           |
| `age`        | `number`   | **Required**. Your age             |
| `password`   | `string`   | **Required**. Your password        |
| `cart`       | `ObjectId` | **Required**. Your cart            |
| `role`       | `string`   | **Required**. Your role            |

## Products

```http
  GET http://localhost:8080/api/products/
```

```http
  GET http://localhost:8080/api/products/:pid
```

```http
  POST http://localhost:8080/api/products/
```

```http
  PUT http://localhost:8080/api/products/:pid
```

```http
  DELETE http://localhost:8080/api/products/:pid
```

| Parameter     | Type      | Description                           |
|:--------------|:----------|:--------------------------------------|
| `_id`         | `number`  | **Not required**. Your product id key |
| `title`       | `string`  | **Required**. Your title              |
| `description` | `string`  | **Required**. Your description        |
| `code`        | `string`  | **Required**. Your code               |
| `price`       | `number`  | **Required**. Your price              |
| `status`      | `boolean` | **Not required**. Your status         |
| `stock`       | `number`  | **Required**. Your stock              |
| `category`    | `string`  | **Required**. Your category           |
| `thumbnails`  | `array`   | **Not required**. Your thumbnails     |

### Note: `price` and `stock` must be greater than or equal to 0.

## Carts

```http
  GET http://localhost:8080/api/carts/
```

```http
  GET http://localhost:8080/api/carts/:cid
```

```http
  POST http://localhost:8080/api/carts/
```

```http
  POST http://localhost:8080/api/carts/:cid/products/:pid
```

```http
  DELETE http://localhost:8080/api/carts/:cid/products/:pid
```

```http
  PUT http://localhost:8080/api/carts/:cid
```

```http
  PUT http://localhost:8080/api/carts/:cid/products/:pid
```

```http
  DELETE http://localhost:8080/api/carts/:cid
```

### Cart Schema

| Parameter  | Type     | Description                        |
|:-----------|:---------|:-----------------------------------|
| `_id`      | `ObjectId` | **Not required**. Your cart id key |
| `products` | `array`  | **Required**. Your products        |

### For products parameter

| Parameter  | Type       | Description                                    |
|:-----------|:-----------|:-----------------------------------------------|
| `_id`      | `ObjectId` | **Not required**. Your product id key          |
| `quantity` | `number`   | **Required**. Your quantity                    |
| `product`  | `ObjectId` | **Required**. The referenced product id key    |

### Note: `quantity` must be greater than or equal to 1.


## Authors

- [@Juan Ignacio Caprioli (ChanoChoca)](https://github.com/ChanoChoca)
