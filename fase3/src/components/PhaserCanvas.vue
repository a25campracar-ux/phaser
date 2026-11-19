<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import { OfficeScene } from '../game/OfficeScene';

const emit = defineEmits(['cambioZona']);
const contenedor = ref(null);
let game = null;

onMounted(() => {
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 640, height: 480,
    backgroundColor: '#0f172a',
    pixelArt: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    parent: contenedor.value,
    scene: [OfficeScene]
  });
  game.events.on('cambio-zona', (zona) => emit('cambioZona', zona));
});

onUnmounted(() => game?.destroy(true));
</script>

<template><div ref="contenedor"></div></template>