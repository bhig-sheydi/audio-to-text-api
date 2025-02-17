const request = require('supertest');
const mockFs = require('mock-fs');
const app = require('../server'); 

describe('Audio to Text API Tests', () => {

  
  beforeEach(() => {
    mockFs({
      'path/to/mock': {
        'test-audio.mp3': 'fake audio content',
      },
    });
  });

  
  afterEach(() => {
    mockFs.restore();
  });

  it('should transcribe audio file successfully', async () => {
    const res = await request(app)
      .post('/transcribe')
      .attach('audio', 'path/to/mock/test-audio.mp3') 
      .set('Content-Type', 'multipart/form-data');

    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transcription'); 
  });

  it('should return error if no audio file is provided', async () => {
    const res = await request(app)
      .post('/transcribe')
      .set('Content-Type', 'multipart/form-data');

    expect(res.status).toBe(400); 
    expect(res.body).toHaveProperty('error');
  });

  it('should return an error for invalid file type', async () => {
    const res = await request(app)
      .post('/transcribe')
      .attach('audio', 'path/to/mock/invalid-text-file.txt') 
      .set('Content-Type', 'multipart/form-data');

    expect(res.status).toBe(400); 
    expect(res.body).toHaveProperty('error');
  });

  it('should return an error if transcription fails', async () => {
    
    const res = await request(app)
      .post('/transcribe')
      .attach('audio', 'path/to/mock/faulty-audio.mp3') 
      .set('Content-Type', 'multipart/form-data');

    expect(res.status).toBe(500); 
    expect(res.body).toHaveProperty('error', 'Transcription failed');
  });

});

