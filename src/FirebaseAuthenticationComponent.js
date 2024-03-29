import "./App.css";
import habitsservice from "./services/habitsservice";
import userservice from "./services/userservice";
import { createContext, useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  deleteUser,
  getAdditionalUserInfo,
} from "firebase/auth";
// import SignIn from "./SignIn";
// import SignUp from "./SignUp";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Imports from MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import validator, { isEmail, isStrongPassword } from "validator";

// npm package "React Social Login Buttons" widgets
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { AppBar, FormGroup, Toolbar } from "@mui/material";

// configuration and apikeys for firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

// function for when the "log in with Google" button is clicked
function GoogleHandleClick(event) {
  console.log("Google Sign in clicked: ");

  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      const { isNewUser } = getAdditionalUserInfo(result);

      console.log("is this a new user?", isNewUser);

      // Creating user in database, if they don't exist already
      userservice.setToken(token);

      // setting refreshToken too, but not using it yet:
      userservice.setRefreshToken(user.stsTokenManager.refreshToken);

      // We only do the following if this is a new user

      if (isNewUser) {
        console.log("This is a new user, adding user to database:");

        const newUserObject = {
          email: user.email,
          uid: user.uid,
          dateAccountCreated: user.metadata.creationTime,
          dateLastSignedIn: user.metadata.lastSignInTime,
          verifiedEmail: user.emailVerified,
        };

        userservice.create(newUserObject).then((returnedUser) => {
          console.log(
            "successfully created user with google signup",
            user.email
          );
        });
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(
        "something went wrong with Google Sign In",
        error.code,
        error.message
      );
    });
}

// function for when the "log in with Facebook" button is clicked
function FacebookHandleClick() {
  console.log("Facebook Sign in clicked: ");
  const provider = new FacebookAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      const { isNewUser } = getAdditionalUserInfo(result);

      console.log("is this a new user?", isNewUser);

      // Creating user in database, if they don't exist already
      userservice.setToken(token);

      // setting refreshToken too, but not using it yet:
      userservice.setRefreshToken(user.stsTokenManager.refreshToken);

      // We only do the following if this is a new user
      if (isNewUser) {
        console.log("This is a new user, adding user to database:");

        const newUserObject = {
          email: user.email,
          uid: user.uid,
          dateAccountCreated: user.metadata.creationTime,
          dateLastSignedIn: user.metadata.lastSignInTime,
          verifiedEmail: user.emailVerified,
        };

        userservice.create(newUserObject).then((returnedUser) => {
          console.log(
            "successfully created user with facebook signup",
            user.email
          );
        });
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });
}

// const displayName = "";
// const email = "";
// const photoURL = "";
// const emailVerified = "";

// // example of how to get a users profile information
// if (user !== null) {
//   console.log("user is not null");
//   // The user object has basic properties such as display name, email, etc.
//   console.log(user.displayName);
//   console.log(user.email);
//   console.log("photourl: " + user.photoURL);
//   console.log(user.emailVerified);

//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.

//   // uid = user.uid;
// }

// 18.07.2022 this is slightly buggy, as it won't say "sign in successful" on successful login here, but I'm keeping this method outside
// the App component because it causes problems with asking for the email 4 times if I put it in the app component.

