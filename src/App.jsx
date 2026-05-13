import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import "./App.css";


function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const confusionMatrix = [
    { label: "True Negative", value: 28, short: "TN" },
    { label: "False Positive", value: 10, short: "FP" },
    { label: "False Negative", value: 2, short: "FN" },
    { label: "True Positive", value: 14, short: "TP" },
  ];
  
  const rocData = [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.08, tpr: 0.45 },
    { fpr: 0.16, tpr: 0.69 },
    { fpr: 0.26, tpr: 0.88 },
    { fpr: 0.42, tpr: 0.94 },
    { fpr: 1.0, tpr: 1.0 },
  ];
  
  const getAnalysisSummary = (result) => {
    if (!result) return "";
  
    if (result.prediction === "Malignant") {
      return "The uploaded thermal image was classified as malignant-risk. Since the model uses a screening-focused threshold, this result suggests that the thermal pattern should be reviewed carefully in a clinical setting.";
    }
  
    return "The uploaded thermal image was classified as benign-risk. The model did not detect strong malignant thermal patterns based on the learned features, but this result is for research use only.";
  };

  const modelResults = [
    { model: "EfficientNetB0", accuracy: 72.2, sensitivity: 31.3, specificity: 89.5, auc: 0.602 },
    { model: "ResNet50", accuracy: 74.1, sensitivity: 68.8, specificity: 76.3, auc: 0.758 },
    { model: "DenseNet121", accuracy: 77.8, sensitivity: 87.5, specificity: 73.7, auc: 0.864 },
    { model: "InceptionV3", accuracy: 74.1, sensitivity: 25.0, specificity: 94.7, auc: 0.683 },
    { model: "Ensemble", accuracy: 75.9, sensitivity: 37.5, specificity: 92.1, auc: 0.844 },
  ];

  const getRiskLevel = (probability) => {
    if (probability >= 0.7) return "High Risk";
    if (probability >= 0.3) return "Moderate Risk";
    return "Low Risk";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please upload a thermal image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = "https://mirrors-realtors-institutions-grey.trycloudflare.com ";

      const response = await axios.post(`${API_URL}/predict`, formData);

      const predictionData = {
        ...response.data,
        fileName: file.name,
        time: new Date().toLocaleString(),
        riskLevel: getRiskLevel(response.data.malignant_probability),
      };

      setResult(predictionData);
      setHistory((prev) => [predictionData, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Prediction failed. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;

    const report = `
Breast Thermography AI Prediction Report

File Name: ${result.fileName}
Prediction: ${result.prediction}
Risk Level: ${result.riskLevel}
Confidence: ${(result.confidence * 100).toFixed(2)}%
Malignant Probability: ${(result.malignant_probability * 100).toFixed(2)}%
Threshold Used: ${result.threshold}
Generated At: ${result.time}

Note: This system is a research prototype and is not intended for clinical diagnosis.
`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "prediction_report.txt";
    link.click();
  };

  return (
    <div className="app">
      <header className="hero">
        <h1>Breast Thermography AI Dashboard</h1>
        <p>
          Interactive deep learning dashboard for benign and malignant thermal image classification.
        </p>
      </header>

      <section className="cards">
        <div className="card">
          <h3>Best Model</h3>
          <h2>DenseNet121</h2>
          <p>Best sensitivity and ROC-AUC performance.</p>
        </div>

        <div className="card">
          <h3>ROC-AUC</h3>
          <h2>0.864</h2>
          <p>Strong classification ability.</p>
        </div>

        <div className="card">
          <h3>Sensitivity</h3>
          <h2>87.5%</h2>
          <p>Important for malignant detection.</p>
        </div>

        <div className="card">
          <h3>Threshold</h3>
          <h2>0.30</h2>
          <p>Lower threshold prioritizes fewer false negatives.</p>
        </div>
      </section>

      <section className="section">
        <h2>Model Performance Comparison</h2>

        <section className="section">
  <h2>Confusion Matrix Heatmap - DenseNet121</h2>

  <div className="confusion-grid">
    {confusionMatrix.map((item) => (
      <div key={item.short} className={`confusion-cell ${item.short.toLowerCase()}`}>
        <span>{item.short}</span>
        <h3>{item.value}</h3>
        <p>{item.label}</p>
      </div>
    ))}
  </div>

  <p className="section-note">
    DenseNet121 achieved high malignant detection with only 2 false negatives on the test set.
  </p>
</section>

<section className="section">
  <h2>ROC Curve - DenseNet121</h2>

  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={rocData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="fpr" label={{ value: "False Positive Rate", position: "insideBottom", offset: -5 }} />
      <YAxis label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="tpr" strokeWidth={3} name="DenseNet121 ROC" />
      <Line type="monotone" dataKey="fpr" strokeWidth={2} strokeDasharray="5 5" name="Random Classifier" />
    </LineChart>
  </ResponsiveContainer>

  <p className="section-note">
    ROC-AUC of 0.864 indicates strong separation between benign and malignant thermal image patterns.
  </p>
</section>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={modelResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="accuracy" />
            <Bar dataKey="sensitivity" />
            <Bar dataKey="specificity" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="section">
        <h2>Detailed Results Table</h2>

        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
              <th>Sensitivity</th>
              <th>Specificity</th>
              <th>ROC-AUC</th>
            </tr>
          </thead>
          <tbody>
            {modelResults.map((item) => (
              <tr key={item.model}>
                <td>{item.model}</td>
                <td>{item.accuracy}%</td>
                <td>{item.sensitivity}%</td>
                <td>{item.specificity}%</td>
                <td>{item.auc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section prediction">
        <div>
          <h2>Thermal Image Prediction</h2>
          <p>
            Upload a breast thermal image. The DenseNet121 model will classify it as benign or malignant.
          </p>

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <button onClick={handlePredict} disabled={loading}>
            {loading ? "Analyzing..." : "Predict Image"}
          </button>

          {result && (
            <div className={`result ${result.prediction.toLowerCase()}`}>
              <h3>Prediction Result</h3>
              <div className={`prediction-badge ${result.prediction.toLowerCase()}`}>
  {result.prediction}
</div>
              <p><strong>Risk Level:</strong> {result.riskLevel}</p>
              <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
              <p><strong>Malignant Probability:</strong> {(result.malignant_probability * 100).toFixed(2)}%</p>
              <div className="analysis-summary">
  <h4>AI Analysis Summary</h4>
  <p>{getAnalysisSummary(result)}</p>
</div>
              <p><strong>Threshold Used:</strong> {result.threshold}</p>

              <button onClick={downloadReport} className="secondary-btn">
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="preview-box">
          {preview ? (
            <img src={preview} alt="Uploaded thermal image" />
          ) : (
            <p>No image uploaded yet.</p>
          )}
        </div>
      </section>

      <section className="section">
        <h2>Prediction History</h2>

        {history.length === 0 ? (
          <p>No predictions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>File</th>
                <th>Prediction</th>
                <th>Risk</th>
                <th>Confidence</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{item.fileName}</td>
                  <td>{item.prediction}</td>
                  <td>{item.riskLevel}</td>
                  <td>{(item.confidence * 100).toFixed(2)}%</td>
                  <td>{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section explanation">
        <h2>Model Interpretation</h2>
        <p>
          The model analyzes thermal intensity patterns from breast thermography images.
          Since this is a screening-focused task, sensitivity is prioritized to reduce false negatives.
        </p>
        <p>
          A threshold of 0.30 is used instead of the default 0.50 to make the model more sensitive
          toward malignant cases.
        </p>
      </section>

      <footer>
  <p>
    Research prototype only. This system is not intended for clinical diagnosis.
  </p>

  <p className="copyright">
    © 2026 Sanya Kaushik. All Rights Reserved.
  </p>
</footer>
    </div>
  );
}

export default App;