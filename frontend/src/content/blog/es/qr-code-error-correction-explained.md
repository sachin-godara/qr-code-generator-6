---
title: "Corrección de Errores en Códigos QR Explicada: Niveles L, M, Q y H"
description: "Domina la corrección de errores Reed-Solomon en códigos QR. Aprende qué nivel (7%, 15%, 25%, 30%) elegir para logotipos, vallas y escaneo infalible."
pubDate: 2026-08-10
author: "Equipo GenerateCustomQR"
keywords: "correccion de errores codigo qr, niveles de correccion qr l m q h, reed solomon qr, qr con logo correccion de errores, tamano maximo logo qr"
category: "design-tips"
readingTime: 8
featured: false
faqs:
  - q: "¿Qué es la corrección de errores en un código QR?"
    a: "Es un algoritmo matemático (código Reed-Solomon) que añade redundancia a la matriz QR. Esto permite que los lectores reconstruyan el 100% de la URL o texto aunque el código esté rayado, manchado o cubierto por un logotipo central hasta en un 30%."
  - q: "¿Qué nivel de corrección debo usar para incluir un logo?"
    a: "Usa siempre el Nivel H (Alto - 30%) o Nivel Q (25%) cuando agregues un logotipo personalizado en el centro. El Nivel H tolera hasta un 30% de datos cubiertos manteniendo un escaneo instantáneo en cualquier smartphone."
  - q: "¿Una mayor corrección de errores hace que el código QR sea más denso?"
    a: "Sí. Mayor corrección requiere más módulos (puntos) para almacenar los bloques de paridad. Por ejemplo, una URL de 50 caracteres en Nivel L genera una cuadrícula de 25×25, mientras que en Nivel H genera 33×33 módulos."
howToSteps:
  - name: "Identifica el soporte y objetivo de tu código"
    text: "Determina si el código se mostrará en pantallas digitales (Nivel M), en papel limpio (Nivel M/Q) o si incluirá un logotipo central (Nivel H)."
  - name: "Configura la Corrección de Errores en GenerateCustomQR"
    text: "En GenerateCustomQR, la corrección de error se ajusta automáticamente a Nivel H (Alto) al subir un logotipo corporativo."
  - name: "Realiza pruebas con diferentes teléfonos"
    text: "Prueba el escaneo a diferentes distancias y condiciones de luz antes de imprimir grandes tiradas."
---

¿Te has preguntado alguna vez por qué un código QR con una mancha de café, una esquina rasgada o un logotipo de empresa en el centro sigue funcionando al instante?

El secreto es la **Corrección de Errores Reed-Solomon**, un algoritmo matemático desarrollado originalmente para comunicaciones espaciales y discos compactos (CDs).

En esta guía te explicamos cómo funciona la corrección de errores, la relación entre los **Niveles L, M, Q y H** y cuál elegir para tu proyecto.

---

## Los 4 Niveles de Corrección de Errores

El estándar internacional ISO/IEC 18004 define **cuatro niveles de corrección**. Cada nivel añade un porcentaje específico de redundancia matemática al código:

| Nivel | Identificador | Capacidad de Recuperación | Densidad de Cuadrícula | Caso de Uso Recomendado |
| :---: | :---: | :---: | :---: | :--- |
| **L** | Low (Bajo) | **~7%** de datos | Mínima (puntos grandes) | Impresiones muy pequeñas, pantallas digitales, URLs simples sin logo |
| **M** | Medium (Medio) | **~15%** de datos | Estándar | **Estándar por defecto** para marketing general, folletos y enlaces web |
| **Q** | Quartile (Cuartil) | **~25%** de datos | Media-Alta | Embalajes industriales, señalización de alto tránsito, micro-logos |
| **H** | High (Alto) | **~30%** de datos | Máxima (densa) | **Obligatorio para Logos Centrales**, vallas, pegatinas de suelo |

---

## ¿Cómo Funciona Reed-Solomon por Dentro?

Al generar un código QR, el sistema no solo convierte tus caracteres en 1s y 0s, sino que calcula **polinomios de paridad**:

<div class="blog-equation-card">
  <div class="blog-equation-segment data">
    <span class="segment-label">Datos Codificados</span>
    <span class="segment-val">70%</span>
  </div>
  <span class="blog-equation-op">+</span>
  <div class="blog-equation-segment parity">
    <span class="segment-label">Paridad Reed-Solomon</span>
    <span class="segment-val">30%</span>
  </div>
  <span class="blog-equation-op">=</span>
  <div class="blog-equation-segment total">
    <span class="segment-label">Matriz Completa</span>
    <span class="segment-val">Nivel H (100%)</span>
  </div>
</div>

Cuando la cámara escanea el código:
1. Localiza los **3 ojos de las esquinas** para corregir la perspectiva.
2. Lee los módulos binarios.
3. Si faltan datos porque están tapados por un logo o dañados por arañazos, las ecuaciones matemáticas reconstruyen los datos ausentes al 100% sin pérdida.

---

## Corrección de Errores vs. Densidad: El Compromiso Técnico

A mayor nivel de corrección de errores, más puntos (módulos) tendrá la cuadrícula:

- **Nivel L (7% Recuperación)**: Cuadrícula de **25 × 25 módulos** (Versión 2). Puntos anchos muy fáciles de leer a tamaños pequeños.
- **Nivel H (30% Recuperación)**: Cuadrícula de **33 × 33 módulos** (Versión 4). Mayor detalle que exige un tamaño físico de impresión ligeramente superior (mínimo 2,5 cm).

> [!IMPORTANT]
> **Regla de Diseño**: En tarjetas de visita sin logo, usa **Nivel M**. Si añades un logotipo, usa siempre **Nivel H** e imprime a un tamaño mínimo de **25 mm × 25 mm**.

---

## Tamaño Ideal del Logotipo Central

- **Área Máxima**: El logo no debe cubrir más del **20% al 25%** del área total del código QR.
- **Margen de Seguridad (5%)**: Aunque el Nivel H tolera hasta un 30%, mantener el logo bajo el 22% deja un margen vital para cámaras con poco enfoque o sombras.
- **Anillo de Protección (Padding)**: Añade siempre un marco blanco o del color de fondo alrededor del logotipo.

---

## Recomendaciones por Caso de Uso Real

| Caso de Uso Real | Peligro Potencial | Nivel Recomendado | Motivo |
| :--- | :--- | :---: | :--- |
| **Pegatinas en Mesas de Bar** | Derrames de líquidos, roces | **Nivel H** | Resiste el desgaste físico continuo de los clientes |
| **Lonas de Exterior** | Sol, lluvia, arrugas por viento | **Nivel Q o H** | Escanea incluso con sombras o dobleces |
| **Cajas y Embalajes** | Esquinas aplastadas, etiquetas | **Nivel Q** | Equilibra velocidad de lectura con tolerancia a daños |
| **Pantallas Digitales / Email** | Cero daño físico | **Nivel M** | Mantiene baja la densidad para pantallas Retina |
| **Códigos con Logotipo de Marca** | Obstrucción deliberada de datos | **Nivel H** | Asegura que la cámara lea los datos alrededor del logo |

---

## Resumen

- Usa **Nivel M (15%)** para enlaces estándar y pantallas sin logotipo.
- Usa **Nivel H (30%)** siempre que incluyas tu logotipo corporativo o imprimas en exteriores.
- Genera y prueba los 4 niveles gratis en **[GenerateCustomQR](/es)**.
