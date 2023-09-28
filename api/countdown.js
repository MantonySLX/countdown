
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { parseISO, differenceInSeconds } = require('date-fns');

module.exports = async (req, res) => {
  try {
    // Get end_date and styling parameters from query parameters
    const endDateStr = req.query.end_date || '';
    const fontSize = req.query.fontSize || '24';
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
    const canvas = createCanvas(300, 100);
    const ctx = canvas.getContext('2d');

    // Apply background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply font and draw text
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = fontColor;
    const text = showLabels ? `${days} Days ${hours} Hours ${minutes} Minutes` : `${days}:${hours}:${minutes}`;
    ctx.fillText(text, 10, 50);

    // Set response type to PNG
    res.setHeader('Content-Type', 'image/png');
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};
