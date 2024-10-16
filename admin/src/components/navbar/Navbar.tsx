import "./navbar.scss";
import { useAuth } from "../../context/AuthProvider"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <div className="navbar">
      <div className="logo">
        <img src="../../../public/kcinema.png" alt="" />
        <span>K. Cinema</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
            alt=""
          />
          <span>Admin</span>
        </div>
        <img style={{cursor: "pointer"}} onClick={handleLogout} src="/logout.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
