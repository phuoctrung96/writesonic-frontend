import { PlusIcon } from "@heroicons/react/outline";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { inviteUser, PendingMember } from "../../../../../api/invte";
import { TeamMemberRole } from "../../../../../api/team";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { segmentTrack } from "../../../../../utils/segment";
import { validateEmail } from "../../../../../utils/validate";
import SmPinkButton from "../../../../buttons/smPinkButton";
import TextInput from "../../../../textInput";
import DropDown from "../../dropDown";

const TeamInviteInputs: React.FC<{
  onInvited: (members: PendingMember) => void;
  userId: string;
}> = ({ onInvited, userId }) => {
  const mounted = useRef(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [role, setRole] = useState<{ value: string; label: string }>({
    value: TeamMemberRole.member,
    label: TeamMemberRole.member,
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { teamId } = router.query;

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const filteredRoles = [];
    Object.keys(TeamMemberRole)?.map((key) => {
      if (key === TeamMemberRole.owner) {
        return;
      }
      filteredRoles.push({
        value: key,
        label: t(`team:${key}`),
      });
    });
    setRoles(filteredRoles);
  }, [router.locale, t]);

  const handleInvite = async () => {
    let validate = true;
    if (!email) {
      setEmailError("Please enter an email.");
      validate = false;
    } else if (!validateEmail(email)) {
      setEmailError("The email should be valid.");
      validate = false;
    } else {
      setEmailError("");
    }

    if (!validate) {
      return;
    }
    try {
      setIsAdding(true);
      const member = await inviteUser(
        email,
        TeamMemberRole[role.value],
        teamId
      );
      onInvited(member);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: "An invitation email has been sent.",
        })
      );

      // track by segment
      segmentTrack("Team Member Invited", {
        userId,
        teamId,
        teamMemberEmail: email,
        teamMemberRole: role.value,
      });
      // track end
    } catch (err) {
      dispatch(
        setToastify({
          status: ToastStatus.failed,
          message:
            err.response?.data?.detail ?? "Failed to send invitation email.",
        })
      );
    } finally {
      if (mounted.current) {
        setIsAdding(false);
      }
    }
  };

  return (
    <>
      <div>
        <TextInput
          htmlFor="email"
          label={t("team:Email_address")}
          placeholder={t("team:Email_address")}
          type="text"
          name="email"
          id="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          error={emailError}
          className="w-full"
        />
      </div>
      <div className="mt-5">
        <DropDown
          label={t("team:Role")}
          options={roles}
          value={role}
          onChange={(val) => setRole(val)}
        />
      </div>
      <div className="mt-5 w-full">
        <SmPinkButton
          className="ml-auto w-full sm:w-1/4 py-2.5"
          onClick={handleInvite}
          disabled={isAdding}
        >
          <PlusIcon
            className="-ml-2 mr-1 h-5 w-5 text-white"
            aria-hidden="true"
          />
          <span>{t("team:Invite")}</span>
        </SmPinkButton>
      </div>
    </>
  );
};

const mapStateToPros = (state) => {
  return {
    userId: state.user?.id,
  };
};

export default connect(mapStateToPros)(TeamInviteInputs);
