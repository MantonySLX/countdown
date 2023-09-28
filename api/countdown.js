
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
    const padding = parseInt(req.query.padding || '10', 10);

    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Create canvas and context
    const canvas = createCanvas(400, 200);  // Increased canvas size for additional elements
    const ctx = canvas.getContext('2d');

    // Apply background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw numbers, labels, and separators individually with controlled x, y coordinates
    const unitValues = [days, hours, minutes, seconds];
    const unitLabels = ['Days', 'Hours', 'Minutes', 'Seconds'];
    let xOffset = 10;

    unitValues.forEach((value, index) => {
      // Calculate text width for dynamic box sizing
      ctx.font = `${fontSize}px ${font}`;
      const textWidth = ctx.measureText(value.toString()).width;

      // Draw box around the digit
      ctx.fillStyle = bgColor;
      ctx.fillRect(xOffset - padding, 20, textWidth + 2 * padding, fontSize + 2 * padding);

      // Draw numbers
      ctx.fillStyle = fontColor;
      ctx.fillText(value.toString(), xOffset, 50);

      // Draw separator if not the last element
      if (index < unitValues.length - 1) {
        xOffset += textWidth + padding;
        ctx.fillText(separator, xOffset, 50);
        xOffset += ctx.measureText(separator).width + padding;
      }

      // Draw labels if showLabels is true
      if (showLabels) {
        ctx.fillStyle = labelColor;
        ctx.font = `14px ${font}`;
        ctx.fillText(unitLabels[index], xOffset - textWidth / 2, 50 + fontSize + 10);  // Center labels below the numbers
      }

      // Update xOffset for the next unit
      xOffset += textWidth + padding;
    });

    // Set response type to PNG
    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
