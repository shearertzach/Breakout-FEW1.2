class Ball {
  constructor(canvas, radius, x, y, color = '#0095DD') {
    this.canvas = canvas;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
    this.radius = radius;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  resetBall(canvas) {
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
  }
}

export default Ball;
