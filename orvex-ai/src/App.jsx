import { Provider } from "react-redux";
import Browse from "./pages/Browse";
import appStore from "./utils/appStore";

const App = () => {
  return (
    <Provider store={appStore}>
      <div className="flex min-h-screen w-full flex-col bg-black text-white">
        <Browse />
      </div>
    </Provider>
  );
};

export default App;