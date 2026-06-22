<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
</p>

# 📋 Leave Management System (Leave MS)

> **TugasVibeCodeBNI** — Enterprise-grade Employee Leave Management System dengan role-based access control, real-time notifications, dan premium glassmorphism UI.

---

## 📖 Daftar Isi

- [Tentang Aplikasi](#-tentang-aplikasi)
- [Tech Stack](#-tech-stack)
- [Arsitektur](#-arsitektur)
- [Fitur Berdasarkan Role](#-fitur-berdasarkan-role)
  - [Manager (Admin)](#-manager-admin)
  - [Supervisor](#-supervisor)
  - [Employee](#-employee)
- [Fitur Global](#-fitur-global-semua-role)
- [Halaman Aplikasi](#-halaman-aplikasi)
- [Database Schema](#-database-schema)
- [Instalasi & Setup](#-instalasi--setup)
- [Demo Accounts](#-demo-accounts)
- [Struktur Folder](#-struktur-folder)
- [Business Rules](#-business-rules)

---

## 🏢 Tentang Aplikasi

**Leave MS** adalah sistem manajemen cuti karyawan yang dibangun untuk kebutuhan enterprise. Aplikasi ini mendukung 3 level akses pengguna (Manager, Supervisor, Employee) dengan fitur yang disesuaikan per role.

### Highlight:
- 🔐 **Role-Based Access Control** — 3 level akses dengan permission berbeda
- 📊 **Interactive Dashboard** — Charts real-time dengan filter rentang waktu
- 🌙 **Dark Mode** — Full dark mode support di seluruh aplikasi
- 🎉 **Animasi Premium** — Framer Motion animations, confetti effects
- 📱 **Responsive** — Mobile-first design dengan sidebar collapsible
- 🔔 **Notification System** — Real-time broadcast & notification bell
- 📥 **Export Excel** — Download data ke format `.xlsx`
- 🎂 **Birthday Tracker** — Pantau ulang tahun karyawan

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 16.2 (App Router + Turbopack) |
| **UI Library** | React 19.2 |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 4.x |
| **Database** | Supabase (PostgreSQL) |
| **UI Components** | shadcn/ui + Radix UI |
| **Charts** | Recharts 3.8 |
| **Forms** | React Hook Form + Zod 4 |
| **Animations** | Framer Motion 12 |
| **Dark Mode** | next-themes |
| **Excel Export** | SheetJS (xlsx) + FileSaver |
| **Confetti** | canvas-confetti |
| **Toast** | Sonner |
| **Icons** | Lucide React |

---

## 🏗 Arsitektur

```
3-Layer Architecture
┌──────────────────────────────────────┐
│           Components (UI)            │  ← React Components + shadcn/ui
├──────────────────────────────────────┤
│          Hooks (State Logic)         │  ← useEmployees, useLeaveRequests, useDashboard
├──────────────────────────────────────┤
│        Services (Data Layer)         │  ← EmployeeStorageService, LeaveStorageService, etc.
├──────────────────────────────────────┤
│      Supabase (PostgreSQL DB)        │  ← Cloud-hosted database
└──────────────────────────────────────┘
```

**Data Flow:**
- Data dari Supabase (snake_case) → **Service Layer** (mapping ke camelCase) → **Hooks** (state management) → **Components** (render)
- Validasi: **Zod** di frontend + **Constraints** di database

---

## 👥 Fitur Berdasarkan Role

### 🔴 Manager (Admin)

Manager memiliki akses **penuh** ke semua fitur aplikasi. Ini adalah role dengan level tertinggi.

#### 📊 Dashboard
| Fitur | Deskripsi |
|-------|-----------|
| Total Employees | Jumlah seluruh karyawan yang terdaftar |
| Pending Requests | Jumlah permintaan cuti yang menunggu approval **dari semua karyawan** |
| Approved Requests | Jumlah cuti yang telah disetujui **dari semua karyawan** |
| Rejected Requests | Jumlah cuti yang ditolak **dari semua karyawan** |
| Block Leave Pending | Jumlah karyawan yang belum mengambil block leave |
| 📈 Leave Status Distribution | Pie chart distribusi status cuti (Pending/Approved/Rejected) |
| 📈 Employees by Department | Horizontal bar chart jumlah karyawan per departemen |
| 📈 Leave Requests Trend | Area chart tren permintaan cuti per bulan |
| 📈 Leave Types by Status | Stacked bar chart jenis cuti per status |
| 📅 Date Range Filter | Filter chart berdasarkan: **1 Minggu, 1 Bulan, 3 Bulan, 6 Bulan, 1 Tahun** |
| 🕐 Recent Leave Requests | 5 permintaan cuti terbaru dari semua karyawan |

#### 👨‍💼 Employee Management
| Fitur | Deskripsi |
|-------|-----------|
| Lihat Semua Karyawan | Grid card semua karyawan dengan avatar, department, position, leave balance |
| Tambah Karyawan | Form: Nama, Department, Position, Tanggal Lahir |
| Edit Karyawan | Edit semua data termasuk Leave Balance, Block Leave Status, Tanggal Lahir |
| Hapus Karyawan | Confirmation dialog sebelum penghapusan permanen |
| Cari Karyawan | Search bar untuk filter berdasarkan nama |
| 📥 Export Excel | Download data seluruh karyawan ke file `.xlsx` |

**Kolom Export Employees:**
| Kolom | Deskripsi |
|-------|-----------|
| Nama | Nama lengkap karyawan |
| Department | Departemen karyawan |
| Position | Jabatan karyawan |
| Sisa Cuti (Hari) | Saldo cuti tahunan tersisa |
| Block Leave | Status block leave (Sudah/Belum) |

#### 📅 Leave Requests
| Fitur | Deskripsi |
|-------|-----------|
| Lihat Semua Cuti | Semua request cuti dari **seluruh karyawan** |
| Filter Status | Filter berdasarkan: All, Pending, Approved, Rejected |
| Buat Request Baru | Pilih karyawan manapun untuk dibuatkan request cuti |
| ✅ Approve Cuti | Setujui request cuti (dengan efek confetti 🎉) |
| ❌ Reject Cuti | Tolak request cuti |
| 📥 Export Excel | Download data seluruh leave requests ke file `.xlsx` |

**Kolom Export Leave Requests:**
| Kolom | Deskripsi |
|-------|-----------|
| Nama Karyawan | Nama karyawan yang mengajukan |
| Jenis Cuti | Cuti Tahunan / Block Leave / Sakit |
| Tanggal Mulai | Tanggal mulai cuti |
| Tanggal Selesai | Tanggal selesai cuti |
| Durasi (Hari) | Jumlah hari cuti |
| Alasan | Alasan pengajuan cuti |
| Status | Menunggu / Disetujui / Ditolak |

#### 🎂 Birthdays
| Fitur | Deskripsi |
|-------|-----------|
| Hari Ini | Kartu besar dengan gradient warna untuk karyawan yang ulang tahun hari ini |
| Segera (30 Hari) | List karyawan yang ulang tahun dalam 30 hari ke depan dengan countdown |
| Nanti | Semua ulang tahun yang lebih dari 30 hari |

#### 📢 Broadcast Notifikasi *(Khusus Manager)*
| Fitur | Deskripsi |
|-------|-----------|
| Kirim Pengumuman | Form dengan judul (maks 100 karakter) dan pesan (maks 500 karakter) |
| Target | Notifikasi dikirim ke **semua pengguna** |
| Feedback | Toast notification saat berhasil/gagal |

#### 🔔 Notifications
| Fitur | Deskripsi |
|-------|-----------|
| Bell Icon | Icon lonceng di header dengan badge unread count |
| Dropdown | List 20 notifikasi terbaru dengan scroll |
| Mark as Read | Tandai notifikasi individual atau semua sekaligus |
| Delete | Hapus notifikasi |
| Auto Refresh | Polling setiap 30 detik |

---

### 🟡 Supervisor

Supervisor memiliki akses **terbatas** — bisa melihat dan mengelola cuti bawahan langsung, namun tidak bisa mengelola data karyawan.

#### 📊 Dashboard
| Fitur | Deskripsi |
|-------|-----------|
| My Leave Balance | Saldo cuti pribadi Supervisor |
| My Pending Requests | Jumlah request cuti pribadi yang pending |
| My Approved Requests | Jumlah request cuti pribadi yang approved |
| My Rejected Requests | Jumlah request cuti pribadi yang rejected |
| 📈 Charts | Semua chart sama seperti Manager |
| 📅 Date Range Filter | Filter chart: 1W, 1M, 3M, 6M, 1Y |

> ⚠️ **Perbedaan dengan Manager:** Stats card hanya menampilkan data **milik Supervisor sendiri**, bukan semua karyawan.

#### 👨‍💼 Employee Management
| Akses | Status |
|-------|--------|
| Lihat Karyawan | ❌ **Tidak bisa akses** — redirect ke Dashboard |
| Tambah/Edit/Hapus | ❌ **Tidak tersedia** |

#### 📅 Leave Requests
| Fitur | Deskripsi |
|-------|-----------|
| Lihat Cuti | Hanya request milik **diri sendiri** (Hikari) dan **bawahan langsung** (Haikal) |
| Filter Status | All, Pending, Approved, Rejected |
| Buat Request Baru | Hanya untuk diri sendiri |
| ✅ Approve Cuti Bawahan | Bisa approve cuti **Haikal** (bawahan) |
| ❌ Reject Cuti Bawahan | Bisa reject cuti **Haikal** |
| Approve/Reject Sendiri | ❌ **Tidak bisa** approve/reject cuti milik sendiri |
| 📥 Export Excel | ❌ **Tidak tersedia** (hanya Manager) |

#### 🎂 Birthdays
| Fitur | Deskripsi |
|-------|-----------|
| Akses | ✅ Bisa melihat semua ulang tahun karyawan |

#### 📢 Broadcast
| Akses | Status |
|-------|--------|
| Menu Broadcast | ❌ **Tidak muncul** di sidebar |
| Akses Langsung | ❌ **Redirect** ke Dashboard |

#### 🔔 Notifications
| Fitur | Deskripsi |
|-------|-----------|
| Terima Notifikasi | ✅ Bisa melihat semua notifikasi yang dikirim Manager |
| Mark as Read | ✅ Bisa tandai dibaca |

---

### 🟢 Employee

Employee memiliki akses **paling terbatas** — hanya bisa melihat data pribadi dan mengajukan cuti.

#### 📊 Dashboard
| Fitur | Deskripsi |
|-------|-----------|
| My Leave Balance | Saldo cuti pribadi |
| My Pending Requests | Jumlah request cuti pribadi yang pending |
| My Approved Requests | Jumlah request cuti pribadi yang approved |
| My Rejected Requests | Jumlah request cuti pribadi yang rejected |
| 📈 Charts | Semua chart tersedia (data global) |
| 📅 Date Range Filter | Filter chart: 1W, 1M, 3M, 6M, 1Y |

> ⚠️ **Perbedaan:** Stats card hanya data **milik Employee sendiri**. Tidak ada card "Total Employees" atau "Block Leave Pending".

#### 👨‍💼 Employee Management
| Akses | Status |
|-------|--------|
| Semua Fitur | ❌ **Tidak bisa akses** — redirect ke Dashboard |

#### 📅 Leave Requests
| Fitur | Deskripsi |
|-------|-----------|
| Lihat Cuti | Hanya request **milik sendiri** (Haikal) |
| Filter Status | All, Pending, Approved, Rejected |
| Buat Request Baru | ✅ Hanya untuk diri sendiri (auto-select) |
| Approve/Reject | ❌ **Tidak tersedia** |
| 📥 Export Excel | ❌ **Tidak tersedia** |

#### 🎂 Birthdays
| Fitur | Deskripsi |
|-------|-----------|
| Akses | ✅ Bisa melihat semua ulang tahun karyawan |

#### 📢 Broadcast
| Akses | Status |
|-------|--------|
| Menu Broadcast | ❌ **Tidak muncul** di sidebar |

#### 🔔 Notifications
| Fitur | Deskripsi |
|-------|-----------|
| Terima Notifikasi | ✅ Bisa melihat notifikasi yang dikirim Manager |
| Mark as Read | ✅ Bisa tandai dibaca |

---

## 🌐 Fitur Global (Semua Role)

| Fitur | Deskripsi |
|-------|-----------|
| 🌙 **Dark Mode** | Toggle tema gelap/terang via icon di header. Preferensi disimpan di localStorage. |
| 🎨 **Glassmorphism UI** | Backdrop blur, transparent backgrounds, premium shadows di seluruh UI |
| ✨ **Animasi Premium** | Staggered entrance, fade-in, animated counters menggunakan Framer Motion |
| 🎉 **Confetti Effect** | Efek confetti saat Manager/Supervisor approve cuti |
| 📱 **Responsive Design** | Mobile sidebar (sheet/drawer), responsive grid, adaptive typography |
| 🔔 **Notification Bell** | Badge unread count, auto-refresh 30 detik |
| 🔐 **Auth Guard** | Redirect otomatis ke login jika belum autentikasi |
| 🍞 **Toast Notifications** | Feedback real-time untuk semua aksi (Sonner) |
| 📋 **Code Review Page** | Halaman publik (tanpa login) menampilkan laporan code review |

---

## 📄 Halaman Aplikasi

| Route | Halaman | Akses | Deskripsi |
|-------|---------|-------|-----------|
| `/login` | Login | Public | Halaman login dengan demo accounts |
| `/dashboard` | Dashboard | All Roles | Overview stats, charts, recent activity |
| `/employees` | Employees | Manager | CRUD karyawan + export Excel |
| `/employees/new` | Add Employee | Manager | Form tambah karyawan baru |
| `/employees/edit/[id]` | Edit Employee | Manager | Form edit data karyawan |
| `/leave` | Leave Requests | All Roles | List & manage leave requests |
| `/leave/new` | New Leave | All Roles | Form pengajuan cuti baru |
| `/birthdays` | Birthdays | All Roles | Kalender ulang tahun karyawan |
| `/broadcast` | Broadcast | Manager | Kirim pengumuman ke semua user |
| `/code-review` | Code Review | Public | Laporan code review (tanpa login) |

---

## 🗄 Database Schema

Aplikasi menggunakan **4 tabel** di Supabase:

### `app_users`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Primary key |
| username | TEXT (UNIQUE) | Username login |
| password_hash | TEXT | Password (plain text untuk demo) |
| role | TEXT | `MANAGER` / `SUPERVISOR` / `EMPLOYEE` |
| display_name | TEXT | Nama tampilan |
| created_at | TIMESTAMPTZ | Waktu pembuatan |

### `employees`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Primary key |
| name | TEXT | Nama karyawan |
| department | TEXT | Departemen |
| position | TEXT | Jabatan |
| annual_leave_balance | INTEGER | Sisa cuti tahunan (default: 12) |
| block_leave_taken | BOOLEAN | Status block leave |
| date_of_birth | DATE | Tanggal lahir (opsional) |
| created_at | TIMESTAMPTZ | Waktu pembuatan |

### `leave_requests`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Primary key |
| employee_id | UUID (FK) | Referensi ke `employees.id` |
| type | TEXT | `ANNUAL_LEAVE` / `BLOCK_LEAVE` / `SICK_LEAVE` |
| start_date | DATE | Tanggal mulai cuti |
| end_date | DATE | Tanggal selesai cuti |
| reason | TEXT | Alasan cuti |
| status | TEXT | `PENDING` / `APPROVED` / `REJECTED` |
| created_at | TIMESTAMPTZ | Waktu pembuatan |

### `notifications`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Primary key |
| title | TEXT | Judul notifikasi |
| message | TEXT | Isi pesan |
| type | TEXT | `ANNOUNCEMENT` / `BIRTHDAY` / `SYSTEM` |
| created_by | TEXT | Username pengirim |
| is_read | BOOLEAN | Status sudah dibaca |
| created_at | TIMESTAMPTZ | Waktu pembuatan |

---

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js 18+
- npm atau yarn
- Akun Supabase (gratis)

### 1. Clone & Install

```bash
git clone <repository-url>
cd employee-leave-system
npm install
```

### 2. Setup Environment

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Database

Jalankan SQL migration di **Supabase SQL Editor** secara berurutan:

1. **Tabel utama** — Buat tabel `app_users`, `employees`, `leave_requests`
2. **RLS Policies** — Enable Row Level Security
3. **Birthday & Notifications** — Jalankan `migration_birthday_notifications.sql`

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Build Production

```bash
npm run build
npm start
```

---

## 🔑 Demo Accounts

| Role | Username | Password | Nama | Akses |
|------|----------|----------|------|-------|
| **Manager** | `admin` | `admin123` | Admin User | Full access — semua fitur |
| **Supervisor** | `hikari` | `hikari123` | Hikari Tanaka | Dashboard pribadi, approve/reject bawahan |
| **Employee** | `haikal` | `haikal123` | Haikal Rahman | Dashboard pribadi, ajukan cuti sendiri |

---

## 📁 Struktur Folder

```
src/
├── app/                          # Next.js App Router
│   ├── (protected)/              # Route yang butuh autentikasi
│   │   ├── dashboard/            # Halaman dashboard
│   │   ├── employees/            # CRUD karyawan
│   │   │   ├── edit/[id]/        # Edit karyawan (dynamic route)
│   │   │   └── new/              # Tambah karyawan baru
│   │   ├── leave/                # Manajemen cuti
│   │   │   └── new/              # Ajukan cuti baru
│   │   ├── birthdays/            # Ulang tahun karyawan
│   │   ├── broadcast/            # Kirim pengumuman (admin)
│   │   └── layout.tsx            # Protected layout (AuthGuard + AppLayout)
│   ├── code-review/              # Public code review page
│   ├── login/                    # Halaman login
│   ├── globals.css               # Global styles + CSS variables
│   ├── layout.tsx                # Root layout (ThemeProvider + Toaster)
│   └── page.tsx                  # Root redirect → /dashboard
│
├── components/
│   ├── dashboard/                # Komponen dashboard
│   │   ├── DashboardGrid.tsx     # Grid stats cards
│   │   ├── DashboardStatsCard.tsx# Individual stat card + animated counter
│   │   ├── DepartmentChart.tsx   # Bar chart department
│   │   ├── LeaveStatusChart.tsx  # Pie chart status cuti
│   │   ├── LeavesTrendChart.tsx  # Area chart tren cuti
│   │   ├── LeaveTypeBreakdownChart.tsx # Stacked bar chart jenis cuti
│   │   └── RecentLeaveRequests.tsx     # List 5 cuti terbaru
│   │
│   ├── employee/                 # Komponen karyawan
│   │   ├── EmployeeForm.tsx      # Form create/edit karyawan
│   │   └── EmployeeTable.tsx     # Grid card karyawan
│   │
│   ├── leave/                    # Komponen cuti
│   │   ├── LeaveRequestForm.tsx  # Form pengajuan cuti
│   │   ├── LeaveRequestTable.tsx # List card leave requests
│   │   └── LeaveRequestFilter.tsx# Tab filter status
│   │
│   ├── shared/                   # Komponen reusable
│   │   ├── AppLayout.tsx         # Layout utama (sidebar + header)
│   │   ├── AuthGuard.tsx         # Auth protection wrapper
│   │   ├── DateRangeFilter.tsx   # Filter rentang waktu
│   │   ├── NotificationDropdown.tsx # Dropdown notifikasi bell
│   │   ├── ThemeToggle.tsx       # Toggle dark/light mode
│   │   ├── PageHeader.tsx        # Header halaman + action button
│   │   ├── SearchInput.tsx       # Input pencarian
│   │   ├── EmptyState.tsx        # Empty state illustration
│   │   ├── StatusBadge.tsx       # Badge status (Pending/Approved/Rejected)
│   │   ├── ConfirmDialog.tsx     # Dialog konfirmasi delete
│   │   ├── AnimatedCounter.tsx   # Animasi angka counter
│   │   ├── FadeIn.tsx            # Fade-in animation wrapper
│   │   ├── StaggerContainer.tsx  # Staggered animation container
│   │   └── Skeleton.tsx          # Loading skeleton
│   │
│   └── ui/                       # shadcn/ui base components
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── textarea.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Hook autentikasi
│   ├── useDashboard.ts           # Hook statistik dashboard
│   ├── useEmployees.ts           # Hook CRUD karyawan
│   └── useLeaveRequests.ts       # Hook CRUD leave requests
│
├── services/                     # Data access layer (Supabase)
│   ├── auth-storage.ts           # Login, logout, session management
│   ├── employee-storage.ts       # CRUD employees → Supabase
│   ├── leave-storage.ts          # CRUD leave requests → Supabase
│   └── notification-service.ts   # CRUD notifications → Supabase
│
├── lib/                          # Utility libraries
│   ├── supabase.ts               # Supabase client initialization
│   ├── utils.ts                  # Helper functions (cn, formatDate, etc.)
│   ├── confetti.ts               # Confetti animation trigger
│   └── export-excel.ts           # Export data ke Excel (.xlsx)
│
├── types/                        # TypeScript type definitions
│   ├── index.ts                  # Barrel export
│   ├── employee.ts               # Employee type
│   ├── leave-request.ts          # LeaveRequest type
│   ├── auth.ts                   # AuthSession & Role types
│   └── notification.ts           # Notification type
│
└── validators/                   # Zod validation schemas
    ├── employee-validator.ts     # Schema validasi form karyawan
    ├── leave-request-validator.ts# Schema validasi form cuti
    └── login-validator.ts        # Schema validasi form login
```

---

## 📏 Business Rules

### Jenis Cuti
| Jenis | Kode | Deskripsi |
|-------|------|-----------|
| **Cuti Tahunan** | `ANNUAL_LEAVE` | Cuti standar tahunan (default 12 hari/tahun) |
| **Block Leave** | `BLOCK_LEAVE` | Cuti wajib berturut-turut sesuai kebijakan perusahaan |
| **Cuti Sakit** | `SICK_LEAVE` | Cuti karena sakit |

### Status Cuti
| Status | Warna | Deskripsi |
|--------|-------|-----------|
| `PENDING` | 🟡 Kuning | Menunggu approval |
| `APPROVED` | 🟢 Hijau | Disetujui oleh Manager/Supervisor |
| `REJECTED` | 🔴 Merah | Ditolak |

### Departemen
Engineering, Human Resources, Finance, Marketing, Operations, Sales

### Jabatan
Manager, Senior Staff, Junior Staff, Intern, Director, Lead

### Role Hierarchy
```
Manager (Admin)     ← Full access, approve/reject semua, manage employees
    │
Supervisor          ← Approve/reject bawahan, lihat data sendiri + bawahan
    │
Employee            ← Hanya lihat & ajukan cuti sendiri
```

---

## 📄 License

This project was built for **TugasVibeCodeBNI** educational purposes.

---

<p align="center">
  Built with ❤️ using Next.js, React, TypeScript, and Supabase
</p>
