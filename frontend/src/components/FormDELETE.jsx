import React, { useState } from "react";
import { toast } from "react-toastify"; // Assurez-vous d'avoir installé react-toastify

const ProductSalesForm = () => {
  const [formData, setFormData] = useState({
    id: "", // Champ ajouté pour l'identifiant du produit à supprimer
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Demander une confirmation avant de supprimer
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette vente ?");
    
    if (confirmation) {
      // Appel de la fonction deleteSale() si l'utilisateur confirme
      deleteSale();
    }
  };

  const deleteSale = () => {
    if (!formData.id) {
      console.error("Veuillez entrer un ID valide pour supprimer une vente.");
      return;
    }

    // Suppression des données en DELETE via l'API
    fetch(`http://127.0.0.1:8000/api/sales/${formData.id}/`, { 
        method: 'DELETE', // Changement de la méthode HTTP en DELETE
        headers: {
            'Content-Type': 'application/json', // En-tête précisant le type de contenu
        },
    })
    .then((response) => {
        if (response.ok) {
            toast.error(`Vente avec ID ${formData.id} supprimée avec succès.`); // Affiche un toast.error en cas de succès
            console.log(`Vente avec ID ${formData.id} supprimée avec succès.`);
        } else {
            toast.error("Erreur lors de la suppression de la vente."); // Affiche un message d'erreur si la suppression échoue
            console.error("Erreur lors de la suppression de la vente.");
        }
    })
    .catch((error) => {
      toast.error("Erreur lors de la suppression."); // Affiche un toast.error en cas d'erreur
      console.error('Erreur lors de la suppression:', error);
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-red-500">
      <h2 className="text-xl font-bold text-red-600 mb-4">Suppression d'une Vente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          name="id" 
          placeholder="ID de la vente" 
          value={formData.id} 
          onChange={handleChange} 
          className="w-full p-2 border rounded-lg" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
        >
          Supprimer
        </button>
      </form>
    </div>
  );
};

export default ProductSalesForm;
