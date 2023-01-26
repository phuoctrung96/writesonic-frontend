import Slider from "@material-ui/core/Slider";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { createCheckout } from "../../../../../api/credit_v2";
import { getOneTimeCredits, OneTimeCredit } from "../../../../../api/list";
import { setOneTimeCredits } from "../../../../../store/options/actions";
import { openHelpScout } from "../../../../../utils/helpScout";
import Block from "../../../../block";
import SmPinkButton from "../../../../buttons/smPinkButton";
import ToolTip, { Position } from "../../../../tooltip";
import Overlay from "../../../overlay";

const MAX_VALUE = 450;
const MIN_VALUE = 50;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "95%",
      margin: "30px auto",
    },
    margin: {
      height: theme.spacing(3),
    },
  })
);

const PrestoSlider = withStyles({
  root: {
    color: "rgba(93, 97, 154)",
    height: 8,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "rgba(93, 97, 154)",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -10,
    "&:focus": {
      boxShadow: "none",
    },
    "&:hover": {
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  mark: {
    height: 0,
    width: 0,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "currentColor",
  },
})(Slider);

const useStylesBootstrap = makeStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    color: "rgb(107, 114, 128)",
    fontSize: "10pt",
  },
}));

function ValueLabelComponent(props) {
  const classes = useStylesBootstrap();
  const { children, open, value } = props;
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(value == MAX_VALUE ? "Custom" : `${value} Credits`);
  }, [value]);

  return <>{children}</>;
}

function OneTimeCreditSlider({
  oneTimeCredits,
}: {
  oneTimeCredits: OneTimeCredit[];
}) {
  const router = useRouter();
  const { teamId } = router.query;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const refToolTip = useRef(null);

  const [isLoading, setLoading] = useState(false);
  const [marks, setMarks] = useState([]);
  const [value, setValue] = useState(null);

  useEffect(() => {
    async function fetchOneTimeCredits() {
      try {
        dispatch(setOneTimeCredits(await getOneTimeCredits()));
      } catch (err) {
        console.error(err);
      }
    }

    fetchOneTimeCredits();
  }, [dispatch]);

  useEffect(() => {
    if (!oneTimeCredits || !oneTimeCredits.length) {
      return;
    }
    setValue(oneTimeCredits[0]?.credits ?? 0);
  }, [oneTimeCredits]);

  const handleChange = (event: object, value: number) => {
    setValue(value);
    refToolTip?.current?.changeToolTipContent();
  };

  useEffect(() => {
    if (!oneTimeCredits || !oneTimeCredits.length) {
      return;
    }
    let lists: { value: number }[] = [];
    oneTimeCredits.forEach((oneTimeCredit) => {
      lists.push({ value: oneTimeCredit.credits });
    });
    lists.push({ value: 450 });
    setMarks(lists);
  }, [oneTimeCredits]);

  const onSubmit = async () => {
    if (value < 450) {
      const plan = oneTimeCredits.find(
        (oneTimeCredits) => oneTimeCredits.credits === value
      );
      let priceId = plan.price_id;

      try {
        setLoading(true);
        const checkoutUrl = await createCheckout(priceId, teamId);

        window.location.href = checkoutUrl;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      openHelpScout();
    }
  };

  return (
    <>
      <Block
        title={t("settings:pay_as_your_go")}
        message={t("settings:pay_as_your_go_description")}
      >
        <ToolTip
          ref={refToolTip}
          className={classNames(classes.root, "relative")}
          position={Position.bottom}
          message={value == MAX_VALUE ? "Custom" : `${value} Credits`}
          targetElClassName="MuiSlider-thumb"
        >
          <PrestoSlider
            valueLabelDisplay="auto"
            defaultValue={50}
            step={null}
            min={MIN_VALUE}
            max={MAX_VALUE}
            marks={marks}
            ValueLabelComponent={ValueLabelComponent}
            value={value}
            onChange={handleChange}
            onChangeCommitted={() => {
              refToolTip?.current?.closeTooltip();
            }}
          />
        </ToolTip>
        <div className="mt-14 sm:mt-10">
          <SmPinkButton
            className="w-full py-2.5"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {value < 450
              ? `${t("settings:purchase_for_btn")} $${
                  oneTimeCredits &&
                  oneTimeCredits.find(
                    (oneTimeCredits) => oneTimeCredits.credits === value
                  )?.price
                }`
              : t("settings:contact_us")}
          </SmPinkButton>
          <Overlay isShowing={!oneTimeCredits} hideLoader />
        </div>
      </Block>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    oneTimeCredits: state.options?.oneTimeCredits,
  };
};

export default connect(mapStateToProps)(OneTimeCreditSlider);
