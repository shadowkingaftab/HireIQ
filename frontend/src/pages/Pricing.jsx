import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['Basic matching', '3 assessments/month', 'Skill graph visualization'],
    buttonText: 'Current Plan',
    planType: 'free',
    disabled: true
  },
  {
    name: 'Pro',
    price: '$20',
    period: '/mo',
    features: ['Advanced analytics', '20 assessments/month', 'Priority support', 'Detailed skill breakdown'],
    buttonText: 'Upgrade to Pro',
    planType: 'pro',
    highlight: true
  },
  {
    name: 'Team',
    price: '$100',
    period: '/mo',
    features: ['Recruiter dashboard', 'Unlimited assessments', 'Team collaboration', 'Candidate tracking'],
    buttonText: 'Upgrade to Team',
    planType: 'team'
  }
];

export default function Pricing() {
  const { currentUser } = useAuth();

  const handleUpgrade = async (planType) => {
    if (!currentUser) {
      alert("Please log in to upgrade.");
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:8000/create-checkout-session",
        {
          plan_type: planType,
          success_url: window.location.origin + "/dashboard?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: window.location.origin + "/pricing"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate upgrade. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Scale Your Proof</h1>
        <p className="text-xl text-gray-500 mb-12">Choose the plan that fits your growth.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`bg-white p-8 rounded-[32px] shadow-xl border ${
                plan.highlight ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-100'
              } flex flex-col`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
              <div className="mb-6">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-500 font-bold">{plan.period}</span>}
              </div>
              <ul className="text-left space-y-4 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600 font-medium">
                    <svg className="w-5 h-5 text-indigo-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.planType)}
                disabled={plan.disabled}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition shadow-lg ${
                  plan.highlight 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                    : plan.disabled 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
