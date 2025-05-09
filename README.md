# E‑Commerce API

Aplikasi backend untuk mengelola produk dan pesanan pada sistem e‑commerce. Dibangun dengan Node.js, Express, PostgreSQL, dan Drizzle ORM.

## Fitur

- Operasi CRUD untuk produk dan pesanan
- Interaksi dengan database melalui Drizzle ORM
- Dokumentasi API interaktif menggunakan Swagger UI
- Validasi input dan penanganan error
- Integritas referensial dengan foreign key dan ON DELETE CASCADE

## Teknologi

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Drizzle ORM**
- **Swagger UI**

## Prasyarat

- Node.js v14+ terpasang
- PostgreSQL v12+ terpasang
- Salah satu package manager: npm, Yarn, pnpm, atau Bun

## Instalasi

1. **Clone repositori**

    ```bash
    git clone https://github.com/salmanabdurrahman/ecommerce-api.git
    cd ecommerce-api
    ```

2. **Pasang dependensi**

    ```bash
    npm install
    # atau
    # yarn install
    # pnpm install
    # bun install
    ```

3. **Atur variabel lingkungan**

    ```bash
    cp .env.example .env
    ```

    Edit file `.env` sesuai kredensial database Anda.

4. **Buat database PostgreSQL**

    ```sql
    CREATE DATABASE ecommerce_db;
    ```

5. **Generate dan jalankan migrasi**

    ```bash
    npm run generate
    npm run migrate
    ```

6. _(Opsional)_ **Seed data contoh**

    ```bash
    npm run seed
    ```

## Menjalankan Aplikasi

- **Mode development (hot reload)**

    ```bash
    npm run dev
    ```

- **Mode production**

    ```bash
    npm start
    ```

Akses API di `http://localhost:3000`.
Dokumentasi Swagger UI di `http://localhost:3000/api-docs`.

## Endpoint API

### Produk

| Method | Endpoint            | Deskripsi                   |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/products`     | Ambil semua produk          |
| GET    | `/api/products/:id` | Ambil produk berdasarkan ID |
| POST   | `/api/products`     | Tambah produk baru          |
| PUT    | `/api/products/:id` | Perbarui produk             |
| DELETE | `/api/products/:id` | Hapus produk                |

### Pesanan

| Method | Endpoint          | Deskripsi                    |
| ------ | ----------------- | ---------------------------- |
| GET    | `/api/orders`     | Ambil semua pesanan          |
| GET    | `/api/orders/:id` | Ambil pesanan berdasarkan ID |
| POST   | `/api/orders`     | Buat pesanan baru            |
| PUT    | `/api/orders/:id` | Perbarui pesanan             |
| DELETE | `/api/orders/:id` | Hapus pesanan                |

## Contoh Penggunaan

**Membuat produk**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Model terbaru smartphone",
    "price": 599.99
  }'
```

**Membuat pesanan**

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```
