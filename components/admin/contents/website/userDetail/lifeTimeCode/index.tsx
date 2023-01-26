import { Customer } from "../../../../../../api/admin/user";
import Block from "../../../../../block";
import CodeTable from "./codeTable";

const LifeTimeCode: React.FC<{ info: Customer }> = ({ info }) => {
  const { appsumo, dealify, stack_social } = info.lifetime_deal_codes;
  return (
    <Block title="LifeTime Codes">
      <div className="grid grid-cols-1 gap-y-6">
        {appsumo?.length && (
          <div>
            <p className="font-normal text-sm text-gray-500">
              Appsumo:
              <span className="font-bold text-lg ml-2">{appsumo?.length}</span>
              <CodeTable className="mt-2" data={appsumo} />
            </p>
          </div>
        )}
        {dealify?.length && (
          <div>
            <p className="font-normal text-sm text-gray-500">
              Dealify:
              <span className="font-bold text-lg ml-2">{dealify?.length}</span>
              <CodeTable className="mt-2" data={dealify} />
            </p>
          </div>
        )}
        {stack_social?.length && (
          <div>
            <p className="font-normal text-sm text-gray-500">
              StackSocial:
              <span className="font-bold text-lg ml-2">
                {stack_social?.length}
              </span>
              <CodeTable className="mt-2" data={stack_social} />
            </p>
          </div>
        )}
      </div>
    </Block>
  );
};

export default LifeTimeCode;
