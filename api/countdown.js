
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

    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);

    // Calculate days, hours, minutes
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    // Create canvas and context
    const canvas = createCanvas(300, 150);
    const ctx = canvas.getContext('2d');

    // Apply background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw numbers and labels individually with controlled x, y coordinates
    const unitValues = [days, hours, minutes];
    const unitLabels = ['Days', 'Hours', 'Minutes'];
    let xOffset = 10;

    unitValues.forEach((value, index) => {
      // Draw numbers
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = fontColor;
      ctx.fillText(value.toString(), xOffset, 50);

      // Draw labels if showLabels is true
      if (showLabels) {
        ctx.fillStyle = labelColor;
        ctx.font = `14px ${font}`;
        ctx.fillText(unitLabels[index], xOffset, 50 + fontSize + 10);  // Position labels below the numbers
      }

      // Calculate the width of the text to properly space out the next unit
      const textWidth = ctx.measureText(value.toString()).width;
      xOffset += textWidth + 40;
    });

    // Set response type to PNG
    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
