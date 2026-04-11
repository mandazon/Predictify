import React, { useState } from "react";
import * as XLSX from "xlsx";
import ExcelIcon from "../Images/Microsoft_Excel-Logo.wine.png";
import { useNavigate } from "react-router-dom";

const ExcelUploader = () => {
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction pour renommer et formater les clés de l'objet
  const renameKeys = (obj) => {
    const quantitySold = obj["Quantité vendue"] ? Number(obj["Quantité vendue"]) : null;
    const unitPrice = obj["Prix unitaire (€)"] ? Number(obj["Prix unitaire (€)"]) : null;
    return {
      product_name: obj["Nom du produit"]?.trim() || null,
      quantity_sold: quantitySold,
      unit_price: unitPrice,
      sales_date: obj["Date de vente"] || null,
      client: obj["Client"]?.trim() || null,
      category: obj["Catégorie"]?.trim() || null,
      trend: obj["Tendance"]?.trim() || null,
      winning_product: obj["Produit Gagnant"] === "Oui",
      total_sales: quantitySold && unitPrice ? quantitySold * unitPrice : 0,
    };
  };

  // Gérer l'importation du fichier Excel
  const handleFileUpload = (event) => {
    setError("");
    setIsLoading(true);

    const file = event.target.files[0];
    if (!file) {
      setError("Veuillez sélectionner un fichier Excel.");
      setIsLoading(false);
      return;
    }

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Le fichier doit être au format .xlsx ou .xls.");
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const formattedData = parsedData.map(renameKeys);

        if (formattedData.length === 0) {
          setError("Le fichier Excel est vide.");
          setIsLoading(false);
          return;
        }

        setJsonData(formattedData);
        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du traitement du fichier Excel.");
        setIsLoading(false);
        console.error(err);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Vérifier que toutes les données contiennent les champs requis
  const validateData = (data) => {
    return data.every(
      (item) =>
        item.product_name &&
        item.quantity_sold !== null &&
        item.unit_price !== null &&
        item.sales_date &&
        item.client &&
        item.category &&
        item.trend
    );
  };

  // Envoyer les données JSON à l'API
  const sendDataToAPI = async () => {
    if (jsonData.length === 0) {
      setError("Veuillez importer un fichier avant d'envoyer.");
      return;
    }

    if (!validateData(jsonData)) {
      setError("Certaines données sont manquantes ou incorrectes. Vérifiez le fichier.");
      return;
    }

    setIsLoading(true);
    try {
      const promises = jsonData.map((el) =>
        fetch("http://127.0.0.1:8000/api/sales/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(el),
        }).then((response) => {
          if (!response.ok) throw new Error(`Erreur pour ${el.product_name}`);
          return response.json();
        })
      );

      await Promise.all(promises);
      alert("Données envoyées avec succès !");
      setIsLoading(false);
    } catch (error) {
      setError("Échec de l'envoi des données. Vérifiez l'API.");
      console.error("Erreur :", error);
      setIsLoading(false);
    }
  };

  // Rediriger vers la page d'analyse après envoi des données
  const handleAnalyze = async () => {
    if (jsonData.length === 0) {
      setError("Veuillez importer un fichier avant d'analyser.");
      return;
    }

    if (!validateData(jsonData)) {
      setError("Certaines données sont manquantes ou incorrectes. Vérifiez le fichier.");
      return;
    }

    setIsLoading(true);
    try {
      const promises = jsonData.map((el) =>
        fetch("http://127.0.0.1:8000/api/sales/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(el),
        }).then((response) => {
          if (!response.ok) throw new Error(`Erreur pour ${el.product_name}`);
          return response.json();
        })
      );

      await Promise.all(promises);
      setIsLoading(false);
      navigate("/analyse"); // Redirection corrigée vers /analyse
    } catch (error) {
      setError("Échec de l'envoi des données pour analyse. Vérifiez l'API.");
      console.error("Erreur :", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <img src={ExcelIcon} alt="Excel Icon" className="w-8 h-8" />
        Importation de Données Excel
      </h2>

      <div className="relative mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          disabled={isLoading}
          aria-label="Importer un fichier Excel"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>
      )}

      {jsonData.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Produit",
                  "Quantité",
                  "Prix Unitaire (€)",
                  "Date",
                  "Client",
                  "Catégorie",
                  "Tendance",
                  "Gagnant",
                  "Ventes Totales (€)",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jsonData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{item.product_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.quantity_sold}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.unit_price}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.sales_date}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.client}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.category}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.trend}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {item.winning_product ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{item.total_sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={sendDataToAPI}
        className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-colors ${
          isLoading || jsonData.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading || jsonData.length === 0}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
            Envoi en cours...
          </span>
        ) : (
          "Envoyer les données"
        )}
      </button>

      <button
        onClick={handleAnalyze}
        className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition-colors ${
          isLoading || jsonData.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isLoading || jsonData.length === 0}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              ></path>
            </svg>
            Analyse en cours...
          </span>
        ) : (
          "Lancer l'Analyse"
        )}
      </button>
    </div>
  );
};

export default ExcelUploader;