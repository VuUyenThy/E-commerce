# Ecommerce MVP API

RESTful API monolithic cho hệ thống thương mại điện tử theo sơ đồ ERD đã cho.

## Công nghệ sử dụng
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- Docker + Docker Compose

## Cấu trúc dự án

```bash
ecommerce-mvp/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  └─ env.js
│  ├─ middleware/
│  │  ├─ authMiddleware.js
│  │  └─ errorHandler.js
│  ├─ controllers/
│  │  ├─ auth.controller.js
│  │  ├─ product.controller.js
│  │  ├─ order.controller.js
│  │  ├─ shipment.controller.js
│  │  └─ user.controller.js
│  ├─ routes/
│  │  ├─ auth.routes.js
│  │  ├─ product.routes.js
│  │  ├─ order.routes.js
│  │  ├─ shipment.routes.js
│  │  └─ user.routes.js
│  ├─ prisma/
│  │  └─ client.js
│  └─ ...
├─ prisma/
│  └─ schema.prisma
├─ .env.example
├─ .gitignore
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
└─ README.md
```

## Cài đặt

```bash
npm install
cp .env.example .env
```

## Tạo database Prisma

```bash
npx prisma migrate dev --name init
```

## Chạy ứng dụng ở local

```bash
npm run dev
```

## Kiểm tra API

- Health check: http://localhost:3001/health
- Đăng ký: POST /api/auth/register
- Đăng nhập: POST /api/auth/login
- Lấy sản phẩm: GET /api/products
- Tạo đơn hàng: POST /api/orders
- Giao hàng: POST /api/shipments

## Chạy bằng Docker Compose

```bash
docker-compose up --build
```

## JWT

- Token được gửi theo định dạng: `Authorization: Bearer <token>`

## Health check

Route `/health` sẽ kiểm tra trạng thái của service và database PostgreSQL.
