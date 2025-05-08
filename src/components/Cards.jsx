import React from 'react';
import CallCard from './CallCard';
import StatisticCard from './StatisticCard';
import CallCardSkeleton from './CallCardSkeleton';
import StatisticCardSkeleton from './StatisticCardSkeleton';

const Cards = ({ data, selectedTab, expandedCardId, setExpandedCardId, isLoading }) => {
  if (isLoading) {
    // Показываем скелетоны загрузки
    const skeletons = Array(5).fill(0);
    
    if (selectedTab === 1) {
      return (
        <div className="flex flex-col gap-4">
          {skeletons.map((_, index) => (
            <CallCardSkeleton key={index} />
          ))}
        </div>
      );
    } else if (selectedTab === 2) {
      return (
        <div className="flex flex-col gap-4">
          {skeletons.map((_, index) => (
            <StatisticCardSkeleton key={index} />
          ))}
        </div>
      );
    }
  }
  
  // Безопасная обработка состояния expandedCardId
  const handleToggleExpand = (itemId) => {
    // Если карточка уже развернута, сворачиваем её (устанавливаем null)
    // В противном случае разворачиваем новую карточку
    setExpandedCardId(expandedCardId === itemId ? null : itemId);
  };
  
  // Проверка на наличие данных
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-10">
        <div className="text-gray-500 text-lg">No data available</div>
      </div>
    );
  }
  
  // Показываем реальные данные, когда они загружены
  if (selectedTab === 1) {
    return (
      <div className="flex flex-col gap-4">
        {data.map((call, index) => (
          <CallCard 
            key={`call-${call.id || index}`} 
            call={call} 
            isExpanded={expandedCardId === call.id}
            onToggleExpand={() => handleToggleExpand(call.id)}
          />
        ))}
      </div>
    );
  } else if (selectedTab === 2) {
    return (
      <div className="flex flex-col gap-4">
        {data.map((statistic, index) => (
          <StatisticCard 
            key={`stat-${statistic.id || index}`} 
            statistic={statistic} 
            isExpanded={expandedCardId === statistic.id}
            onToggleExpand={() => handleToggleExpand(statistic.id)} 
          />
        ))}
      </div>
    );
  }
  
  return null; 
};

export default Cards;