// This method checks for if the user has just been redirected via a 'verify email' link. Not used at the moment as I'm not using Email link authentication.
if (isSignInWithEmailLink(auth, window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.

  // TODO: 08/08/2022 its possible this may be broken, because we clear the localstorage in the useeffect if the user is logged out.

  let email = window.localStorage.getItem("emailForSignIn");
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt("Please provide your email for confirmation");
  }
  // The client SDK will parse the code from the link for you.
  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      // Clear email from storage.
      window.localStorage.removeItem("emailForSignIn");
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    })
    .catch((error) => {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}

// simple default Home Page component
function Home({ theUser }) {
  return (
    <Container component="main">
      <CssBaseline />
      {/* This was the text above the calendar */}
      {/* {theUser !== null ? (
        null
      ) : (
        <h2>You do not have access to the Home page. Please sign in</h2>
      )}
      {theUser !== null ? (
        <h2>{`Welcome back, ${theUser.email}`}</h2>
      ) : null} */}
    </Container>
  );
}

// Create New Account Component from MUI
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      {/* TODO: add a link here I guess */}
      <Link color="inherit" href="">
        Habitimity
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    // I can change this to light to change the theme
    whiteText: {
      main: "#fff",
      contrastText: "#fff",
    },
    orange: {
      main: "#F24E1ECC",
      contrastText: "#fff",
    },
    lightorange: {
      main: "#FF8D24CC",
      contrastText: "#fff",
    },
    purple: {
      main: "#A259FFCC",
      contrastText: "#fff",
    },
    green: {
      main: "#0ACF83CC",
      contrastText: "#fff",
    },
    blue: {
      main: "#1ABCFECC",
      contrastText: "#fff",
    },
    pink: {
      main: "#FF7262CC",
      contrastText: "#fff",
    },
    white: {
      main: "#fff",
      contrastText: "#fff",
    },
  },
});

function SignUp({ setshowComponent }) {
  const [signUpErrorText, setsignUpErrorText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!isEmail(data.get("email"))) {
      setsignUpErrorText("Not a valid email, please enter a valid email");
    } else if (!isStrongPassword(data.get("password"), { minUppercase: 0 })) {
      setsignUpErrorText(
        "Password is not strong enough, min characters: 8, min numerical: 1, min symbols: 1,  please choose another password"
      );
    } else if (
      isEmail(data.get("email")) &&
      isStrongPassword(data.get("password"), { minUppercase: 0 })
    ) {
      createUserWithEmailAndPassword(
        auth,
        data.get("email"),
        data.get("password")
      )
        .then((userCredential) => {
          // Successful Sign Up via email, automatically logged in
          const user = userCredential.user;

          // Actually possibly do want this, as we're just about to send a post request with axios setting token to userservice:
          userservice.setToken(userCredential.user.accessToken);
          // setting refreshToken too, but not using it yet:
          userservice.setRefreshToken(
            userCredential.user.stsTokenManager.refreshToken
          );

          // console.log("do we get a credential token here?", userCredential);
          // console.log("I believe this is the accessToken", userCredential.user.accessToken, typeof userCredential.user.accessToken);
          // console.log("I believe this is the refreshToken also", userCredential.user.stsTokenManager.refreshToken);
          // console.log("checking email", userCredential.user.email, typeof userCredential.user.email);
          // console.log("checking uid", userCredential.user.uid, typeof userCredential.uid);
          // console.log("checking creationtime", userCredential.user.metadata.creationTime, typeof userCredential.user.metadata.creationTime);
          // console.log("checking lastSignInTime", userCredential.user.metadata.lastSignInTime, typeof userCredential.user.metadata.lastSignInTime);
          // console.log("checking verifiedEmail", userCredential.user.emailVerified, typeof userCredential.user.emailVerified)

          // create user in database. Note: creationTime and lastSignInTime are Strings
          // Lets try to send these string dates to mongoDB and see if it works them out

          console.log("adding user to database:");

          const newUserObject = {
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            dateAccountCreated: userCredential.user.metadata.creationTime,
            dateLastSignedIn: userCredential.user.metadata.lastSignInTime,
            verifiedEmail: userCredential.user.emailVerified,
          };

          userservice.create(newUserObject).then((returnedUser) => {
            console.log(
              "successfully created user with email signup",
              userCredential.user.email
            );
          });

          setsignUpErrorText("Account Successfully Created!");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);

          if (errorCode === "auth/email-already-in-use") {
            setsignUpErrorText("Account with this email already exists");
          } else {
            setsignUpErrorText("Something went wrong with sign in");
          }

          // ..
        });

      console.log("Creating account, user: " + data.get("email"));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h2" align="center">
            Create A New Account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  component="h1"
                  variant="caption"
                  sx={{ color: "red" }}
                >
                  {signUpErrorText}
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up With Email
            </Button>
            <GoogleLoginButton
              onClick={GoogleHandleClick}
              // style={{ margin: "5px auto 0", display: "block" }}
            />
            <FacebookLoginButton onClick={FacebookHandleClick} />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => setshowComponent("SignIn")}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

