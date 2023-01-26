import { PlusIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import fly_man from "../../../../public/images/fly_man.svg";
import rootCustomerLinks from "../../../../utils/rootCutomerLink";
import SmPinkButton from "../../../buttons/smPinkButton";

export default function EmptyCopy() {
  const router = useRouter();
  const goToNewCopy = () => {
    const { customerId, projectId, teamId } = router.query;
    router.push(
      customerId
        ? `\/${rootCustomerLinks(
            customerId
          )}\/project/${projectId}\/new-copy\/all`
        : teamId
        ? `\/${teamId}\/project/${projectId}\/new-copy\/all`
        : `\/project/${projectId}\/new-copy\/all`,
      undefined,
      { shallow: true }
    );
  };
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <Image src={fly_man} width={220} height={220} alt="fly_man" />
        <p className="text-sm text-gray-2 font-normal">
          You haven&#39;t generated any copies yet.
        </p>
        <SmPinkButton className="w-full mt-5 py-2.5" onClick={goToNewCopy}>
          <div className="flex items-center">
            <PlusIcon className="h-4 w-4 text-white mr-1" />
            New Copy
          </div>
        </SmPinkButton>
      </div>
    </div>
  );
}
