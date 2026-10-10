/* ===================================================
   DES-CIFRADOR — Lógica Principal
   =================================================== */

/* ===== 1. SISTEMA DE TOAST NOTIFICATIONS ===== */
var TOAST_ICONS = {
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
};

function showToast(message, type) {
  type = type || "info";
  var container = document.getElementById("toastContainer");
  if (!container) return;
  var toast = document.createElement("div");
  toast.className = "toast " + type;

  var iconSvg = TOAST_ICONS[type] || TOAST_ICONS.info;

  toast.innerHTML =
    '<span class="toast-icon">' + iconSvg + '</span>' +
    '<span class="toast-message">' + message + '</span>';

  container.appendChild(toast);
  setTimeout(function() {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

/* ===== 2. EFECTO HACKER / MATRIX SCRAMBLE ===== */
var scrambleChars = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}";

function scrambleText(element, finalString, callback) {
  if (!element) return;
  element.classList.add("scrambling");

  var length = finalString.length;
  var iterations = 0;
  var maxIterations = Math.min(18, length * 2 + 6);
  var currentArray = new Array(length).fill("");

  var interval = setInterval(function() {
    iterations++;
    for (var i = 0; i < length; i++) {
      if (finalString[i] === " " || finalString[i] === "\n") {
        currentArray[i] = finalString[i];
      } else if (iterations / maxIterations > (i / length)) {
        currentArray[i] = finalString[i];
      } else {
        var rand = Math.floor(Math.random() * scrambleChars.length);
        currentArray[i] = scrambleChars[rand];
      }
    }

    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
      element.value = currentArray.join("");
    } else {
      element.textContent = currentArray.join("");
    }

    if (iterations >= maxIterations) {
      clearInterval(interval);
      if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
        element.value = finalString;
      } else {
        element.textContent = finalString;
      }
      element.classList.remove("scrambling");
      if (callback) callback();
    }
  }, 25);
}

/* ===== 3. LÓGICA CIFRADO CÉSAR CON Ñ ===== */
var AB = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";

function isLowerCase(ch) {
  return (ch >= "a" && ch <= "z") || ch === "ñ";
}

function shiftChar(ch, shift) {
  if (!ch) return ch;
  var up = ch.toUpperCase();
  var idx = AB.indexOf(up);
  if (idx === -1) return ch;
  var len = AB.length;
  var n = (idx + (shift % len) + len) % len;
  var out = AB[n];
  return isLowerCase(ch) ? out.toLowerCase() : out;
}

function cifrar(texto, shift) {
  return Array.from(texto).map(function(c) { return shiftChar(c, shift); }).join("");
}

function getShiftValue() {
  var slider = document.getElementById("shiftSlider");
  var input = document.getElementById("desp");
  if (slider) return parseInt(slider.value) || 0;
  if (input) return parseInt(input.value) || 0;
  return 0;
}

function setShiftValue(val) {
  var slider = document.getElementById("shiftSlider");
  var input = document.getElementById("desp");
  var badge = document.getElementById("shiftValBadge");
  if (slider) slider.value = val;
  if (input) input.value = val;
  if (badge) badge.textContent = (val >= 0 ? "+" : "") + val;
}

function setPresetShift(val) {
  setShiftValue(val);
  liveUpdateCesar();
}

function cesarEncriptar(animated) {
  var t = document.getElementById("texto").value || "";
  var d = getShiftValue();
  var target = document.getElementById("salidaCesar");
  var res = cifrar(t, d);

  if (animated !== false) {
    scrambleText(target, res);
  } else {
    target.textContent = res;
  }
}

function cesarDesencriptar(animated) {
  var t = document.getElementById("texto").value || "";
  var d = getShiftValue();
  var target = document.getElementById("salidaCesar");
  var res = cifrar(t, -d);

  if (animated !== false) {
    scrambleText(target, res);
  } else {
    target.textContent = res;
  }
}

function liveUpdateCesar() {
  var live = document.getElementById("liveModeToggle");
  if (!live || live.checked) {
    cesarEncriptar(false);
  }
}

/* ===== 4. DETECCIÓN AUTOMÁTICA (spanishScore) ===== */
function spanishScore(txt) {
  var words = [" EL ", " LA ", " QUE ", " DE ", " Y ", " EN ", " LOS ", " LAS ", " POR ", " PARA ", " CON ", " NO ", " UN ", " UNA ", " ES ", " DEL "];
  var U = " " + txt.toUpperCase() + " ";
  var s = 0;
  for (var i = 0; i < words.length; i++) {
    if (U.indexOf(words[i]) !== -1) s += 2;
  }
  var matches = U.match(/[AEIOUÁÉÍÓÚ]/g);
  s += (matches ? matches.length : 0) / 40;
  return s;
}

