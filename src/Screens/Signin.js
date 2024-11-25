import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  //const [imageFile, setImageFile] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  //const [accounts, setAccounts] = useState(null);

  const verifyImage = async () => {
    if (!image) return false;

    try {
      const response = await fetch('http://localhost:5000/verify-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, image }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Изображение подтверждено');
        return true;
      } else {
        alert(result.message || 'Ошибка проверки изображения');
        return false;
      }
    } catch (error) {
      console.error('Ошибка при проверке изображения:', error);
      alert('Ошибка при подключении к серверу');
      return false;
    }
  };

  const login = async () => {
    if (!email ||!password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const isImageVerified = await verifyImage();
    if (!isImageVerified) return;

    try {
      localStorage.setItem('email', email);
      navigate(`/home`);
    } catch (error) {
      alert('Ошибка авторизации');
    }
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = (event) => {
      if (event.target.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    };
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div style={rootDiv}>
      {image? (
        <div style={imageContainer}>
          <img
            src={image}
            alt=""
            width={150}
            height={150}
            onClick={handleImageClick}
            style={imageStyle}
          />
        </div>
      ) : (
        <div style={imageContainer}>
          <div
            style={{
              borderRadius: '50%',
              width: 150,
              height: 150,
              border: '1px solid grey',
              cursor: 'pointer',
              backgroundImage: 'linear-gradient(to bottom, #ccc, #ccc)',
              backgroundSize: '100% 0%',
              backgroundPosition: 'bottom',
              transition: 'background-position 0.5s ease-in-out',
            }}
            onClick={handleImageClick}
          />
        </div>
      )}
      {!image && (
        <div style={{ color: 'yellow', margin: 15, fontSize: 16 }}>
          Пожалуйста, выберите изображение
        </div>
      )}
      <input
        style={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="text"
      />
      <input
        style={input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        type="password"
      />
      <input
        style={input}
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
        type="text"
      />
      <button style={button} onClick={login}>
        Войти
      </button>

      <span
        style={{ cursor: 'pointer' }}
        onClick={() => {
          navigate('/Signup');
        }}
      >
        Создать новую учетную запись
      </span>
    </div>
  );
}

const rootDiv = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start', 
  height: '85vh',
  backgroundColor: 'rgba(63, 70, 82, 0.5)',
  width: '30vw',
  position: 'absolute', 
  top: '0px', 
  right: '0px', 
  padding: 0,
};

const input = {
  width: 300,
  padding: 10,
  margin: 10,
  borderRadius: 10,
  outline: 'none',
  border: '2px solid grey',
  fontSize: 16,
};

const imageStyle = {
  width: 150,
  height: 150,
  border: 'none',
  borderRadius: '50%',
  margin: 15,
  objectFit: 'cover',
};

const imageContainer = {
  position: 'elative',
};

const button = {
  width: 325,
  padding: 10,
  borderRadius: 10,
  margin: 10,
  cursor: 'pointer',
  fontSize: 16,
  color: 'white',
  backgroundColor: '#9D27CD',
  border: 'none',
};