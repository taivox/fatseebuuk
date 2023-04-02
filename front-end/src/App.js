import { Outlet } from "react-router-dom";
import Chats from "./components/main/Chats";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Menu from "./components/main/Menu";

function App() {
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
