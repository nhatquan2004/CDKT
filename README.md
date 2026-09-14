# 🏁 Cuộc Đua Kỳ Thú 2026 – Web Check-in

> Web app check-in sự kiện **The Amazing Race Season 8 – 2026**

## Cấu trúc dự án

```
CDKT/
├── FE/     # Frontend — React + Vite + TailwindCSS
└── BE/     # Backend — Node.js + Express + MongoDB
```

---

## 🚀 Cài đặt & Chạy

### 1. Backend (BE)

```bash
cd BE
npm install
```

Tạo file `.env` (copy từ `.env.example` rồi điền thông tin):

```env
MONGODB_URI=<connection string MongoDB Atlas của bạn>
JWT_SECRET=<chuỗi bí mật bất kỳ>
ADMIN_USERNAME=btc2026
ADMIN_PASSWORD=cdkt@2026!
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

```bash
npm run dev   # Chạy dev server tại http://localhost:5000
```

### 2. Frontend (FE)

```bash
cd FE
npm install
npm run dev   # Chạy dev server tại http://localhost:5173
```

---

## 📱 Màn hình dành cho Người Chơi

| Route | Tên | Mô tả |
|-------|-----|-------|
| `/` | Chọn Team | Chọn team trước khi vào bản đồ |
| `/map` | Bản đồ Check-in | Bấm pin → xem nhiệm vụ → nộp ảnh |

## 🔐 Trang quản trị BTC (ẩn)

| Route | Tên | Mô tả |
|-------|-----|-------|
| `/btc-admin/login` | Đăng nhập BTC | Nhập username/password từ `.env` |
| `/btc-admin/submissions` | Xem minh chứng | Danh sách ảnh đã nộp, filter theo team/điểm |
| `/btc-admin/locations` | Quản lý điểm | Chỉnh title/description 6 điểm check-in |

---

## 🌐 API Endpoints

| Method | Route | Mô tả | Auth |
|--------|-------|-------|------|
| GET | `/api/teams` | Danh sách 10 team | Public |
| GET | `/api/locations` | Danh sách 6 điểm | Public |
| POST | `/api/submissions` | Nộp minh chứng (multipart) | Public |
| GET | `/api/submissions` | Xem tất cả minh chứng | Admin JWT |
| PUT | `/api/locations/:id` | Sửa điểm | Admin JWT |
| POST | `/api/admin/login` | Đăng nhập admin | Public |

---

## 📸 Upload ảnh

- **Mặc định**: Lưu local tại `BE/uploads/`, serve qua `/uploads/<filename>`
- **Cloudinary**: Xem comment trong `BE/src/middlewares/upload.middleware.js` để chuyển đổi

---

## 🎨 Design System

- **Primary**: `#D2232A` (đỏ)
- **Accent**: `#F5A623` (vàng/cam)
- **Neutral**: `#FFFDF7` (trắng ngà)
- Font: **Be Vietnam Pro** (body) + **Pacifico** (display)

---

## 📝 Notes

- Server tự động seed **10 team** và **6 location** khi DB rỗng
- Admin JWT hết hạn sau **8 tiếng** (đủ 1 ngày sự kiện)
- Cập nhật `CLIENT_ORIGIN` trong `BE/.env` và `VITE_API_URL` trong `FE/.env` khi deploy lên production
