<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import { MainScene } from '../game/MainScene';

// Recibe la prop desde App.vue
const props = defineProps(['nombreUsuario', 'colorAvatar']);

// Apunta al <div ref="contenedor"> del template
const contenedor = ref(null);
// Guardamos la instancia del juego para destruirla al salir
let game = null;

// Se ejecuta una sola vez, cuando el <div> ya existe en la página
onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,           // WebGL automático (o Canvas 2D)
    width: 640, height: 400,     // Tamaño del lienzo en píxeles
    backgroundColor: '#1e293b',  // Fondo oscuro
    parent: contenedor.value,    // Inserta el <canvas> dentro del <div>
    scene: [MainScene]           // Escena inicial
  });

  // Sincroniza el nombre actual al terminar de arrancar (útil con v-if)
  game.events.once('ready', () => {
    game?.scene.getScene('MainScene')?.actualizarNombre(props.nombreUsuario);
  });
  game.events.once('ready', () => {
    game?.scene.getScene('MainScene')?.cambiarColor(props.colorAvatar);
  });
});

// IMPRESCINDIBLE: al ocultar (v-if="false"), detiene el bucle y libera memoria
onUnmounted(() => game?.destroy(true));

// Al MISMO nivel que onMounted (NUNCA dentro de onMounted)
watch(() => props.nombreUsuario, (nuevoNombre) => {
  const escena = game?.scene.getScene('MainScene');
  escena?.actualizarNombre(nuevoNombre);
});

watch(() => props.colorAvatar, (nuevoColor) => {
  const escena = game?.scene.getScene('MainScene');
  escena?.cambiarColor(nuevoColor);
});

function alternarPausa() {
  const escena = game?.scene.getScene('MainScene');
  if (!escena) return;

  if (escena.scene.isPaused()) {
    escena.scene.resume();
  } else {
    escena.scene.pause();
  }
}

defineExpose({ alternarPausa });
</script>

<template>
  <div ref="contenedor"></div>
</template>