# Mission Control: The Next Frontier

Prototipo web educativo para practicar el concepto de un **Space Mission Design Game** antes de adaptar el proyecto al reto oficial.

## Qué incluye

- Selección de destino: Luna, Marte o asteroide.
- Recursos de misión: presupuesto, energía, masa, seguridad y ciencia.
- Selección de componentes de nave.
- Restricciones de presupuesto, masa y energía.
- Tres eventos narrativos durante el vuelo.
- Decisiones con consecuencias cuantificables.
- ASTRA, asistente de misión que explica conceptos y ofrece análisis contextual predefinido.
- Puntuación y debriefing final.
- Diseño responsive para computadora, tableta y móvil.

## Ejecutarlo

Es un sitio estático. Abre `index.html` en un navegador o sirve la carpeta con cualquier servidor local.

## Archivos

- `index.html`: interfaz y pantallas.
- `styles.css`: diseño visual.
- `game.js`: datos, reglas y lógica del juego.

## Importante

Los números y reglas actuales son **datos de demostración**, no valores oficiales de NASA. La intención es entrenar la mecánica y el flujo del videojuego. Para una entrega del NASA Space Apps Challenge deben sustituirse o justificarse usando los recursos y datos oficiales del reto correspondiente.

## Próxima versión sugerida

1. Sustituir reglas demostrativas por datos NASA documentados.
2. Añadir una misión principal única con narrativa más cinematográfica.
3. Incorporar ilustraciones y animaciones propias.
4. Añadir un mapa/progreso de viaje.
5. Convertir ASTRA en una IA real mediante un backend seguro, evitando exponer claves API en el navegador.
6. Añadir una pantalla de fuentes científicas y explicación de cada decisión.
7. Incorporar accesibilidad, sonido y guardado de partida.

## Objetivo de diseño

El juego no pretende simular toda la ingeniería de una misión espacial. Su objetivo es enseñar de manera interactiva que el diseño de misiones exige **trade-offs**: mejorar ciencia, seguridad o capacidad normalmente consume masa, energía, tiempo o presupuesto.
