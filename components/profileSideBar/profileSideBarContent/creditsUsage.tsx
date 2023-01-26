import { ResponsiveLine, Serie } from "@nivo/line";
import useTranslation from "next-translate/useTranslation";
import { connect } from "react-redux";
import ProfileSideBarSubTitle from "./freeCreditOffer/profileSideBarSubTitle";

const initData = {
  id: "gradientA",
  color: "#FFB546",
  data: [
    {
      x: "",
      y: 0,
    },
  ],
};

const linearGradientDef = (id, colors, options = {}) => ({
  id,
  type: "linearGradient",
  colors,
  ...options,
});

const theme = {
  background: "#ffffff",
  textColor: "#6B7280",
  fontSize: 10,
  axis: {
    domain: {
      line: {
        stroke: "#FFFFFF",
        strokeWidth: 0,
      },
    },
    ticks: {
      line: {
        stroke: "#FFFFFF",
        strokeWidth: 0,
      },
    },
  },
  grid: {
    line: {
      stroke: "#F2F4FA",
      strokeWidth: 1,
    },
  },
};

function RenderTick({ textAnchor, textBaseline, value, x, y }) {
  if (value % 1 !== 0 || value === 0) {
    return null;
  }
  return (
    <g transform={`translate(${x - 10},${y})`}>
      <text
        alignmentBaseline={textBaseline}
        textAnchor={textAnchor}
        className="text-xxs opacity-60"
      >
        {value}
      </text>
    </g>
  );
}

const CreditUsage: React.FC<{ infoes: Serie; yScaleMax: number | "auto" }> = ({
  infoes,
  yScaleMax,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <ProfileSideBarSubTitle>
        {t("nav_bar:credits_usage")}
      </ProfileSideBarSubTitle>
      <div className="w-full h-44">
        <ResponsiveLine
          data={[infoes]}
          animate={true}
          enableArea={true}
          enableGridX={false}
          enablePoints={true}
          useMesh={true}
          pointSize={7}
          pointColor="rgba(255, 255, 255, 1)"
          pointBorderWidth={1.5}
          pointBorderColor="#FFB546"
          curve="linear"
          margin={{ top: 20, right: 25, bottom: 25, left: 30 }}
          defs={[
            linearGradientDef("gradientA", [
              { offset: 30, color: "inherit" },
              { offset: 100, color: "inherit", opacity: 0 },
            ]),
          ]}
          fill={[{ match: "*", id: "gradientA" }]}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: yScaleMax,
            stacked: true,
            reverse: false,
            nice: 90,
          }}
          axisBottom={{
            axis: "x",
            scale: "linear",
            length: 7,
            ticksPosition: "before",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            axis: "y",
            scale: "linear",
            length: 7,
            ticksPosition: "before",
            tickSize: 0,
            tickPadding: 10,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: "middle",
            tickValues: 6,
            renderTick: RenderTick,
          }}
          gridYValues={6}
          theme={theme}
          tooltip={({ point }) => {
            return (
              <div>
                <p className="text-gray-0 text-xs font-medium">
                  {point.data.y}
                </p>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    isOpenModal: state.modals?.isProfileSidebarOpen,
  };
};

export default connect(mapStateToPros)(CreditUsage);
