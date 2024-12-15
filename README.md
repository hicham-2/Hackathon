# hackathon

A VueJS Node Express MongoDB Project with docker

## Getting Started

1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/) (v2.10+)
2. Run `docker compose build --no-cache` to build fresh images
3. Run `docker compose up` to start the project
4. Open `http://localhost:3000` for the front and `https://localhost:8080` for the backend in your favorite web browser and [accept the auto-generated TLS certificate](https://stackoverflow.com/a/15076602/1352334)
5. Run `docker compose down --remove-orphans` to stop the Docker containers.
6. Run `docker compose exec backend bash ` to be in the container of the backend and run `node src/data/fixtures.js` to load fixtures.
7. three users payload = {
    -login : `admin.1@mail.com`      | mpd : `123`
    -login : `professeur.1@mail.com` | mpd : `124`
    -login : `professeur.2@mail.com` | mpd : `125`
}
