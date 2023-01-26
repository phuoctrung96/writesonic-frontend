import { RadioGroup, Switch } from "@headlessui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Customer,
  setBusiness as setBusinessAxios,
  unsetBusiness as unsetBusinessAxios,
  updateRole,
} from "../../../../../api/admin/user";
import { getProfile, UserRole } from "../../../../../api/user";
import { setToastify, ToastStatus } from "../../../../../store/main/actions";
import { setUser } from "../../../../../store/user/actions";
import Block from "../../../../block";

const settings = [
  {
    name: "Member",
    value: UserRole.member,
  },
  {
    name: "Admin",
    value: UserRole.admin,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Access({
  info,
  myRole,
  onChange,
  myId,
}: {
  info: Customer;
  myRole: UserRole;
  onChange: Function;
  myId: string;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(
    settings.find(({ value }) => value === info.role) ?? UserRole.member
  );
  const [isBusiness, setIsBusiness] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsBusiness(!!info.business);
  }, [info.business]);

  const onSelect = (item) => {
    setIsLoading(true);
    setSelected(item);
    updateRole({
      id: info.id,
      role: item.value,
    })
      .then((res) => {
        onChange(res);
        dispatch(
          setToastify({
            status: ToastStatus.success,
            message: "Changed the user's role",
          })
        );
      })
      .catch((err) => {
        const errorCode = err.response?.status;
        const errorDetail = err.response?.data?.detail;
        if (errorCode === 406 && errorDetail === "You don't have permission") {
          router.push("/", undefined, { shallow: true });
        }
      })
      .finally(() => {
        if (mounted.current) {
          setIsLoading(false);
        }
      });
  };

  const setBusiness = async (value) => {
    setIsLoading(true);
    setIsBusiness(value);
    try {
      const res = value
        ? await setBusinessAxios({ id: info.id })
        : await unsetBusinessAxios({
            id: info.id,
          });
      onChange(res);
      dispatch(
        setToastify({
          status: ToastStatus.success,
          message: value
            ? "Successfully, give business access"
            : "Successfully, remove business access",
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
      if (mounted.current) {
        setIsLoading(true);
      }
    }
  };

  return (
    <Block title="Change User's Role" message="">
      <RadioGroup value={selected} onChange={onSelect}>
        <RadioGroup.Label className="sr-only">Privacy setting</RadioGroup.Label>
        <div className="bg-white rounded-md -space-y-px">
          {settings?.map((setting, settingIdx) => (
            <RadioGroup.Option
              key={setting.value}
              value={setting}
              disabled={myId === info.id || myRole !== UserRole.super_admin}
              className={({ checked }) =>
                classNames(
                  settingIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                  settingIdx === settings.length - 1
                    ? "rounded-bl-md rounded-br-md"
                    : "",
                  checked
                    ? "bg-indigo-50 border-indigo-200"
                    : "border-gray-200",
                  "relative border p-4 flex cursor-pointer focus:outline-none"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      checked
                        ? "bg-indigo-600 border-transparent"
                        : "bg-white border-gray-300",
                      active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                      "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center"
                    )}
                    aria-hidden="true"
                  >
                    <span className="rounded-full bg-white w-1.5 h-1.5" />
                  </span>
                  <div className="ml-3 flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className={classNames(
                        checked ? "text-indigo-900" : "text-gray-900",
                        "block text-sm font-medium"
                      )}
                    >
                      {setting.name}
                    </RadioGroup.Label>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      {!!!info?.business && (
        <div className="flex justify-between items-center mt-7">
          <p className="text-sm font-medium text-gray-500 flex items-center">
            Business Access
          </p>
          <Switch
            checked={isBusiness}
            onChange={setBusiness}
            disabled={myRole !== UserRole.super_admin}
            className={classNames(
              isBusiness ? "bg-indigo-600" : "bg-gray-200",
              "h-auto relative inline-flex flex-shrink-0 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                isBusiness ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            />
          </Switch>
        </div>
      )}
      {myRole !== UserRole.super_admin && (
        <div className="cursor-not-allowed absolute left-0 top-0 w-full h-full bg-gray-500 opacity-10 rounded-lg"></div>
      )}
    </Block>
  );
}

const mapStateToPros = (state) => {
  return {
    myRole: state?.user?.role ?? UserRole.member,
    myId: state?.user?.id,
  };
};

export default connect(mapStateToPros)(Access);
