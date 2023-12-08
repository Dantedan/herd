import React, { useRef, useEffect } from 'react';

const Roulette = (options) => {
  const canvasRef = useRef(null);
  let winner = Math.floor(Math.random() * options.length);
  let scale = 100; // Font size and overall scale
  let breaks = 0.001; // Speed loss per frame
  let endSpeed = 0.0000001; // Speed at which the letter stops
  let firstLetter = 360; // Number of frames until the first letter stops (60 frames per second)
  let offset = -((1 + firstLetter) * (breaks * firstLetter + 2 * endSpeed)) / 2;
  let offsetV = (endSpeed + breaks) * firstLetter;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();

    const loop = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#622';
      ctx.fillRect(0, (canvas.height - scale) / 2, canvas.width, scale);
      ctx.fillStyle = '#ccc';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.setTransform(
        1,
        0,
        0,
        1,
        Math.floor(canvas.width / 2),
        Math.floor(canvas.height / 2)
      );
      let o = offset;
      while (o < 0) o++;
      o %= 1;
      let h = Math.ceil(canvas.height / (2 * scale));
      for (let j = -h; j < h; j++) {
        let c = winner + j - Math.floor(offset);
        while (c < 0) c += options.length;
        c %= options.length;
        let s = 1 - Math.abs(j + o) / (canvas.height / (2 * scale) + 1);
        ctx.globalAlpha = s;
        ctx.font = scale * s + 'px Helvetica';
        ctx.fillText(options[c], scale, (j + o) * scale);
      }
      offset += offsetV;
      offsetV -= breaks;
      if (offsetV < endSpeed) {
        offset = 0;
        offsetV = 0;
      }
      requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resizeCanvas);

    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} />;
};

export default Roulette;