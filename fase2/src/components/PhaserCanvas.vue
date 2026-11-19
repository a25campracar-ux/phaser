<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import { MapScene } from '../game/MapScene';

const emit = defineEmits(['mapaCargado']);
const contenedor = ref(null);
let game = null;

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 640, height: 480,
    backgroundColor: '#0f172a',
    pixelArt: true,
    parent: contenedor.value,
    scene: [MapScene]
  });

  game.events.on('mapa-cargado', (elementos) => {
    emit('mapaCargado', elementos);
  });
});

onUnmounted(() => game?.destroy(true));
</script>

<template><div ref="contenedor"></div></template>