import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";  // Importation de toast pour afficher un message de succès

const ProductSalesForm = ({ productId }) => {
  const [formData, setFormData] = useState({
    id: productId,  // L'ID doit être fourni par un parent ou être généré ici
    product_name: "",
    quantity_sold: "",
    unit_price: "",
    sales_date: "",
    client: "",
    category: "",
    total_sales: "",
    winning_product: false,
    trend: ""
  });

  useEffect(() => {
    if (productId) {
      // Si un ID est passé, on récupère les données actuelles du produit via l'API
      fetch(`http://127.0.0.1:8000/api/sales/${productId}/`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.id) {
      updateData();
    } else {
      console.error("Aucun ID fourni pour la mise à jour.");
    }
  };

  const updateData = () => {
    console.log(formData);

    fetch(`http://127.0.0.1:8000/api/sales/${formData.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Données mises à jour avec succès !");
        // Rafraîchir la liste sans recharger la page
        // Mettre à jour la liste des produits ou appeler une fonction parent pour mettre à jour l'état
      })
      .catch((error) => console.error('Error updating data:', error));
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-blue-500">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Mise à Jour des Ventes</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="id" placeholder="ID du produit" value={formData.id} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="text" name="product_name" placeholder="Nom du produit" value={formData.product_name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="number" name="quantity_sold" placeholder="Quantité vendue" value={formData.quantity_sold} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="number" name="unit_price" placeholder="Prix unitaire (€)" value={formData.unit_price} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="date" name="sales_date" value={formData.sales_date} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="text" name="client" placeholder="Client" value={formData.client} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="text" name="category" placeholder="Catégorie" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <input type="number" name="total_sales" placeholder="Total Vente (€)" value={formData.total_sales} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <div className="flex items-center gap-2">
          <input type="checkbox" name="winning_product" checked={formData.winning_product} onChange={handleChange} />
          <label className="text-blue-600">Produit Gagnant</label>
        </div>
        <input type="text" name="trend" placeholder="Tendance" value={formData.trend} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Mettre à Jour</button>
      </form>
    </div>
  );
};

export default ProductSalesForm;
