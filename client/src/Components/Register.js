import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import Cookies from "universal-cookie";

function Register({ setIsAuth }) {
  const cookie = new Cookies();
  const [user, setuser] = useState({ name: "", username: "", password: "" });
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [form, setForm] = useState(1);

  useEffect(() => {
    setuser({ name: "", username: "", password: "" });
    setusername("");
    setpassword("");
  }, [form]);

  function login(e) {
    e.preventDefault();

    Axios.post(process.env.REACT_APP_LOGIN_ROUTE, { username, password })
      .then((res) => {
        const { token, userId, name, username, message } = res.data;

        if (message === "") {
          cookie.set("token", token);
          cookie.set("userId", userId);
          cookie.set("name", name);
          cookie.set("username", username);
          setIsAuth(true);
        } else {
          alert(message);
        }
      })
      .catch((error) => {
        return error;
      });
  }

  function Signup(e) {
    e.preventDefault();
    Axios.post(process.env.REACT_APP_SIGNUP_ROUTE, user)
      .then((res) => {
        const { token, userId, name, username, hashedpassword, message } = res.data;

        if (message === "") {
          cookie.set("token", token);
          cookie.set("userId", userId);
          cookie.set("name", name);
          cookie.set("username", username);
          cookie.set("hashedpassword", hashedpassword);
          setIsAuth(true);
        } else {
          alert(message);
        }
      })
      .catch((error) => {
        return error;
      });
  }

  return (
    <div className="my-4 card w-75 mx-auto">
      <Form className="d-flex justify-content-center">
        <Button
          className="w-50"
          variant="primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            setForm(1);
          }}
        >
          Sign Up
        </Button>
        <Button
          className="w-50"
          variant="primary"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            setForm(2);
          }}
        >
          Login
        </Button>
      </Form>
      {form === 1 ? (
        <Form className="my-2 mx-2">
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              value={user.name}
              onChange={(e) => setuser({ ...user, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={user.username}
              onChange={(e) => setuser({ ...user, username: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setuser({ ...user, password: e.target.value })}
            />
          </Form.Group>
          <Button
            className="w-20 mx-auto"
            variant="primary"
            type="submit"
            onClick={Signup}
          >
            Sign Up
          </Button>
        </Form>
      ) : (
        <Form className="my-2 mx-2">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </Form.Group>
          <Button
            className="w-20 mx-auto"
            variant="primary"
            type="submit"
            onClick={login}
          >
            Login
          </Button>
        </Form>
      )}
    </div>
  );
}

export default Register;
