import { useState } from "react";
import { connect } from "react-redux";
import { Customer } from "../../../../../api/admin/user";
import Block from "../../../../block";
import SmRedButton from "../../../../buttons/smRedButton";
import DeleteUserModal from "./deleteUserModal";

const DeleteUser: React.FC<{ info: Customer; myId: string }> = ({
  info,
  myId,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  if (myId === info.id) {
    return null;
  }
  return (
    <Block
      title="Delete this User"
      message="Once you delete an user, there is no going back. Please be certain."
    >
      <div className="mt-5 w-full">
        <SmRedButton
          className="w-full sm:w-1/2"
          onClick={() => setOpenModal(true)}
        >
          Delete User
        </SmRedButton>
      </div>
      <DeleteUserModal
        user_id={info.id}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </Block>
  );
};

const mapStateToPros = (state) => {
  return {
    myId: state?.user?.id,
  };
};

export default connect(mapStateToPros)(DeleteUser);
