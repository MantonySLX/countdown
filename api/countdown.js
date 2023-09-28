
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { parseISO, differenceInSeconds } = require('date-fns');

module.exports = async (req, res) => {
  try {
    // Get end_date from query parameters
    const endDateStr = req.query.end_date || '';
    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = Math.floor(timeLeft % 60);

    // Create canvas and context
    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext('2d');

    // Apply background color
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw numbers and labels individually with controlled x, y coordinates
    const unitValues = [days, hours, minutes, seconds];
    const unitLabels = ['Days', 'Hours', 'Minutes', 'Seconds'];
    let xOffset = 10;

    unitValues.forEach((value, index) => {
      // Draw numbers
      ctx.font = '24px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(value.toString(), xOffset, 50);

      // Draw labels
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.fillText(unitLabels[index], xOffset, 50 + 30);  // Position labels below the numbers

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
