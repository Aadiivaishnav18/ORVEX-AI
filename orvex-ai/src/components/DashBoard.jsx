import Header from "../pages/Header";
import SideBar from "./Sidebar";

const DashBoard = () => {
  return (
    <div>
      <div>
        <Header />
      </div>

      <div className="py-4 m-4 w-3/5 bg-amber-50 ">
        <SideBar />
      </div>
    </div>
  );
};

export default DashBoard;
