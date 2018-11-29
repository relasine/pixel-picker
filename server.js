const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.locals.title = "PixelPicker";

app.use(bodyParser.json());
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

app.get("/api/v1/projects", (request, response) => {
  database("projects")
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error: error.message });
    });
});

app.post("/api/v1/projects", (request, response) => {
  const project = request.body;

  if (!project.title) {
    return response.status(422).send({
      error: `Expected format {title: <String>}. You're missing a 'title' property.`
    });
  }

  console.log(project);

  database("projects")
    .insert(project, "id")
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post("/api/v1/projects/:project_id/palettes", (request, response) => {
  const palette = { ...request.body, project_id: request.params.project_id };

  if (!palette.title) {
    return response.status(422).send({
      error: `Expected format {title: <String>}. You're missing a 'title' property.`
    });
  }

  database("palettes")
    .insert(palette, "id")
    .then(palette => {
      console.log(palette);
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:project_id/palettes", (request, response) => {
  const project = request.params.project_id;

  console.log(project);

  database("palettes")
    .where("project_id", project)
    .select()
    .then(palettes => {
      console.log(palettes);
      if (palettes.length > 0) {
        response.status(200).json(palettes);
      } else {
        response.status(200).json([]);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete("api/v1/palettes", (request, response) => {
  let palette = request.body;

  // DELETE PALETTE //

  return response.status(202).json();
});

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}`);
});
