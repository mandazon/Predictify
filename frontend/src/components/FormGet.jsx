import React, { useState, useEffect } from "react";

const ProductSalesTable = () => {
  const [salesData, setSalesData] = useState([]);

  // Effectuer la requête GET pour récupérer les données à partir de l'API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/sales/')
      .then((response) => response.json())
      .then((data) => setSalesData(data))  // Mettre à jour l'état avec les données reçues
      .catch((error) => console.error('Error fetching data:', error));
  }, []); // L'effet se déclenche seulement lors du montage initial du composant

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-blue-100">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Liste des Ventes</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-50">
            <th className="p-3 text-left text-sm font-medium text-blue-600">Nom du produit</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Quantité vendue</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Prix unitaire (€)</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Date de vente</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Client</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Catégorie</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Total Vente (€)</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Produit Gagnant</th>
            <th className="p-3 text-left text-sm font-medium text-blue-600">Tendance</th>
          </tr>
        </thead>
        <tbody>
          {salesData.length > 0 ? (
            salesData.map((sale, index) => (
              <tr key={index} className="hover:bg-blue-50 transition-colors">
                <td className="p-3 text-sm text-gray-800">{sale.product_name}</td>
                <td className="p-3 text-sm text-gray-800">{sale.quantity_sold}</td>
                <td className="p-3 text-sm text-gray-800">{sale.unit_price}</td>
                <td className="p-3 text-sm text-gray-800">{sale.sales_date}</td>
                <td className="p-3 text-sm text-gray-800">{sale.client}</td>
                <td className="p-3 text-sm text-gray-800">{sale.category}</td>
                <td className="p-3 text-sm text-gray-800">{sale.total_sales}</td>
                <td className="p-3 text-sm text-gray-800">{sale.winning_product ? "Oui" : "Non"}</td>
                <td className="p-3 text-sm text-gray-800">{sale.trend}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="p-3 text-center text-sm text-gray-500">Aucune donnée disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSalesTable;
