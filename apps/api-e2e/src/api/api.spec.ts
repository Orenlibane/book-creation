import axios from 'axios';

describe('GET /api/health', () => {
  it('should report service health', async () => {
    const res = await axios.get('/api/health');

    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({
      service: 'book-creation-api',
      status: 'ok',
    });
  });
});
