// src/components/PaymentChoice/PaymentChoice.jsx
import React, { useState } from 'react';
import '../styles/PaymentChoice.css';

// Import des images locales (chemin relatif depuis src/)
import Visa      from '../Images/1-Visa.png';
import MasterCard from '../Images/2-MasterCard.png';
import PayPal     from '../Images/3-PayPal.png';
import Stripe     from '../Images/4-Stripe.png';

const PaymentChoice = ({ selectedPlan, billingCycle, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Logique simplifiée – à connecter à Stripe plus tard
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Paiement simulé – Intégrez Stripe ici');
  };

  const price = billingCycle === 'monthly' ? selectedPlan?.priceMonthly : selectedPlan?.priceYearly;
  const period = billingCycle === 'monthly' ? 'mois' : 'an';

  return (
    <div className="payment-choice">
      <div className="choice-container">
        <button className="back-btn" onClick={onBack}>← Retour</button>

        <h1>Paiement sécurisé</h1>

        <div className="order-summary">
          <h3>Récapitulatif</h3>
          <p><strong>{selectedPlan?.title}</strong></p>
          <p>{price} € / {period}</p>
          <p className="total">Total : {price} €</p>
        </div>

        <div className="payment-methods">
          <h3>Méthodes de paiement acceptées</h3>
          <div className="icons-row">
            <img src={Visa}       alt="Visa"       className="payment-icon" />
            <img src={MasterCard} alt="Mastercard" className="payment-icon" />
            <img src={PayPal}     alt="PayPal"     className="payment-icon" />
            <img src={Stripe}     alt="Stripe"     className="payment-icon" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <label>Numéro de carte</label>
          <input type="text" placeholder="1234 5678 9012 3456" required />

          <div className="form-row">
            <div>
              <label>Date d'expiration</label>
              <input type="text" placeholder="MM / AA" required />
            </div>
            <div>
              <label>CVC</label>
              <input type="text" placeholder="123" maxLength={4} required />
            </div>
          </div>

          <label>Nom sur la carte</label>
          <input type="text" placeholder="John Doe" required />

          <div className="trust-bar">
            <span>🔒 Connexion sécurisée (SSL 256-bit)</span>
            <span>Paiement protégé par Stripe</span>
          </div>

          <button type="submit" className="pay-btn">
            Payer {price} € maintenant
          </button>
        </form>

        <p className="reassurance-text">
          Vos informations sont cryptées et jamais stockées sur nos serveurs.<br />
          Annulation gratuite sous 14 jours • Support 24/7
        </p>
      </div>
    </div>
  );
};

export default PaymentChoice;