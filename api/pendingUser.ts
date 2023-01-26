import { getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import authRequest from "../utils/authRequest";

export const sendVerificationEmail = ({
  email,
  newEmail,
  password,
  locale,
}: {
  email: string;
  newEmail: string;
  password: string;
  locale: string;
}) => {
  const auth = getAuth();
  auth.languageCode = locale;
  return new Promise(async (resolve, reject) => {
    try {
      // check if the user is an owner
      await signInWithEmailAndPassword(auth, email, password);
      // create new pending user
      await authRequest({
        url: `/pending-user/create`,
        method: "post",
        data: { email: newEmail },
      });

      resolve("success");
    } catch (err) {
      reject(err);
    }
  });
};