// SignIn MUI Template Component

function SignIn(props) {
  const [signInErrorText, setsignInErrorText] = useState("");

  const handleSignInSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(
      "Sign in clicked: " +
        {
          email: data.get("email"),
          password: data.get("password"),
        }
    );

    if (!isEmail(data.get("email"))) {
      setsignInErrorText("Not a valid email, please enter a valid email");
    } else if (data.get("password").length < 6) {
      setsignInErrorText("Password invalid");
    } else if (isEmail(data.get("email")) && data.get("password").length >= 6) {
      signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setsignInErrorText("");

          // ...
        })
        .catch((error) => {
          console.log("no user with these credentials exists");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (
            errorCode === "auth/user-not-found" ||
            errorCode === "auth/wrong-password"
          ) {
            setsignInErrorText("No user with these credentials exists");
          } else {
            setsignInErrorText("Something went wrong with sign in");
          }
        });

      console.log("Signing in, user: " + data.get("email"));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "success.light" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h2">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSignInSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Typography component="h1" variant="caption" sx={{ color: "red" }}>
              {signInErrorText}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <GoogleLoginButton
              onClick={GoogleHandleClick}
              // style={{ margin: "5px auto 0", display: "block" }}
            />
            <FacebookLoginButton onClick={FacebookHandleClick} />
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("ForgotPassword")}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("SignUp")}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

// Email Link Verification Component, not used currently

