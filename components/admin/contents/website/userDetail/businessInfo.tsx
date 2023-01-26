import { Switch } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setBusinessActive as setBusinessActiveAxios } from "../../../../../api/admin/business";
import { getAllEngine, XEngine } from "../../../../../api/admin/engine";
import { Customer } from "../../../../../api/admin/user";
import { getProfile, UserRole } from "../../../../../api/user";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { setUser } from "../../../../../store/user/actions";
import Block from "../../../../block";

const defaultValue = { id: -1, name: "Please Select..." };

function Access({
  info,
  onChange,
  myRole,
}: {
  info: Customer;
  onChange: Function;
  myRole: UserRole;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState<boolean>(false);
  const mounted = useRef(false);
  const [options, setOptions] = useState<XEngine[]>([]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        const engines = await getAllEngine();
        setOptions([defaultValue, ...engines]);
      } catch (err) {}
    }
    initialize();
  }, []);

  useEffect(() => {
    setIsActive(!!info.business.is_active);
  }, [info.business]);

  const setBusinessActive = async (value) => {
    try {
      setIsActive(value);
      const data = await setBusinessActiveAxios({
        id: info.business.id,
        is_active: value,
      });
      onChange({
        ...info,
        business: { ...info.business, is_active: data },
      });
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: value
            ? "Successfully, Active business access"
            : "Successfully, Inactive business access",
        })
      );
      // rest the profile
      const profile = await getProfile({ teamId: null });
      dispatch(setUser(profile));
    } catch (err) {
      const errorCode = err.response?.status;
      const errorDetail = err.response?.data?.detail;
      if (errorCode === 406 && errorDetail === "You don't have permission") {
        router.push("/", undefined, { shallow: true });
      }
    } finally {
    }
  };

  return (
    <Block title="Business Information" message="">
      <div className="flex justify-between items-center mt-7 relative">
        <p className="text-sm font-medium text-gray-500 flex items-center">
          {info?.business?.is_active ? "Active" : "InActive"}
        </p>
        <Switch
          checked={isActive}
          onChange={setBusinessActive}
          disabled={myRole !== UserRole.super_admin}
          className={classNames(
            isActive ? "bg-indigo-600" : "bg-gray-200",
            "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              isActive ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
            )}
          />
        </Switch>
      </div>
      {myRole !== UserRole.super_admin && (
        <div className="cursor-not-allowed absolute left-0 top-0 w-full h-full bg-gray-500 opacity-10 rounded-lg"></div>
      )}
    </Block>
  );
}

const mapStateToPros = (state) => {
  return {
    myRole: state?.user?.role ?? UserRole.member,
  };
};

export default connect(mapStateToPros)(Access);
