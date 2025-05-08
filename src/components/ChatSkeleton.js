import React from 'react';

const ChatSkeleton = () => {
  // Создаем массив фейковых сообщений для скелетона
  const skeletonMessages = Array(5).fill(0);
  
  // Функция для получения случайной ширины
  const getRandomWidth = () => {
    // Создаем случайную ширину от 70% до 95% для длинных строк
    return `${Math.floor(70 + Math.random() * 25)}%`;
  };
  
  // Функция для получения средней ширины
  const getMediumWidth = () => {
    // Создаем случайную ширину от 50% до 75%
    return `${Math.floor(50 + Math.random() * 25)}%`;
  };
  
  // Функция для получения короткой ширины
  const getShortWidth = () => {
    // Создаем случайную ширину от 20% до 40%
    return `${Math.floor(20 + Math.random() * 20)}%`;
  };
  
  return (
    <div className='w-full flex items-center justify-center overflow-hidden overflow-y-auto px-2 py-1 scroll'>
      <div className='w-full lg:w-4/5 flex flex-col h-full items-start justify-start'>
        {skeletonMessages.map((_, i) => {
          // Определяем количество строк в сообщении (1-3)
          const linesCount = Math.floor(Math.random() * 3) + 1;
          const lines = Array(linesCount).fill(0);
          
          return (
            <div key={i} className="w-full">
              <span className={`flex items-start justify-center gap-2 lg:gap-5 my-4 ${i % 2 === 0 ? 'bg-gray-200' : 'bg-blue-100'} p-3 rounded-md w-full`}>
                <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg ${i % 2 === 0 ? 'bg-gray-300' : 'bg-blue-300'} relative overflow-hidden`}>
                  <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    {lines.map((_, lineIndex) => {
                      // Первая строка обычно длиннее
                      let width = lineIndex === 0 ? getRandomWidth() : 
                                (lineIndex === lines.length - 1 ? getShortWidth() : getMediumWidth());
                      
                      return (
                        <div 
                          key={lineIndex} 
                          className={`h-4 ${i % 2 === 0 ? 'bg-gray-300' : 'bg-blue-200'} rounded-md relative overflow-hidden`}
                          style={{ width }}
                        >
                          <div className="absolute top-0 left-0 right-0 bottom-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSkeleton; 