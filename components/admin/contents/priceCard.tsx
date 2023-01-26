import AnimatedNumber from "animated-number-react";

export default function PriceCard({
  name,
  price,
  percent,
}: {
  name: string;
  price: number;
  percent?: number;
}) {
  const formatPriceValue = (value) => `$ ${Number(value).toFixed(5)}`;
  const formatPercentValue = (value) => `${Number(value).toFixed(0)} %`;

  return (
    <div className="bg-white p-3.5 rounded-md shadow">
      <p className="font-medium text-xs text-gray-500 mb-2">{name}</p>
      <AnimatedNumber
        className="font-medium text-xl text-black mt-1"
        value={price}
        formatValue={formatPriceValue}
        duration={400}
      />
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
}
