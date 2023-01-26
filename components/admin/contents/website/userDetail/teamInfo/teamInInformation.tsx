import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTeam } from "../../../../../../api/admin/team";
import { Customer } from "../../../../../../api/admin/user";
import { setToastify, ToastStatus } from "../../../../../../store/main/actions";
import getErrorMessage from "../../../../../../utils/getErrorMessage";
import Block from "../../../../../block";
import SmPinkButton from "../../../../../buttons/smPinkButton";
import TextInput from "../../../../../textInput";
interface TeamInfoInterface {
  info: Customer;
  onChange: Function;
}

const TeamInformation: React.FC<TeamInfoInterface> = ({ info, onChange }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { teamId } = router.query;

  const [teamName, setTeamName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamNameError, setTeamNameError] = useState<string>("");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handSubmit = async () => {
    if (!teamName) {
      setTeamNameError("Please enter a team name.");
      return;
    } else {
      setTeamNameError("");
    }
    try {
      setIsLoading(true);
      const customer = await updateTeam({
        customer_id: info.id,
        name: teamName,
      });
      onChange(customer);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "Successfully, Team is created",
        })
      );
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message: getErrorMessage(err),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTeamName(info?.team_info?.name ?? "");
  }, [info?.team_info?.name]);

  return (
    <Block title="Team Name">
      <>
        <div className="mt-5 pt-6 border-t border-gray-0">
          <TextInput
            htmlFor="name"
            label={t("team:team_name")}
            placeholder={t("team:team_name")}
            type="text"
            name="name"
            id="name"
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
            }}
            error={teamNameError}
            className="w-full"
          />
        </div>
        <div className="mt-5 w-full">
          <SmPinkButton
            className="ml-auto w-full sm:w-1/4 py-2.5"
            onClick={handSubmit}
            disabled={isLoading}
          >
            {!!info?.team_info?.name ? (
              <span>Update</span>
            ) : (
              <span>Create</span>
            )}
          </SmPinkButton>
        </div>
      </>
    </Block>
  );
};

export default TeamInformation;
