import React, { useState } from "react";
import Header from "./components/Header/Header";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import "./App.css";

function App() {
  const [results, setResults] = useState(null); // Можна видалити цей стан, якщо результат не потрібен тут

  const handleRunTest = (result) => {
    console.log("Отримано результат:", result); // Логування отриманого результату
    // setResults(result); // Більше не потрібно оновлювати стан, якщо результат відображається в popup
  };

  return (
    <div className="App">
      <Header />
      <ControlPanel
        onRunTest={handleRunTest} // Передаємо функцію для оновлення результату
        loading={false}
      />
    </div>
  );
}

export default App;