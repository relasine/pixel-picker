const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.locals.title = "PixelPicker";

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("public/scripts"));

app.set("port", process.env.PORT || 3000);

app.get("/api/v1/projects", (request, response) => {
  let projects;

  return response.status(200).json(projects);
});

app.post("api/v1/projects", (request, response) => {
  let project = request.body;

  // CREATE NEW PROJECT //

  return response.status(201).json();
});

app.post("api/v1/palettes", (request, response) => {
  let palette = request.body;

  // CREATE NEW PALETTE //

  return response.status(201).json();
});

app.delete("api/v1/palettes", (request, response) => {
  let palette = request.body;

  // DELETE PALETTE //

  return response.status(202).json();
});

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}`);
});
