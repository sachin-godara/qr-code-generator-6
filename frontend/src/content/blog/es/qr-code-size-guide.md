---
title: "Guía de Tamaños de Códigos QR — Dimensiones Mínimas para Impresión y Vallas"
description: "Referencia completa de dimensiones para códigos QR. Descubre los tamaños mínimos para tarjetas de visita, pegatinas, carteles, vallas publicitarias y pantallas."
pubDate: 2026-08-22
author: "Equipo GenerateCustomQR"
keywords: "tamano codigo qr, medidas minimas qr, dimensiones qr impresion, que tamano debe tener un codigo qr, tamano qr tarjeta de visita"
category: "guides"
readingTime: 6
featured: false
faqs:
  - q: "¿Cuál es el tamaño mínimo para un código QR?"
    a: "El tamaño mínimo absoluto para un escaneo fiable es de 2×2 cm para códigos QR escaneados a corta distancia (menos de 20 cm). No obstante, se recomienda 3×3 cm como mínimo seguro para la mayoría de aplicaciones impresas. Aplica la regla: tamaño mínimo = distancia de escaneo ÷ 10."
  - q: "¿Qué tamaño debe tener un código QR en una tarjeta de visita?"
    a: "En una tarjeta de visita estándar (8,5×5,5 cm), el código QR debe medir al menos 1,5×1,5 cm, idealmente 2×2 cm. Colócalo en una esquina con al menos 3 mm de margen blanco (zona de silencio) en todos los lados."
  - q: "¿Qué tamaño de código QR necesito para una valla publicitaria exterior?"
    a: "Para una valla escaneada desde un coche a 10 metros: mínimo 100×100 cm. Para señalización peatonal a 2 metros: mínimo 20×20 cm. La fórmula es: tamaño QR = distancia de visión (cm) ÷ 10. Exporta siempre en formato SVG o PDF vectorial."
  - q: "¿Más datos en un código QR requieren un tamaño de impresión mayor?"
    a: "Sí. Un código QR con una URL corta (20 caracteres) tiene menos módulos que uno con una tarjeta vCard completa (más de 300 caracteres). Más datos = más módulos = mayor detalle = requiere mayor tamaño físico. Mantén las URLs cortas para imprimir en tamaños más reducidos."
  - q: "¿Qué resolución debo usar al imprimir un código QR?"
    a: "Imprime siempre a un mínimo de 300 DPI para calidad profesional. GenerateCustomQR exporta en SVG (vectorial infinitamente escalable) y PDF a 300 DPI, ideales para imprimir en cualquier tamaño sin pixelación."
---

Una de las preguntas más frecuentes al crear un código QR es: *"¿Qué tamaño debe tener?"* La respuesta depende del lugar de colocación, la distancia desde la que se escaneará y la cantidad de datos codificados.

Esta guía ofrece recomendaciones de tamaño definitivas para cada uso común.

---

## La Regla de Oro: Distancia de Escaneo ÷ 10

La fórmula más simple y efectiva para calcular el tamaño de un código QR:

> **Tamaño mínimo del código QR = Distancia de escaneo ÷ 10**

Si alguien va a escanear el código QR desde **30 cm de distancia** (distancia típica en tarjetas de visita), el tamaño mínimo es **3 cm × 3 cm**.

Si lo van a escanear desde **3 metros de distancia** (un cartel en una pared), el tamaño mínimo es **30 cm × 30 cm**.

---

## Tabla de Tamaños por Caso de Uso

| Caso de Uso | Distancia Típica de Escaneo | Tamaño Mínimo QR | Tamaño Recomendado |
| :--- | :--- | :--- | :--- |
| **Tarjeta de visita** | 15–30 cm | 2 cm × 2 cm | 2.5–3 cm × 2.5–3 cm |
| **Etiqueta de producto** | 15–25 cm | 1.5 cm × 1.5 cm | 2 cm × 2 cm |
| **Pegatina / Identificador** | 20–40 cm | 2 cm × 2 cm | 3 cm × 3 cm |
| **Folleto / Folleto tríptico** | 25–40 cm | 2.5 cm × 2.5 cm | 3–4 cm × 3–4 cm |
| **Caballete de mesa restaurante** | 30–50 cm | 3 cm × 3 cm | 4–5 cm × 4–5 cm |
| **Cartel A4** | 0.5–1.5 m | 5 cm × 5 cm | 8–10 cm × 8–10 cm |
| **Cartel A3 / A2** | 1–3 m | 10 cm × 10 cm | 15 cm × 15 cm |
| **Roll-up / Banner feria** | 1–5 m | 15 cm × 15 cm | 20–25 cm × 20–25 cm |
| **Valla publicitaria exterior** | 5–20 m | 50 cm × 50 cm | 80–100 cm × 80–100 cm |
| **Pantalla de estadio** | 20–50 m | 2 m × 2 m | 3 m × 3 m |