function detectBestShift(cipherText) {
  var best = { shift: 0, score: -1, text: cipherText };
  for (var s = 0; s < AB.length; s++) {
    var candidate = cifrar(cipherText, -s);
    var score = spanishScore(candidate);
    if (score > best.score) {
      best = { shift: s, score: score, text: candidate };
    }
  }
  return best;
}

/* ===== 5. RUEDA CÉSAR INTERACTIVA (Dimensiones y Radio Originales) ===== */
var currentInteractiveShift = 0;

function generateWheelLetters(elementId, isMoving) {
  var wheel = document.getElementById(elementId);
  if (!wheel) return;
  wheel.innerHTML = "";
  var len = AB.length;
  var angleStep = 360 / len;
  var radius = isMoving ? 123 : 159;

  for (var i = 0; i < len; i++) {
    var letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = isMoving ? AB[i].toLowerCase() : AB[i];

    var angle = i * angleStep;
    var angleRad = (angle - 90) * (Math.PI / 180);
    var x = radius * Math.cos(angleRad);
    var y = radius * Math.sin(angleRad);

    letter.style.left = "calc(50% + " + x + "px)";
    letter.style.top = "calc(50% + " + y + "px)";
    letter.style.transform = "translate(-50%, -50%) rotate(" + angle + "deg)";

    wheel.appendChild(letter);
  }
}

function openInteractiveModal() {
  var fixedWheel = document.getElementById("fixedWheel");
  if (fixedWheel && fixedWheel.innerHTML === "") {
    generateWheelLetters("fixedWheel", false);
    generateWheelLetters("movingWheel", true);
  }

  var cipherText = document.getElementById("texto").value || "";
  document.getElementById("encryptedInput").value = cipherText;

  var best = detectBestShift(cipherText);
  currentInteractiveShift = best.shift;
  document.getElementById("currentShift").value = currentInteractiveShift;

  var badge = document.getElementById("shiftBadge");
  if (badge) {
    if (best.score > 0 && cipherText.trim().length > 0) {
      badge.textContent = "Sugerencia: shift " + best.shift;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }
  }

  updateWheelAndDecryption();
  document.getElementById("interactiveModal").classList.add("show");
}

function closeInteractiveModal() {
  document.getElementById("interactiveModal").classList.remove("show");
}

function adjustShift(direction) {
  var len = AB.length;
  currentInteractiveShift = (currentInteractiveShift + direction + len) % len;
  document.getElementById("currentShift").value = currentInteractiveShift;
  updateWheelAndDecryption();
}

function updateWheelAndDecryption() {
  var shift = currentInteractiveShift;
  var movingWheel = document.getElementById("movingWheel");
  var encryptedText = document.getElementById("encryptedInput").value || "";

  var angleStep = 360 / AB.length;
  if (movingWheel) {
    movingWheel.style.transform = "rotate(" + (-(shift * angleStep)) + "deg)";
  }
  document.getElementById("decryptedOutput").textContent = cifrar(encryptedText, -shift);
}

function copyDecrypted() {
  var textToCopy = document.getElementById("decryptedOutput").textContent || "";
  if (textToCopy === "--" || !textToCopy) {
    showToast("No hay resultado para copiar", "error");
    return;
  }
  copyToClipboard(textToCopy);
}

/* ===== 6. MÓDULO MORSE ===== */
var MORSE_CODE = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
  "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "Ñ": "--.--", "O": "---", "P": ".--.", "Q": "--.-",
  "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--",
  "X": "-..-", "Y": "-.--", "Z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.",
  " ": "/"
};

var REVERSE_MORSE = {};
for (var key in MORSE_CODE) {
  REVERSE_MORSE[MORSE_CODE[key]] = key;
}

function morseEncode(text) {
  return Array.from(text.toUpperCase())
    .map(function(char) {
      if (char === "Á") char = "A";
      if (char === "É") char = "E";
      if (char === "Í") char = "I";
      if (char === "Ó") char = "O";
      if (char === "Ú") char = "U";
      return MORSE_CODE[char] || char;
    })
    .join(" ");
}

