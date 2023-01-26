import CountUsers from "./countUsers";
import ExpenditureMonth from "./expenditureMonth";

export default function Home() {
  return (
    <>
      <div className="mt-6">
        <CountUsers />
      </div>
      <div className="mt-6">
        <ExpenditureMonth />
      </div>
    </>
  );
}
