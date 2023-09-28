
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { parseISO, differenceInSeconds } = require('date-fns');

module.exports = async (req, res) => {
  try {
    // Extract query parameters for customization
    const endDateStr = req.query.end_date || '';

    // Set the styling to match the uploaded example
    const fontSize = 36;
    const font = 'Courier New, Courier, monospace';
    const fontColor = '#4CAF50';
    const bgColor = '#ffd54f';
    const labelColor = '#2196F3';
    const separator = ':';
    const numberPadding = 20;

    // Calculate the countdown
    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Create canvas and apply styling
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the countdown numbers and labels
    const unitValues = [days, hours, minutes, seconds];
    const unitLabels = ['Days', 'Hours', 'Minutes', 'Seconds'];
    let xOffset = 10;
    unitValues.forEach((value, index) => {
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = fontColor;
      const textValue = value.toString().padStart(2, '0');
      ctx.fillText(textValue, xOffset, 100);

      // Draw labels
      ctx.fillStyle = labelColor;
      ctx.font = `14px ${font}`;
      const textMetrics = ctx.measureText(textValue);
      const labelXOffset = xOffset + (textMetrics.width - ctx.measureText(unitLabels[index]).width) / 2;
      ctx.fillText(unitLabels[index], labelXOffset, 120);

      const textWidth = ctx.measureText(textValue).width;
      xOffset += textWidth + numberPadding;
      if (index < unitValues.length - 1) {
        ctx.fillText(separator, xOffset, 100);
        xOffset += ctx.measureText(separator).width + numberPadding;
      }
    });

    // Set response type and send image
    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
