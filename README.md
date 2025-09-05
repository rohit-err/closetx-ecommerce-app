# 👗 ClosetX - Second-Hand Fashion Marketplace

ClosetX is a **full-stack MERN application** that allows users to buy and sell second-hand clothes, footwear, and accessories.  
It comes with a **user app** and a **separate admin dashboard** to manage listings and users.

---

## 🚀 Live Demo
- **User App:** [ClosetX User](https://closetx-frontend.vercel.app)
- **Admin Dashboard:** [ClosetX Admin](https://closetx-admin.vercel.app)

---

## ✨ Features

### 👥 User Features
- Sign up / Sign in
- List second-hand fashion products (₹49 per listing via Razorpay test mode)
- Browse and explore products
- Contact sellers via **WhatsApp**, **Email**, or **Phone**
- Cloud-based image uploads with **Cloudinary**
- Responsive design for mobile & desktop

### 🛠 Admin Features
- Dashboard to manage all listings
- User management
- Delete/ban inappropriate listings

---

## 🛠 Tech Stack
- **Frontend:** React 19, Zustand, TailwindCSS
- **Backend:** Node.js, Express.js, MongoDB
- **Payments:** Razorpay (test mode)
- **Image Storage:** Cloudinary
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🌟 Future Improvements
- Stripe integration for international payments
- Reels system (short product showcase videos)
- Buyer-Seller chat feature
- Location-based filters for nearby products

---

## 📷 Screenshots

<img width="1906" height="862" alt="Screenshot 2025-09-05 175518" src="https://github.com/user-attachments/assets/10ca6403-8e4b-4ee5-9724-6f018e732e97" />
<img width="1893" height="863" alt="Screenshot 2025-09-05 175643" src="https://github.com/user-attachments/assets/50ed60c4-d3b1-4407-8cb6-403d8928e3dc" />
<img width="1903" height="866" alt="Screenshot 2025-09-05 175733" src="https://github.com/user-attachments/assets/c13d0229-9caf-4640-9560-f48e392fda38" />

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rohit-err/closetx.git
cd closetx
```

### 2️⃣ Install Dependencies
#### For Backend
```bash
cd backend
npm install
```
#### For Frontend
```bash
cd frontend
npm install
```

### 3️⃣ Environment Variables
Create `.env` files in **backend** and **frontend** folders.

**Backend `.env`**
```
PORT=5000
MONGO_URI=your_mongodb_uri
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_key_id
```

### 4️⃣ Start the App
#### Backend
```bash
npm run dev
```
#### Frontend
```bash
npm run dev
```

---

## 👤 Author
Made with ❤️ by [Rohit Kumar](https://github.com/rohit-err)
