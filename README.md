# PharmaDist ERP

Pharmaceutical Wholesale Distribution & Accounting ERP — Desktop Application

## Stack
- **Frontend**: React 18 + Vite + TanStack Query + React Router
- **Backend**: Node.js + Express 4 + Sequelize 6 + MySQL 8
- **Desktop**: Electron 31 + electron-builder + electron-updater
- **PDF**: pdfmake (invoice printing)
- **Auth**: JWT (bcryptjs)

## Architecture (Option A — Single Machine)

```
Electron shell
├── Spawns Node/Express backend on localhost:3001
└── Loads React frontend (Vite dev server in dev, built /dist in production)
        ↕ REST API (/api/*)
    Express API
        ↕ Sequelize ORM
    MySQL 8 (local install)
```

To switch to **Option B (LAN)**: set `VITE_API_BASE_URL=http://<server-ip>:3001/api` on each client machine.

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- MySQL 8 running locally

### 1. Install dependencies
```bash
cd pharma-erp
npm run install:all
```

### 2. Configure environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL credentials
```

### 3. Create database
```sql
CREATE DATABASE pharma_erp_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run migrations & seed
```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 5. Start development
```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev

# Terminal 3 — Electron (optional, or just use browser at localhost:5173)
cd ../  # root
npm run electron:dev
```

### Default credentials
- Username: `admin`
- Password: `admin123`  ← **Change immediately after first login**

## Build for Production
```bash
npm run build:frontend
npm run electron:build
# Installer output: dist-electron/
```

## Database Backup
Click **Settings → Backup Database** in the app, or use:
```bash
mysqldump -u root -p pharma_erp > backup.sql
```

## Module Permissions
Each user (except admin) has per-module ACL:
`parties | products | purchase | sales | stock | ledger | reports | settings`

Each module has: `can_view | can_create | can_edit | can_delete | can_print`

Admin role bypasses all checks.

## Key Business Rules
1. **Batch selection** — FEFO by default; manual override on billing screen
2. **GST** — Intra-state: SGST+CGST; Inter-state: IGST; based on party state code
3. **DPCO drugs** — Discount cannot exceed `dpco_price_ceiling`; flagged visually
4. **Schemes** — Free-quantity schemes (10+1) reduce stock but have zero sale value
5. **Ledger** — Auto-posted from every transaction; no direct edits
6. **Voucher numbers** — Independent sequences per type, never counted from rows
