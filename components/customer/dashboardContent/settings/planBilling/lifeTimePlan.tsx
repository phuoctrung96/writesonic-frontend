import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { LifeTimeCredit } from "../../../../../api/credit_v2";
import Block from "../../../../block";
import ConfirmChangeCardModal from "./confirmChangeCardModal";

function LifeTimePlan({ lifeTimePlan }: { lifeTimePlan: LifeTimeCredit[] }) {
  const [isLoading, setLoading] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Block
        title={t("settings:lifetime_plan")}
        message={t("settings:lifetime_plan_description")}
      >
        <div className="mt-8">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    {lifeTimePlan?.map((lifeTime, idx) => (
                      <tr
                        key={lifeTime.name}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lifeTime.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {lifeTime.codes} {t("settings:codes")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 text-right">
                          {lifeTime.credits_per_month}{" "}
                          {t("settings:credits_per_month")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Block>
      <ConfirmChangeCardModal />
    </>
  );
}

export default LifeTimePlan;
