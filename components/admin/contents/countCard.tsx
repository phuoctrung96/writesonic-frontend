import AnimatedNumber from "animated-number-react";

export default function CountCard({
  name,
  value,
  percent,
}: {
  name: string;
  value: number;
  percent?: number;
}) {
  const formatCountValue = (value) => `${Number(value).toFixed(0)}`;
  const formatPercentValue = (value) => `${Number(value).toFixed(0)} %`;

  return (
    <div className="bg-white p-3.5 rounded-md">
      <p className="font-medium text-xs text-gray-300">{name}</p>
      <AnimatedNumber
        className="font-medium text-xl text-black mt-1"
        value={value}
        formatValue={formatCountValue}
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
