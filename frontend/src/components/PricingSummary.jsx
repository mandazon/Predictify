// src/components/PricingSummary/PricingSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';   // ← Ajout important

import '../styles/PricingSummary.css';

const PricingSummary = ({ plan, billingCycle, onClose, onConfirm }) => {
  const navigate = useNavigate();   // ← Hook pour navigation programmatique

  if (!plan) return null;

  const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  const period = billingCycle === 'monthly' ? 'mois' : 'an';

  // Fonction qui remplace l'ancien onConfirm
  const handleConfirmAndPay = () => {
    // 1. On ferme le modal immédiatement (UX fluide)
    onClose();

    // 2. On navigue vers la page PaymentChoice en emportant les données utiles
    navigate('/payment-choice', {
      state: {
        selectedPlan: {
          title: plan.title,
          priceMonthly: plan.priceMonthly,
          priceYearly: plan.priceYearly,
          creditRate: plan.creditRate,
          features: plan.features,
          billingCycle: billingCycle,           // 'monthly' ou 'yearly'
          finalPrice: price,
          periodLabel: period,
          // Ajoutez ici d'autres champs si besoin (ex: planId, discount, etc.)
        }
      }
    });
  };

  return (
    <div className="summary-overlay" onClick={onClose}>
      <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2 className="summary-title">Récapitulatif de votre sélection</h2>

        <div className="plan-card-summary">
          <h3>{plan.title}</h3>
          <p className="summary-price">
            {price} € <span>/ {period}</span>
          </p>
          <p className="summary-old-price">
            <s>{(price * 1.2).toFixed(2)} €</s> <span className="savings">Économisez 20 %</span>
          </p>

          <p className="summary-rate">Taux appliqué : {plan.creditRate}</p>

          <ul className="summary-features">
            {plan.features.map((feat, i) => (
              <li key={i}>{feat}</li>
            ))}
          </ul>
        </div>

        <div className="reassurance">
          <div className="secure-badge">
            <span className="lock-icon">🔒</span> Paiement 100 % sécurisé
          </div>
          <p>Annulation possible à tout moment • Sans engagement caché</p>
        </div>

        {/* Changement ici : on utilise notre nouvelle fonction */}
        <button className="confirm-btn" onClick={handleConfirmAndPay}>
          Confirmer et payer
        </button>

        <p className="support-text">Besoin d’aide ? Contactez-nous 24/7</p>
      </div>
    </div>
  );
};

export default PricingSummary;