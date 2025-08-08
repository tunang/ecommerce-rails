import { Provider, useDispatch } from "react-redux";
import AppRoutes from "./routes";
import { initializeAuth } from "./store/slices/authSlice";
import { useEffect } from "react";
import { store } from "./store";

function AuthWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize authentication on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <AuthWrapper />
    </Provider>
  );
} 

export default App;
