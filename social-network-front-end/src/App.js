import { Outlet } from "react-router-dom";
import Chats from "./components/Chats";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Menu from "./components/Menu";

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
