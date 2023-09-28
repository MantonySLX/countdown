
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { parseISO, differenceInSeconds } = require('date-fns');

module.exports = async (req, res) => {
  try {
    // Get end_date and styling parameters from query parameters
    const endDateStr = req.query.end_date || '';
    const fontSize = parseInt(req.query.fontSize || '24', 10);
    const fontColor = req.query.fontColor || '#000000';
    const font = req.query.font || 'Arial';
    const bgColor = req.query.bgColor || '#FFFFFF';
    const labelColor = req.query.labelColor || '#000000';
    const showLabels = req.query.showLabels === 'true';
    const separator = req.query.separator || ':';
    const numberPadding = parseInt(req.query.numberPadding || '0', 10);

    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Create canvas and context
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Calculate the total width needed for the text and separators
    let totalWidth = 0;
    const unitValues = [days, hours, minutes, seconds];
    ctx.font = `${fontSize}px ${font}`;
    unitValues.forEach((value) => {
      totalWidth += ctx.measureText(value.toString()).width + 2 * numberPadding;
    });
    totalWidth += ctx.measureText(separator).width * (unitValues.length - 1);

    // Resize the canvas width dynamically based on the text width
    canvas.width = totalWidth + 40;

    // Apply background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw numbers, labels, and separators individually with controlled x, y coordinates
    const unitLabels = ['Days', 'Hours', 'Minutes', 'Seconds'];
    let xOffset = 10;

    unitValues.forEach((value, index) => {
      // Calculate text width for dynamic box sizing
      const textWidth = ctx.measureText(value.toString()).width;

      // Draw numbers with padding
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = fontColor;
      ctx.fillText(value.toString(), xOffset + numberPadding, 50);

      // Draw separator if not the last element
      if (index < unitValues.length - 1) {
        xOffset += textWidth + 2 * numberPadding;
        ctx.fillText(separator, xOffset, 50);
        xOffset += ctx.measureText(separator).width;
      }

      // Draw labels if showLabels is true
      if (showLabels) {
        ctx.fillStyle = labelColor;
        ctx.font = `14px ${font}`;
        const labelWidth = ctx.measureText(unitLabels[index]).width;
        ctx.fillText(unitLabels[index], xOffset + numberPadding - textWidth / 2 - labelWidth / 2, 70);  // Center labels below the numbers
      }

      // Update xOffset for the next unit
      xOffset += textWidth + 2 * numberPadding;
    });

    // Set response type to PNG
    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
