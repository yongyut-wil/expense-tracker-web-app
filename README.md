# Expense Tracker Web Application

แอปพลิเคชันเว็บสำหรับติดตามและจัดการค่าใช้จ่ายส่วนตัว พัฒนาด้วย Next.js, React และ TypeScript

## 🌟 ฟีเจอร์หลัก

### 💰 การจัดการรายรับ-รายจ่าย
- บันทึกรายรับและรายจ่ายประจำวัน
- แยกประเภทรายการตามหมวดหมู่ (อาหาร, การเดินทาง, ช้อปปิ้ง, บิล, ฯลฯ)
- แก้ไขและลบรายการได้
- แสดงยอดคงเหลือแบบสดๆ

### 📊 แดชบอร์ดวิเคราะห์
- ภาพรวมสถานะการเงิน (รายรับ, รายจ่าย, คงเหลือ)
- กราฟแสดงแนวโน้มรายรับ-รายจ่าย
- เปรียบเทียบข้อมูลเดือนปัจจุบันกับเดือนที่แล้ว
- แสดงรายการล่าสุดพร้อมการเคลื่อนไหวแบบ Animated

### 🌐 หลายภาษา
- รองรับภาษาไทยและอังกฤษ
- สลับภาษาได้แบบ Real-time
- รูปแบบวันที่และสกุลเงินที่เหมาะสมกับแต่ละภาษา

### 🎨 อินเทอร์เฟซที่ทันสมัย
- ออกแบบด้วย Tailwind CSS และ shadcn/ui
- รองรับ Dark Mode และ Light Mode
- Animation และ Transitions ที่นุ่มนวล
- Responsive Design ทำงานได้บนทุกอุปกรณ์

### 🔐 ระบบความปลอดภัย
- การยืนยันตัวตนผู้ใช้ (Login/Register)
- JWT Token Authentication
- Session Management
- ป้องกันการเข้าถึงข้อมูลโดยไม่ได้รับอนุญาต

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **Next.js 16.1.1** - React Framework พร้อม App Router
- **React 19.2.3** - UI Library
- **TypeScript** - ภาษาพัฒนาที่มี Type Safety
- **Tailwind CSS 4.1.18** - CSS Framework
- **shadcn/ui** - Component Library
- **Framer Motion** - Animation Library
- **Recharts** - Chart Library
- **next-intl** - Internationalization

### State Management & API
- **Zustand** - State Management
- **React Hook Form** - Form Handling
- **Zod** - Schema Validation
- **Axios** - HTTP Client

### UI Components
- **Radix UI** - Headless UI Components
- **Lucide React** - Icon Library
- **Sonner** - Toast Notifications
- **React Day Picker** - Date Picker

## 📁 โครงสร้างโปรเจ็ค

```
expense-tracker-web-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # รองรับหลายภาษา
│   │   │   ├── (auth)/        # หน้า Authentication
│   │   │   └── (dashboard)/   # หน้า Dashboard
│   ├── components/            # React Components
│   │   ├── ui/               # UI Components (shadcn/ui)
│   │   └── dashboard/        # Dashboard Components
│   ├── lib/                  # Utility Functions
│   │   ├── api.ts           # API Configuration
│   │   └── categories.ts     # Category Definitions
│   ├── stores/               # State Management (Zustand)
│   ├── types/               # TypeScript Type Definitions
│   └── i18n/                # Internationalization Config
├── messages/                 # Translation Files
│   ├── en.json              # English Translation
│   └── th.json              # Thai Translation
├── public/                  # Static Assets
└── Dockerfile              # Docker Configuration
```

## 🚀 การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น
- Node.js 22 ขึ้นไป
- npm, yarn หรือ pnpm

### ขั้นตอนการติดตั้ง

1. Clone repository
```bash
git clone <repository-url>
cd expense-tracker-web-app
```

2. Install dependencies
```bash
yarn install
# หรือ
npm install
```

3. ตั้งค่า Environment Variables
```bash
cp env-example .env
```

แก้ไขไฟล์ `.env` ตามความเหมาะสม:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. รัน Development Server
```bash
yarn dev
# หรือ
npm run dev
```

5. เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## 🐳 การใช้งานกับ Docker

### Build Docker Image
```bash
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 -t expense-tracker .
```

### รัน Container
```bash
docker run -p 3000:3000 expense-tracker
```

## 📝 การใช้งาน

### 1. สมัครสมาชิกและเข้าสู่ระบบ
- สร้างบัญชีผู้ใช้ใหม่ผ่านหน้า Register
- เข้าสู่ระบบด้วย Email และ Password

### 2. บันทึกรายการ
- คลิกปุ่ม "เพิ่มรายการ" บนหน้า Dashboard
- เลือกประเภท (รายรับ/รายจ่าย)
- กรอกรายละเอียด จำนวนเงิน หมวดหมู่ และวันที่
- บันทึกรายการ

### 3. ดูแดชบอร์ด
- ดูภาพรวมการเงินประจำเดือน
- ตรวจสอบแนวโน้มรายรับ-รายจ่าย
- ดูรายการล่าสุด

### 4. จัดการรายการ
- แก้ไขรายการที่บันทึกไว้
- ลบรายการที่ไม่ต้องการ
- กรองและค้นหารายการ

## 🎨 หมวดหมู่รายการ

### รายจ่าย
- 🍽️ อาหารและเครื่องดื่ม
- 🚗 การเดินทาง
- 🛍️ การช้อปปิ้ง
- 🎬 บันเทิง
- ⚡ บิลและสาธารณูปโภค
- 🏥 การแพทย์และสุขภาพ
- 📚 การศึกษา
- 📦 อื่นๆ

### รายรับ
- 💼 เงินเดือน
- 💻 งาน Freelance
- 📈 การลงทุน
- 🎁 ของขวัญ
- 📦 อื่นๆ

## 🔧 คำสั่งที่มีประโยชน์

### Development
```bash
yarn dev          # รัน Development Server
yarn build        # Build สำหรับ Production
yarn start        # รัน Production Server
yarn lint         # ตรวจสอบ Code Quality
```

### Type Checking
```bash
npx tsc --noEmit   # ตรวจสอบ TypeScript
```

## 🚀 การ Deploy

### การ Deploy อัตโนมัติ (CI/CD)

#### GitHub Actions (แนะนำ)
โปรเจ็คนี้มีการตั้งค่า CI/CD ผ่าน GitHub Actions แล้ว:

1. **Auto Deploy เมื่อ Push ไปที่ Main Branch**
   - Build Docker Image และ Push ไป GitHub Container Registry
   - Deploy ไปยัง EC2 Server ผ่าน k3s (Kubernetes)
   - Restart Deployment อัตโนมัติ

2. **Workflow ที่มีอยู่:**
   - `deploy-web.yml` - Build Docker และ Deploy ไป Production Server

3. **Environment Variables ที่ต้องตั้งค่า:**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-server.com
   NODE_ENV=production
   ```

#### Docker
```bash
# Build Image
docker build -t expense-tracker .

# รัน Container
docker run -p 3000:3000 expense-tracker

# รันแบบ Production พร้อม Environment Variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api.com \
  expense-tracker
```

#### Manual Deploy
```bash
# Build สำหรับ Production
yarn build

# รัน Production Server
yarn start
```

