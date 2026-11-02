# VKSTAR Smart Attendance System - Backend API

Hệ thống backend hoàn chỉnh cho ứng dụng quản lý chấm công thông minh VKSTAR.

## 🛠️ Công nghệ sử dụng
- **Node.js & Express.js**
- **Prisma ORM** (PostgreSQL / MySQL)
- **Socket.io** (Realtime Dashboard updates)

## 🚀 Hướng dẫn cài đặt & chạy Local

1. Cài đặt dependencies:
   ```bash
   npm install
   ```

2. Tạo tệp `.env` dựa trên `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Đồng bộ cơ sở dữ liệu với Prisma:
   ```bash
   npm run prisma:db
   ```

4. Chạy server ở chế độ phát triển (Development):
   ```bash
   npm run dev
   ```

Server sẽ chạy tại `http://localhost:5000`.
