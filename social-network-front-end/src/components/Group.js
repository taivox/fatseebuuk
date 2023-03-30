import { Outlet, useParams } from "react-router-dom"
import Footer from "./common/Footer";
import Header from "./common/Header";
import GroupHeader from "./group/GroupHeader";
import GroupMenu from "./group/GroupMenu";
import Chats from "./main/Chats";

function Group(){
    // let {id} = useParams()

    return (
        <div>
          <Header />
          <GroupHeader/>
          <div className="container">
            <div className="row">
              <GroupMenu />
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

export default Group