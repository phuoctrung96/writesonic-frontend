import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { disconnectSemrush } from "../../../../../../api/semrush";
import semrushLogo from "../../../../../../public/images/semrush.png";
import { setIsAuthorizedBySemrush } from "../../../../../../store/user/actions";
import SmPinkButton from "../../../../../buttons/smPinkButton";
import SmRedButton from "../../../../../buttons/smRedButton";
import IntegrationBlock from "../integrationBlock";

const Semrush: React.FC<{ isAuthorizedBySemrush: boolean }> = ({
  isAuthorizedBySemrush,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await disconnectSemrush();
      dispatch(setIsAuthorizedBySemrush(false));
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const redirectUrl = location.origin + "/integrations-processing/semrush";
  return (
    <IntegrationBlock
      imageSrc={semrushLogo}
      title="SEMrush"
      description="Utilize the keyword research and ranking data of SEMrush to optimize your AI-generated content for SEO."
      width={45}
      height={30}
    >
      {isAuthorizedBySemrush ? (
        <SmRedButton
          className="mx-auto"
          disabled={isLoading}
          onClick={handleDisconnect}
        >
          Disconnect
        </SmRedButton>
      ) : (
        <Link
          href={`https://oauth.semrush.com/auth/login?client_id=writesonic&redirect_uri=${encodeURIComponent(
            redirectUrl
          )}&response_type=code&scope=user.id%2Cdomains.info%2Curl.info
          `}
        >
          <a>
            <SmPinkButton className="mx-auto">Connect</SmPinkButton>
          </a>
        </Link>
      )}
    </IntegrationBlock>
  );
};

const mapStateToPros = (state) => {
  return {
    isAuthorizedBySemrush: state?.user?.is_authorized_by_semrush ?? false,
  };
};

export default connect(mapStateToPros)(Semrush);