---

## Cómo Afecta la Cantidad de Datos al Tamaño

A mayor cantidad de caracteres codificados en el código QR, más *módulos* (pequeños cuadrados) contendrá la cuadrícula. Una mayor densidad exige un tamaño físico superior para que las cámaras distingan cada punto.

| Tipo de Contenido | Número Aprox. de Módulos | Impacto en el Tamaño Mínimo |
| :--- | :--- | :--- |
| **URL Corta** (< 50 caracteres) | 25×25 módulos | Tamaño estándar |
| **URL Mediana** (50–100 caracteres) | 33×33 módulos | +10% de aumento |
| **URL Larga** (100–200 caracteres) | 41×41 módulos | +25% de aumento |
| **vCard** (Contacto completo) | 45×45 módulos | +30% de aumento |
| **Credenciales Wi-Fi** | 29×29 módulos | Tamaño estándar |
| **Texto Plano** (500+ caracteres) | 57×57+ módulos | +50% o más |

> [!TIP]
> **Consejo Pro**: Usa URLs cortas para mantener baja la densidad de módulos, permitiendo códigos QR más pequeños y fáciles de escanear.

---

## Corrección de Errores y Tamaño

Los códigos QR cuentan con cuatro niveles de corrección de errores que influyen en la densidad:

| Nivel | Capacidad de Recuperación | Impacto en Tamaño | Mejor Para |
| :---: | :---: | :---: | :--- |
| **L** (Bajo) | 7% de datos | Código más compacto | Pantallas digitales, entornos limpios |
| **M** (Medio) | 15% de datos | +10% más grande | Uso general, folletos impresos |
| **Q** (Cuartil) | 25% de datos | +20% más grande | Exteriores, superficies con textura |
| **H** (Alto) | 30% de datos | +30% más grande | **Incrustación de logotipos** |

Cuando añades un logotipo en el centro de tu código QR, utiliza siempre **Nivel H**. Esto hace que el código tenga más puntos, por lo que debes prever ese 30% adicional en tus dimensiones.

---

## Requisitos de Resolución por Formato de Exportación

| Formato de Exportación | Resolución Óptima | Caso de Uso |
| :--- | :--- | :--- |
| **PNG** | 300 DPI para impresión, 72 DPI web | Formato más versátil para diseño digital |
| **SVG** | Infinita (Vectorial) | Impresión a cualquier tamaño sin pixelar |
| **PDF** | 300 DPI incrustado | Imprentas profesionales y catálogos |

Con [GenerateCustomQR](/es), puedes exportar imágenes PNG de hasta **8192 × 8192 píxeles**, más que suficiente incluso para vallas de gran formato.

---

## Errores Comunes de Dimensionamiento

- ❌ **Hacerlo demasiado pequeño**: Códigos menores de 2 cm son arriesgados en teléfonos antiguos o con poca luz.
- ❌ **Olvidar la zona de silencio**: El margen blanco exterior debe tener al menos 4 módulos de grosor.
- ❌ **Usar baja resolución en imprenta**: Un PNG de 300px saldrá borroso en papel. Usa SVG o PDF a 300 DPI.
- ❌ **No hacer pruebas reales**: Imprime siempre una prueba de muestra y escanéala con 3 móviles diferentes a la distancia real.

---

## Lista de Comprobación Antes de Imprimir

- [x] Calcular el tamaño mínimo: **Distancia de escaneo ÷ 10**
- [x] Añadir un 30% extra si se usa Nivel H con logotipo
- [x] Mantener la zona de silencio de 4 módulos alrededor
- [x] Exportar en SVG o PDF a 300 DPI
- [x] Realizar prueba física de escaneo con varios teléfonos
