import React from "react";
import "./Header.css";

function Header() {
    return (
        <header className="header">
            <h1>Інструмент тестування продуктивності WebAssembly та JavaScript у веб-застосунку</h1>
            <p>Оберіть задачу та виконайте її в різних середовищах: WASM або JS для порівняння продуктивності в тій чи іншій задачі.</p>
        </header>
    );
}

export default Header;
