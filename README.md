````markdown
# 🩺 Breast Thermography AI Dashboard

An interactive AI-powered medical imaging dashboard for breast thermography analysis using deep learning and FastAPI inference APIs.

## 🚀 Live Demo
Frontend:  
https://your-cloudflare-url.pages.dev](https://breastcancer.sanyakaushik2365.workers.dev

Backend API:  
https://sanyakkk-breast-cancer-backend.hf.space/docs

---

# 📌 Overview

This project is a full-stack AI research dashboard designed for breast thermography image classification. The system uses deep learning models trained on thermographic breast images to classify scans into:

- Benign
- Malignant

The application provides:
- Real-time AI prediction
- Risk-level analysis
- Model performance visualization
- ROC curve analytics
- Confusion matrix interpretation
- Prediction history tracking
- Downloadable reports

---

# 🧠 AI Models Used

The project compares multiple transfer learning CNN architectures:

| Model | Accuracy | Sensitivity | Specificity | ROC-AUC |
|------|------|------|------|------|
| EfficientNetB0 | 72.2% | 31.3% | 89.5% | 0.602 |
| ResNet50 | 74.1% | 68.8% | 76.3% | 0.758 |
| DenseNet121 | 77.8% | 87.5% | 73.7% | 0.864 |
| InceptionV3 | 74.1% | 25.0% | 94.7% | 0.683 |
| Ensemble | 75.9% | 37.5% | 92.1% | 0.844 |

### ✅ Best Performing Model
DenseNet121
- High malignant sensitivity
- Strong ROC-AUC performance
- Optimized for screening-focused classification

---

# 🏗️ Tech Stack

## Frontend
- React.js
- Axios
- Recharts
- CSS3
- Responsive UI

## Backend
- FastAPI
- TensorFlow / Keras
- Pillow
- NumPy
- Uvicorn

## Deployment
- Frontend → Cloudflare Pages
- Backend → Hugging Face Spaces
- Model Serving → TensorFlow Inference API

---

# 📂 Features

## 🔍 AI Prediction System
- Upload thermal breast images
- Real-time malignant/benign classification
- Confidence score generation
- Risk-level estimation

## 📊 Interactive Analytics
- ROC Curve visualization
- Confusion Matrix heatmap
- Comparative model metrics
- Sensitivity/Specificity charts

## 📄 Report Generation
- Download prediction reports
- Track prediction history
- AI-generated analysis summaries

## 🎨 Professional UI
- Responsive medical dashboard
- Modern glassmorphism design
- Mobile-friendly layout
- Animated interactions

---

# ⚙️ System Architecture

```text
React Frontend
      ↓
Axios API Requests
      ↓
FastAPI Backend
      ↓
TensorFlow DenseNet121 Model
      ↓
Prediction Response
      ↓
Frontend Visualization
````

---

# 📷 Dataset

The project uses the:

### Mendeley Breast Thermography Dataset

Used for:

* preprocessing
* transfer learning
* thermal image classification
* performance benchmarking

---

# 📈 Research Focus

This system prioritizes:

* high sensitivity
* lower false negatives
* screening-oriented detection

A custom threshold strategy was implemented to improve malignant case identification.

---

# 🔒 Disclaimer

This project is a research prototype developed for academic and educational purposes only.

It is NOT intended for:

* medical diagnosis
* clinical decision-making
* real-world healthcare deployment

Always consult certified medical professionals.

---

# 👩‍💻 Author

### Sanya Kaushik

Graduate Student — Computer Engineering
California State University, Fullerton

---

# ⭐ Future Improvements

* Grad-CAM visualization
* PDF medical reports
* Multi-model ensemble selection
* Authentication system
* Patient metadata integration
* GPU inference optimization
* Clinical dashboard analytics

---

# 📬 Contact

LinkedIn:
[https://linkedin.com/in/sanyakaushik](https://linkedin.com/in/sanyakaushik)

```
```
