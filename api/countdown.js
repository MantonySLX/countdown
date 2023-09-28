
const { createCanvas, loadImage } = require("@napi-rs/canvas");
const GIFEncoder = require("gifencoder");
const { parseISO, differenceInSeconds } = require("date-fns");

module.exports = async (req, res) => {
  try {
    const endDateStr = req.query.end_date || "";
    const endDate = parseISO(endDateStr);
    const now = new Date();
    const timeLeft = differenceInSeconds(endDate, now);

    // Calculate days, hours, minutes
    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    const canvas = createCanvas(300, 200);
    const ctx = canvas.getContext("2d");
    const encoder = new GIFEncoder(300, 200);

    encoder.createReadStream().pipe(res);

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1000); // 1 second
    encoder.setQuality(10);

    const unitValues = [days, hours, minutes];
    const unitLabels = ["Days", "Hours", "Minutes"];

    for (let i = 57; i <= 60; i++) {
      ctx.fillStyle = "#ffd54f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let xOffset = 10;

      unitValues.forEach((value, index) => {
        ctx.font = "24px Arial";
        ctx.fillStyle = "#333";
        ctx.fillText(value.toString(), xOffset, 50);

        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.fillText(unitLabels[index], xOffset, 80);

        const textWidth = ctx.measureText(value.toString()).width;
        xOffset += textWidth + 40;
      });

      ctx.font = "24px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(i.toString(), xOffset, 50);

      ctx.fillStyle = "#333";
      ctx.font = "14px Arial";
      ctx.fillText("Seconds", xOffset, 80);

      encoder.addFrame(ctx);
    }

    encoder.finish();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
