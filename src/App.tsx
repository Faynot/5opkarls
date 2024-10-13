import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [text, setText] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    // Подключаемся к WebSocket серверу
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = async (event) => {
      // Проверяем тип данных. Если это Blob, преобразуем его в строку
      if (typeof event.data === 'string') {
        setText(event.data);  // Если это строка, просто присваиваем
      } else if (event.data instanceof Blob) {
        const textFromBlob = await event.data.text();  // Преобразуем Blob в строку
        setText(textFromBlob);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // Отправляем новое значение текста как строку на сервер
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(newText); // Отправляем строку
    }
  };

  return (
    <div className="App">
      <textarea
        value={text}
        onChange={handleTextChange}
        rows={10}
        cols={50}
        placeholder="Введите текст, который будет на экране у кирилкина..."
      />
    </div>
  );
}

export default App;