function morseDecode(morse) {
  var tokens = morse.trim().split(/\s+/);
  return tokens
    .map(function(token) {
      if (token === "/") return " ";
      return REVERSE_MORSE[token] || "?";
    })
    .join("");
}

function convertirMorse() {
  var txt = document.getElementById("textoMorse").value || "";
  var res = morseEncode(txt);
  scrambleText(document.getElementById("salidaMorse"), res);
}

function decodificarMorse() {
  var morse = document.getElementById("textoMorse").value || "";
  var res = morseDecode(morse);
  scrambleText(document.getElementById("salidaMorse"), res);
}

/* ===== 7. BASE64, ROT13, BINARIO Y HEX ===== */
function convertirBase64() {
  var t = document.getElementById("textoOtros").value || "";
  try {
    var b64 = btoa(unescape(encodeURIComponent(t)));
    scrambleText(document.getElementById("salidaOtros"), b64);
  } catch(e) {
    showToast("Error al codificar Base64: " + e.message, "error");
  }
}

function decodificarBase64() {
  var t = document.getElementById("textoOtros").value || "";
  try {
    var res = decodeURIComponent(escape(atob(t)));
    scrambleText(document.getElementById("salidaOtros"), res);
  } catch(e) {
    showToast("Entrada Base64 no válida", "error");
  }
}

function convertirROT13() {
  var t = document.getElementById("textoOtros").value || "";
  var res = cifrar(t, 13);
  scrambleText(document.getElementById("salidaOtros"), res);
}

function convertirBinario() {
  var t = document.getElementById("salidaCesar").textContent;
  if (!t || t === "--") {
    t = document.getElementById("texto").value || "";
  }
  var out = Array.from(t)
    .map(function(ch) { return ch.charCodeAt(0).toString(2).padStart(8, "0"); })
    .join(" ");
  scrambleText(document.getElementById("salidaBin"), out);
}

