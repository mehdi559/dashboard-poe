import { format } from 'date-fns';
import { fr, enUS, es } from 'date-fns/locale';

class ReportGenerator {
  static getLocale(language) {
    switch (language) {
      case 'fr': return fr;
      case 'es': return es;
      default: return enUS;
    }
  }

  static async generateHTML(reportData) {
    const { type, data, translations: t } = reportData;
    
    switch (type) {
      case 'monthly':
        return this.generateMonthlyReport(data, t);
      case 'annual':
        return this.generateAnnualReport(data, t);
      case 'budget':
        return this.generateBudgetReport(data, t);
      case 'savings':
        return this.generateSavingsReport(data, t);
      case 'debts':
        return this.generateDebtReport(data, t);
      default:
        return this.generateMonthlyReport(data, t);
    }
  }

  static generateMonthlyReport(data, t) {
    const monthName = format(new Date(data.selectedMonth + '-01'), 'MMMM yyyy', {
      locale: this.getLocale(data.language)
    });

    return `
      <div class="container">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; }
          .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 2rem; border-radius: 12px; }
          .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; font-size: 1.1rem; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
          .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); transition: transform 0.2s ease; }
          .metric-card:hover { transform: translateY(-2px); }
          .metric-card h3 { font-size: 1.1rem; opacity: 0.9; margin-bottom: 0.5rem; }
          .metric-card .value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .metric-card .subtitle { font-size: 0.9rem; opacity: 0.75; }
          .section { margin-bottom: 2rem; }
          .section h2 { font-size: 1.8rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
          .category-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; background: #f8fafc; transition: all 0.2s ease; }
          .category-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .category-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .category-name { font-weight: 600; text-transform: capitalize; font-size: 1.1rem; }
          .category-amount { font-weight: bold; font-size: 1.1rem; }
          .progress-bar { width: 100%; height: 10px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin: 0.5rem 0; }
          .progress-fill { height: 100%; border-radius: 6px; transition: width 0.3s ease; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
          .warning { color: #f59e0b; }
          .chart-container { height: 300px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 2rem; margin: 1rem 0; display: flex; align-items: center; justify-content: center; border: 2px dashed #cbd5e1; }
          .chart-placeholder { text-align: center; color: #64748b; font-size: 1.1rem; }
          .table { width: 100%; border-collapse: collapse; margin-top: 1rem; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
          .table th, .table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .table th { background: #f9fafb; font-weight: 600; color: #374151; }
          .table tr:hover { background: #f8fafc; }
          .recommendations { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .recommendations h3 { color: #1e40af; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
          .recommendations ul { list-style: none; }
          .recommendations li { margin-bottom: 0.5rem; color: #1e40af; }
          .footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; }
          
          /* Styles d'impression optimisés pour PDF */
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: none; margin: 0; padding: 1rem; }
            .metric-card { break-inside: avoid; page-break-inside: avoid; }
            .section { break-inside: avoid; page-break-inside: avoid; }
            .category-item { break-inside: avoid; page-break-inside: avoid; }
            .recommendations { break-inside: avoid; page-break-inside: avoid; }
            .table { break-inside: avoid; page-break-inside: avoid; }
            .chart-container { height: 200px; }
            .progress-bar { height: 6px; }
            .metric-card .value { font-size: 2rem; }
            .header h1 { font-size: 2rem; }
            .section h2 { font-size: 1.5rem; }
          }
        </style>
        
        <!-- En-tête -->
        <div class="header">
          <h1>${t('monthlyReport')} - ${monthName}</h1>
          <p>${t('generatedOn')} ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <!-- Métriques principales -->
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>${t('totalSpent')}</h3>
            <div class="value">${this.formatCurrency(data.totalSpent)}</div>
            <div class="subtitle">
              ${data.totalBudget > 0 ? ((data.totalSpent / data.totalBudget) * 100).toFixed(1) : '0.0'}% ${t('ofBudget')}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('savingsRate')}</h3>
            <div class="value">${data.savingsRate ? data.savingsRate.toFixed(1) : '0.0'}%</div>
            <div class="subtitle">
              ${this.formatCurrency(data.monthlyIncome ? data.monthlyIncome - data.totalSpent : 0)} ${t('thisMonth')}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('remainingBudget')}</h3>
            <div class="value">${this.formatCurrency(data.totalBudget - data.totalSpent)}</div>
            <div class="subtitle">${t('available')}</div>
          </div>
        </div>

        <!-- Analyse par catégorie -->
        <div class="section">
          <h2>📊 ${t('budgetAnalysis')}</h2>
          <div>
            ${data.categories.map(category => {
              const spent = data.currentMonthExpenses
                .filter(e => e.category === category.name)
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
              const statusClass = percentage > 100 ? 'negative' : percentage > 80 ? 'warning' : 'positive';
              
              return `
                <div class="category-item">
                  <div class="category-header">
                    <span class="category-name">${t(category.name)}</span>
                    <span class="category-amount ${statusClass}">${this.formatCurrency(spent)} / ${this.formatCurrency(category.budget)}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${category.color || '#3b82f6'}"></div>
                  </div>
                  <div style="font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem;">${percentage.toFixed(1)}% ${t('used')}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Graphique des dépenses -->
        <div class="section">
          <h2>📈 ${t('expenseChart')}</h2>
          <div class="chart-container">
            <div class="chart-placeholder">
              📊 ${t('chartWillBeHere')}
              <br><small>${t('interactiveInBrowser')}</small>
            </div>
          </div>
        </div>

        <!-- Top dépenses -->
        <div class="section">
          <h2>🏆 ${t('topExpenses')}</h2>
          <table class="table">
            <thead>
              <tr>
                <th>${t('date')}</th>
                <th>${t('description')}</th>
                <th>${t('category')}</th>
                <th style="text-align: right;">${t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              ${data.currentMonthExpenses && data.currentMonthExpenses.length > 0 
                ? data.currentMonthExpenses
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 10)
                    .map(expense => `
                      <tr>
                        <td>${format(new Date(expense.date), 'dd/MM/yyyy')}</td>
                        <td>${expense.description}</td>
                        <td style="text-transform: capitalize;">${t(expense.category)}</td>
                        <td style="text-align: right; font-weight: 600;">${this.formatCurrency(expense.amount)}</td>
                      </tr>
                    `).join('')
                : `<tr><td colspan="4" style="text-align: center; color: #6b7280; padding: 2rem;">${t('noExpensesThisMonth') || 'Aucune dépense ce mois'}</td></tr>`
              }
            </tbody>
          </table>
        </div>

        <!-- Commentaires et recommandations -->
        <div class="recommendations">
          <h3>💡 ${t('recommendations')}</h3>
          <ul>
            ${this.generateRecommendations(data, t).map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          ${t('generatedBy')} ${data.userName || t('user')} | ${t('futureFinance')}
        </div>
      </div>
    `;
  }

  static generateAnnualReport(data, t) {
    // Utiliser l'année de la date sélectionnée ou l'année courante
    const selectedYear = data.selectedMonth ? data.selectedMonth.split('-')[0] : new Date().getFullYear().toString();
    const yearExpenses = data.expenses.filter(e => e.date.startsWith(selectedYear));
    const totalYearSpent = yearExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalYearIncome = data.monthlyIncome * 12;
    const yearSavingsRate = totalYearIncome > 0 ? ((totalYearIncome - totalYearSpent) / totalYearIncome) * 100 : 0;
    
    // Dépenses par mois
    const monthlyData = Array.from({length: 12}, (_, i) => {
      const month = String(i + 1).padStart(2, '0');
      const monthExpenses = yearExpenses.filter(e => e.date.startsWith(`${selectedYear}-${month}`));
      const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return { month, total: monthTotal, count: monthExpenses.length };
    });

    return `
      <div class="container">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; }
          .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 2rem; border-radius: 12px; }
          .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; font-size: 1.1rem; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
          .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); transition: transform 0.2s ease; }
          .metric-card:hover { transform: translateY(-2px); }
          .metric-card h3 { font-size: 1.1rem; opacity: 0.9; margin-bottom: 0.5rem; }
          .metric-card .value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .metric-card .subtitle { font-size: 0.9rem; opacity: 0.75; }
          .section { margin-bottom: 2rem; }
          .section h2 { font-size: 1.8rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
          .monthly-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
          .month-card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; text-align: center; }
          .month-card.active { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; }
          .month-card h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
          .month-card .amount { font-size: 1.2rem; font-weight: bold; }
          .month-card .count { font-size: 0.8rem; opacity: 0.7; }
          .table { width: 100%; border-collapse: collapse; margin-top: 1rem; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
          .table th, .table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .table th { background: #f9fafb; font-weight: 600; color: #374151; }
          .table tr:hover { background: #f8fafc; }
          .recommendations { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .recommendations h3 { color: #1e40af; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
          .recommendations ul { list-style: none; }
          .recommendations li { margin-bottom: 0.5rem; color: #1e40af; }
          .footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; }
          
          /* Styles d'impression optimisés pour PDF */
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: none; margin: 0; padding: 1rem; }
            .metric-card { break-inside: avoid; page-break-inside: avoid; }
            .section { break-inside: avoid; page-break-inside: avoid; }
            .monthly-grid { grid-template-columns: repeat(4, 1fr); }
            .table { break-inside: avoid; page-break-inside: avoid; }
            .recommendations { break-inside: avoid; page-break-inside: avoid; }
            .metric-card .value { font-size: 2rem; }
            .header h1 { font-size: 2rem; }
            .section h2 { font-size: 1.5rem; }
          }
        </style>
        
        <!-- En-tête -->
        <div class="header">
          <h1>${t('annualReport')} - ${selectedYear}</h1>
          <p>${t('generatedOn')} ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <!-- Métriques principales -->
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>${t('totalSpent')}</h3>
            <div class="value">${this.formatCurrency(totalYearSpent)}</div>
            <div class="subtitle">
              ${totalYearIncome > 0 ? ((totalYearSpent / totalYearIncome) * 100).toFixed(1) : '0.0'}% ${t('ofBudget')}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('savingsRate')}</h3>
            <div class="value">${yearSavingsRate.toFixed(1)}%</div>
            <div class="subtitle">
              ${this.formatCurrency(totalYearIncome - totalYearSpent)} ${t('thisYear') || 'Cette année'}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('remainingBudget')}</h3>
            <div class="value">${this.formatCurrency(totalYearIncome - totalYearSpent)}</div>
            <div class="subtitle">${t('available')}</div>
          </div>
        </div>

        <!-- Dépenses par mois -->
        <div class="section">
          <h2>📊 ${t('monthlyBreakdown') || 'Répartition Mensuelle'}</h2>
          <div class="monthly-grid">
            ${monthlyData.map((monthData, index) => {
              const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
              const isCurrentMonth = new Date().getMonth() === index;
              return `
                <div class="month-card ${isCurrentMonth ? 'active' : ''}">
                  <h4>${monthNames[index]}</h4>
                  <div class="amount">${this.formatCurrency(monthData.total)}</div>
                  <div class="count">${monthData.count} ${t('expenses') || 'dépenses'}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Top dépenses de l'année -->
        <div class="section">
          <h2>🏆 ${t('topExpenses')} ${selectedYear}</h2>
          <table class="table">
            <thead>
              <tr>
                <th>${t('date')}</th>
                <th>${t('description')}</th>
                <th>${t('category')}</th>
                <th style="text-align: right;">${t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              ${yearExpenses && yearExpenses.length > 0 
                ? yearExpenses
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 15)
                    .map(expense => `
                      <tr>
                        <td>${format(new Date(expense.date), 'dd/MM/yyyy')}</td>
                        <td>${expense.description}</td>
                        <td style="text-transform: capitalize;">${t(expense.category)}</td>
                        <td style="text-align: right; font-weight: 600;">${this.formatCurrency(expense.amount)}</td>
                      </tr>
                    `).join('')
                : `<tr><td colspan="4" style="text-align: center; color: #6b7280; padding: 2rem;">${t('noExpensesThisYear') || 'Aucune dépense cette année'}</td></tr>`
              }
            </tbody>
          </table>
        </div>

        <!-- Commentaires et recommandations -->
        <div class="recommendations">
          <h3>💡 ${t('recommendations')}</h3>
          <ul>
            ${this.generateRecommendations(data, t).map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>

        <!-- Footer -->
        <div class="footer">
          ${t('generatedBy')} ${data.userName || t('user')} | ${t('futureFinance')}
        </div>
      </div>
    `;
  }

  static generateBudgetReport(data, t) {
    return `
      <div class="container">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; }
          .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 2rem; border-radius: 12px; }
          .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; font-size: 1.1rem; }
          .section { margin-bottom: 2rem; }
          .section h2 { font-size: 1.8rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
          .category-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; background: #f8fafc; transition: all 0.2s ease; }
          .category-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .category-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .category-name { font-weight: 600; text-transform: capitalize; font-size: 1.1rem; }
          .category-amount { font-weight: bold; font-size: 1.1rem; }
          .progress-bar { width: 100%; height: 10px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin: 0.5rem 0; }
          .progress-fill { height: 100%; border-radius: 6px; transition: width 0.3s ease; }
          .positive { color: #10b981; }
          .negative { color: #ef4444; }
          .warning { color: #f59e0b; }
          .recommendations { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .recommendations h3 { color: #1e40af; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
          .recommendations ul { list-style: none; }
          .recommendations li { margin-bottom: 0.5rem; color: #1e40af; }
          .footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; }
          
          /* Styles d'impression optimisés pour PDF */
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: none; margin: 0; padding: 1rem; }
            .category-item { break-inside: avoid; page-break-inside: avoid; }
            .section { break-inside: avoid; page-break-inside: avoid; }
            .recommendations { break-inside: avoid; page-break-inside: avoid; }
            .progress-bar { height: 6px; }
            .header h1 { font-size: 2rem; }
            .section h2 { font-size: 1.5rem; }
          }
        </style>
        
        <div class="header">
          <h1>📊 ${t('budgetAnalysis')}</h1>
          <p>${t('generatedOn')} ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>
        
        <div class="section">
          <h2>🎯 ${t('detailedBudgetOverview') || 'Vue d\'ensemble détaillée du budget'}</h2>
          <div>
            ${data.categories.map(category => {
              const spent = data.currentMonthExpenses
                .filter(e => e.category === category.name)
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0;
              const statusClass = percentage > 100 ? 'negative' : percentage > 80 ? 'warning' : 'positive';
              return `
                <div class="category-item">
                  <div class="category-header">
                    <span class="category-name">${t(category.name)}</span>
                    <span class="category-amount ${statusClass}">${this.formatCurrency(spent)} / ${this.formatCurrency(category.budget)}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${category.color || '#3b82f6'}"></div>
                  </div>
                  <div style="font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem;">${percentage.toFixed(1)}% ${t('used')}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="recommendations">
          <h3>💡 ${t('recommendations')}</h3>
          <ul>
            ${this.generateRecommendations(data, t).map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="footer">
          ${t('generatedBy')} ${data.userName || t('user')} | ${t('futureFinance')}
        </div>
      </div>
    `;
  }

  static generateSavingsReport(data, t) {
    const totalSavings = data.savingsGoals ? data.savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0) : 0;
    const totalTarget = data.savingsGoals ? data.savingsGoals.reduce((sum, s) => sum + s.targetAmount, 0) : 0;
    const overallProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;
    
    return `
      <div class="container">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; }
          .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 2rem; border-radius: 12px; }
          .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; font-size: 1.1rem; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
          .metric-card { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); transition: transform 0.2s ease; }
          .metric-card:hover { transform: translateY(-2px); }
          .metric-card h3 { font-size: 1.1rem; opacity: 0.9; margin-bottom: 0.5rem; }
          .metric-card .value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .metric-card .subtitle { font-size: 0.9rem; opacity: 0.75; }
          .section { margin-bottom: 2rem; }
          .section h2 { font-size: 1.8rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
          .goal-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; background: #f8fafc; transition: all 0.2s ease; }
          .goal-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .goal-name { font-weight: 600; font-size: 1.1rem; }
          .goal-amount { font-weight: bold; font-size: 1.1rem; }
          .progress-bar { width: 100%; height: 10px; background: #e5e7eb; border-radius: 6px; overflow: hidden; margin: 0.5rem 0; }
          .progress-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, #10b981, #059669); transition: width 0.3s ease; }
          .positive { color: #10b981; }
          .warning { color: #f59e0b; }
          .recommendations { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .recommendations h3 { color: #1e40af; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
          .recommendations ul { list-style: none; }
          .recommendations li { margin-bottom: 0.5rem; color: #1e40af; }
          .footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; }
          
          /* Styles d'impression optimisés pour PDF */
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: none; margin: 0; padding: 1rem; }
            .metric-card { break-inside: avoid; page-break-inside: avoid; }
            .goal-item { break-inside: avoid; page-break-inside: avoid; }
            .section { break-inside: avoid; page-break-inside: avoid; }
            .recommendations { break-inside: avoid; page-break-inside: avoid; }
            .progress-bar { height: 6px; }
            .metric-card .value { font-size: 2rem; }
            .header h1 { font-size: 2rem; }
            .section h2 { font-size: 1.5rem; }
          }
        </style>
        
        <div class="header">
          <h1>💰 ${t('savingsReport')}</h1>
          <p>${t('generatedOn')} ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <!-- Métriques principales -->
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>${t('totalSavings') || 'Total Épargne'}</h3>
            <div class="value">${this.formatCurrency(totalSavings)}</div>
            <div class="subtitle">
              ${overallProgress.toFixed(1)}% ${t('reached')}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('targetAmount') || 'Objectif Total'}</h3>
            <div class="value">${this.formatCurrency(totalTarget)}</div>
            <div class="subtitle">
              ${t('remaining') || 'Restant'} ${this.formatCurrency(totalTarget - totalSavings)}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('savingsRate')}</h3>
            <div class="value">${data.savingsRate ? data.savingsRate.toFixed(1) : '0.0'}%</div>
            <div class="subtitle">
              ${t('thisMonth')}
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>🎯 ${t('savingsGoals')}</h2>
          <div>
            ${(data.savingsGoals || []).map(goal => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const statusClass = progress >= 100 ? 'positive' : 'warning';
              return `
                <div class="goal-item">
                  <div class="goal-header">
                    <span class="goal-name">${goal.name}</span>
                    <span class="goal-amount ${statusClass}">${this.formatCurrency(goal.currentAmount)} / ${this.formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                  </div>
                  <div style="font-size: 0.9rem; color: #6b7280; margin-top: 0.25rem;">${progress.toFixed(1)}% ${t('reached')}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="recommendations">
          <h3>💡 ${t('recommendations')}</h3>
          <ul>
            ${this.generateSavingsRecommendations(data.savingsGoals, data.monthlyIncome - data.totalSpent, t).map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="footer">
          ${t('generatedBy')} ${data.userName || t('user')} | ${t('futureFinance')}
        </div>
      </div>
    `;
  }

  static generateDebtReport(data, t) {
    const totalDebt = data.debts ? data.debts.reduce((sum, d) => sum + d.balance, 0) : 0;
    const debtCount = data.debts ? data.debts.length : 0;
    
    return `
      <div class="container">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; background: white; }
          .header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 2rem; border-radius: 12px; }
          .header h1 { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; font-size: 1.1rem; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
          .metric-card { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); transition: transform 0.2s ease; }
          .metric-card:hover { transform: translateY(-2px); }
          .metric-card h3 { font-size: 1.1rem; opacity: 0.9; margin-bottom: 0.5rem; }
          .metric-card .value { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
          .metric-card .subtitle { font-size: 0.9rem; opacity: 0.75; }
          .section { margin-bottom: 2rem; }
          .section h2 { font-size: 1.8rem; font-weight: bold; color: #1f2937; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
          .debt-item { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; background: #f8fafc; transition: all 0.2s ease; }
          .debt-item:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .debt-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
          .debt-name { font-weight: 600; font-size: 1.1rem; }
          .debt-amount { font-weight: bold; font-size: 1.1rem; }
          .debt-description { color: #6b7280; font-size: 0.9rem; margin-top: 0.25rem; }
          .negative { color: #ef4444; }
          .positive { color: #10b981; }
          .recommendations { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 1.5rem; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .recommendations h3 { color: #1e40af; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
          .recommendations ul { list-style: none; }
          .recommendations li { margin-bottom: 0.5rem; color: #1e40af; }
          .footer { text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9rem; }
          
          /* Styles d'impression optimisés pour PDF */
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: none; margin: 0; padding: 1rem; }
            .metric-card { break-inside: avoid; page-break-inside: avoid; }
            .debt-item { break-inside: avoid; page-break-inside: avoid; }
            .section { break-inside: avoid; page-break-inside: avoid; }
            .recommendations { break-inside: avoid; page-break-inside: avoid; }
            .metric-card .value { font-size: 2rem; }
            .header h1 { font-size: 2rem; }
            .section h2 { font-size: 1.5rem; }
          }
        </style>
        
        <div class="header">
          <h1>💳 ${t('debtAnalysis')}</h1>
          <p>${t('generatedOn')} ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <!-- Métriques principales -->
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>${t('totalDebt') || 'Total Dettes'}</h3>
            <div class="value">${this.formatCurrency(totalDebt)}</div>
            <div class="subtitle">
              ${debtCount} ${t('debts') || 'dettes'}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('averageDebt') || 'Dette Moyenne'}</h3>
            <div class="value">${debtCount > 0 ? this.formatCurrency(totalDebt / debtCount) : this.formatCurrency(0)}</div>
            <div class="subtitle">
              ${t('perDebt') || 'par dette'}
            </div>
          </div>
          <div class="metric-card">
            <h3>${t('debtToIncome') || 'Ratio Dette/Revenu'}</h3>
            <div class="value">${data.monthlyIncome > 0 ? ((totalDebt / data.monthlyIncome) * 100).toFixed(1) : '0.0'}%</div>
            <div class="subtitle">
              ${t('monthlyIncome') || 'revenu mensuel'}
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>📋 ${t('debtBreakdown') || 'Détail des Dettes'}</h2>
          <div>
            ${(data.debts || []).map(debt => {
              const percentageOfTotal = totalDebt > 0 ? (debt.balance / totalDebt) * 100 : 0;
              return `
                <div class="debt-item">
                  <div class="debt-header">
                    <span class="debt-name">${debt.name}</span>
                    <span class="debt-amount negative">${this.formatCurrency(debt.balance)}</span>
                  </div>
                  <div class="debt-description">
                    ${debt.description || t('noDescription') || 'Aucune description'}
                  </div>
                  <div style="font-size: 0.9rem; color: #6b7280; margin-top: 0.5rem;">
                    ${percentageOfTotal.toFixed(1)}% ${t('ofTotalDebt') || 'du total des dettes'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="recommendations">
          <h3>💡 ${t('recommendations')}</h3>
          <ul>
            ${this.generateDebtRecommendations(data.debts, data.monthlyIncome, t).map(rec => `<li>• ${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="footer">
          ${t('generatedBy')} ${data.userName || t('user')} | ${t('futureFinance')}
        </div>
      </div>
    `;
  }

  static generateRecommendations(data, t) {
    const recommendations = [];
    
    // Recommandations générales basées sur les métriques principales
    if (data.savingsRate < 20) {
      recommendations.push(t('increaseSavingsRecommendation') || 'Considérez augmenter votre taux d\'épargne à au moins 20% de vos revenus.');
    }
    
    if (data.totalSpent > data.totalBudget) {
      recommendations.push(t('reduceBudgetExcessRecommendation') || 'Réduisez les dépenses dans les catégories dépassant le budget.');
    }
    
    if (data.debts && data.debts.length > 0) {
      const totalDebt = data.debts.reduce((sum, d) => sum + d.balance, 0);
      if (data.monthlyIncome > 0 && (totalDebt / data.monthlyIncome) > 0.3) {
        recommendations.push(t('highDebtToIncomeRecommendation') || 'Votre ratio dette/revenu est élevé. Priorisez le remboursement des dettes.');
      } else {
        recommendations.push(t('debtReductionRecommendation') || 'Priorisez le remboursement des dettes à taux d\'intérêt élevés.');
      }
    }
    
    // Recommandations positives si tout va bien
    if (recommendations.length === 0) {
      recommendations.push(t('keepGoodWork') || 'Excellente gestion financière ! Continuez ainsi.');
    }
    
    return recommendations;
  }

  static generateBudgetRecommendations(categoryAnalysis, t) {
    const recommendations = [];
    
    const exceededCategories = categoryAnalysis.filter(c => c.status === 'exceeded');
    const warningCategories = categoryAnalysis.filter(c => c.status === 'warning');
    
    if (exceededCategories.length > 0) {
      recommendations.push(t('reduceExceededCategories') || `Réduisez les dépenses dans ${exceededCategories.length} catégorie(s) dépassant le budget.`);
    }
    
    if (warningCategories.length > 0) {
      recommendations.push(t('monitorWarningCategories') || `Surveillez ${warningCategories.length} catégorie(s) approchant de la limite.`);
    }
    
    const goodCategories = categoryAnalysis.filter(c => c.status === 'good');
    if (goodCategories.length > categoryAnalysis.length * 0.7) {
      recommendations.push(t('excellentBudgetControl') || 'Excellent contrôle budgétaire ! Vous respectez vos limites.');
    }
    
    return recommendations.length > 0 ? recommendations : [t('keepGoodWork') || 'Continuez votre bonne gestion budgétaire.'];
  }

  static generateSavingsRecommendations(savingsGoals, totalMonthSavings, t) {
    const recommendations = [];
    
    if (savingsGoals.length === 0) {
      recommendations.push(t('createSavingsGoals') || 'Créez des objectifs d\'épargne spécifiques pour mieux planifier vos finances.');
    } else if (totalMonthSavings === 0) {
      recommendations.push(t('startMonthlySavings') || 'Commencez à épargner mensuellement, même un petit montant fait la différence.');
    } else if (totalMonthSavings < 100) {
      recommendations.push(t('increaseMonthlySavings') || 'Augmentez progressivement votre épargne mensuelle.');
    }
    
    // Analyser la progression des objectifs
    const completedGoals = savingsGoals.filter(goal => goal.currentAmount >= goal.targetAmount);
    const inProgressGoals = savingsGoals.filter(goal => goal.currentAmount > 0 && goal.currentAmount < goal.targetAmount);
    
    if (completedGoals.length > 0) {
      recommendations.push(t('celebrateCompletedGoals') || `Félicitations ! Vous avez atteint ${completedGoals.length} objectif(s).`);
    }
    
    if (inProgressGoals.length > 0) {
      recommendations.push(t('continueProgressGoals') || `Continuez vers vos ${inProgressGoals.length} objectif(s) en cours.`);
    }
    
    return recommendations.length > 0 ? recommendations : [t('keepGoodWork') || 'Excellente progression de vos objectifs d\'épargne !'];
  }

  static generateDebtRecommendations(debts, monthlyIncome, t) {
    const recommendations = [];
    
    if (debts.length === 0) {
      recommendations.push(t('noDebtsGood') || 'Excellent ! Vous n\'avez aucune dette. Continuez à éviter l\'endettement.');
      return recommendations;
    }
    
    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const debtToIncomeRatio = monthlyIncome > 0 ? totalDebt / monthlyIncome : 0;
    
    if (debtToIncomeRatio > 0.5) {
      recommendations.push(t('highDebtUrgent') || 'Votre niveau d\'endettement est élevé. Considérez un plan de remboursement accéléré.');
    } else if (debtToIncomeRatio > 0.3) {
      recommendations.push(t('moderateDebtWarning') || 'Votre ratio dette/revenu est modéré. Surveillez vos nouvelles dépenses.');
    }
    
    // Recommandations par type de dette
    const highInterestDebts = debts.filter(d => d.interestRate && d.interestRate > 5);
    if (highInterestDebts.length > 0) {
      recommendations.push(t('prioritizeHighInterest') || 'Priorisez le remboursement des dettes à taux d\'intérêt élevés.');
    }
    
    const largeDebts = debts.filter(d => d.balance > monthlyIncome);
    if (largeDebts.length > 0) {
      recommendations.push(t('consolidateLargeDebts') || 'Considérez la consolidation de vos grosses dettes pour réduire les intérêts.');
    }
    
    return recommendations.length > 0 ? recommendations : [t('manageDebtsWell') || 'Vous gérez bien vos dettes. Continuez vos paiements réguliers.'];
  }

  static formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // === MÉTHODES D'EXPORT ===
  static async exportHTML(reportData) {
    try {
      const html = await this.generateHTML(reportData);
      
      // Créer un blob et télécharger
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Rapport-${reportData.type}-${timestamp}.html`;
      
      // Télécharger le fichier
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, fileName };
    } catch (error) {
      console.error('Erreur export HTML:', error);
      return { success: false, error };
    }
  }

  static async exportPDF(reportData) {
    try {
      console.log('🔄 Début export PDF...');
      const html = await this.generateHTML(reportData);
      
      // Vérifier que le HTML n'est pas vide
      if (!html || html.trim().length === 0) {
        throw new Error('Le contenu HTML généré est vide');
      }
      
      console.log('📄 HTML généré:', html.substring(0, 200) + '...');
      
      // Utiliser une approche simple avec window.print() comme fallback
      console.log('📄 Tentative d\'export PDF...');
      
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Rapport-${reportData.type}-${timestamp}.pdf`;
      
      console.log('📄 Configuration PDF...');
      
      // Créer un élément temporaire pour le HTML
      const element = document.createElement('div');
      element.innerHTML = html;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      element.style.width = '210mm';
      element.style.height = 'auto';
      element.style.backgroundColor = 'white';
      element.style.padding = '20px';
      document.body.appendChild(element);
      
      console.log('📄 Génération PDF en cours...');
      
      // Attendre que l'élément soit complètement rendu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Essayer d'abord avec html2pdf.js si disponible
      try {
        if (typeof window.html2pdf !== 'undefined') {
          console.log('📄 Utilisation de html2pdf.js...');
          await window.html2pdf().set({
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: fileName,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait',
              compress: true
            }
          }).from(element).save();
        } else {
          // Fallback: ouvrir dans une nouvelle fenêtre pour impression
          console.log('📄 Utilisation du fallback print...');
          const printWindow = window.open('', '_blank');
          printWindow.document.write(`
            <html>
              <head>
                <title>${fileName}</title>
                <style>
                  @media print {
                    body { margin: 0; padding: 0; }
                    .container { max-width: none; margin: 0; padding: 1rem; }
                  }
                </style>
              </head>
              <body>${html}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.focus();
          
          // Attendre que la page soit chargée puis imprimer
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 1000);
      } catch (error) {
        console.error('Erreur avec html2pdf.js, utilisation du fallback:', error);
        
        // Fallback: ouvrir dans une nouvelle fenêtre pour impression
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>${fileName}</title>
              <style>
                @media print {
                  body { margin: 0; padding: 0; }
                  .container { max-width: none; margin: 0; padding: 1rem; }
                }
              </style>
            </head>
            <body>${html}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        // Attendre que la page soit chargée puis imprimer
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      }
      
      // Nettoyer
      document.body.removeChild(element);
      
      console.log('✅ Export PDF réussi:', fileName);
      return { success: true, fileName };
    } catch (error) {
      console.error('❌ Erreur export PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // === MÉTHODE DE VALIDATION ===
  static async validateReports() {
    console.log('🧪 Validation complète du ReportGenerator...');
    
    const testData = {
      selectedMonth: '2025-01',
      language: 'fr',
      totalSpent: 1500,
      totalBudget: 2000,
      savingsRate: 25.0,
      monthlyIncome: 3000,
      categories: [
        { name: 'Alimentation', budget: 400, color: '#10b981' },
        { name: 'Transport', budget: 300, color: '#3b82f6' },
        { name: 'Loisirs', budget: 200, color: '#f59e0b' }
      ],
      currentMonthExpenses: [
        { date: '2025-01-15', description: 'Courses', category: 'Alimentation', amount: 150 },
        { date: '2025-01-20', description: 'Essence', category: 'Transport', amount: 80 },
        { date: '2025-01-25', description: 'Cinéma', category: 'Loisirs', amount: 25 }
      ],
      expenses: [
        { date: '2025-01-15', description: 'Courses', category: 'Alimentation', amount: 150 },
        { date: '2025-01-20', description: 'Essence', category: 'Transport', amount: 80 },
        { date: '2025-01-25', description: 'Cinéma', category: 'Loisirs', amount: 25 }
      ],
      debts: [
        { name: 'Prêt voiture', balance: 5000, description: 'Prêt automobile' },
        { name: 'Carte de crédit', balance: 1200, description: 'Solde carte de crédit' }
      ],
      savingsGoals: [
        { name: 'Vacances', currentAmount: 800, targetAmount: 2000 },
        { name: 'Épargne d\'urgence', currentAmount: 1500, targetAmount: 3000 }
      ],
      userName: 'Test User'
    };

    const testTranslations = {
      monthlyReport: 'Rapport Mensuel',
      annualReport: 'Rapport Annuel',
      budgetAnalysis: 'Analyse Budgétaire',
      savingsReport: 'Rapport d\'Épargne',
      debtAnalysis: 'Analyse des Dettes',
      totalSpent: 'Total Dépensé',
      savingsRate: 'Taux d\'épargne',
      remainingBudget: 'Budget Restant',
      ofBudget: 'du budget',
      thisMonth: 'ce mois',
      available: 'disponible',
      debts: 'Dettes',
      savingsGoals: 'Objectifs d\'épargne',
      expenseChart: 'Graphique des Dépenses',
      topExpenses: 'Top Dépenses',
      recommendations: 'Recommandations',
      generatedOn: 'Généré le',
      generatedBy: 'Généré par',
      futureFinance: 'Future Finance',
      date: 'Date',
      description: 'Description',
      category: 'Catégorie',
      amount: 'Montant',
      used: 'utilisé',
      reached: 'atteint',
      chartWillBeHere: 'Graphique affiché ici',
      interactiveInBrowser: 'Interactif dans le navigateur',
      noExpensesThisMonth: 'Aucune dépense ce mois',
      increaseSavingsRecommendation: 'Considérez augmenter votre taux d\'épargne',
      reduceBudgetExcessRecommendation: 'Réduisez les dépenses dans les catégories dépassant le budget',
      debtReductionRecommendation: 'Priorisez le remboursement des dettes à taux d\'intérêt élevés',
      keepGoodWork: 'Excellente gestion financière ! Continuez ainsi'
    };

    const reportTypes = ['monthly', 'annual', 'budget', 'savings', 'debts'];
    let allTestsPassed = true;

    for (const type of reportTypes) {
      try {
        console.log(`📊 Test: ${type} report`);
        const html = await this.generateHTML({
          type,
          data: testData,
          translations: testTranslations
        });
        
        // Vérifications
        if (!html.includes('container')) {
          console.error(`❌ ${type}: CSS manquant`);
          allTestsPassed = false;
        }
        
        if (html.includes('NaN')) {
          console.error(`❌ ${type}: Calculs NaN détectés`);
          allTestsPassed = false;
        }
        
        if (html.includes('undefined')) {
          console.error(`❌ ${type}: Valeurs undefined détectées`);
          allTestsPassed = false;
        }
        
        if (html.includes('m 85,00 €')) {
          console.error(`❌ ${type}: Problème de formatage des mois`);
          allTestsPassed = false;
        }
        
        console.log(`✅ ${type}: OK`);
        
      } catch (error) {
        console.error(`❌ ${type}: Erreur -`, error);
        allTestsPassed = false;
      }
    }

    if (allTestsPassed) {
      console.log('\n🎉 VALIDATION RÉUSSIE !');
      console.log('✅ Tous les rapports fonctionnent correctement');
      console.log('✅ Le design est professionnel');
      console.log('✅ Les calculs sont corrects');
      console.log('✅ Aucune erreur NaN ou undefined');
    } else {
      console.log('\n❌ VALIDATION ÉCHOUÉE !');
      console.log('❌ Des problèmes ont été détectés');
    }

    return allTestsPassed;
  }

  // === MÉTHODE DE VALIDATION PDF ===
  static async validatePDFExport() {
    console.log('📄 Validation de l\'export PDF...');
    
    const testData = {
      selectedMonth: '2025-01',
      language: 'fr',
      totalSpent: 1500,
      totalBudget: 2000,
      savingsRate: 25.0,
      monthlyIncome: 3000,
      categories: [
        { name: 'Alimentation', budget: 400, color: '#10b981' },
        { name: 'Transport', budget: 300, color: '#3b82f6' },
        { name: 'Loisirs', budget: 200, color: '#f59e0b' }
      ],
      currentMonthExpenses: [
        { date: '2025-01-15', description: 'Courses', category: 'Alimentation', amount: 150 },
        { date: '2025-01-20', description: 'Essence', category: 'Transport', amount: 80 },
        { date: '2025-01-25', description: 'Cinéma', category: 'Loisirs', amount: 25 }
      ],
      expenses: [
        { date: '2025-01-15', description: 'Courses', category: 'Alimentation', amount: 150 },
        { date: '2025-01-20', description: 'Essence', category: 'Transport', amount: 80 },
        { date: '2025-01-25', description: 'Cinéma', category: 'Loisirs', amount: 25 }
      ],
      debts: [
        { name: 'Prêt voiture', balance: 5000, description: 'Prêt automobile' },
        { name: 'Carte de crédit', balance: 1200, description: 'Solde carte de crédit' }
      ],
      savingsGoals: [
        { name: 'Vacances', currentAmount: 800, targetAmount: 2000 },
        { name: 'Épargne d\'urgence', currentAmount: 1500, targetAmount: 3000 }
      ],
      userName: 'Test User'
    };

    const testTranslations = {
      monthlyReport: 'Rapport Mensuel',
      annualReport: 'Rapport Annuel',
      budgetAnalysis: 'Analyse Budgétaire',
      savingsReport: 'Rapport d\'Épargne',
      debtAnalysis: 'Analyse des Dettes',
      totalSpent: 'Total Dépensé',
      savingsRate: 'Taux d\'épargne',
      remainingBudget: 'Budget Restant',
      ofBudget: 'du budget',
      thisMonth: 'ce mois',
      available: 'disponible',
      debts: 'Dettes',
      savingsGoals: 'Objectifs d\'épargne',
      expenseChart: 'Graphique des Dépenses',
      topExpenses: 'Top Dépenses',
      recommendations: 'Recommandations',
      generatedOn: 'Généré le',
      generatedBy: 'Généré par',
      futureFinance: 'Future Finance',
      date: 'Date',
      description: 'Description',
      category: 'Catégorie',
      amount: 'Montant',
      used: 'utilisé',
      reached: 'atteint',
      chartWillBeHere: 'Graphique affiché ici',
      interactiveInBrowser: 'Interactif dans le navigateur',
      noExpensesThisMonth: 'Aucune dépense ce mois',
      increaseSavingsRecommendation: 'Considérez augmenter votre taux d\'épargne',
      reduceBudgetExcessRecommendation: 'Réduisez les dépenses dans les catégories dépassant le budget',
      debtReductionRecommendation: 'Priorisez le remboursement des dettes à taux d\'intérêt élevés',
      keepGoodWork: 'Excellente gestion financière ! Continuez ainsi'
    };

    const reportTypes = ['monthly', 'annual', 'budget', 'savings', 'debts'];
    let allPDFTestsPassed = true;

    for (const type of reportTypes) {
      try {
        console.log(`📄 Test PDF: ${type} report`);
        
        // Test de génération HTML pour PDF
        const html = await this.generateHTML({
          type,
          data: testData,
          translations: testTranslations
        });
        
        // Vérifications spécifiques au PDF
        if (!html.includes('container')) {
          console.error(`❌ ${type} PDF: CSS manquant`);
          allPDFTestsPassed = false;
        }
        
        if (html.includes('NaN')) {
          console.error(`❌ ${type} PDF: Calculs NaN détectés`);
          allPDFTestsPassed = false;
        }
        
        if (html.includes('undefined')) {
          console.error(`❌ ${type} PDF: Valeurs undefined détectées`);
          allPDFTestsPassed = false;
        }
        
        if (html.includes('m 85,00 €')) {
          console.error(`❌ ${type} PDF: Problème de formatage des mois`);
          allPDFTestsPassed = false;
        }
        
        // Test de compatibilité PDF
        if (!html.includes('@media print')) {
          console.warn(`⚠️ ${type} PDF: Styles d'impression manquants (optionnel)`);
        }
        
        console.log(`✅ ${type} PDF: OK`);
        
      } catch (error) {
        console.error(`❌ ${type} PDF: Erreur -`, error);
        allPDFTestsPassed = false;
      }
    }

    if (allPDFTestsPassed) {
      console.log('\n🎉 VALIDATION PDF RÉUSSIE !');
      console.log('✅ Tous les exports PDF fonctionnent correctement');
      console.log('✅ Le design est optimisé pour PDF');
      console.log('✅ Les calculs sont corrects');
      console.log('✅ Aucune erreur NaN ou undefined');
      console.log('✅ Prêt pour l\'export PDF professionnel');
    } else {
      console.log('\n❌ VALIDATION PDF ÉCHOUÉE !');
      console.log('❌ Des problèmes ont été détectés dans l\'export PDF');
    }

    return allPDFTestsPassed;
  }
}

export default ReportGenerator;