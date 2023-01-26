import React from "react";
import { connect } from "react-redux";

class CannyFeedback extends React.Component<{
  userId: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  userAvatar: string;
}> {
  componentDidMount() {
    window["Canny"]("render", {
      boardToken: process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN,
      basePath: null,
      ssoToken: null,
    });
    window["Canny"]("identify", {
      boardToken: process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN,
      appID: process.env.NEXT_PUBLIC_CANNY_APP_ID,
      user: {
        email: this.props.userEmail,
        name: this.props.userFirstName + " " + this.props.userLastName,
        id: this.props.userId,

        // These fields are optional, but recommended:
        avatarURL: this.props.userAvatar,
        // created: new Date(user.created).toISOString(),
      },
    });
  }

  render() {
    return <div data-canny />;
  }
}

const mapStateToPros = (state) => {
  return {
    userId: state.user?.id,
    userEmail: state.user?.email,
    userFirstName: state.user?.firstName,
    userLastName: state.user?.lastName,
    userAvatar: state.user?.photo_url,
  };
};

export default connect(mapStateToPros)(CannyFeedback);
