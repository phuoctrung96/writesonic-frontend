import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  TeamMemberInfo,
  TeamMemberRole,
} from "../../../../../../../../api/team";
import SmPinkButton from "../../../../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../../../../buttons/smWhiteButton";
import SelectBox from "../../../../../../../customer/dashboardContent/selectBox";
const EditMemberForm: React.FC<{
  currentMember: TeamMemberInfo;
  onOkay: Function;
  closeModal: Function;
}> = ({ onOkay, closeModal, currentMember }) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const [roles, setRoles] = useState<string[]>([]);
  const [role, setRole] = useState<string>(currentMember.role);

  useEffect(() => {
    const filteredRoles = [];
    Object.keys(TeamMemberRole)?.map((key) => {
      if (key === TeamMemberRole.owner) {
        return;
      }
      filteredRoles.push(key);
    });
    setRoles(filteredRoles);
  }, [locale, t]);

  const handleSubmit = async () => {
    onOkay(role);
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div>
      <div className="mt-5">
        <SelectBox
          id="engine_name"
          name="engine_name"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {roles?.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </SelectBox>
      </div>
      <div className="w-full sm:ml-auto sm:w-1/2 mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <SmPinkButton className="w-full sm:ml-3" onClick={handleSubmit}>
          Update
        </SmPinkButton>
        <SmWhiteButton className="w-full mt-3 sm:mt-0" onClick={handleCancel}>
          Cancel
        </SmWhiteButton>
      </div>
    </div>
  );
};

export default EditMemberForm;
