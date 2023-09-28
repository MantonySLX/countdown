
const { createCanvas, loadImage } = require('canvas');
const { parseISO, differenceInSeconds } = require('date-fns');

module.exports = async (req, res) => {
  try {
    console.log("Serverless function invoked");  // Debug log

    // Get end_date from query parameters
    const endDateStr = req.query.end_date || '';
    console.log("Received end_date:", endDateStr);  // Debug log

    const endDate = parseISO(endDateStr);
    const now = new Date();

    // Calculate time left in seconds
    const timeLeft = differenceInSeconds(endDate, now);
    console.log("Calculated time left:", timeLeft);  // Debug log

    // Calculate days, hours, minutes
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    // Create canvas and context
    const canvas = createCanvas(300, 100);
    const ctx = canvas.getContext('2d');

    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText(`${days} Days ${hours} Hours ${minutes} Minutes`, 10, 50);

    // Set response type to PNG
    res.setHeader('Content-Type', 'image/png');

    // Send the image
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);

    console.log("Image sent successfully");  // Debug log
  } catch (error) {
    console.error("Error occurred:", error);  // Debug log
    res.status(500).send('Internal Server Error');
  }
};
