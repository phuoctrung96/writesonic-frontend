import { ReactNode } from "react";

function RightSection({ children }: { children: ReactNode }) {
  return (
    <section className="col-span-3 flex-1 relative bg-root flex flex-col rounded-b-lg md:round-r-lg overflow-x-hidden overflow-y-auto">
      <div className="flex-1">{children}</div>
    </section>
  );
}

export default RightSection;
