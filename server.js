const bodyParser = require("body-parser"); //allows server.js to parse the json data in the request object
const express = require("express"); //imports express
const app = express(); //creates an instance of app
const environment = process.env.NODE_ENV || "development"; //sets the development
const configuration = require("./knexfile")[environment]; //configures knex specific to the environment
const database = require("knex")(configuration); //initializes the database

app.locals.title = "PixelPicker"; //sets the title of the server

app.use(bodyParser.json()); //initializes bodyParser
app.use(express.static("public")); //grants access to the public folder

app.set("port", process.env.PORT || 3000); //sets the port based on the environnment or defaults to 3000

app.get("/api/v1/projects", (request, response) => {
  //end point for project get requests
  database("projects") //selects the projects table
    .select() //selects all projects in the table
    .then(projects => {
      response.status(200).json(projects); //sends the projects object as a response
    })
    .catch(error => {
      response.status(500).json({ error }); //sends an error
    });
});

app.post("/api/v1/projects", (request, response) => {
  //end point for project post requests
  const project = request.body; //sets projects equal to the request body

  if (!project.title) {
    //evaluates for a project title
    return response.status(422).send({
      error: `Expected format {title: <String>}. You're missing a 'title' property.` //sends an error if no title
    });
  }

  database("projects") //selects the projects table
    .insert(project, "id") //inserts the request body into the database and assigns an id
    .then(project => {
      response.status(201).json({ id: project[0] }); //sends the generated id back to the user as a response
    })
    .catch(error => {
      response.status(500).json({ error }); //sends an error
    });
});

app.post("/api/v1/projects/:project_id/palettes", (request, response) => {
  //endpoint for palette post request
  const palette = { ...request.body, project_id: request.params.project_id }; //declares palette variable and sets it equal to the request body and project_id params

  if (!palette.title) {
    //evaluates for a title in the request object
    return response.status(422).send({
      error: `Expected format {title: <String>}. You're missing a 'title' property.` //sends an error if no title
    });
  }

  database("palettes") //selects the palettes table
    .insert(palette, "id") //inserts the response body/project_id param into the palette table with a unique id
    .then(data => {
      response.status(201).json(data); //sends the unique id for the palette back to the user
    })
    .catch(error => {
      response.status(500).json({ error }); //sends an error
    });
});

app.get("/api/v1/projects/:project_id/palettes", (request, response) => {
  //get request for palettes for a specific project
  const project = request.params.project_id; //declares a project variable and sets it equal to the project_id param

  database("palettes") //selects the palettes table
    .where("project_id", project) //specifies that we're looking for palettes with a specific project_id (foreign id)
    .select() //selects them
    .then(palettes => {
      if (palettes.length > 0) {
        response.status(200).json(palettes); //sends back the palettes cooresponding to the project_id
      } else {
        response.status(200).json([]); //sends an empty array if no palettes exist with the cooresponding project_id
      }
    })
    .catch(error => {
      response.status(500).json({ error }); //sends back an error
    });
});

app.delete("/api/v1/palettes/:palette_id", (request, response) => {
  //endpoint for a delete palette request
  const palette = request.params.palette_id; //declares a variable and sets it equal to the palette_id param

  database("palettes") //access the palettes table
    .where("id", palette) //select the palette with the cooresponding id from the request body
    .del() //deletes it
    .then(() => {
      response
        .status(202) //indicates success
        .json({ message: `succesfully removed palette #${palette}` });
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get("port"), () => {
  //listen at the port indicated by the environment or 3000
  console.log(`${app.locals.title} is running on ${app.get("port")}`);
});
