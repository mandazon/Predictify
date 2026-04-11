// src/pages/PricingPage.jsx
import React, { useState } from 'react';
import PricingCard from '../components/PricingCard';
import PricingSummary from '../components/PricingSummary';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowSummary(true);
  };

  const handleCloseSummary = () => {
    setShowSummary(false);
    // Optionnel : on peut aussi réinitialiser selectedPlan si on veut repartir de zéro
    // setSelectedPlan(null);
  };

  return (
    <div className="predictify-pricing-wrapper">
      <PricingCard
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
        onSelectPlan={handleSelectPlan}
      />

      {showSummary && selectedPlan && (
        <PricingSummary
          plan={selectedPlan}
          billingCycle={billingCycle}
          onClose={handleCloseSummary}
          // onConfirm n'est plus nécessaire → on le supprime des props
        />
      )}
    </div>
  );
};

export default PricingPage;