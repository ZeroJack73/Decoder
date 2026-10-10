# DES-CIFRADOR

> **Suite interactiva de criptografía clásica y seguridad web moderna con soporte nativo para el alfabeto español (Ñ).**

![Logo DES-CIFRADOR](assets/logo.svg)

---

## ¿Qué es DES-CIFRADOR?

**DES-CIFRADOR** es una aplicación web interactiva diseñada para explorar y comprender los principios fundamentales de la criptografía clásica y la seguridad de contraseñas. Creada originalmente como proyecto académico de matemáticas en la **Universidad del Valle de Guatemala**, combina algoritmos clásicos, análisis de frecuencias en idioma español y una experiencia de usuario cyberpunk futurista.

---

## Funcionalidades Principales

### 1. Cifrado César (Soporte Español Ñ)
- **Alfabeto completo de 27 letras**: `A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z`.
- **Slider interactivo de desplazamiento**: Ajusta el desplazamiento de `-26` a `+26` en tiempo real.
- **Modo en vivo (Live Mode)**: Cifra automáticamente a medida que escribes o mueves el slider.
- **Atajos rápidos**: Presets de un clic para César clásico (+3), ROT13 (+13), etc.
- **Efecto Hacker / Matrix Scramble**: Animación visual de decodificación carácter por carácter en verde neón.

### 2. Rueda de Cifrado Interactiva & Criptoanálisis Heurístico
- Rueda visual animada de doble disco (fijo y móvil).
- **Auto-detección con `spanishScore()`**: Analiza los 27 desplazamientos posibles y sugiere automáticamente el shift más probable según la frecuencia de palabras y vocales en español.

### 3. Código Morse
- Codificación bidireccional Texto ⇄ Código Morse (con soporte para Ñ y vocales acentuadas).

### 4. Suite Criptográfica Rápida
- **Base64**: Codificación y decodificación compatible con UTF-8.
- **ROT13**: Algoritmo de rotación rápida.
- **Binario & Hexadecimal**: Conversión inmediata con espaciado por bytes (8 bits).

### 5. Mini-Juego de Retos: "Descifra el Código"
- Desafíos aleatorios con citas célebres y frases cifradas.
- Sistema de pistas, contador de puntos y rachas de victorias.
- Persistencia de puntuación máxima mediante `localStorage`.

### 6. Compartir Mensaje Secreto con Enlace & QR
- Generación instantánea de enlaces con hash URL (`#msg=...&shift=...`).
- Código QR dinámico para escanear y descifrar directamente desde el móvil.

---

## Estructura del Proyecto

```
Decoder/
├── Index.html          # Interfaz principal semántica y accesible
├── css/
│   └── styles.css      # Sistema de diseño cyberpunk, animaciones y glassmorphism
├── js/
│   └── app.js          # Lógica criptográfica, rueda interactiva, juego y eventos
├── assets/
│   └── logo.svg        # Logo vectorial animado (candado + rueda de cifrado)
└── README.md           # Documentación completa del proyecto
```

---

## Requisitos y Uso

1. No requiere instalación de servidores ni librerías externas (Zero Dependencies).
2. Simplemente abre `Index.html` en cualquier navegador web moderno (Edge, Chrome, Firefox, Safari).
3. Para compartir un mensaje secreto, haz clic en el botón **Compartir** y envía el enlace o QR generado.

---

## Créditos & Licencia

Desarrollado por estudiantes de la **Universidad del Valle de Guatemala**.
Proyecto libre para fines educativos y de divulgación sobre ciberseguridad.
