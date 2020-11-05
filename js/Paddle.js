class Paddle {
  constructor(canvas) {
    this.paddleWidth = 75;
    this.paddleHeight = 10;
    this.canvas = canvas;
    this.x = (this.canvas.width - this.paddleWidth) / 2;
    this.y = this.canvas.height - this.paddleHeight;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.paddleWidth, this.paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  resetPaddle() {
    this.x = (this.canvas.width - this.paddleWidth) / 2;
  }
}

export default Paddle;
