import React, { useState, useEffect } from "react";

const ProductSalesTable = () => {
  const [salesData, setSalesData] = useState([]);

  // Effectuer la requête GET pour récupérer les données à partir de l'API
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/sales/');
        if (response.ok) {
          const data = await response.json();
          setSalesData(data);
        } else {
          console.error('Error fetching data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSalesData();
  }, []); // L'effet se déclenche seulement lors du montage initial du composant

  // Fonction pour supprimer une vente
  const handleDelete = (id) => {
    setSalesData((prevSalesData) => prevSalesData.filter((sale) => sale.id !== id));
  };

  // Fonction pour ajouter une vente (vous pouvez l'adapter à votre logique d'ajout)
  const handleAdd = (newSale) => {
    setSalesData((prevSalesData) => [...prevSalesData, newSale]);
  };

  // Fonction pour modifier une vente
  const handleEdit = (id, field, value) => {
    setSalesData((prevSalesData) =>
      prevSalesData.map((sale) =>
        sale.id === id ? { ...sale, [field]: value } : sale
      )
    );
  };

  return (
    <div className="max-w-full mx-auto bg-white p-6 rounded-xl shadow-lg border border-blue-100 overflow-x-auto">
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
            <th className="p-3 text-left text-sm font-medium text-blue-600">Actions</th> {/* Colonne Actions */}
          </tr>
        </thead>
        <tbody>
          {salesData.length > 0 ? (
            salesData.map((sale) => (
              <tr key={sale.id} className="hover:bg-blue-50 transition-colors">
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="text"
                    value={sale.product_name}
                    onChange={(e) => handleEdit(sale.id, "product_name", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="number"
                    value={sale.quantity_sold}
                    onChange={(e) => handleEdit(sale.id, "quantity_sold", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="number"
                    value={sale.unit_price}
                    onChange={(e) => handleEdit(sale.id, "unit_price", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="date"
                    value={sale.sales_date}
                    onChange={(e) => handleEdit(sale.id, "sales_date", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="text"
                    value={sale.client}
                    onChange={(e) => handleEdit(sale.id, "client", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="text"
                    value={sale.category}
                    onChange={(e) => handleEdit(sale.id, "category", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="number"
                    value={sale.total_sales}
                    onChange={(e) => handleEdit(sale.id, "total_sales", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <select
                    value={sale.winning_product ? "Oui" : "Non"}
                    onChange={(e) => handleEdit(sale.id, "winning_product", e.target.value === "Oui")}
                    className="border px-2 py-1 rounded-md w-full"
                  >
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                  </select>
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <input
                    type="text"
                    value={sale.trend}
                    onChange={(e) => handleEdit(sale.id, "trend", e.target.value)}
                    className="border px-2 py-1 rounded-md w-full"
                  />
                </td>
                <td className="p-3 text-sm text-gray-800">
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="p-3 text-center text-sm text-gray-500">
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Ajouter un bouton pour ajouter une nouvelle vente */}
      <button
        onClick={() => handleAdd({
          id: Date.now(),
          product_name: '',
          quantity_sold: 0,
          unit_price: 0,
          sales_date: '',
          client: '',
          category: '',
          total_sales: 0,
          winning_product: false,
          trend: ''
        })}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Ajouter une vente
      </button>
    </div>
  );
};

export default ProductSalesTable;
