export const INIT_MODAL: string = "INIT_MODAL";
export const SIDE_BAR: string = "SIDE_BAR";
export const PROFILE_BAR: string = "PROFILE_BAR";
export const CREATE_PROJECT_MODAL: string = "CREATE_PROJECT_MODAL";
export const RENAME_PROJECT_MODAL: string = "RENAME_PROJECT_MODAL";
export const DELETE_PROJECT_MODAL: string = "DELETE_PROJECT_MODAL";
export const TEMPLATE_MODAL: string = "TEMPLATE_MODAL";
export const TEMPLATE_SIDE_BAR: string = "TEMPLATE_SIDE_BAR";
export const DELETE_HISTORY_MODAL: string = "DELETE_HISTORY_MODAL";
export const CONFIRM_CHANGE_PLAN_MODAL: string = "CONFIRM_CHANGE_PLAN_MODAL";
export const CONFIRM_CANCEL_PLAN_MODAL: string = "CONFIRM_CANCEL_PLAN_MODAL";
export const CONFIRM_CANCEL_X_PLAN_MODAL: string =
  "CONFIRM_CANCEL_X_PLAN_MODAL";
export const CONFIRM_CHGANGE_CARD_MODAL: string = "CONFIRM_CHGANGE_CARD_MODAL";
export const CONFIRM_PURCHASE_CREDITS_MODAL: string =
  "CONFIRM_PURCHASE_CREDITS_MODAL";
export const PROJECT_SIDE_BAR: string = "PROJECT_SIDE_BAR";
export const CONFIRM_CHANGE_X_PLAN_MODAL: string =
  "CONFIRM_CHANGE_X_PLAN_MODAL";
export const Switch_Account: string = "Switch_Account";
export const UPDATE_MEMBER_ROLE_MODAL: string = "UPDATE_MEMBER_ROLE_MODAL";
export const DELETE_MEMBER_MODAL: string = "DELETE_MEMBER_MODAL";
export const UPDATE_PENDING_MEMBER_ROLE_MODAL: string =
  "UPDATE_PENDING_MEMBER_ROLE_MODAL";
export const DELETE_PENDING_MEMBER_MODAL: string =
  "DELETE_PENDING_MEMBER_MODAL";

export const initModals = () => {
  return { type: INIT_MODAL };
};

export const openSidebar = (open: boolean) => {
  return { type: SIDE_BAR, payload: open };
};

export const openProfilebar = (open: boolean) => {
  return { type: PROFILE_BAR, payload: open };
};

export const openCreateProjectModal = (open: boolean) => {
  return { type: CREATE_PROJECT_MODAL, payload: open };
};

export const openRenameProjectModal = (id: string) => {
  return { type: RENAME_PROJECT_MODAL, payload: id };
};

export const openDeleteProjectModal = (id: string) => {
  return { type: DELETE_PROJECT_MODAL, payload: id };
};

export const openTemplateSidebar = (open: boolean) => {
  return { type: TEMPLATE_SIDE_BAR, payload: open };
};

export const openDeleteHistoryModal = (open: boolean) => {
  return { type: DELETE_HISTORY_MODAL, payload: open };
};
export const openConfirmChangePlanModal = (open: boolean) => {
  return { type: CONFIRM_CHANGE_PLAN_MODAL, payload: open };
};

export const openConfirmChangeXPlanModal = (open: boolean) => {
  return { type: CONFIRM_CHANGE_X_PLAN_MODAL, payload: open };
};

export const openConfirmCancelPlanModal = (open: boolean) => {
  return { type: CONFIRM_CANCEL_PLAN_MODAL, payload: open };
};

export const openConfirmCancelXPlanModal = (open: boolean) => {
  return { type: CONFIRM_CANCEL_X_PLAN_MODAL, payload: open };
};

export const openConfirmChangeCardModal = (open: boolean) => {
  return { type: CONFIRM_CHGANGE_CARD_MODAL, payload: open };
};

export const openConfirmPurchaseCreditsModal = (open: boolean) => {
  return { type: CONFIRM_PURCHASE_CREDITS_MODAL, payload: open };
};

export const openProjectSideBar = (open: boolean) => {
  return { type: PROJECT_SIDE_BAR, payload: open };
};

export const openSwitchAccountModal = (open: boolean) => {
  return { type: Switch_Account, payload: open };
};

export const openUpdateMemberRoleModal = (open: boolean) => {
  return { type: UPDATE_MEMBER_ROLE_MODAL, payload: open };
};

export const openDeleteMemberModal = (open: boolean) => {
  return { type: DELETE_MEMBER_MODAL, payload: open };
};

export const openUpdatePendingMemberRoleModal = (open: boolean) => {
  return { type: UPDATE_PENDING_MEMBER_ROLE_MODAL, payload: open };
};

export const openDeletePendingMemberModal = (open: boolean) => {
  return { type: DELETE_PENDING_MEMBER_MODAL, payload: open };
};
