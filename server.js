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
      response.status(500).json({ error });
    });
});

app.post("/api/v1/projects", (request, response) => {
  const project = request.body;

  if (!project.title) {
    return response.status(422).send({
      error: `Expected format {title: <String>}. You're missing a 'title' property.`
    });
  }

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
    .then(data => {
      response.status(201).json(data);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:project_id/palettes", (request, response) => {
  const project = request.params.project_id;

  database("palettes")
    .where("project_id", project)
    .select()
    .then(palettes => {
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

app.delete("/api/v1/palettes/:palette_id", (request, response) => {
  const palette = request.params.palette_id;

  console.log(palette);

  database("palettes")
    .where("id", palette)
    .del()
    .then(() => {
      response
        .status(202)
        .json({ message: `succesfully removed palette #${palette}` });
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get("port"), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}`);
});
