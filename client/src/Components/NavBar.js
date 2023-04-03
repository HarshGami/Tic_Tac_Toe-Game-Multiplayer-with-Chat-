import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Cookies from "universal-cookie";

function NavBar({ logout, isAuth }) {
  const cookie = new Cookies();
  const username = cookie.get("username");

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">Tic Tac Toe</Navbar.Brand>
        {isAuth === true && (
          <>
            <div>{username}</div>
            <Button variant="primary" type="submit" onClick={logout}>
              Log Out
            </Button>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
