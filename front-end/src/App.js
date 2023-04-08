import { Outlet, useNavigate } from "react-router-dom";
import Chats from "./components/main/Chats";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Menu from "./components/main/Menu";
import { useEffect, useState } from "react";


function App() {
  const [jwtToken, setJwtToken] = useState("")
  
  const navigate = useNavigate()
  
  useEffect(() =>{
    if (jwtToken !== ""){
      navigate("/login")
      return
    }
  
  },[])

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
          <Menu />
          <div className="col-md-6">
            <Outlet />
          </div>
          <Chats />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
