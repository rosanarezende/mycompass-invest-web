/**
 * React Hook for Portfolio Management - Phase 0 MVP
 * 
 * Custom hook que encapsula toda a lógica de portfolios
 * para componentes React
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  PortfolioService,
  ManualRebalancingCalculator,
  isFeatureEnabled,
  type Portfolio,
  type CreatePortfolioInput,
  type AddAssetInput,
  type UpdateAssetInput,
  type RebalancingResult
} from '@mycompass/invest-core';

interface UsePortfolioProps {
  userId: string;
}

interface UsePortfolioReturn {
  // Estado
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;

  // Ações
  createPortfolio: (input: CreatePortfolioInput) => Promise<Portfolio>;
  updatePortfolio: (portfolioId: string, updates: Partial<Portfolio>) => Promise<Portfolio>;
  deletePortfolio: (portfolioId: string) => Promise<void>;
  selectPortfolio: (portfolioId: string) => void;

  // Assets
  addAsset: (input: AddAssetInput) => Promise<Portfolio>;
  updateAsset: (input: UpdateAssetInput) => Promise<Portfolio>;
  removeAsset: (portfolioId: string, assetId: string) => Promise<Portfolio>;

  // Rebalanceamento
  calculateRebalancing: (
    portfolioId: string,
    additionalAmount?: number,
    currentPrices?: Record<string, number>
  ) => Promise<RebalancingResult>;

  // Utilidades
  refreshPortfolios: () => Promise<void>;
  getPortfolioStats: () => Promise<{
    totalPortfolios: number;
    totalValue: number;
    totalReturn: number;
    totalReturnPercent: number;
    portfoliosByObjective: Record<string, number>;
  }>;

  // Features
  features: {
    canCreateMultiple: boolean;
    canRebalance: boolean;
    maxPortfolios: number;
  };
}

export function usePortfolio({ userId }: UsePortfolioProps): UsePortfolioReturn {
  // Estado
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serviços
  const [portfolioService] = useState(() => new PortfolioService());
  const [rebalancingCalculator] = useState(() => new ManualRebalancingCalculator());

  // Features disponíveis
  const features = {
    canCreateMultiple: isFeatureEnabled('MULTI_PORTFOLIO'),
    canRebalance: isFeatureEnabled('REBALANCING_CALCULATOR'),
    maxPortfolios: 3 // Fase 0 limit
  };

  // Handlers de erro
  const handleError = useCallback((err: unknown, operation: string) => {
    const message = err instanceof Error ? err.message : `Erro desconhecido em ${operation}`;
    setError(message);
    console.error(`Portfolio Hook Error (${operation}):`, err);
  }, []);

  // Carregar portfolios
  const refreshPortfolios = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const userPortfolios = await portfolioService.getUserPortfolios(userId);
      setPortfolios(userPortfolios);

      // Se não há portfolio selecionado, selecionar o primeiro
      if (!currentPortfolio && userPortfolios.length > 0) {
        setCurrentPortfolio(userPortfolios[0]);
      }

      // Se o portfolio atual foi deletado, limpar seleção
      if (currentPortfolio && !userPortfolios.find(p => p.id === currentPortfolio.id)) {
        setCurrentPortfolio(userPortfolios[0] || null);
      }
    } catch (err) {
      handleError(err, 'refreshPortfolios');
    } finally {
      setLoading(false);
    }
  }, [userId, portfolioService, currentPortfolio, handleError]);

  // Criar portfolio
  const createPortfolio = useCallback(async (input: CreatePortfolioInput): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const portfolio = await portfolioService.createPortfolio(input);
      await refreshPortfolios();
      setCurrentPortfolio(portfolio);
      return portfolio;
    } catch (err) {
      handleError(err, 'createPortfolio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, refreshPortfolios, handleError]);

  // Atualizar portfolio
  const updatePortfolio = useCallback(async (
    portfolioId: string,
    updates: Partial<Portfolio>
  ): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const updatedPortfolio = await portfolioService.updatePortfolio(portfolioId, updates);
      await refreshPortfolios();

      // Atualizar current portfolio se for o mesmo
      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }

      return updatedPortfolio;
    } catch (err) {
      handleError(err, 'updatePortfolio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, currentPortfolio, refreshPortfolios, handleError]);

  // Deletar portfolio
  const deletePortfolio = useCallback(async (portfolioId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await portfolioService.deletePortfolio(portfolioId);
      await refreshPortfolios();
    } catch (err) {
      handleError(err, 'deletePortfolio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, refreshPortfolios, handleError]);

  // Selecionar portfolio
  const selectPortfolio = useCallback((portfolioId: string) => {
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (portfolio) {
      setCurrentPortfolio(portfolio);
    }
  }, [portfolios]);

  // Adicionar asset
  const addAsset = useCallback(async (input: AddAssetInput): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const updatedPortfolio = await portfolioService.addAsset(input);
      await refreshPortfolios();

      // Atualizar current portfolio se for o mesmo
      if (currentPortfolio?.id === input.portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }

      return updatedPortfolio;
    } catch (err) {
      handleError(err, 'addAsset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, currentPortfolio, refreshPortfolios, handleError]);

  // Atualizar asset
  const updateAsset = useCallback(async (input: UpdateAssetInput): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const updatedPortfolio = await portfolioService.updateAsset(input);
      await refreshPortfolios();

      // Atualizar current portfolio se for o mesmo
      if (currentPortfolio?.id === input.portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }

      return updatedPortfolio;
    } catch (err) {
      handleError(err, 'updateAsset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, currentPortfolio, refreshPortfolios, handleError]);

  // Remover asset
  const removeAsset = useCallback(async (portfolioId: string, assetId: string): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const updatedPortfolio = await portfolioService.removeAsset(portfolioId, assetId);
      await refreshPortfolios();

      // Atualizar current portfolio se for o mesmo
      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(updatedPortfolio);
      }

      return updatedPortfolio;
    } catch (err) {
      handleError(err, 'removeAsset');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, currentPortfolio, refreshPortfolios, handleError]);

  // Calcular rebalanceamento
  const calculateRebalancing = useCallback(async (
    portfolioId: string,
    additionalAmount?: number,
    currentPrices?: Record<string, number>
  ): Promise<RebalancingResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await portfolioService.calculateRebalancing(
        portfolioId,
        additionalAmount,
        currentPrices
      );
      return result;
    } catch (err) {
      handleError(err, 'calculateRebalancing');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, handleError]);

  // Estatísticas do usuário
  const getPortfolioStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await portfolioService.getUserPortfolioStats(userId);
      return stats;
    } catch (err) {
      handleError(err, 'getPortfolioStats');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [portfolioService, userId, handleError]);

  // Carregar portfolios na inicialização
  useEffect(() => {
    if (userId) {
      refreshPortfolios();
    }
  }, [userId, refreshPortfolios]);

  // Limpar erro após 10 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // Estado
    portfolios,
    currentPortfolio,
    loading,
    error,

    // Ações
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    selectPortfolio,

    // Assets
    addAsset,
    updateAsset,
    removeAsset,

    // Rebalanceamento
    calculateRebalancing,

    // Utilidades
    refreshPortfolios,
    getPortfolioStats,

    // Features
    features
  };
}

// Hook para estatísticas simples
export function usePortfolioStats(userId: string) {
  const [stats, setStats] = useState<{
    totalPortfolios: number;
    totalValue: number;
    totalReturn: number;
    totalReturnPercent: number;
    portfoliosByObjective: Record<string, number>;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const portfolioService = new PortfolioService();

  const refreshStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const userStats = await portfolioService.getUserPortfolioStats(userId);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading portfolio stats:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, portfolioService]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return { stats, loading, refreshStats };
}

// Hook para validação de features
export function useFeatures() {
  return {
    manualPortfolio: isFeatureEnabled('MANUAL_PORTFOLIO'),
    multiPortfolio: isFeatureEnabled('MULTI_PORTFOLIO'),
    rebalancing: isFeatureEnabled('REBALANCING_CALCULATOR'),
    csvImport: isFeatureEnabled('CSV_IMPORT'),
    taxCalc: isFeatureEnabled('BASIC_TAX_CALC'),
    openFinance: isFeatureEnabled('OPEN_FINANCE'),

    // Helper methods
    isPhase0: () => isFeatureEnabled('MANUAL_PORTFOLIO'),
    isPhase1: () => isFeatureEnabled('CSV_IMPORT'),
    isPhase2: () => isFeatureEnabled('CEI_SCRAPING'),
    isPhase3: () => isFeatureEnabled('OPEN_FINANCE')
  };
}
