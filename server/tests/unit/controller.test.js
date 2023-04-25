const db = require('../../config/db');
const utils = require('../../utils');
const { startGame, getLifetimeWins } = require('../../controllers');

jest.mock('../../config/db', () => ({
  Game: {
    create: jest.fn()
  },
  Player: {
    findAll: jest.fn(),
    count: jest.fn(),
    increment: jest.fn()
  }
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  shuffle: jest.fn()
}));

describe('startGame', () => {
  it('should return an error if number of players is not two', async () => {
    db.Player.findAll.mockResolvedValue(3);
    
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
    
    await startGame(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('should create a new game and return the response', async () => {
    // Set up mock data and expected response
    const players = [{ name: 'Player 1', wins: 2, increment: jest.fn()}, { name: 'Player 2', wins: 10, increment: jest.fn() }];

    // Mock database methods
    db.Player.count.mockResolvedValue(2);
    db.Player.findAll.mockResolvedValue(players);
    db.Game.create.mockResolvedValue({ update: jest.fn() });
    utils.shuffle.mockImplementation((arr) => arr);
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };
    
    // Make request to controller function
    await startGame(req, res);
        
    // expect there is a draw and there are 13 rounds
    expect(res.json.mock.calls[0][0].draw).toBe(true);
    expect(res.json.mock.calls[0][0].rounds.length).toBe(13);
  });

});

describe('getLifetimeWins', () => {
  it('should return an array of player objects with name and wins', async () => {
    const expectedResponse = [{ name: 'Player 1', wins: 2 }, { name: 'Player 2', wins: 10 }];
    db.Player.findAll.mockResolvedValue(expectedResponse);
    
    const req = {};
    const res = {
      json: jest.fn()
    };
    
    await getLifetimeWins(req, res);
    
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Player 1', wins: 2 }),
        expect.objectContaining({ name: 'Player 2', wins: 10 })
      ])
    );
  });

  it('should respond with a 500 error if the database query fails', async () => {
    // Mock the database module and its `findAll` method to throw an error
    db.Player.findAll.mockRejectedValue(new Error('Database error'));

    // Define the request and response objects
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    // Call the controller function
    await getLifetimeWins(req, res);

    // Check that the response is an error
    // expect(res.json).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});



  