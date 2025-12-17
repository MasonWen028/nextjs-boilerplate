'use client';

import { useState, useEffect } from 'react';
import './index.css';

interface PricingPlan {
  id?: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  description: string;
  popular: boolean;
  displayOrder?: number;
}

// 默认价格计划（数据库失败时的后备数据）
const defaultPricingPlans: PricingPlan[] = [
  {
    name: 'Standard',
    monthlyPrice: 33,
    yearlyPrice: 26,
    features: [
      'Mass email',
      'Custom modules',
      'Workflows',
      'Cadences',
      'Sales forecasting',
      'Lookup fields',
      'Canvas',
      'Office 365 integration',
      'Zoho Marketplace'
    ],
    description: 'All the essentials:',
    popular: false
  },
  {
    name: 'Professional',
    monthlyPrice: 55,
    yearlyPrice: 43,
    features: [
      'Blueprint',
      'CPQ',
      'SalesSignals',
      'Inventory management',
      'Webhooks',
      'Assignment rules',
      'Validation rules',
      'Kiosk Studio',
      'Google Ads integration'
    ],
    description: 'Everything in Standard +',
    popular: false
  },
  {
    name: 'Enterprise',
    monthlyPrice: 77,
    yearlyPrice: 60,
    features: [
      'Zia - AI assistant',
      'Territory management',
      'Custom functions',
      'Journey orchestration',
      'Multi-user portals',
      'Page layouts',
      'Client scripts',
      'Approval process',
      'Sandbox'
    ],
    description: 'Everything in Professional +',
    popular: true
  },
  {
    name: 'Ultimate',
    monthlyPrice: 100.10,
    yearlyPrice: 78,
    features: [
      'Enhanced feature limits',
      'Custom AI/ML platform',
      'Advanced customization',
      'Data preparation',
      'Augmented analytics',
      'Data storytelling',
      'Unified business insights',
      'Advanced administration'
    ],
    description: 'Everything in Enterprise +',
    popular: false
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(defaultPricingPlans);
  const [loading, setLoading] = useState(true);

  // 从 API 获取价格计划，失败则使用默认数据
  useEffect(() => {
    async function fetchPricingPlans() {
      try {
        const response = await fetch('/api/pricing');
        if (response.ok) {
          const data = await response.json();
          if (data.plans && data.plans.length > 0) {
            setPricingPlans(data.plans);
          }
        } else {
          console.warn('API 返回错误，使用默认价格计划');
        }
      } catch (error) {
        console.warn('获取价格计划失败，使用默认数据:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPricingPlans();
  }, []);

  const getPrice = (plan: typeof pricingPlans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = () => {
    const monthlyTotal = pricingPlans.reduce((sum, plan) => sum + plan.monthlyPrice, 0);
    const yearlyTotal = pricingPlans.reduce((sum, plan) => sum + plan.yearlyPrice, 0);
    const savings = ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  if (loading) {
    return (
      <section className="pricing-section" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-xl">加载价格计划中...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pricing-section" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Billing Toggle */}
        <div className="pricing-toggle-wrapper">
          <div className="pricing-toggle">
            <button
              className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`toggle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
            {billingCycle === 'yearly' && (
              <div className="savings-badge">
                SAVE UP TO {getSavings()}%
              </div>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">MOST POPULAR</div>
              )}
              <div className="pricing-card-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">A$</span>
                  <span className="amount">{getPrice(plan).toFixed(plan.name === 'Ultimate' && billingCycle === 'monthly' ? 2 : 0)}</span>
                  <span className="period">/user/month</span>
                </div>
                <div className="billing-info">
                  billed {billingCycle === 'monthly' ? 'monthly' : 'yearly'}
                </div>
              </div>
              <button
                className={`pricing-button ${plan.popular ? 'popular-button' : ''}`}
              >
                START FREE TRIAL
              </button>
              <div className="pricing-features">
                <div className="features-description">{plan.description}</div>
                <ul className="features-list">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