function convertirHex() {
  var t = document.getElementById("salidaCesar").textContent;
  if (!t || t === "--") {
    t = document.getElementById("texto").value || "";
  }
  var out = Array.from(t)
    .map(function(ch) { return ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"); })
    .join(" ");
  scrambleText(document.getElementById("salidaHex"), out);
}

/* ===== 8. MINI-JUEGO "DESCIFRA EL CÓDIGO" ===== */
var CHALLENGES = [
  { text: "HOLA MUNDO", hint: "El saludo tradicional de todo programador" },
  { text: "CODIGO SECRETO", hint: "Lo que buscas descifrar en este momento" },
  { text: "UNIVERSIDAD DEL VALLE", hint: "Alma máter del proyecto" },
  { text: "SEGURIDAD INFORMATICA", hint: "La ciencia de proteger datos" },
  { text: "JULIO CESAR", hint: "Emperador romano inventor de este cifrado" },
  { text: "MATEMATICAS Y CRIPTOGRAFIA", hint: "La base de los algoritmos de encriptación" },
  { text: "NO HAY LUGAR COMO EL HOGAR", hint: "Frase clásica del Mago de Oz" },
  { text: "LA PACIENCIA ES CLAVE", hint: "Consejo para descifrar misterios" },
  { text: "HACKER DE NEON", hint: "Estilo cibernético futurista" },
  { text: "CONEXION ESTABLECIDA", hint: "Mensaje de terminal exitoso" },
  { text: "ENCRIPTA TUS PASSWORDS", hint: "Regla número uno de ciberseguridad" }
];

var currentGame = {
  plainText: "",
  cipherText: "",
  shift: 0,
  hint: "",
  score: 0,
  streak: 0
};

function initChallengeGame() {
  var savedScore = localStorage.getItem("descifrador_score");
  var savedStreak = localStorage.getItem("descifrador_streak");
  if (savedScore) currentGame.score = parseInt(savedScore) || 0;
  if (savedStreak) currentGame.streak = parseInt(savedStreak) || 0;

  updateGameStats();
  nextChallenge();
}

function nextChallenge() {
  var randomIdx = Math.floor(Math.random() * CHALLENGES.length);
  var item = CHALLENGES[randomIdx];
  var shift = Math.floor(Math.random() * 25) + 1; // 1 to 25

  currentGame.plainText = item.text;
  currentGame.shift = shift;
  currentGame.hint = item.hint;
  currentGame.cipherText = cifrar(item.text, shift);

  var cipherEl = document.getElementById("gameCipherBox");
  if (cipherEl) {
    scrambleText(cipherEl, currentGame.cipherText);
  }

  var hintEl = document.getElementById("gameHintText");
  if (hintEl) {
    hintEl.textContent = "Pista: " + currentGame.hint;
  }

  var input = document.getElementById("gameGuessInput");
  if (input) {
    input.value = "";
    input.focus();
  }

  var banner = document.getElementById("gameWinBanner");
  if (banner) banner.classList.remove("show");
}

function checkChallengeGuess() {
  var input = document.getElementById("gameGuessInput");
  if (!input) return;
  var guess = input.value.trim().toUpperCase();

  if (!guess) {
    showToast("Escribe tu intento antes de comprobar", "error");
    return;
  }

  if (guess === currentGame.plainText) {
    currentGame.score += 100 + (currentGame.streak * 20);
    currentGame.streak += 1;

    localStorage.setItem("descifrador_score", currentGame.score);
    localStorage.setItem("descifrador_streak", currentGame.streak);
    updateGameStats();

    var banner = document.getElementById("gameWinBanner");
    if (banner) {
      banner.innerHTML = "<strong>¡CORRECTO!</strong> El desplazamiento era <strong>+" + currentGame.shift + "</strong>. +100 Puntos!";
      banner.classList.add("show");
    }

    showToast("¡Excelente trabajo, código descifrado!", "success");

    setTimeout(function() {
      nextChallenge();
    }, 2400);
  } else {
    currentGame.streak = 0;
    localStorage.setItem("descifrador_streak", 0);
    updateGameStats();
    showToast("Respuesta incorrecta, sigue intentando", "error");
  }
}

function updateGameStats() {
  var scoreEl = document.getElementById("gameScoreVal");
  var streakEl = document.getElementById("gameStreakVal");
  if (scoreEl) scoreEl.textContent = currentGame.score;
  if (streakEl) streakEl.textContent = currentGame.streak;
}

/* ===== 9. COMPARTIR MENSAJE SECRETO (URL Hash & QR) ===== */
function openShareModal() {
  var cipherText = document.getElementById("salidaCesar").textContent;
  if (!cipherText || cipherText === "--") {
    cipherText = cifrar(document.getElementById("texto").value || "HOLA MUNDO", getShiftValue());
  }
  var shift = getShiftValue();

  var baseUrl = window.location.href.split("#")[0];
  var shareUrl = baseUrl + "#msg=" + encodeURIComponent(cipherText) + "&shift=" + shift;

  document.getElementById("shareUrlInput").value = shareUrl;

  renderInlineQR("shareQrBox", shareUrl);

  document.getElementById("shareModal").classList.add("show");
}

function closeShareModal() {
  document.getElementById("shareModal").classList.remove("show");
}

function copyShareLink() {
  var url = document.getElementById("shareUrlInput").value;
  copyToClipboard(url, function() {
    showToast("Enlace secreto copiado al portapapeles", "success");
  });
}

function renderInlineQR(containerId, text) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var qrImgUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(text);
  container.innerHTML = '<img src="' + qrImgUrl + '" alt="Código QR del mensaje" style="width:160px;height:160px;display:block;border-radius:6px" onerror="this.parentNode.innerHTML=\'<em>Escanea o copia el enlace</em>\'" />';
}

function checkUrlHashPayload() {
  var hash = window.location.hash;
  if (!hash || hash.indexOf("msg=") === -1) return;

  try {
    var params = new URLSearchParams(hash.substring(1));
    var msg = params.get("msg");
    var shift = parseInt(params.get("shift")) || 0;

    if (msg) {
      document.getElementById("texto").value = msg;
      setShiftValue(shift);
      document.getElementById("salidaCesar").textContent = cifrar(msg, -shift);

      showToast("Mensaje secreto cargado con éxito", "success");
    }
  } catch(e) {
    console.warn("Hash error:", e);
  }
}

/* ===== 10. COPIADO GENERAL ===== */
var ICON_CHECK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"' +
  ' stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;color:limegreen">' +
  '<polyline points="20 6 9 17 4 12"></polyline></svg>';

function copyAll(type, btn) {
  var txt = "";
  if (type === "bin")      txt = document.getElementById("salidaBin").value || "";
  else if (type === "hex") txt = document.getElementById("salidaHex").value || "";
  else if (type === "morse") txt = document.getElementById("salidaMorse").value || "";
  else if (type === "otros") txt = document.getElementById("salidaOtros").value || "";
  else                     txt = document.getElementById("salidaCesar").textContent || "";

  if (!txt || txt === "--") {
    showToast("No hay contenido para copiar", "error");
    return;
  }

  copyToClipboard(txt, function() {
    if (btn) {
      var orig = btn.__origHTML || btn.innerHTML;
      if (!btn.__origHTML) btn.__origHTML = orig;
      btn.innerHTML = ICON_CHECK;
      setTimeout(function() { btn.innerHTML = btn.__origHTML; }, 1400);
    }
    showToast("Copiado al portapapeles", "success");
  });
}

function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(function() {
        if (onSuccess) onSuccess();
        else showToast("Copiado al portapapeles", "success");
      })
      .catch(function() { fallbackCopy(text, onSuccess); });
  } else {
    fallbackCopy(text, onSuccess);
  }
}

