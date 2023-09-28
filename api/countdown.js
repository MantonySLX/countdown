
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { parseISO, differenceInSeconds } = require('date-fns');

module.exports = async (req, res) => {
  try {
    const endDateStr = req.query.end_date || '';
    const fontSize = parseInt(req.query.fontSize || '24', 10);
    const font = req.query.font || 'Arial';
    const fontColor = req.query.fontColor || '#333';
    const bgColor = req.query.bgColor || '#ffd54f';
    const labelColor = req.query.labelColor || '#333';
    const separator = req.query.separator || ':';
    const numberPadding = parseInt(req.query.numberPadding || '10', 10);
    const showLabels = req.query.showLabels === 'true';

    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const unitValues = [days, hours, minutes, seconds];
    const unitLabels = ['Days', 'Hours', 'Minutes', 'Seconds'];
    let xOffset = 10;

    unitValues.forEach((value, index) => {
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = fontColor;
      const textValue = value.toString().padStart(2, '0');
      ctx.fillText(textValue, xOffset, 100);

      if (showLabels) {
        ctx.fillStyle = labelColor;
        ctx.font = `14px ${font}`;
        const textMetrics = ctx.measureText(textValue);
        const labelXOffset = xOffset + (textMetrics.width - ctx.measureText(unitLabels[index]).width) / 2;
        ctx.fillText(unitLabels[index], labelXOffset, 100 + fontSize + 10);
      }

      const textWidth = ctx.measureText(textValue).width;
      xOffset += textWidth + numberPadding;

      if (index < unitValues.length - 1) {
        ctx.fillText(separator, xOffset, 100);
        xOffset += ctx.measureText(separator).width + numberPadding;
      }
    });

    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
