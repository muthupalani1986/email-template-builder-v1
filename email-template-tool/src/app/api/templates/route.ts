import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

async function getAuthenticatedUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET - Fetch all templates for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT id, name, header_content, footer_content, body_content, created_at, updated_at FROM email_templates WHERE user_id = $1 ORDER BY updated_at DESC',
      [user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new template
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, header_content, footer_content, body_content } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Template name is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO email_templates (user_id, name, header_content, footer_content, body_content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.id, name, header_content || '', footer_content || '', body_content || '']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}