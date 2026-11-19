<script setup>
import { ref, watch, onUnmounted } from 'vue';
import PhaserCanvas from './components/PhaserCanvas.vue';

const zonaActiva = ref(null);
const segundos = ref(0);
let temporizador = null;

// Cada vez que se entra o sale de una sala, se reinicia el contador
watch(() => zonaActiva.value?.nombre, (nombre) => {
  clearInterval(temporizador);
  segundos.value = 0;
  if (nombre) temporizador = setInterval(() => { segundos.value++; }, 1000);
});

onUnmounted(() => clearInterval(temporizador));
</script>

<template>
  <main style="display: flex; gap: 20px; padding: 20px; font-family: sans-serif;">
    <PhaserCanvas @cambio-zona="zonaActiva = $event" />

    <aside style="width: 280px; background: #1e293b; color: white; padding: 18px; border-radius: 12px;">
      <h3>Estado de proximidad</h3>
      <div v-if="zonaActiva" style="background: #065f46; border: 2px solid #10b981; padding: 14px; border-radius: 8px;">
        <strong>Dentro de: {{ zonaActiva.nombre }}</strong>
        <p style="margin: 6px 0 0; font-size: 13px; color: #a7f3d0;">Audio de sala activo (listo para Fase 4)</p>
        <p style="margin: 6px 0 0; font-size: 13px;">Tiempo en la sala: {{ segundos }} s</p>
      </div>
      <div v-else style="background: #334155; padding: 14px; border-radius: 8px;">
        <strong>Pasillo / Zona común</strong>
        <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1;">Sin conversación activa</p>
      </div>
      <p style="margin-top: 16px; font-size: 12px; color: #94a3b8;">Controles: WASD o flechas para moverte. Shift para correr.</p>
    </aside>
  </main>
</template>