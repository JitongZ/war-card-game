# War-card-game

## Introduction
War-card-game is an application that allows you to play the game of [War](https://en.wikipedia.org/wiki/War_(card_game)). The repository contains both a backend and a frontend implementation, and provides a Dockerfile for easy deployment on any machine. The project is built using the Express.js and React frameworks, and uses a MySQL database to store game data.

The backend RESTful service has three endpoints:
	* `POST /start`: An endpoint to start a game. Two simulated players will play out the game. It will respond with the game result and an array of all cards played at each round. 
	* `GET /lifetime-wins`: An endpoint to get lifetime wins for each player stored in a database.
  * `DELETE /clear`: An endpoint to erase all game records and players' scores.

## Getting Started
Currently, the deployment involves two steps. 
1. We need to deploy the backend server and the database. After this step, you are ready to use the API endpoints.
2. If you want to try the simple UI, you also need to deploy the frontend.

Please follow the following instructions for each step.

### Deploying the Backend Server with Docker
To deploy the backend server with Docker, follow these steps:
1. Install Docker on your machine if you haven't already.
2. Clone this repository to your local machine.
3. Navigate to the `war-card-game` directory and run `docker-compose up` to start the backend server and database.
6. The server should now be listening on port 6868. You can test that it's working by navigating to `http://localhost:6868` in your web browser. You should see a message that says "This is a War card game server!".
7. Now you can access the API endpoints by:
  - http://localhost:6868/start
  - http://localhost:6868/lifetime-wins
  - http://localhost:6868/clear

### Running the Frontend Client with Docker
To run the frontend client with Docker, follow these steps:
1. Ensure you have Docker installed on your machine. Ensure your backend docker container is running on port http://localhost:6868.
2. Navigate to the `client` directory and build the Docker image by running `docker build -t war-card-game-client .`.
4. From the `client` directory, run the Docker container by executing `docker run -p 3000:3000 war-card-game-client`.
5. The client should now be listening on port 3000. You can test that it's working by navigating to `http://localhost:3000` in your web browser.

### Screenshots of the frontend UI
This is the default page when you go to `http://localhost:3000`:
<img width="1194" alt="image" src="https://user-images.githubusercontent.com/21675671/234359236-aed922f5-1034-46aa-ac68-5870adfc84b6.png">

If you click `Start New Game`:
<img width="1145" alt="image" src="https://user-images.githubusercontent.com/21675671/234359321-bdcd6fdf-0d00-47fb-895d-8ee505a97a02.png">

Click `Next` to replay the game.
<img width="1164" alt="image" src="https://user-images.githubusercontent.com/21675671/234359717-8a786673-7e47-478c-aab2-dab08ec6042c.png">

There is a draw in the previous round, so we start a "War".
<img width="1209" alt="image" src="https://user-images.githubusercontent.com/21675671/234359895-efd95f2c-8a87-4adc-8d3f-aa4edcb0661c.png">

We can see that Player wins this "War" in this round. Note that if we click `Clear History`, the page will be the same as the default page, where the scores for both players are zeroes and the card board is empty.
Note that the result of the current game and the remaining rounds are displayed. These are spoilers. In a real simulated War card game, these should be hidded.

## Testing
### Backend Server
The backend server uses Jest and Supertest for testing. To run the tests, navigate to the `server` directory and run `npm test`.

### Future Improvements
Here are some potential improvements that could be made to this application in the future:
- Use Swagger for API documentation
- Implement continuous integration and deployment using a tool like Travis CI
- Deploy the application online using Heroku, or a cloud provider like AWS or Google Cloud Platform
- Add more features to the game, such as multiplayer mode or different game modes
- Improve the frontend design and user experience
- Add more tests to improve code coverage and ensure the application is functioning correctly
