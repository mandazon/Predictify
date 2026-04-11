import React, { useState } from "react";
import * as XLSX from "xlsx";
//Taminito izy namaha an 'ilay erreur hoe ny zavara takian'ny API  tsirairay nef le zavatra nalefako liste misy 
// folo donc zan naton misy fonction foreach mampiditra an 'izy tsirairay boucler in 10  
const ExcelUploader = () => {
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState("");

  // Fonction pour renommer et formater les clés de l'objet
  const renameKeys = (obj) => {
    const quantitySold = obj["Quantité vendue"] ? Number(obj["Quantité vendue"]) : null; // Convertir en nombre
    const unitPrice = obj["Prix unitaire (€)"] ? Number(obj["Prix unitaire (€)"]) : null; // Convertir en nombre
    return {
      product_name: obj["Nom du produit"]?.trim() || null, // Supprimer les espaces inutiles et éviter ""
      quantity_sold: quantitySold,
      unit_price: unitPrice,
      sales_date: obj["Date de vente"] || null,
      client: obj["Client"]?.trim() || null,
      category: obj["Catégorie"]?.trim() || null,
      trend: obj["Tendance"]?.trim() || null,
      winning_product: obj["Produit Gagnant"] === "Oui", // Convertir en booléen
      total_sales: quantitySold && unitPrice ? quantitySold * unitPrice : 0, // Calcul du total des ventes
    };
  };

  // Gérer l'importation du fichier Excel
  const handleFileUpload = (event) => {
    setError(""); 

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Lire la première feuille du fichier Excel
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir les données Excel en JSON
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      // Renommer et formater les données
      const formattedData = parsedData.map(renameKeys);

      setJsonData(formattedData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Vérifier que toutes les données contiennent les champs requis et sont valides
  const validateData = (data) => {
    return data.every((item) =>
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
  const sendDataToAPI = () => {
    // if (jsonData.length === 0) {
    //   setError("Veuillez importer un fichier avant d'envoyer.");
    //   return;
    // }

    // if (!validateData(jsonData)) {
    //   setError("Certaines données sont manquantes ou incorrectes. Vérifiez le fichier.");
    //   return;
    // }

    // // Créer un objet JSON sous la forme { data: [...] }
    // const payload = { data: jsonData };

    // // Log des données envoyées pour vérifier leur format
    // console.log("Données envoyées :", JSON.stringify(payload, null, 2));

    // // Vérifier les données avant l'envoi
    // jsonData.forEach((item, index) => {
    //   console.log(`Données de l'élément ${index + 1}:`, item);
    //   if (!item.product_name || !item.quantity_sold || !item.unit_price || !item.sales_date || !item.client || !item.category || !item.trend) {
    //     console.error(`Erreur dans l'élément ${index + 1}:`, item);
    //   }
    // });

    console.log("etooooo")
    // console.log(jsonData)

    // on va boucler sur chaque element de jsonData pour l'envoyer un a un
    jsonData.forEach((el) => {
      fetch("http://127.0.0.1:8000/api/sales/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(el), 
        })
          .then((response) => {
            if (!response.ok) throw new Error("Erreur lors de l'envoi des données.");
            return response.json();
          })
          .then((data) => {
            alert("Données envoyées avec succès !");
            console.log("Réponse API :", data);
          })
          .catch((error) => {
            setError("Échec de l'envoi des données. Vérifiez l'API.");
            console.error("Erreur :", error);
          }); 
    })

    
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-blue-500">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Importation Excel</h2>
      
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="w-full p-2 border rounded-lg mb-4" />
      
      {error && <p className="text-red-500">{error}</p>}

      {jsonData.length > 0 && (
        <pre className="bg-gray-100 p-2 rounded-lg text-sm max-h-40 overflow-auto">
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      )}

      <button onClick={sendDataToAPI} className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 mt-4">
        Envoyer les données
      </button>
    </div>
  );
};

export default ExcelUploader;
