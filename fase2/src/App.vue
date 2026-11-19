<script setup>
import { ref } from 'vue';
import PhaserCanvas from './components/PhaserCanvas.vue';

const elementosMapa = ref([]);
</script>

<template>
  <main style="display: flex; gap: 20px; padding: 20px; font-family: sans-serif;">
    <PhaserCanvas @mapa-cargado="elementosMapa = $event" />

    <aside style="min-width: 260px; background: #1e293b; color: white; padding: 16px; border-radius: 10px;">
      <h3>Objetos del mapa (Tiled)</h3>
      <p v-if="elementosMapa.length === 0">Cargando capa Objectes...</p>
      <ul>
        <li v-for="(el, i) in elementosMapa" :key="i" style="margin-bottom: 8px;">
          <strong>[{{ el.tipo }}]</strong> {{ el.nombre }}
          <span v-if="el.tipo === 'Zona'"> (Máx. {{ el.aforo }} pers.)</span>
        </li>
      </ul>
    </aside>
  </main>
</template>