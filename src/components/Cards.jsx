import React from 'react';
import CallCard from './CallCard';
import StatisticCard from './StatisticCard';

const Cards = ({ data, selectedTab, expandedCardId, setExpandedCardId }) => {
  if (selectedTab === 1) {
    return (
      <div className="flex flex-col gap-4">
        {data?.map((call, index) => (
          <CallCard 
            key={index} 
            call={call} 
            isExpanded={expandedCardId === call.id}
            onToggleExpand={() => setExpandedCardId(expandedCardId === call.id ? null : call.id)}
          />
        ))}
      </div>
    );
  } else if (selectedTab === 2) {
    return (
        <div className="flex flex-col gap-4">
          {data?.map((statistic, index) => (
            <StatisticCard 
              key={index} 
              statistic={statistic} 
              isExpanded={expandedCardId === statistic.id}
              onToggleExpand={() => setExpandedCardId(expandedCardId === statistic.id ? null : statistic.id)} 
            />
          ))}
        </div>
      );
  }
  return null; 
};

export default Cards;
