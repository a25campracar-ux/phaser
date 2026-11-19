import Phaser from 'phaser';

export class OfficeScene extends Phaser.Scene {
  constructor() { super('OfficeScene'); }

  preload() {
    this.load.image('tiles_office', '/assets/tilesets/pixel_office.png');
    this.load.tilemapTiledJSON('mapa_office', '/assets/maps/oficina.json');
    this.load.spritesheet('c3tr3s', '/assets/sprites/c3tr3s.png',
      { frameWidth: 48, frameHeight: 48 });
  }

  create() {
    const map = this.make.tilemap({ key: 'mapa_office' });
    const tileset = map.addTilesetImage('pixel_office_tiles', 'tiles_office');
    map.createLayer('Suelo', tileset, 0, 0);
    this.capaParedes = map.createLayer('Paredes', tileset, 0, 0);
    this.capaParedes?.setCollisionByProperty({ collides: true });

    this.zonas = [];
    map.getObjectLayer('Objetos')?.objects.forEach((obj) => {
      const props = this.obtenerPropiedades(obj);
      const cx = obj.x + (obj.width || 0) / 2;
      const cy = obj.y + (obj.height || 0) / 2;

      if (props.tipo === 'spawn') {
        this.jugador = this.physics.add.sprite(cx, cy, 'c3tr3s', 0);
        this.jugador.body.setSize(16, 12);
        this.jugador.body.setOffset(16, 32);
        this.jugador.setCollideWorldBounds(true);
        // this.physics.world.createDebugGraphic();
        if (this.capaParedes) this.physics.add.collider(this.jugador, this.capaParedes);
      }

      if (props.tipo === 'zona') {
        const rect = new Phaser.Geom.Rectangle(obj.x, obj.y, obj.width, obj.height);
        this.zonas.push({ nombre: props.nombreSala || 'Sala', rect });
        this.add.rectangle(cx, cy, obj.width, obj.height, 0x10b981, 0.18)
          .setStrokeStyle(1.5, 0x10b981);
        this.add.text(cx, obj.y + 12, props.nombreSala || 'Sala',
          { fontSize: '11px', color: '#a7f3d0' }).setOrigin(0.5);
      }
    });
    this.zonaActual = null;

    this.direccion = 'abajo';
    this.framesQuieto = { abajo: 0, izquierda: 1, arriba: 2, derecha: 3 };
    this.etiqueta = this.add.text(this.jugador.x, this.jugador.y - 30, 'c3tr3s',
      { fontSize: '13px', fontFamily: 'sans-serif', color: '#ffffff',
        backgroundColor: '#0f172a88' }).setOrigin(0.5);
    this.crearAnimaciones();
    this.cursores = this.input.keyboard.createCursorKeys();
    this.teclasWASD = this.input.keyboard.addKeys('W,A,S,D');
    this.teclaShift = this.input.keyboard.addKey('SHIFT');
  }

  crearAnimaciones() {
    const dirs = [
      { clave: 'caminar-abajo',     frames: [0, 4, 8, 12] },
      { clave: 'caminar-izquierda', frames: [1, 5, 9, 13] },
      { clave: 'caminar-arriba',    frames: [2, 6, 10, 14] },
      { clave: 'caminar-derecha',   frames: [3, 7, 11, 15] }
    ];
    dirs.forEach((d) => {
      this.anims.create({
        key: d.clave,
        frames: this.anims.generateFrameNumbers('c3tr3s', { frames: d.frames }),
        frameRate: 8, repeat: -1
      });
    });
  }

  update() {
    if (!this.jugador) return;
    let vx = 0, vy = 0;
    if (this.cursores.left.isDown  || this.teclasWASD.A.isDown) vx = -1;
    if (this.cursores.right.isDown || this.teclasWASD.D.isDown) vx = 1;
    if (this.cursores.up.isDown    || this.teclasWASD.W.isDown) vy = -1;
    if (this.cursores.down.isDown  || this.teclasWASD.S.isDown) vy = 1;

    // Sprint con Shift: más velocidad y animación más rápida
    const sprint = this.teclaShift.isDown;
    this.jugador.anims.timeScale = sprint ? 1.6 : 1.0;
    const vel = new Phaser.Math.Vector2(vx, vy).normalize().scale(sprint ? 260 : 160);
    this.jugador.setVelocity(vel.x, vel.y);

    if (vx !== 0 || vy !== 0) {
      if (Math.abs(vx) > Math.abs(vy)) this.direccion = vx < 0 ? 'izquierda' : 'derecha';
      else this.direccion = vy < 0 ? 'arriba' : 'abajo';
      this.jugador.anims.play(`caminar-${this.direccion}`, true);
    } else {
      this.jugador.anims.stop();
      this.jugador.setFrame(this.framesQuieto[this.direccion]);
    }

    this.etiqueta.setPosition(this.jugador.x, this.jugador.y - 30);
    this.comprobarZonas();
  }

  comprobarZonas() {
    const pieY = this.jugador.y + 14;
    const hallada = this.zonas.find((z) =>
      Phaser.Geom.Rectangle.Contains(z.rect, this.jugador.x, pieY)) || null;
    if (hallada?.nombre !== this.zonaActual?.nombre) {
      this.zonaActual = hallada;
      this.game.events.emit('cambio-zona', hallada ? { nombre: hallada.nombre } : null);
    }
  }

  obtenerPropiedades(obj) {
    const res = {};
    (obj.properties || []).forEach((p) => { res[p.name] = p.value; });
    return res;
  }
}