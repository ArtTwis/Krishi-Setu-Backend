export const APPLICATION_DESCRIPTION =
  "AgriTrack is a Node.js-based backend application designed to store, manage, and track comprehensive farmer records. personal details, land ownership, crop cultivation, financial information, bank loans, and government scheme benefits in a structured digital format.";

export const DB_NAME = "krishisetu";

export const APPLICATION_NAME = "Krishi-Setu";

export const SALT = 10;

export const USER_ID_LENGTH = 8;

export const cookiesOptions = {
  httpOnly: true, //  Using the HttpOnly flag when generating a cookie helps mitigate the risk of client side script accessing the protected cookie (if the browser supports it)
  secure: true, //  The purpose of the secure attribute is to prevent cookies from being observed by unauthorized parties due to the transmission of the cookie in clear text. To accomplish this goal, browsers which support the secure attribute will only send cookies with the secure attribute when the request is going to an HTTPS page. Said in another way, the browser will not send a cookie with the secure attribute set over an unencrypted HTTP request. By setting the secure attribute, the browser will prevent the transmission of a cookie over an unencrypted channel.
};

export const defaultPassword = "KRISHI@";

export const UserTypeEnum = {
  admin: "ADMIN",
  user: "USER",
};

export const MailTypeEnum = {
  verification: "VERIFICATION",
  registration: "REGISTRATION",
  forgotPassword: "FORGOT_PASSWORD",
  changePassword: "CHANGE_PASSWORD",
  login: "LOGIN",
  logout: "LOGOUT",
  otp: "OTP",
  contact: "CONTACT",
};
