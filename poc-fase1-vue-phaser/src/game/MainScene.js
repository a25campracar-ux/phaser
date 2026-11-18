import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    // Registramos la escena con la clave 'MainScene' para recuperarla desde Vue
    super('MainScene');
  }

  // Se ejecuta UNA SOLA VEZ al iniciar la escena: creamos los objetos
  create() {
    // Círculo verde en el centro (x=320, y=200, radio=24px)
    this.avatar = this.add.circle(320, 200, 24, 0x10b981);

    // Texto flotante sobre el avatar, centrado con .setOrigin(0.5)
    this.etiqueta = this.add.text(320, 160, 'Anna', {
      fontSize: '18px', fontFamily: 'sans-serif', color: '#ffffff'
    }).setOrigin(0.5);
  }

  // Bucle continuo a 60 FPS
  update(time) {
    // Oscilación arriba y abajo del avatar
    this.avatar.y = 200 + Math.sin(time * 0.004) * 8;

    // La etiqueta sigue siempre al avatar
    this.etiqueta.setPosition(this.avatar.x, this.avatar.y - 38);
  }

  // Método público que llama Vue para cambiar el texto
  actualizarNombre(nuevoNombre) {
    // || 'Anónimo' evita que el texto quede vacío
    this.etiqueta?.setText(nuevoNombre || 'Anónimo');
  }
}