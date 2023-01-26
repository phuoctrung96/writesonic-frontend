import { useEffect, useState } from "react";
import Trend from "react-trend";

const TrendLine: React.FC<{ trends: string[] }> = ({ trends }) => {
  const [infos, setInfos] = useState<number[]>([]);

  useEffect(() => {
    setInfos(
      trends?.map((trend) => {
        return parseFloat(trend);
      }) ?? []
    );
  }, [trends]);
  return (
    <div className="w-20">
      <Trend
        data={infos}
        gradient={["#42b3f4"]}
        radius={0}
        strokeWidth={2.8}
        strokeLinecap={"butt"}
      />
    </div>
  );
};

export default TrendLine;
