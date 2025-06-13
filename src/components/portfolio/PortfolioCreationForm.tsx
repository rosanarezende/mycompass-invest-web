/**
 * Portfolio Creation Form - Fase 0 MVP
 * 
 * Formulário para criação manual de portfolios
 * Demonstra integração com o core package
 */

'use client';

import React, { useState } from 'react';
import { 
  PortfolioService, 
  CreatePortfolioInput, 
  isFeatureEnabled,
  Validator,
  type RiskProfile,
  type TargetAllocation
} from '@mycompass/invest-core';

interface PortfolioFormProps {
  userId: string;
  onSuccess: (portfolioId: string) => void;
  onError: (error: string) => void;
}

export function PortfolioCreationForm({ userId, onSuccess, onError }: PortfolioFormProps) {
  const [formData, setFormData] = useState<Partial<CreatePortfolioInput>>({
    userId,
    name: '',
    description: '',
    objective: 'investment',
    riskProfile: {
      type: 'moderate',
      score: 5,
      description: ''
    },
    targetAllocations: [
      { category: 'stocks', percentage: 60 },
      { category: 'bonds', percentage: 30 },
      { category: 'cash', percentage: 10 }
    ],
    timeHorizon: 10,
    targetAmount: undefined,
    monthlyContribution: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const portfolioService = new PortfolioService();

  // Verificar se múltiplos portfolios estão habilitados
  const multiPortfolioEnabled = isFeatureEnabled('MULTI_PORTFOLIO');
  const manualPortfolioEnabled = isFeatureEnabled('MANUAL_PORTFOLIO');

  if (!manualPortfolioEnabled) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800">
          Funcionalidade não disponível
        </h3>
        <p className="text-yellow-700 mt-2">
          A criação manual de portfolios não está habilitada nesta versão.
        </p>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nome
    const nameValidation = Validator.validatePortfolioName(formData.name || '');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0]?.message || 'Nome inválido';
    }

    // Validar perfil de risco
    if (formData.riskProfile) {
      const riskValidation = Validator.validateRiskProfile(formData.riskProfile);
      if (!riskValidation.isValid) {
        newErrors.riskProfile = riskValidation.errors[0]?.message || 'Perfil de risco inválido';
      }
    }

    // Validar alocações
    if (formData.targetAllocations) {
      const allocationsValidation = Validator.validateTargetAllocations(formData.targetAllocations);
      if (!allocationsValidation.isValid) {
        newErrors.targetAllocations = allocationsValidation.errors[0]?.message || 'Alocações inválidas';
      }
    }

    // Validar horizonte de tempo
    if (formData.timeHorizon) {
      const timeHorizonValidation = Validator.validateTimeHorizon(formData.timeHorizon);
      if (!timeHorizonValidation.isValid) {
        newErrors.timeHorizon = timeHorizonValidation.errors[0]?.message || 'Horizonte de tempo inválido';
      }
    }

    // Validar valores monetários
    if (formData.targetAmount) {
      const targetAmountValidation = Validator.validateCurrency(formData.targetAmount, 'Meta de valor');
      if (!targetAmountValidation.isValid) {
        newErrors.targetAmount = targetAmountValidation.errors[0]?.message || 'Meta de valor inválida';
      }
    }

    if (formData.monthlyContribution) {
      const contributionValidation = Validator.validateCurrency(formData.monthlyContribution, 'Contribuição mensal');
      if (!contributionValidation.isValid) {
        newErrors.monthlyContribution = contributionValidation.errors[0]?.message || 'Contribuição inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const portfolio = await portfolioService.createPortfolio(formData as CreatePortfolioInput);
      onSuccess(portfolio.id);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Erro ao criar portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAllocation = (index: number, field: 'category' | 'percentage', value: string | number) => {
    const newAllocations = [...(formData.targetAllocations || [])];
    newAllocations[index] = {
      ...newAllocations[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      targetAllocations: newAllocations
    }));
  };

  const addAllocation = () => {
    setFormData(prev => ({
      ...prev,
      targetAllocations: [
        ...(prev.targetAllocations || []),
        { category: 'stocks', percentage: 0 }
      ]
    }));
  };

  const removeAllocation = (index: number) => {
    const newAllocations = [...(formData.targetAllocations || [])];
    newAllocations.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      targetAllocations: newAllocations
    }));
  };

  const totalAllocation = (formData.targetAllocations || [])
    .reduce((sum, allocation) => sum + (allocation.percentage || 0), 0);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Criar Novo Portfolio
        </h2>
        <p className="text-gray-600">
          Configure seu portfolio de investimentos com alocação personalizada
        </p>
        
        {!multiPortfolioEnabled && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">
              📝 <strong>Fase 0 MVP:</strong> Limitado a 3 portfolios por usuário
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do Portfolio */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Portfolio *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Aposentadoria, Reserva de Emergência"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o objetivo deste portfolio..."
          />
        </div>

        {/* Objetivo */}
        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo *
          </label>
          <select
            id="objective"
            value={formData.objective || 'investment'}
            onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="retirement">Aposentadoria</option>
            <option value="education">Educação</option>
            <option value="emergency">Reserva de Emergência</option>
            <option value="investment">Investimento Geral</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Perfil de Risco */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Perfil de Risco *
          </label>
          <div className="space-y-3">
            <select
              value={formData.riskProfile?.type || 'moderate'}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                riskProfile: {
                  ...prev.riskProfile!,
                  type: e.target.value as RiskProfile['type']
                }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="conservative">Conservador (Score 1-3)</option>
              <option value="moderate">Moderado (Score 4-7)</option>
              <option value="aggressive">Agressivo (Score 8-10)</option>
              <option value="custom">Personalizado</option>
            </select>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Score de Risco (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.riskProfile?.score || 5}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  riskProfile: {
                    ...prev.riskProfile!,
                    score: parseInt(e.target.value) || 5
                  }
                }))}
                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {errors.riskProfile && (
            <p className="mt-1 text-sm text-red-600">{errors.riskProfile}</p>
          )}
        </div>

        {/* Alocações Alvo */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Alocações Alvo *
            </label>
            <span className={`text-sm font-medium ${
              Math.abs(totalAllocation - 100) > 0.01 ? 'text-red-600' : 'text-green-600'
            }`}>
              Total: {totalAllocation.toFixed(1)}%
            </span>
          </div>
          
          <div className="space-y-3">
            {(formData.targetAllocations || []).map((allocation, index) => (
              <div key={index} className="flex items-center space-x-3">
                <select
                  value={allocation.category}
                  onChange={(e) => updateAllocation(index, 'category', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="stocks">Ações</option>
                  <option value="bonds">Renda Fixa</option>
                  <option value="reits">Fundos Imobiliários</option>
                  <option value="crypto">Criptomoedas</option>
                  <option value="cash">Dinheiro/Poupança</option>
                  <option value="alternatives">Alternativos</option>
                </select>
                
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={allocation.percentage}
                    onChange={(e) => updateAllocation(index, 'percentage', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-1 text-gray-500">%</span>
                </div>
                
                {(formData.targetAllocations || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAllocation(index)}
                    className="px-2 py-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addAllocation}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            + Adicionar Categoria
          </button>
          
          {errors.targetAllocations && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAllocations}</p>
          )}
        </div>

        {/* Horizonte de Tempo */}
        <div>
          <label htmlFor="timeHorizon" className="block text-sm font-medium text-gray-700 mb-2">
            Horizonte de Tempo (anos) *
          </label>
          <input
            type="number"
            id="timeHorizon"
            min="1"
            max="50"
            value={formData.timeHorizon || 10}
            onChange={(e) => setFormData(prev => ({ ...prev, timeHorizon: parseInt(e.target.value) || 10 }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.timeHorizon ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.timeHorizon && (
            <p className="mt-1 text-sm text-red-600">{errors.timeHorizon}</p>
          )}
        </div>

        {/* Meta de Valor (Opcional) */}
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Meta de Valor (R$)
          </label>
          <input
            type="number"
            id="targetAmount"
            min="0"
            step="0.01"
            value={formData.targetAmount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: parseFloat(e.target.value) || undefined }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.targetAmount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 1000000"
          />
          {errors.targetAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
          )}
        </div>

        {/* Contribuição Mensal (Opcional) */}
        <div>
          <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 mb-2">
            Contribuição Mensal (R$)
          </label>
          <input
            type="number"
            id="monthlyContribution"
            min="0"
            step="0.01"
            value={formData.monthlyContribution || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, monthlyContribution: parseFloat(e.target.value) || undefined }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.monthlyContribution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 2000"
          />
          {errors.monthlyContribution && (
            <p className="mt-1 text-sm text-red-600">{errors.monthlyContribution}</p>
          )}
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || Math.abs(totalAllocation - 100) > 0.01}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Criando...' : 'Criar Portfolio'}
          </button>
        </div>
      </form>
    </div>
  );
}
