import React from 'react';
import CallCard from './CallCard';
import StatisticCard from './StatisticCard';

const Cards = ({ data, selectedTab }) => {
  if (selectedTab === 1) {
    return (
      <div className="flex flex-col gap-4">
        {data?.map((call, index) => (
          <CallCard key={index} call={call} />
        ))}
      </div>
    );
  } else if (selectedTab === 2) {
    return (
        <div className="flex flex-col gap-4">
          {data?.map((statistic, index) => (
            <StatisticCard key={index} statistic={statistic} />
          ))}
        </div>
      );
  }
  return null; 
};

export default Cards;
