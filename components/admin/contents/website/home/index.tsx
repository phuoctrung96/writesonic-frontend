import ExpenditureMonth from "./expenditureMonth";
import ExpenditureMonthPerEngine from "./expenditureMonthPerEngine";
import ExpenditureToday from "./expenditureToday";
import ExpenditureTodayPerEngine from "./expenditureTodayPerEngine";
import MonthTable from "./monthTable";
import RatingTable from "./ratingTable";
import TodayTable from "./todayTable";

export default function Home() {
  return (
    <div className="py-6">
      <div>
        <ExpenditureMonth />
      </div>
      <div className="mt-6">
        <ExpenditureToday />
      </div>
      <div className="mt-6">
        <ExpenditureMonthPerEngine />
      </div>
      <div className="mt-6">
        <ExpenditureTodayPerEngine />
      </div>
      <div className="mt-12">
        <MonthTable />
      </div>
      <div className="mt-12">
        <TodayTable />
      </div>
      <div className="mt-12">
        <RatingTable />
      </div>
    </div>
  );
}
