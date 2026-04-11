// src/components/PricingCard/PricingCard.jsx
import React from "react";
import "../styles/PricingCard.css";

const PricingCard = ({
  billingCycle,
  onBillingCycleChange,
  onSelectPlan
}) => {
  const plans = [
    {
      title: "Basic",
      priceMonthly: 15,
      priceYearly: 162,
      description: "Idéal pour les petites entreprises",
      creditRate: "2,5% + 0,25€ par transaction",
      features: [
        "Analyses de prévisions de base",
        "Accès à des rapports mensuels",
        "Support par email",
      ],
    },
    {
      title: "Standard",
      priceMonthly: 30,
      priceYearly: 324,
      description: "Parfait pour les entreprises en croissance",
      creditRate: "2,3% + 0,25€ par transaction",
      features: [
        "Analyses prédictives avancées",
        "Rapports hebdomadaires personnalisés",
        "Support prioritaire par chat",
      ],
    },
    {
      title: "Premium",
      priceMonthly: 150,
      priceYearly: 1620,
      description: "Idéal pour les grandes entreprises",
      creditRate: "2,0% + 0,25€ par transaction",
      features: [
        "Prévisions en temps réel avec alertes",
        "Rapports quotidiens détaillés",
        "Assistance dédiée 24/7 avec conseiller personnalisé",
      ],
    },
  ];

  const Card = ({ title, priceMonthly, priceYearly, description, creditRate, features }) => {
    const price = billingCycle === "monthly" ? priceMonthly : priceYearly;
    const oldPrice = (price * 1.2).toFixed(2);

    return (
      <div className={`pricing-card ${title === "Standard" ? "highlighted" : ""}`}>
        <header>
          <h2 className="card-title">{title}</h2>
          <p className="old-price"><s>{oldPrice} €</s></p>
          <h1 className="card-price">
            {price} € <span>/ {billingCycle === "monthly" ? "mois" : "an"}</span>
          </h1>
        </header>
        <p className="card-description">{description}</p>
        <p className="card-credit-rate">Taux : {creditRate}</p>
        <ul className="card-features">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <button
          className="select-button"
          onClick={() => onSelectPlan({ title, priceMonthly, priceYearly, description, creditRate, features })}
        >
          Sélectionner
        </button>
      </div>
    );
  };

  return (
    <div className="pricing-container">
      <header className="pricing-header">
        <h1 className="pricing-title">Nos Plans Tarifaires</h1>
        <div className="billing-toggle">
          <p>Mensuel</p>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={billingCycle === "yearly"}
              onChange={() => onBillingCycleChange(billingCycle === "monthly" ? "yearly" : "monthly")}
              aria-label="Basculer entre facturation mensuelle et annuelle"
            />
            <div className="slider"></div>
          </label>
          <p>Annuel</p>
        </div>
      </header>

      <div className="pricing-cards">
        {plans.map((plan) => (
          <Card key={plan.title} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default PricingCard;