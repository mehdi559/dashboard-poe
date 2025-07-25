import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

const WelcomeScreen = ({ financeManager, theme, t, onStart }) => {
  // Sécurisation pour splash screen : valeurs par défaut si props manquantes
  const safeFinanceManager = financeManager || { state: {}, actions: {} };
  const state = safeFinanceManager.state || {};
  const actions = safeFinanceManager.actions || {};
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep(1);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Icons.TrendingUp,
      title: t('welcome_smart_dashboard'),
      description: t('welcome_smart_dashboard_desc'),
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Icons.Target,
      title: t('welcome_budget_management'),
      description: t('welcome_budget_management_desc'),
      color: "from-green-500 to-green-600"
    },
    {
      icon: Icons.PiggyBank,
      title: t('welcome_savings_goals'),
      description: t('welcome_savings_goals_desc'),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Icons.BarChart3,
      title: t('welcome_detailed_reports'),
      description: t('welcome_detailed_reports_desc'),
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Icons.Calendar,
      title: t('welcome_financial_planning'),
      description: t('welcome_financial_planning_desc'),
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Icons.Shield,
      title: t('welcome_max_security'),
      description: t('welcome_max_security_desc'),
      color: "from-red-500 to-red-600"
    }
  ];

  const stats = [
    { label: t('welcome_active_users'), value: "10K+", icon: Icons.Users },
    { label: t('welcome_processed_transactions'), value: "1M+", icon: Icons.Activity },
    { label: t('welcome_savings_generated'), value: "500K€", icon: Icons.TrendingUp },
    { label: t('welcome_satisfaction_rating'), value: "4.9/5", icon: Icons.Star }
  ];

  const quickActions = [
    {
      title: t('welcome_get_started'),
      description: t('welcome_get_started_desc'),
      icon: Icons.Play,
      action: onStart || (() => {}),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: t('welcome_add_income'),
      description: t('welcome_add_income_desc'),
      icon: Icons.Plus,
      action: () => {
        if (onStart) onStart();
        if (actions.setActiveTab) actions.setActiveTab('revenue');
      },
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: t('welcome_view_dashboard'),
      description: t('welcome_view_dashboard_desc'),
      icon: Icons.BarChart3,
      action: () => {
        if (onStart) onStart();
        if (actions.setActiveTab) actions.setActiveTab('dashboard');
      },
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      {/* Sélecteur de langue en haut à droite */}
      <div className="absolute top-6 right-8 z-50 flex space-x-2">
        {['fr', 'en', 'es'].map(lang => (
          <button
            key={lang}
            onClick={() => actions.setLanguage && actions.setLanguage(lang)}
            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 font-semibold shadow-md
              ${state.language === lang
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-white'}
            `}
            style={{ minWidth: 40 }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/5 dark:to-purple-500/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className={`transform transition-all duration-1000 ${animationStep >= 1 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-6">
                <Icons.Sparkles className="w-4 h-4 mr-2" />
                {t('welcome_new_version')}
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {t('welcome_take_control')}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {t('welcome_intro')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group`}
                  >
                    <action.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{action.title}</span>
                  </button>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual */}
            <div className={`transform transition-all duration-1000 delay-300 ${animationStep >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="relative">
                {/* Floating Cards */}
                <div className="relative z-10 space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 animate-pulse-slow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('welcome_total_balance')}</h3>
                      <Icons.TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: state.currency || 'EUR' 
                      }).format(state.totalBalance || 5420)}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">+12.5% {t('welcome_this_month')}</div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 ml-8 animate-pulse-slow delay-1000">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t('welcome_savings_goal')}</h3>
                      <Icons.Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '68%'}}></div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">68% {t('welcome_of_goal')}</div>
                  </div>
                </div>
                
                {/* Background Elements */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-r from-green-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('welcome_full_features')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('welcome_full_features_desc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('welcome_ready_transform')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('welcome_join_thousands')}
          </p>
          <button
            onClick={() => actions.setActiveTab('dashboard')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 hover:scale-105 transform inline-flex items-center space-x-3"
          >
            <Icons.ArrowRight className="w-6 h-6" />
            <span>{t('welcome_start_now')}</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default WelcomeScreen; 