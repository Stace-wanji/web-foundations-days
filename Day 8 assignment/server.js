const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// PostgreSQL Pool Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ticketing_db'
});

// 1. View Seats for an Event
app.get('/api/events/:eventId/seats', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'SELECT id, seat_number, status FROM seats WHERE event_id = $1',
      [eventId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Hold Seats (Atomic Conditional Update & Transaction)
app.post('/api/holds', async (req, res) => {
  const { userId, seatId } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Attempt to atomically lock the seat only if it is currently AVAILABLE
    const updateResult = await client.query(
      `UPDATE seats 
       SET status = 'HELD', version = version + 1 
       WHERE id = $1 AND status = 'AVAILABLE' 
       RETURNING id, seat_number`,
      [seatId]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Seat is already held or booked.' });
    }

    await client.query('COMMIT');
    res.status(201).json({ 
      message: 'Seat successfully held', 
      seatId: updateResult.rows[0].id,
      expiresIn: '10 minutes' 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to hold seat due to conflict.' });
  } finally {
    client.release();
  }
});

// 3. Confirm Order & Checkout
app.post('/api/orders', async (req, res) => {
  const { userId, seatId, amount } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify seat is currently HELD
    const seatCheck = await client.query(
      'SELECT status FROM seats WHERE id = $1',
      [seatId]
    );

    if (seatCheck.rows.length === 0 || seatCheck.rows[0].status !== 'HELD') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Seat hold has expired or is invalid.' });
    }

    // Update seat to BOOKED
    await client.query(
      "UPDATE seats SET status = 'BOOKED' WHERE id = $1",
      [seatId]
    );

    // Insert confirmation record into orders
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, seat_id, amount, status) 
       VALUES ($1, $2, $3, 'CONFIRMED') 
       RETURNING id, created_at`,
      [userId, seatId, amount]
    );

    await client.query('COMMIT');
    res.status(201).json({ 
      message: 'Order confirmed successfully', 
      orderId: orderResult.rows[0].id,
      seatId: seatId 
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Checkout processing failed.' });
  } finally {
    client.release();
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ticketing server running on port ${PORT}`);
});