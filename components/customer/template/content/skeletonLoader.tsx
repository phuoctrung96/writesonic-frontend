import React from "react";
import ContentLoader from "react-content-loader";

interface SkeletonProps {
  loaderType: string;
  height?: number;
}

const SkeletonLoader: React.FC<SkeletonProps> = ({ loaderType, height }) => {
  const loaderData = {
    "line-x": <rect x="0" y="0" rx="4" ry="4" width="300" height="10" />,
    "short-line-x": <rect x="0" y="0" rx="4" ry="4" width="150" height="10" />,
    "short-line-y": (
      <rect x="120" y="0" rx="4" ry="4" width="150" height="10" />
    ),
    list: (
      <>
        <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
        <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
        <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
        <rect x="0" y="60" rx="3" ry="3" width="250" height="10" />
        <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
        <rect x="20" y="100" rx="3" ry="3" width="80" height="10" />
      </>
    ),
    "section-list": (
      <>
        <rect x="80" y="6" rx="4" ry="4" width="343" height="18" />
        <rect x="8" y="6" rx="4" ry="4" width="65" height="18" />
        <rect x="80" y="40" rx="4" ry="4" width="343" height="18" />
        <rect x="8" y="40" rx="4" ry="4" width="65" height="18" />
        <rect x="80" y="75" rx="4" ry="4" width="343" height="18" />
        <rect x="8" y="75" rx="4" ry="4" width="65" height="18" />
      </>
    ),
    "bullet-list": (
      <>
        <rect x="50" y="6" rx="4" ry="4" width="343" height="18" />
        <rect x="8" y="6" rx="4" ry="4" width="35" height="18" />
        <rect x="50" y="40" rx="4" ry="4" width="343" height="18" />
        <rect x="8" y="40" rx="4" ry="4" width="35" height="18" />
        <rect x="50" y="75" rx="4" ry="4" width="343" height="18" />
        <rect x="8" y="75" rx="4" ry="4" width="35" height="18" />
      </>
    ),
  };
  return (
    <ContentLoader title="" height={height ? height : 20}>
      {loaderData[loaderType]}
    </ContentLoader>
  );
};

export default SkeletonLoader;
