import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

interface ClientInfo {
  userId: string;
  ws: WebSocket;
}

const activeClients = new Map<string, ClientInfo>();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export function initWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws: WebSocket, req) => {
    // Determine userId from query params or headers
    const url = new URL(req.url || '', 'http://localhost');
    const token = url.searchParams.get('token');
    
    let userId: string | null = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        console.error('WebSocket connection authentication failed:', err);
        ws.close(4001, 'Unauthorized');
        return;
      }
    } else {
      console.warn('WebSocket connection attempt without token');
      ws.close(4001, 'Token required');
      return;
    }

    const clientId = Math.random().toString(36).substring(2, 9);
    activeClients.set(clientId, { userId, ws });
    console.log(`WebSocket client connected. ClientID: ${clientId}, UserID: ${userId}`);

    ws.on('close', () => {
      activeClients.delete(clientId);
      console.log(`WebSocket client disconnected. ClientID: ${clientId}`);
    });

    ws.on('error', (err) => {
      console.error(`WebSocket error for ClientID ${clientId}:`, err);
    });
  });
}

// Notify all members of a circle (excluding the sender if specified)
export async function notifyCircle(circleId: string, payload: any, excludeUserId?: string) {
  try {
    // Get all active member user_ids in this circle
    const res = await pool.query(
      `SELECT user_id FROM circle_members WHERE circle_id = $1 AND is_active = TRUE`,
      [circleId]
    );
    const memberIds = res.rows.map(row => row.user_id);

    // Send payload to each active connection that belongs to a member
    for (const [clientId, client] of activeClients.entries()) {
      if (memberIds.includes(client.userId)) {
        if (excludeUserId && client.userId === excludeUserId) {
          continue; // Skip the sender
        }
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify(payload));
        }
      }
    }
  } catch (error) {
    console.error('Error notifying circle members via WebSocket:', error);
  }
}
