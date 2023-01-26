import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { disconnectWordpress } from "../../../../../../api/thirdparty";
import wordpressLogo from "../../../../../../public/images/wordpress-blue.svg";
import { setIsAuthorizedByWordpress } from "../../../../../../store/user/actions";
import SmPinkButton from "../../../../../buttons/smPinkButton";
import SmRedButton from "../../../../../buttons/smRedButton";
import IntegrationBlock from "../integrationBlock";

const Wordpress: React.FC<{ isAuthorizedByWordpress: boolean }> = ({
  isAuthorizedByWordpress,
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
      await disconnectWordpress();
      dispatch(setIsAuthorizedByWordpress(false));
    } catch (err) {
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const redirectUrl = location.origin + "/integrations-processing/wordpress";

  return (
    <IntegrationBlock
      imageSrc={wordpressLogo}
      title="Wordpress"
      description="Publish Generated Content from the AI Article Writer or Sonic Editor directly to WordPress."
      width={30}
      height={30}
    >
      {isAuthorizedByWordpress ? (
        <SmRedButton
          className="mx-auto"
          disabled={isLoading}
          onClick={handleDisconnect}
        >
          Disconnect
        </SmRedButton>
      ) : (
        <Link
          href={`https://public-api.wordpress.com/oauth2/authorize?client_id=${
            process.env.NEXT_PUBLIC_WORDPRESS_CLIENT_ID
          }&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code
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
    isAuthorizedByWordpress: state?.user?.is_authorized_by_wordpress ?? false,
  };
};

export default connect(mapStateToPros)(Wordpress);
