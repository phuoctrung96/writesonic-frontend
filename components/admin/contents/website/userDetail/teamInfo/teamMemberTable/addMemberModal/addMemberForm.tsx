import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import { TeamMemberRole } from "../../../../../../../../api/team";
import SmPinkButton from "../../../../../../../buttons/smPinkButton";
import SmWhiteButton from "../../../../../../../buttons/smWhiteButton";
import SelectBox from "../../../../../../../customer/dashboardContent/selectBox";
const AddMemberForm: React.FC<{
  onOkay: Function;
  closeModal: Function;
}> = ({ onOkay, closeModal }) => {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string>("");
  const [userIdError, setUserIdError] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [role, setRole] = useState<string>(TeamMemberRole.member.toString());

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
    setUserIdError("");
    if (!userId) {
      setUserIdError("Please insert the userId");
      return;
    }
    onOkay(userId, role);
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div>
      <div>
        <TextInput
          label="Id"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
          error={userIdError}
        />
      </div>
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
          Add
        </SmPinkButton>
        <SmWhiteButton className="w-full mt-3 sm:mt-0" onClick={handleCancel}>
          Cancel
        </SmWhiteButton>
      </div>
    </div>
  );
};

function TextInput({
  value,
  onChange,
  error,
  label,
  placeholder,
}: {
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <>
      <label className="block text-base font-medium text-gray-700">
        {label}
      </label>
      <input
        value={value}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base"
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && (
        <h3 className="text-base font-medium text-red-600 mt-1">{error}</h3>
      )}
    </>
  );
}

export default AddMemberForm;
