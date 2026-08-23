import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload, validateImageHeader } from '../middleware/upload.js';

const router = Router();

// POST /api/v1/wardrobe — Add garment to digital closet
router.post('/', authenticateToken, upload.single('image'), validateImageHeader, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const { category, colorTag, fabricType, occasionSuitability, purchasePrice } = req.body;

  if (!category || !colorTag || !fabricType || !occasionSuitability) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Missing required wardrobe fields (category, colorTag, fabricType, occasionSuitability)'
    });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, data: null, error: 'Image file required' });
  }

  // Parse occasionSuitability (could be sent as JSON string array or form-data multi-fields)
  let occasions: string[] = [];
  try {
    occasions = typeof occasionSuitability === 'string' 
      ? JSON.parse(occasionSuitability) 
      : occasionSuitability;
  } catch (err) {
    occasions = [occasionSuitability];
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  const price = purchasePrice ? parseFloat(purchasePrice) : null;

  try {
    const insertRes = await pool.query(
      `INSERT INTO wardrobe_items (
        user_id, image_url, category, color_tag, fabric_type, occasion_suitability, purchase_price, times_worn
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0) RETURNING *`,
      [req.user.id, imageUrl, category, colorTag, fabricType, occasions, price]
    );

    return res.status(201).json({
      success: true,
      data: insertRes.rows[0],
      error: null
    });
  } catch (error: any) {
    console.error('Error adding wardrobe item:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/wardrobe/mine — Get full wardrobe inventory
router.get('/mine', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    const itemsRes = await pool.query(
      `SELECT *, 
        CASE 
          WHEN times_worn > 0 THEN ROUND((purchase_price / times_worn)::numeric, 2) 
          ELSE purchase_price 
        END as cost_per_wear
       FROM wardrobe_items 
       WHERE user_id = $1 
       ORDER BY added_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      data: itemsRes.rows,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching wardrobe:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// PUT /api/v1/wardrobe/:id — Update garment (increment worn count, update details)
router.put('/:id', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const itemId = req.params.id;
  const { category, colorTag, fabricType, occasionSuitability, purchasePrice, incrementWorn } = req.body;

  try {
    // Check ownership
    const ownerCheck = await pool.query(
      `SELECT user_id, times_worn FROM wardrobe_items WHERE id = $1`,
      [itemId]
    );

    if (ownerCheck.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'Wardrobe item not found' });
    }

    if (ownerCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, data: null, error: 'Access denied: Unauthorized to edit this item' });
    }

    let occasions: string[] | undefined = undefined;
    if (occasionSuitability) {
      try {
        occasions = typeof occasionSuitability === 'string' 
          ? JSON.parse(occasionSuitability) 
          : occasionSuitability;
      } catch (err) {
        occasions = [occasionSuitability];
      }
    }

    const price = purchasePrice !== undefined ? parseFloat(purchasePrice) : undefined;
    
    // Explicitly handle increment of times_worn
    let timesWornVal = undefined;
    if (incrementWorn === true || incrementWorn === 'true') {
      timesWornVal = ownerCheck.rows[0].times_worn + 1;
    }

    const updateRes = await pool.query(
      `UPDATE wardrobe_items SET 
        category = COALESCE($1, category),
        color_tag = COALESCE($2, color_tag),
        fabric_type = COALESCE($3, fabric_type),
        occasion_suitability = COALESCE($4, occasion_suitability),
        purchase_price = COALESCE($5, purchase_price),
        times_worn = COALESCE($6, times_worn)
       WHERE id = $7
       RETURNING *,
        CASE 
          WHEN times_worn > 0 THEN ROUND((purchase_price / times_worn)::numeric, 2) 
          ELSE purchase_price 
        END as cost_per_wear`,
      [category, colorTag, fabricType, occasions, price, timesWornVal, itemId]
    );

    return res.json({
      success: true,
      data: updateRes.rows[0],
      error: null
    });
  } catch (error: any) {
    console.error('Error updating wardrobe item:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// DELETE /api/v1/wardrobe/:id — Remove garment
router.delete('/:id', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const itemId = req.params.id;

  try {
    const deleteRes = await pool.query(
      `DELETE FROM wardrobe_items WHERE id = $1 AND user_id = $2 RETURNING *`,
      [itemId, req.user.id]
    );

    if (deleteRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Wardrobe item not found or unauthorized to delete'
      });
    }

    return res.json({
      success: true,
      data: { message: 'Wardrobe item removed successfully' },
      error: null
    });
  } catch (error: any) {
    console.error('Error deleting wardrobe item:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/wardrobe/stats — Cost-per-wear stats
router.get('/stats', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    // 1. Calculate general aggregates
    const aggregatesRes = await pool.query(
      `SELECT 
         COALESCE(SUM(purchase_price), 0) as total_value,
         COALESCE(AVG(purchase_price), 0) as avg_price,
         COALESCE(SUM(times_worn), 0) as total_wears
       FROM wardrobe_items 
       WHERE user_id = $1`,
      [req.user.id]
    );

    // 2. Average cost per wear overall
    const overallCpwRes = await pool.query(
      `SELECT 
         COALESCE(SUM(purchase_price) / NULLIF(SUM(times_worn), 0), 0) as average_cpw
       FROM wardrobe_items 
       WHERE user_id = $1 AND purchase_price IS NOT NULL`,
      [req.user.id]
    );

    // 3. Category distribution with averages
    const categoryRes = await pool.query(
      `SELECT category, COUNT(*) as count, COALESCE(SUM(purchase_price), 0) as total_price, COALESCE(SUM(times_worn), 0) as total_wears
       FROM wardrobe_items
       WHERE user_id = $1
       GROUP BY category`,
      [req.user.id]
    );

    // 4. Top 5 lowest cost-per-wear items (highest value/most used)
    const topValRes = await pool.query(
      `SELECT *,
         ROUND((purchase_price / times_worn)::numeric, 2) as cost_per_wear
       FROM wardrobe_items
       WHERE user_id = $1 AND times_worn > 0 AND purchase_price IS NOT NULL
       ORDER BY cost_per_wear ASC
       LIMIT 5`,
      [req.user.id]
    );

    const agg = aggregatesRes.rows[0];
    const cpw = overallCpwRes.rows[0];

    return res.json({
      success: true,
      data: {
        totalValue: parseFloat(agg.total_value),
        avgPrice: Number(agg.avg_price).toFixed(2),
        totalWears: parseInt(agg.total_wears, 10),
        averageCpw: Number(cpw.average_cpw).toFixed(2),
        categoryBreakdown: categoryRes.rows,
        topValueItems: topValRes.rows
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching wardrobe stats:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

export default router;
