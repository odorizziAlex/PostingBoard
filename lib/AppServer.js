/* eslint-env node */

/**
 * DESCRIPTION: This class sends an ics file via nodemailer to the given email
 * address. The informations for the given post ar read out from the html 
 * placeholders.
 */

const path = require("path"),
  express = require("express"),
  nodemailer = require("nodemailer"),
  bodyParser = require("body-parser"),
  { writeFileSync } = require("fs"),
  ics = require("ics");

/**
 * Returns needed array for setting a start date to the .ics file.
 * @param {*} startDate start date of the event from the given post.
 */
function getFormattedStartDate(startDate) {
  let data = startDate.split("-");
  return [data[0], data[1], data[2], 0, 0];
}

/**
 * Calculates the duration of the post's event and adds 23 hours and 
 * 55 minutes to the end date, so the last day is still included
 * in the duratiion of the post.
 * @param {*} startDate when the event from the post starts
 * @param {*} endDate when the event from the post ends
 */
function getDuration(startDate, endDate) {
  let start = new Date(startDate),
    end = new Date(endDate),
    timeDifference = Math.abs(end.getTime() - start.getTime()),
    millis = 1000,
    seconds = 60,
    minutes = 60,
    hours = 24,
    dayDifference = Math.ceil(timeDifference / (millis * seconds * minutes *
      hours));
  return { days: dayDifference, hours: 23, minutes: 55 };
}

/**
 * ics.createEvent() returns a Promise, which means, that this has to be a async await construct.
 * @param {*} data The informations from the clicked post that need to be set into the ics file.
 */
async function createICSFile(data) {
  await ics.createEvent({
    title: data.title,
    description: "Event typ: " + data.category +
      ".\nPostingBoard Uni Regensburg (MME 2019)",
    start: getFormattedStartDate(data.start),
    duration: getDuration(data.start, data.end),
    organizer: {
      name: data.faculty,
      email: "noreply.postingboard@gmail.com",
    },
  }, (error, value) => {
    if (error) {
      console.log(error);
    }
    writeFileSync(__dirname + "/PostingBoard-Event.ics", value);
  });
}

/**
 * AppServer
 *
 * Creates a simple web server by using express to static serve files from a given directory.
 *
 * @author: Alexander Bazo
 * @version: 1.0
 */

class AppServer {

  /**
   * Creates full path to given appDir and constructors express application with
   * static "/app" route to serve files from app directory.
   * 
   * @constructor
   * @param  {String} appDir Relative path to application dir (from parent)
   */
  constructor(appDir) {
    this.appDir = path.join(__dirname, "../", appDir);
    this.app = express();
    this.app.use("/app", express.static(this.appDir));
    // Body Parser Middleware
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }

  /**
   * Starts server on given port
   * 
   * @param  {Number} port Port to use for serving static files
   */
  start(port) {
    this.server = this.app.listen(port, function() {
      console.log("---------------------------------------------");
      console.log(
        `AppServer started. Client available at http://localhost:${port}/app`
      );
    });
    this.initRouts();
  }

  initRouts() {
    this.app.post("/app", this.postMessage.bind(this));
  }
  /**
   * transporter.sendMail() returns a Promise, which means, that this has to be a async await construct.
   */
  async postMessage(req, res) {
    const output = `
      <h1>PostingBoard</h1>
      <p> Du hast dir dieses Plakat selbst zugesendet.\n
      Um es in deinen Kalender abzuspeichern, doppelklick die .ics datei.</p>
      `;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "noreply.postingboard@gmail.com",
        pass: "PostingBoard",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    createICSFile(req.body);

    await transporter.sendMail({
      from: '"PostingBoard MME UniRegensburg 2019" <noreply.postingboard@gmail.com>',
      to: req.body.email,
      subject: "Plakat von PostingBoard",
      attachments: [{
        filename: req.body.title + "_PostingBoard-Event.ics",
        path: __dirname + "/PostingBoard-Event.ics",
      }],
      html: output,
    });
    res.redirect("back");
  }

  /**
   * Stops running express server
   */
  stop() {
    if (this.server === undefined) {
      return;
    }
    this.server.close();
  }

}

module.exports = AppServer;