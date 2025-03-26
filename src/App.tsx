import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes/router";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Provider store={store}>
      <main className="w-screen flex flex-row">
        <ToastContainer />
        <AppRoutes />
      </main>
    </Provider>
  );
}

export default App;
