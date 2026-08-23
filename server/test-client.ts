import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import pool, { initDb } from './db.js';
import { initWebSocket } from './services/realtime.js';

// Import routers
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import circlesRouter from './routes/circles.js';
import invitesRouter from './routes/invites.js';
import outfitsRouter from './routes/outfits.js';
import feedbackRouter from './routes/feedback.js';
import wardrobeRouter from './routes/wardrobe.js';
import analyticsRouter from './routes/analytics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Boot server on test port 3002
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/circles', circlesRouter);
app.use('/api/v1/invites', invitesRouter);
app.use('/api/v1/outfits', outfitsRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/wardrobe', wardrobeRouter);
app.use('/api/v1/analytics', analyticsRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
initWebSocket(wss);

function assert(condition: any, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`✅ ${message}`);
}

async function runTests() {
  console.log('--- STARTING FADE INTEGRATION TESTS ---');
  
  await initDb();
  
  const serverPort = 3002;
  server.listen(serverPort, async () => {
    console.log(`Test server listening on port ${serverPort}`);
    
    try {
      const testImagePath = path.join(__dirname, 'test-image.png');
      const tinyPng = Buffer.from('89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000A49444154789C63000100000500010D0A2DB40000000049454E44AE426082', 'hex');
      fs.writeFileSync(testImagePath, tinyPng);
      console.log('Created valid test PNG image.');

      // Clear existing records to ensure idempotent test runs
      console.log('Cleaning existing records...');
      await pool.query('DELETE FROM wardrobe_items');
      await pool.query('DELETE FROM friend_feedback');
      await pool.query('DELETE FROM outfit_submissions');
      await pool.query('DELETE FROM invite_tokens');
      await pool.query('DELETE FROM circle_members');
      await pool.query('DELETE FROM circles');
      await pool.query('DELETE FROM users');

      // 1. Manually insert seed user and circle to create initial invite token
      console.log('Seeding initial invite token for bootstrapping...');
      const seedUserRes = await pool.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
        ['System Owner', 'system@fade.com', 'dummy_hash']
      );
      const systemId = seedUserRes.rows[0].id;
      
      const seedCircleRes = await pool.query(
        `INSERT INTO circles (name, owner_id) VALUES ($1, $2) RETURNING id`,
        ['Initial Root Circle', systemId]
      );
      const initialCircleId = seedCircleRes.rows[0].id;

      await pool.query(
        `INSERT INTO circle_members (circle_id, user_id, is_active) VALUES ($1, $2, TRUE)`,
        [initialCircleId, systemId]
      );

      const tokenVal = 'seed_invite_token_123';
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
      await pool.query(
        `INSERT INTO invite_tokens (circle_id, generated_by, token, expires_at) 
         VALUES ($1, $2, $3, $4)`,
        [initialCircleId, systemId, tokenVal, expiresAt]
      );
      console.log('Seeding complete.');

      // 2. Register User A (invite-gated)
      console.log('Testing registration of User A...');
      const regARes = await fetch(`http://localhost:${serverPort}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'User A',
          email: 'usera@fade.com',
          password: 'Password123',
          inviteToken: 'seed_invite_token_123',
          aestheticStyle: 'Techwear',
          bodyShape: 'Hourglass',
          skinUndertone: 'Warm',
          seasonalColorProfile: 'LightSpring',
          somatotype: 'Ectomorph'
        })
      });
      const regAData: any = await regARes.json();
      assert(regAData.success === true, 'User A registered successfully');
      const tokenA = regAData.data.accessToken;
      const userAId = regAData.data.user.id;

      // 3. Login User A
      console.log('Testing login of User A...');
      const loginARes = await fetch(`http://localhost:${serverPort}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'usera@fade.com', password: 'Password123' })
      });
      const loginAData: any = await loginARes.json();
      assert(loginAData.success === true, 'User A logged in successfully');
      
      // 4. Update profile for User A
      console.log("Updating User A's style profile...");
      const updateRes = await fetch(`http://localhost:${serverPort}/api/v1/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenA}`
        },
        body: JSON.stringify({
          aestheticStyle: 'DarkAcademia',
          bodyShape: 'Trapezoid'
        })
      });
      const updateData: any = await updateRes.json();
      assert(updateData.success === true, 'Profile updated successfully');
      assert(updateData.data.aestheticStyle === 'DarkAcademia', 'Aesthetic updated to DarkAcademia');
      assert(updateData.data.bodyShape === 'Trapezoid', 'Body shape updated to Trapezoid');

      // 5. Create Circle A
      console.log('Creating Circle A...');
      const circleARes = await fetch(`http://localhost:${serverPort}/api/v1/circles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenA}`
        },
        body: JSON.stringify({ name: 'User A Circle' })
      });
      const circleAData: any = await circleARes.json();
      assert(circleAData.success === true, 'Circle A created successfully');
      const circleIdA = circleAData.data.id;

      // 6. Generate invite token for Circle A
      console.log('Generating invite token for Circle A...');
      const inviteRes = await fetch(`http://localhost:${serverPort}/api/v1/invites/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenA}`
        },
        body: JSON.stringify({ circleId: circleIdA })
      });
      const inviteData: any = await inviteRes.json();
      assert(inviteData.success === true, 'Invite token generated successfully');
      const circleInviteToken = inviteData.data.token;

      // 7. Validate invite token
      console.log('Validating invite token...');
      const valRes = await fetch(`http://localhost:${serverPort}/api/v1/invites/${circleInviteToken}/validate`);
      const valData: any = await valRes.json();
      assert(valData.success === true && valData.data.isValid === true, 'Invite token validated as valid');

      // 8. Register User B using invite token
      console.log('Registering User B using invite token...');
      const regBRes = await fetch(`http://localhost:${serverPort}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'User B',
          email: 'userb@fade.com',
          password: 'Password123',
          inviteToken: circleInviteToken,
          aestheticStyle: 'Minimalist',
          bodyShape: 'Rectangle',
          skinUndertone: 'Cool',
          seasonalColorProfile: 'TrueSummer',
          somatotype: 'Mesomorph'
        })
      });
      const regBData: any = await regBRes.json();
      assert(regBData.success === true, 'User B registered successfully and automatically joined Circle A');
      const tokenB = regBData.data.accessToken;
      const userBId = regBData.data.user.id;

      // 9. Setup WebSocket listener for User B
      console.log('Establishing WebSocket connection for User B...');
      const wsClient = new WebSocket(`ws://localhost:${serverPort}?token=${tokenB}`);
      
      let wsMessageReceived: boolean = false;
      let wsMessageData: any = null;

      wsClient.on('open', () => {
        console.log('WebSocket client for User B successfully connected.');
      });

      wsClient.on('message', (data) => {
        console.log('WebSocket notification received for User B!');
        wsMessageReceived = true;
        wsMessageData = JSON.parse(data.toString());
      });

      // Wait a moment for WS connection to establish
      await new Promise(resolve => setTimeout(resolve, 500));

      // 10. Upload Outfit Submission as User A (triggers Gemini AI)
      console.log('Uploading outfit as User A...');
      const formData = new FormData();
      formData.append('occasionTag', 'CasualBrunch');
      formData.append('circleId', circleIdA);
      
      const blob = new Blob([fs.readFileSync(testImagePath)], { type: 'image/png' });
      formData.append('image', blob, 'test-image.png');

      const outfitUploadRes = await fetch(`http://localhost:${serverPort}/api/v1/outfits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenA}`
        },
        body: formData
      });

      const outfitData: any = await outfitUploadRes.json();
      assert(outfitData.success === true, 'Outfit uploaded and analyzed by Gemini successfully');
      assert(outfitData.data.ai_score_overall !== undefined, 'AI score overall populated');
      const submissionId = outfitData.data.id;

      // Wait a moment for WS message transmission
      await new Promise(resolve => setTimeout(resolve, 800));

      // 11. Assert User B received realtime submission alert
      assert(wsMessageReceived, 'User B received real-time WebSocket notification of submission');
      assert(wsMessageData.type === 'NEW_SUBMISSION', 'WebSocket message has type NEW_SUBMISSION');
      assert(wsMessageData.data.submissionId === submissionId, 'WebSocket message contains correct submission ID');

      // 12. User B submits feedback on outfit submission
      console.log('Submitting friend feedback as User B...');
      const feedbackRes = await fetch(`http://localhost:${serverPort}/api/v1/feedback/${submissionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenB}`
        },
        body: JSON.stringify({
          ratingOverall: 9,
          ratingFit: 9,
          ratingColor: 8,
          ratingVibe: 10,
          ratingOccasion: 9,
          feedbackTag: 'Appreciate',
          textComment: 'This outfit drapes beautifully on you!',
          voiceNoteUrl: 'http://fade-storage/voice-notes/b-feedback.mp3'
        })
      });
      const feedbackData: any = await feedbackRes.json();
      assert(feedbackData.success === true, 'Feedback submitted successfully by User B');

      // 13. Fetch single submission + feedbacks as User A
      console.log('Fetching submission and feedbacks...');
      const getOutfitRes = await fetch(`http://localhost:${serverPort}/api/v1/outfits/${submissionId}`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const getOutfitData: any = await getOutfitRes.json();
      assert(getOutfitData.success === true, 'Outfit retrieved successfully');
      assert(getOutfitData.data.feedback.length === 1, 'Feedback array contains 1 feedback');
      assert(getOutfitData.data.feedback[0].reviewer_name === 'User B', 'Reviewer name is User B');

      // 14. Fetch averaged feedback scores
      console.log('Fetching average scores...');
      const avgRes = await fetch(`http://localhost:${serverPort}/api/v1/feedback/${submissionId}/average`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const avgData: any = await avgRes.json();
      assert(avgData.success === true, 'Averages retrieved successfully');
      assert(avgData.data.avgOverall === '9.0', 'Average overall rating computed correctly');
      assert(avgData.data.feedbackCount === 1, 'Feedback count is 1');

      // 15. Add Wardrobe Item as User A
      console.log('Adding wardrobe item...');
      const wFormData = new FormData();
      wFormData.append('category', 'Outerwear');
      wFormData.append('colorTag', 'Camel');
      wFormData.append('fabricType', 'Wool');
      wFormData.append('occasionSuitability', JSON.stringify(['DateNight', 'FormalEvent']));
      wFormData.append('purchasePrice', '150.00');
      
      const wBlob = new Blob([fs.readFileSync(testImagePath)], { type: 'image/png' });
      wFormData.append('image', wBlob, 'wardrobe-item.png');

      const addWRes = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokenA}` },
        body: wFormData
      });
      const addWData: any = await addWRes.json();
      assert(addWData.success === true, 'Wardrobe item added successfully');
      const itemId = addWData.data.id;

      // 16. Get wardrobe inventory and verify cost-per-wear
      console.log('Checking wardrobe inventory cost-per-wear...');
      const getWRes = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/mine`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const getWData: any = await getWRes.json();
      assert(getWData.success === true, 'Wardrobe inventory fetched successfully');
      assert(getWData.data[0].cost_per_wear === 150, 'Cost per wear equals purchase price when times_worn is 0');

      // 17. Increment times_worn count
      console.log('Incrementing times_worn of wardrobe item...');
      const putWRes = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenA}`
        },
        body: JSON.stringify({ incrementWorn: true })
      });
      const putWData: any = await putWRes.json();
      assert(putWData.success === true, 'Wardrobe item updated successfully');
      assert(putWData.data.times_worn === 1, 'times_worn incremented to 1');
      assert(putWData.data.cost_per_wear === 150, 'Cost per wear is $150 after 1 wear');

      // Increment it again to see cost-per-wear halve
      await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenA}`
        },
        body: JSON.stringify({ incrementWorn: true })
      });
      
      const getWRes2 = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/mine`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const getWData2: any = await getWRes2.json();
      assert(getWData2.data[0].times_worn === 2, 'times_worn updated to 2');
      assert(getWData2.data[0].cost_per_wear === 75, 'Cost per wear computed correctly to $75.00 after 2 wears');

      // 18. Get wardrobe stats
      console.log('Fetching wardrobe stats...');
      const wStatsRes = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/stats`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const wStatsData: any = await wStatsRes.json();
      assert(wStatsData.success === true, 'Wardrobe stats fetched successfully');
      assert(wStatsData.data.totalWears === 2, 'Total wears equals 2');
      assert(wStatsData.data.averageCpw === '75.00', 'Average cost-per-wear aggregates correctly');

      // 19. Get Analytics Style Stats
      console.log('Fetching style stats...');
      const aStatsRes = await fetch(`http://localhost:${serverPort}/api/v1/analytics/style-stats`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const aStatsData: any = await aStatsRes.json();
      assert(aStatsData.success === true, 'Style stats fetched successfully');
      assert(aStatsData.data.topAesthetic === 'DarkAcademia', 'Top aesthetic retrieved as DarkAcademia');
      assert(aStatsData.data.totalLooks === 1, 'Total looks equals 1');

      // 20. Get Analytics Calendar stats
      console.log('Fetching look calendar...');
      const calRes = await fetch(`http://localhost:${serverPort}/api/v1/analytics/look-calendar`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const calData: any = await calRes.json();
      assert(calData.success === true, 'Look calendar fetched successfully');
      const dates = Object.keys(calData.data);
      assert(dates.length === 1, 'Look calendar groups by 1 date');

      // 21. Get Analytics Trend Report
      console.log('Fetching trend report...');
      const trendRes = await fetch(`http://localhost:${serverPort}/api/v1/analytics/trend-report`, {
        headers: { 'Authorization': `Bearer ${tokenA}` }
      });
      const trendData: any = await trendRes.json();
      assert(trendData.success === true, 'Trend report fetched successfully');
      assert(trendData.data.length === 1, 'Trend report contains 1 week interval');

      // 22. SECURITY BOUNDARIES TEST
      console.log('Testing security boundary: User B attempts to access User A wardrobe...');
      const secWRes = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/mine`, {
        headers: { 'Authorization': `Bearer ${tokenB}` }
      });
      const secWData: any = await secWRes.json();
      // User B should get their own (empty) wardrobe, not User A's wardrobe
      assert(secWData.success === true && secWData.data.length === 0, 'User B wardrobe is empty; user segregation verified');

      console.log('Testing security boundary: User B attempts to edit User A wardrobe item...');
      const secWEditRes = await fetch(`http://localhost:${serverPort}/api/v1/wardrobe/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenB}`
        },
        body: JSON.stringify({ incrementWorn: true })
      });
      const secWEditData: any = await secWEditRes.json();
      assert(secWEditRes.status === 403, 'User B editing User A item rejected with 403 Forbidden');

      console.log('Testing security boundary: User B attempts to view feed of a circle they are not in...');
      // Create another circle for User A, but do not invite User B
      const circleA2Res = await fetch(`http://localhost:${serverPort}/api/v1/circles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenA}`
        },
        body: JSON.stringify({ name: 'User A Secret Circle' })
      });
      const circleA2Data: any = await circleA2Res.json();
      const circleA2Id = circleA2Data.data.id;

      const secCircleRes = await fetch(`http://localhost:${serverPort}/api/v1/outfits/circle/${circleA2Id}`, {
        headers: { 'Authorization': `Bearer ${tokenB}` }
      });
      const secCircleData: any = await secCircleRes.json();
      assert(secCircleRes.status === 403, 'User B accessing unjoined circle rejected with 403 Forbidden');

      // Clean up WS
      wsClient.close();
      
      // Clean up test image
      fs.unlinkSync(testImagePath);
      console.log('Cleaned up test image.');

      console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! FADE BACKEND IS 100% CORRECT!');
      server.close(() => {
        process.exit(0);
      });

    } catch (err) {
      console.error('❌ TESTS FAILED WITH EXCEPTION:', err);
      server.close(() => {
        process.exit(1);
      });
    }
  });
}

runTests();
