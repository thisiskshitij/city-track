---

#  CityTrack – Smart City Issue Reporting & Classification System

CityTrack is an AI-powered web application that enables citizens to report civic issues and allows municipal authorities to manage, classify, and resolve them efficiently. The system leverages machine learning and geospatial analysis to automate issue categorization, detect duplicates, and highlight problem hotspots.

---

##  Features

###  Citizen Module

* Register/Login securely
* Report issues with **text, image, and location**
* View and track complaint status
* Upvote existing issues
* Filter issues by category/location

###  Admin Module

* Department-based dashboard
* View and manage assigned issues
* Update status (Pending → In Progress → Resolved)
* Add remarks and resolution notes
* View analytics and hotspots

###  AI Features

* Automatic classification using **DistilBERT**
* Image-based classification using **MobileNet**
* Severity prediction (Low / Medium / High)
* Duplicate detection using text + location
* Confidence scoring

---

## System Architecture

* **Frontend:** HTML, CSS, JavaScript (React optional)
* **Backend:** Node.js, Express
* **Database:** MongoDB / PostgreSQL
* **AI Models:** Python (TensorFlow / PyTorch)
* **Maps:** Leaflet / Mapbox

---

##   Installation & Setup

###  Clone the Repository

```bash
git clone https://github.com/your-username/citytrack.git
cd citytrack
```

### Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

###  Environment Variables

Create a `.env` file in backend:

```
PORT=5000
DB_URI=your_database_connection
JWT_SECRET=your_secret_key
```

---

### Run the Project

#### Start Backend

```bash
npm start
```

#### Start Frontend

```bash
npm run dev
```

---

## 📊 Project Structure

```
citytrack/
│
├── frontend/        # User & admin interface
├── backend/         # APIs and business logic
├── ai-model/        # ML models (DistilBERT + MobileNet)
├── database/        # Schema & configs
└── README.md
```

---

## 🧠 How It Works

1. User submits complaint (text + image + location)
2. Backend processes request
3. AI models classify issue & predict severity
4. Duplicate detection checks similar issues
5. Data stored in database
6. Admin manages issue via dashboard

---

## 🧪 Testing

* Functional Testing ✔️
* API Testing ✔️
* AI Model Validation ✔️
* Integration Testing ✔️

---

## 📈 Future Enhancements

* 📱 Mobile App (Android/iOS)
* 🔔 Real-time notifications
* 🌐 Multilingual support
* 🤖 Improved AI accuracy
* 🌍 IoT integration for smart cities

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---


