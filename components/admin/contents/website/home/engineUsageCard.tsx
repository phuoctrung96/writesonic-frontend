import AnimatedNumber from "animated-number-react";

const EngineUsageCard: React.FC<{
  engineName: string;
  cost: number;
  numberOfGeneration: number;
  percent?: number;
}> = ({ engineName, cost, numberOfGeneration, percent }) => {
  const formatPriceValue = (value) => `$ ${Number(value).toFixed(5)}`;
  const formatPercentValue = (value) => `${Number(value).toFixed(0)} %`;
  const formatGenerationsValue = (value) => `${Number(value).toFixed(0)}`;

  return (
    <div className="bg-white p-3.5 rounded-md shadow">
      <p className="font-medium text-xs text-gray-500 mb-2">{engineName}</p>
      <div className="flex justify-between items-center">
        <AnimatedNumber
          className="font-medium text-xl text-black mt-1"
          value={cost}
          formatValue={formatPriceValue}
          duration={400}
        />
        <AnimatedNumber
          className="font-medium text-md text-black mt-1 text-indigo-600"
          value={numberOfGeneration}
          formatValue={formatGenerationsValue}
          duration={400}
        />
      </div>
      {percent !== undefined && (
        <AnimatedNumber
          className="mt-1 font-normal text-xs text-green-600 bg-green-100 max-w-max px-2 rounded-xl flex items-center"
          value={percent}
          formatValue={formatPercentValue}
          duration={400}
        />
      )}
    </div>
  );
};

export default EngineUsageCard;
