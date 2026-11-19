<script setup>
import { ref } from 'vue';
// Importamos el componente puente que contiene el <canvas> de Phaser
import PhaserCanvas from './components/PhaserCanvas.vue';

// Variable reactiva que guarda el nombre escrito en el input
const nombre = ref('Anna');
// Booleano para montar/desmontar el juego (prueba onMounted / onUnmounted)
const mostrarJuego = ref(true);
const color = ref('#10b981');
const canvasRef = ref(null);
</script>

<template>
  <main class="contenedor-app">
    <!-- Toda la interfaz (inputs, botones) se hace en HTML/CSS dentro de Vue -->
    <div class="controles">
      <input v-model="nombre" placeholder="Escribe tu nombre de usuario..." />
      <input type="color" v-model="color" />
      <button @click="mostrarJuego = !mostrarJuego">
        {{ mostrarJuego ? 'Ocultar lienzo' : 'Mostrar lienzo' }}
      </button>
    </div>

    <!-- Pasamos 'nombre' hacia abajo con :nombreUsuario y controlamos el ciclo con v-if -->
    <PhaserCanvas ref="canvasRef" v-if="mostrarJuego" :nombreUsuario="nombre" :colorAvatar="color" />
    <button @click="canvasRef?.alternarPausa()">Pausa / Reanudar</button>
  </main>
</template>