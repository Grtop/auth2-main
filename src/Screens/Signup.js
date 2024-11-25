import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const signUp = async () => {
    if (!username ||!email ||!password ||!image) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    const mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat)) {
      alert("Пожалуйста, введите корректный адрес электронной почты");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          image,
        }),
      });

      if (response.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        navigate("/");
      } else {
        alert("Ошибка регистрации");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    };
  };

  const handleCircleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = (event) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    };
  };

  return (
    <div style={rootDiv}>
      {image? (
        <div style={imageContainer}>
          <img
            src={image}
            style={imageStyle}
            alt=""
            width={150}
            height={150}
            onClick={handleImageClick}
          />
        </div>
      ) : (
        <div style={imageContainer}>
          <div
            style={{
              borderRadius: "50%",
              width: 150,
              height: 150,
              border: "1px solid grey",
              cursor: "pointer",
              backgroundImage: "linear-gradient(to bottom, #ccc, #ccc)",
              backgroundSize: "100% 0%",
              backgroundPosition: "bottom",
              transition: "background-position 0.5s ease-in-out",
            }}
            onClick={handleCircleClick}
          />
        </div>
      )}
      {!image && (
        <div style={{ color: "yellow", margin: 10, fontSize: 14 }}>
          Пожалуйста, выберите изображение
        </div>
      )}
      <input
        style={input}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
        type="text"
      />
      <input
        style={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Электронная почта"
        type="text"
      />
      <input
        style={input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />
      <button style={button} onClick={signUp}>
        Зарегистрироваться
      </button>
    </div>
  );
};

const rootDiv = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center', 
  height: '100vh',
  backgroundColor: 'rgba(63, 70, 82, 0.5)',
  width: '100vw',
  position: 'relative', 
  top: '0px', 
  right: '0px', 
  padding: 0,
};

const input = {
  width: 300,
  padding: 10,
  margin: 10,
  borderRadius: 10,
  outline: "none",
  border: "2px solid grey",
  fontSize: 17,
};

const button = {
  width: 325,
  padding: 10,
  borderRadius: 10,
  margin: 10,
  cursor: "pointer",
  fontSize: 17,
  color: "white",
  backgroundColor: "#9D27CD",
  border: "none",
};

const imageStyle = {
  width: 150,
  height: 150,
  border: "none",
  borderRadius: "50%",
  margin: 20,
  objectFit: "cover",
};

const imageContainer = {
  position: "relative",
};

export default SignUp;
