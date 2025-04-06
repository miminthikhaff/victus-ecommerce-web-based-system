import { React, useEffect, useRef, useState } from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import { Link } from "react-router-dom";
import "./LoginSignup.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../more/Loader";
import { clearErrors, login, registerUser } from "../../actions/userAction";
import MetaData from "../../more/Metadata";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = ({ history, location }) => {
  const dispatch = useDispatch();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("/profile.png");

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const uploadToCloudinary = async (file) => {
    if (!file) {
      console.error("❌ No file provided for upload.");
      return { avatarUrl: "", avatarPublicId: "" };
    }

    console.log("🔹 Uploading file:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user_avatars"); // Ensure this exists

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dv2e3rocm/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Upload failed:", data.error?.message);
        return { avatarUrl: "", avatarPublicId: "" };
      }

      console.log("✅ Cloudinary Upload Success:", data.secure_url);

      // Return both avatarUrl and avatarPublicId
      return {
        avatarUrl: data.secure_url,
        avatarPublicId: data.public_id, // Add this line
      };
    } catch (error) {
      console.error("❌ Error uploading avatar:", error);
      return { avatarUrl: "", avatarPublicId: "" };
    }
  };

  const registerSubmit = async (e) => {
    e.preventDefault();

    console.log("🔹 User State Before Submit:", user);
    console.log("🔹 Avatar Before Submit:", avatar);

    if (!name || !email || !password) {
      console.error("❌ Missing required fields.");
      return;
    }

    let avatarUrl = "https://default-avatar-url.com"; // Default avatar URL
    let avatarPublicId = ""; // Default empty string

    if (avatar instanceof File) {
      console.log("🔹 Avatar Before Upload:", avatar); // 👈 Place this here for debugging
      console.log("File Type:", avatar?.type); // 👈 Logs the file type
      console.log("File Size:", avatar?.size); // 👈 Logs the file size

      const uploadData = await uploadToCloudinary(avatar);
      avatarUrl = uploadData.avatarUrl;
      avatarPublicId = uploadData.avatarPublicId;

      if (!avatarUrl) {
        console.error("❌ Avatar upload failed.");
        return;
      }
    }

    // Construct the payload
    const payload = {
      name: user.name,
      email: user.email,
      password: user.password,
      avatarUrl: avatarUrl,
      avatarPublicId: avatarPublicId, // Use avatarPublicId here
    };

    console.log("🔹 Payload Being Sent:", payload);

    // Send the request to the server
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/v2/registration`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Registration failed:", data.message);
      return;
    }

    console.log("✅ Registration Successful:", data);
    // Proceed with your success actions here, like redirecting the user or showing a success message
  };

  const submitRegistrationForm = ({ avatarUrl, avatarPublicId }) => {
    const payload = {
      name,
      email,
      password,
      avatarUrl,
      avatarPublicId,
    };

    console.log("🔹 Payload Being Sent:", payload);
    dispatch(registerUser(payload));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.readyState === 2) {
            setAvatarPreview(reader.result); // Base64 preview
            setAvatar(file); // Store actual File object
          }
        };

        reader.readAsDataURL(file); // Convert file to base64 for preview
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isAuthenticated) {
      history.push(redirect);
    }
  }, [dispatch, error, history, isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Login or Signup" />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forgot Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
                <Link to="/">
                  <span>Login as a guest ?</span>
                </Link>
              </form>

              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  {/* Only render the preview image if there's a valid avatarPreview */}
                  {avatarPreview && (
                    <img src={avatarPreview} alt="Avatar Preview" />
                  )}

                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
          <div></div>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      )}
    </>
  );
};

export default LoginSignup;