function EmailLink() {
  const [emailLinkErrorText, setemailLinkErrorText] = useState("");

  const handleEmailLinkSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
    });

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: "http://localhost:3000",
      // This must be true.
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: "com.example.ios",
      // },
      // android: {
      //   packageName: "com.example.android",
      //   installApp: true,
      //   minimumVersion: "12",
      // },
      // dynamicLinkDomain: "example.page.link",
    };
    if (!isEmail(data.get("email"))) {
      setemailLinkErrorText("Not a valid email, please enter a valid email");
    } else {
      sendSignInLinkToEmail(auth, data.get("email"), actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem("emailForSignIn", data.get("email"));
          let emaillog = window.localStorage.getItem("emailForSignIn");
          console.log("Stored email: " + emaillog);
          setemailLinkErrorText("Email Link Sent!");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          // ...
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Email Link Verification
          </Typography>
          <Box
            component="form"
            onSubmit={handleEmailLinkSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Email Link
            </Button>
            <Typography component="h1" variant="caption" sx={{ color: "red" }}>
              {emailLinkErrorText}
            </Typography>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

// Forgot Password form (created by copying Sign In component)

function ForgotPassword(props) {
  const [forgotErrorText, setforgotErrorText] = useState("");

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
    });

    if (!isEmail(data.get("email"))) {
      setforgotErrorText("Not a valid email, please enter a valid email");
    } else {
      sendPasswordResetEmail(auth, data.get("email"))
        .then(() => {
          // Password reset email sent!
          console.log("Password reset email sent! to: " + data.get("email"));
          setforgotErrorText("Password reset email sent!");
          // ..
        })
        .catch((error) => {
          console.log("no user with this email exists");
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (errorCode === "auth/user-not-found") {
            setforgotErrorText("No user with this email exists");
          } else {
            setforgotErrorText("Something went wrong with sign in");
          }
          // ..
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleForgotSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Password Reset Email
            </Button>
            <Typography component="h1" variant="caption" sx={{ color: "red" }}>
              {forgotErrorText}
            </Typography>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => props.setshowComponent("SignIn")}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

// Delete user component

function DeleteUser({ theUser }) {
  const [deleteUserErrorText, setdeleteUserErrorText] = useState("");

  const handleDeleteAccountSubmit = (event) => {
    event.preventDefault();
    console.log(theUser);

    if (theUser === null) {
      setdeleteUserErrorText("You are not logged in");
    } else if (window.confirm("Do you really want to delete your account?")) {
      // we perhaps have to keep a copy of the token here
      let copyOfToken = theUser.accessToken;

      deleteUser(theUser)
        .then(() => {
          userservice.setToken(copyOfToken);

          // we delete from MongoDB here.
          userservice.axiosDelete(theUser.uid).then(() => {
            console.log("user deleted successfully");
            userservice.setToken(null);
            copyOfToken = null;
          });

          setdeleteUserErrorText("Account deleted successfully");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          // An error ocurred
          if (errorCode === "auth/requires-recent-login") {
            setdeleteUserErrorText(
              "For sensitive operations such as account deletion the user must have logged in recently. Please log out and log in and try again"
            );
          } else {
            setdeleteUserErrorText("Something went wrong with Delete");
            console.log("Something went wrong with Delete");
          }
          // ..
        });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" align="center">
            Delete Account
          </Typography>
          <Typography component="h1" variant="body1" align="center">
            Warning! This will delete your account and data forever. Click the
            button below if you want to proceed.
          </Typography>
          <Box
            component="form"
            onSubmit={handleDeleteAccountSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Delete My Account
            </Button>
            <Typography
              component="h1"
              variant="caption"
              align="center"
              sx={{ color: "red" }}
            >
              {deleteUserErrorText}
            </Typography>
          </Box>
          <Typography component="h1" variant="h5" align="center">
            Dark Theme
          </Typography>
          <SwitchLabels />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

// The dark theme switch
function SwitchLabels() {
  const [labelText, setlabelText] = useState("Dark Theme Off");

  const onSwitchChange = () => {
    if (labelText === "Dark Theme Off") {
      console.log("dark theme On loggged");
      setlabelText("Dark Theme On");

      document.documentElement.style.setProperty(
        "--firebase-auth-darktheme-color",
        "#7F8487"
      );
    } else {
      console.log("dark theme off");
      setlabelText("Dark Theme Off");
      document.documentElement.style.setProperty(
        "--firebase-auth-darktheme-color",
        "transparent"
      );
    }
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch onChange={onSwitchChange} />}
        label={labelText}
      />
    </FormGroup>
  );
}

function ContactUs({}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center">
        Send your feedback to habitimity [at] gmail.com!
      </Typography>
    </ThemeProvider>
  );
}

// This switches between which component we want to show
const Switcher = ({ setshowComponent, showComponent, theUser }) => {
  switch (showComponent) {
    case "Home":
      return <Home setshowComponent={setshowComponent} theUser={theUser} />;
    case "SignUp":
      return <SignUp setshowComponent={setshowComponent} theUser={theUser} />;
    case "SignIn":
      return <SignIn setshowComponent={setshowComponent} theUser={theUser} />;
    case "DeleteUser":
      return (
        <DeleteUser setshowComponent={setshowComponent} theUser={theUser} />
      );
    case "ForgotPassword":
      return (
        <ForgotPassword setshowComponent={setshowComponent} theUser={theUser} />
      );
    case "ContactUs":
      return <ContactUs />;
    default:
      return <SignUp setshowComponent={setshowComponent} theUser={theUser} />;
  }
};

function FirebaseAuthenticationComponent({
  setshowComponent,
  showComponent,
  userToken,
  setUserToken,
  theUser,
  setTheUser,
  setHabits,
  setSelectedHabitButtonId,
}) {
  console.log("App rerendered");
  // state for the username of the currently signed in user
  const [signedInUsername, setsignedInUsername] = useState("Logged Out");

  /* putting onAuthStateChanged in useEffect sets the onauthstate listener only once when App is first rendered, preventing
  another listener being added when App is rerendered, thereby preventing infinite loops when we change the state in onauthstatechanged.
  This solution took about 2 hours to find: https://stackoverflow.com/questions/61155701/how-to-prevent-infinite-loop-caused-by-onauthstatechanged-firebase-auth.
  Edit: Could have used useAuthState hook from react-firebase-hooks also, which also gives you access to a 'user' variable telling you if
  they are logged in or not. That might have been easier.
  */
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;

        console.log("logged in, finding out what user is ", user);

        // addding the boolean true in getIdToken to force Refresh so that token is always valid
        user
          .getIdToken(true)
          .then(function (idToken) {
            // we will set user token here, so that its available in the app component, though its possible we will never use it

            habitsservice.setToken(idToken);
            userservice.setToken(idToken);
            userservice.setRefreshToken(user.refreshToken);

            setUserToken(idToken);

            // saving token to localStorage. Current not necessary as Firebase somehow persists the user. Otherwise the token would disappear when we refresh the page, so thats what saving to window.localstorage is for
            window.localStorage.setItem(
              "loggedHabitsUserToken",
              JSON.stringify(idToken)
            );

            // here we are fetching the habits for each user
            // TODO 09.08.2022: Oh ok so the bug was that i didn't send the token with the get request in habitservice, so perhaps this could make back to useEffect in App, but maybe it is working well as it is
            habitsservice.getAll().then((response) => {
              console.log("Successful:", response);
              setHabits(response);
              if (response && response.length) {
                console.log("setting selectedhabitbuttonid");
                setSelectedHabitButtonId(response[0].id);
              } else {
                console.log(
                  "habits array was empty, setting current habit id to 1"
                );
                setSelectedHabitButtonId(1);
              }
            });

            // console.log("window localstorage set: ", JSON.stringify(idToken));

            // Send token to your backend via HTTPS
            // could also just send token to the backend directly here I guess
          })
          .catch(function (error) {
            // Handle error
            console.log("error retrieving token: ", error);
          });

        setTheUser(user);
        console.log(
          "Auth state changed, user is: " + uid + " username: " + user.email
        );
        setsignedInUsername("Signed In: " + user.email);
        setshowComponent("Home");
        // ...
      } else {
        console.log("Auth state changed, Logged Out");
        setsignedInUsername("Logged Out");
        setTheUser(user);
        habitsservice.setToken(null);
        userservice.setToken(null);
        userservice.setRefreshToken(null);

        // Again, we may never use userToken in the App component, so this could be deleted
        setUserToken(null);

        // clearing habits array too:
        setHabits([]);

        window.localStorage.clear();
        console.log("window localstorage cleared: ", null);

        // User is signed out
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <header
          style={{
            backgroundColor: "#33333D",
            height: "3rem",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            color="whiteText"
            sx={{ fontWeight: "light" }}
            onClick={() => setshowComponent("Home")}
          >
            Home
          </Button>
          <Button
            color="whiteText"
            sx={{ fontWeight: "light" }}
            onClick={() => setshowComponent("SignUp")}
          >
            Sign Up
          </Button>
          <Button
            color="whiteText"
            sx={{ fontWeight: "light" }}
            onClick={() => setshowComponent("SignIn")}
          >
            Log In
          </Button>
          <Button
            color="whiteText"
            sx={{ fontWeight: "light" }}
            onClick={() => setshowComponent("DeleteUser")}
          >
            Profile
          </Button>
          <Button
            color="whiteText"
            sx={{ fontWeight: "light" }}
            onClick={() => setshowComponent("ForgotPassword")}
          >
            Forgot Password
          </Button>
          <Button
            color="whiteText"
            sx={{ fontWeight: "light" }}
            onClick={() => setshowComponent("ContactUs")}
            style={{ marginRight: "auto" }}
          >
            Contact Us
          </Button>
          
          <div style={{ marginRight: "8px", fontWeight: "300", color: "#fff" }}>
            {signedInUsername}
          </div>

          <Button
            fullWidth
            variant="contained"
            sx={{
              width: "10%",
              justifyContent: "center",
              float: "right",
              marginRight: "8px",
            }}
            onClick={() => {
              if (theUser) {
                signOut(auth)
                  .then(() => {
                    // Sign-out successful.
                    console.log("Sign out successful");
                  })
                  .catch((error) => {
                    // An error happened.
                  });
              } else {
                setshowComponent("SignIn");
              }
            }}
          >
            {theUser ? "Log Out" : "Sign In"}
          </Button>
        </header>
        <Box textAlign="center"></Box>
        <Switcher
          setshowComponent={setshowComponent}
          showComponent={showComponent}
          theUser={theUser}
        />
      </div>
    </ThemeProvider>
  );
}

export default FirebaseAuthenticationComponent;
