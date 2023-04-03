import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./Components/JoinGame";
import Register from "./Components/Register";
import NavBar from "./Components/NavBar";

function App() {
  const api_key = process.env.REACT_APP_API_KEY;
  const cookie = new Cookies();
  const token = cookie.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);

  function logout() {
    cookie.remove("userId");
    cookie.remove("token");
    cookie.remove("name");
    cookie.remove("username");
    cookie.remove("hashedpassword");
    client.disconnectUser();
    setIsAuth(false);
  }

  if (token) {
    client
      .connectUser(
        {
          id: cookie.get("userId"),
          name: cookie.get("name"),
          username: cookie.get("username"),
          hashedpassword: cookie.get("hashedpassword"),
        },
        token
      )
      .then(() => {
        setIsAuth(true);
      });
  }

  return (
    <>
      <NavBar logout={logout} isAuth={isAuth} />
      {isAuth ? (
        <>
          <Chat client={client}>
            <JoinGame />
          </Chat>
        </>
      ) : (
        <>
          <Register setIsAuth={setIsAuth} />
        </>
      )}
    </>
  );
}

export default App;
