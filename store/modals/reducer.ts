import {
  CONFIRM_CANCEL_PLAN_MODAL,
  CONFIRM_CANCEL_X_PLAN_MODAL,
  CONFIRM_CHANGE_PLAN_MODAL,
  CONFIRM_CHANGE_X_PLAN_MODAL,
  CONFIRM_CHGANGE_CARD_MODAL,
  CONFIRM_PURCHASE_CREDITS_MODAL,
  CREATE_PROJECT_MODAL,
  DELETE_HISTORY_MODAL,
  DELETE_MEMBER_MODAL,
  DELETE_PENDING_MEMBER_MODAL,
  DELETE_PROJECT_MODAL,
  INIT_MODAL,
  PROFILE_BAR,
  PROJECT_SIDE_BAR,
  RENAME_PROJECT_MODAL,
  SIDE_BAR,
  Switch_Account,
  TEMPLATE_SIDE_BAR,
  UPDATE_MEMBER_ROLE_MODAL,
  UPDATE_PENDING_MEMBER_ROLE_MODAL,
} from "./actions";

const INITIAL_STATE = {
  isSidebarOpen: false,
  isProfileSidebarOpen: false,
  isOpenCreateProjectModal: false,
  idOpenDeleteProjectModal: false,
  isOpenTemplateSideBar: false,
  isOpenDeleteHistoryModal: false,
  isOpenConfirmChangePlanModal: false,
  isOpenConfirmChangeXPlanModal: false,
  isOpenConfirmCancelPlanModal: false,
  isOpenConfirmCancelXPlanModal: false,
  isOpenConfirmChangeCardModal: false,
  isOpenConfirmPurchaseCreditsModal: false,
  isOpenProjectSidebar: false,
  idOpenRenameProjectModal: null,
  isOpenSwitchAccountModal: false,
  isOpenUpdateMemberRoleModal: false,
  isOpenDeleteMemberModal: false,
  isOpenUpdatePendingMemberRoleModal: false,
  isOpenDeletePendingMemberModal: false,
};

export default function modals(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_MODAL:
      return INITIAL_STATE;
    case SIDE_BAR:
      return { ...state, isSidebarOpen: action.payload };
    case PROFILE_BAR:
      return { ...state, isProfileSidebarOpen: action.payload };
    case CREATE_PROJECT_MODAL:
      return { ...state, isOpenCreateProjectModal: action.payload };
    case RENAME_PROJECT_MODAL:
      return { ...state, idOpenRenameProjectModal: action.payload };
    case DELETE_PROJECT_MODAL:
      return { ...state, idOpenDeleteProjectModal: action.payload };
    case TEMPLATE_SIDE_BAR:
      return { ...state, isOpenTemplateSideBar: action.payload };
    case DELETE_HISTORY_MODAL:
      return { ...state, isOpenDeleteHistoryModal: action.payload };
    case CONFIRM_CHANGE_PLAN_MODAL:
      return { ...state, isOpenConfirmChangePlanModal: action.payload };
    case CONFIRM_CHANGE_X_PLAN_MODAL:
      return { ...state, isOpenConfirmChangeXPlanModal: action.payload };
    case CONFIRM_CANCEL_PLAN_MODAL:
      return { ...state, isOpenConfirmCancelPlanModal: action.payload };
    case CONFIRM_CANCEL_X_PLAN_MODAL:
      return { ...state, isOpenConfirmCancelXPlanModal: action.payload };
    case CONFIRM_CHGANGE_CARD_MODAL:
      return { ...state, isOpenConfirmChangeCardModal: action.payload };
    case CONFIRM_PURCHASE_CREDITS_MODAL:
      return { ...state, isOpenConfirmPurchaseCreditsModal: action.payload };
    case PROJECT_SIDE_BAR:
      return { ...state, isOpenProjectSidebar: action.payload };
    case Switch_Account:
      return { ...state, isOpenSwitchAccountModal: action.payload };
    case UPDATE_MEMBER_ROLE_MODAL:
      return { ...state, isOpenUpdateMemberRoleModal: action.payload };
    case DELETE_MEMBER_MODAL:
      return { ...state, isOpenDeleteMemberModal: action.payload };
    case UPDATE_PENDING_MEMBER_ROLE_MODAL:
      return { ...state, isOpenUpdatePendingMemberRoleModal: action.payload };
    case DELETE_PENDING_MEMBER_MODAL:
      return { ...state, isOpenDeletePendingMemberModal: action.payload };
    default:
      return state;
  }
}
