import AnimatedNumber from "animated-number-react";
import { useEffect, useState } from "react";
import { getGenerationsForToday } from "../../../../../api/admin/creditHistory";
import { Customer } from "../../../../../api/admin/user";
import Block from "../../../../block";

function TrackingCard({ name, data }: { name: string; data: number }) {
  const formatValue = (value) => Number(value).toFixed(0);

  return (
    <div className="p-5 rounded-md bg-gray-100">
      <p className="font-medium text-sm text-gray-600 uppercase">{name}</p>
      <AnimatedNumber
        className="font-bold text-sm text-black mt-5"
        value={data}
        formatValue={formatValue}
        duration={400}
      />
    </div>
  );
}

const GenerationHistory: React.FC<{ info: Customer }> = ({ info }) => {
  const [generations, setGenerations] = useState<number>(0);
  const [credits, setCredits] = useState<number>(0);
  useEffect(() => {
    async function initialize() {
      try {
        const { generations, credits } = await getGenerationsForToday({
          owner_id: info.id,
        });
        setGenerations(generations);
        setCredits(credits);
      } catch (err) {}
    }
    if (info?.id) {
      initialize();
    }
  }, [info.id]);

  return (
    <Block title="Generations For Today">
      <div className="grid grid-cols-2 gap-2">
        <TrackingCard name="Generations" data={generations} />
        <TrackingCard name="Credits" data={credits} />
      </div>
    </Block>
  );
};

export default GenerationHistory;
