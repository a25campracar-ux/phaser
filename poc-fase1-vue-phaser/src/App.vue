<script setup>
import { ref } from 'vue';
// Importamos el componente puente que contiene el <canvas> de Phaser
import PhaserCanvas from './components/PhaserCanvas.vue';

// Variable reactiva que guarda el nombre escrito en el input
const nombre = ref('Anna');
// Booleano para montar/desmontar el juego (prueba onMounted / onUnmounted)
const mostrarJuego = ref(true);
</script>

<template>
  <main class="contenedor-app">
    <!-- Toda la interfaz (inputs, botones) se hace en HTML/CSS dentro de Vue -->
    <div class="controles">
      <input v-model="nombre" placeholder="Escribe tu nombre de usuario..." />
      <button @click="mostrarJuego = !mostrarJuego">
        {{ mostrarJuego ? 'Ocultar lienzo' : 'Mostrar lienzo' }}
      </button>
    </div>

    <!-- Pasamos 'nombre' hacia abajo con :nombreUsuario y controlamos el ciclo con v-if -->
    <PhaserCanvas v-if="mostrarJuego" :nombreUsuario="nombre" />
  </main>
</template>