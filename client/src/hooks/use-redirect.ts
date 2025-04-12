import { useNavigate } from "react-router-dom";

function UseRedirect(path: string) {
  const navigate = useNavigate();

  function redirect() {
    navigate(path);
  }

  return redirect;
}

export default UseRedirect;
