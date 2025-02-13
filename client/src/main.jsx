import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { useLoadUserQuery } from "./features/api/authApi.js";
import LoadingSpinner from "./components/UI/LoadingSpinner.jsx";

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner /> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <Custom>
      <App />
    </Custom>
  </Provider>
);