function fallbackCopy(text, onSuccess) {
  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var ok = document.execCommand("copy");
    document.body.removeChild(ta);
    if (ok) {
      if (onSuccess) onSuccess();
      else showToast("Copiado al portapapeles", "success");
    } else {
      showToast("No se pudo copiar", "error");
    }
  } catch(e) {
    showToast("Error al copiar: " + e.message, "error");
  }
}

/* ===== 11. CONTROL DE PESTAÑAS Y MENÚ ===== */
function switchTab(tabId, btn) {
  var tabs = document.querySelectorAll(".tab-content");
  var btns = document.querySelectorAll(".tab-btn");

  tabs.forEach(function(t) { t.classList.remove("active"); });
  btns.forEach(function(b) { b.classList.remove("active"); });

  var targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add("active");
  if (btn) btn.classList.add("active");

  if (tabId === "tabGame") {
    if (!currentGame.plainText) initChallengeGame();
  }
}

function toggleMenu() {
  document.getElementById("menuModal").classList.toggle("show");
  document.getElementById("hamburgerBtn").classList.toggle("open");
}

function closeMenu() {
  document.getElementById("menuModal").classList.remove("show");
  document.getElementById("hamburgerBtn").classList.remove("open");
}

function enviarSugerencia() {
  var sugerencia = document.getElementById("sugerenciaTexto").value.trim();
  if (sugerencia.length === 0) {
    showToast("Por favor, escribe tu sugerencia antes de enviarla", "error");
    return;
  }
  showToast("Sugerencia enviada con éxito", "success");
  document.getElementById("sugerenciaTexto").value = "";
  closeMenu();
}

function limpiarCampos() {
  document.getElementById("texto").value = "";
  setShiftValue(0);
  document.getElementById("salidaCesar").textContent = "--";
  document.getElementById("salidaBin").value = "";
  document.getElementById("salidaHex").value = "";
  document.getElementById("texto").focus();
  showToast("Campos restablecidos", "info");
}

/* ===== 12. INICIALIZACIÓN GLOBAL ===== */
document.addEventListener("DOMContentLoaded", function() {
  // Configurar slider
  var slider = document.getElementById("shiftSlider");
  if (slider) {
    slider.addEventListener("input", function() {
      setShiftValue(slider.value);
      liveUpdateCesar();
    });
  }

  // Texto César reactivo
  var textoInput = document.getElementById("texto");
  if (textoInput) {
    textoInput.addEventListener("input", function() {
      liveUpdateCesar();
    });
  }

  // Input modal interactivo
  var encInput = document.getElementById("encryptedInput");
  if (encInput) {
    encInput.addEventListener("input", updateWheelAndDecryption);
  }

  // Modal close en backdrop
  var modals = ["menuModal", "interactiveModal", "shareModal"];
  modals.forEach(function(id) {
    var m = document.getElementById(id);
    if (m) {
      m.addEventListener("click", function(e) {
        if (e.target.id === id) {
          m.classList.remove("show");
          if (id === "menuModal") {
            document.getElementById("hamburgerBtn").classList.remove("open");
          }
        }
      });
    }
  });

  // Enter en el juego para comprobar
  var guessInput = document.getElementById("gameGuessInput");
  if (guessInput) {
    guessInput.addEventListener("keydown", function(e) {
      if (e.key === "Enter") checkChallengeGuess();
    });
  }

  // Check URL hash for shared message
  checkUrlHashPayload();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeMenu();
    closeInteractiveModal();
    closeShareModal();
  }
});