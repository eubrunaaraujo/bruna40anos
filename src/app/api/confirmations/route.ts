import { NextResponse } from 'next/server';

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://mxuilfsozunufpqtiyyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dWlsZnNvenVudWZwcXRpeXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NTc2NTgsImV4cCI6MjA2MTUzMzY1OH0.QYSePqm4QS-tvLySWcRR8axBAcxeQGX5f1OOlJrIJh4';
const TABLE_NAME = 'confirmations';

// Helper function to make Supabase API calls
async function supabaseFetch(path: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const defaultHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation', // Ask Supabase to return the inserted/updated data
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Supabase API Error:', errorData);
      throw new Error(`Supabase error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    // For DELETE requests with Prefer: return=minimal, Supabase returns 204 No Content
    if (response.status === 204) {
        return NextResponse.json({ message: 'Delete successful' }, { status: 200 });
    }

    return NextResponse.json(await response.json(), { status: response.status });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}

// GET: Fetch all confirmations
export async function GET(request: Request) {
  // Select all columns, order by creation date descending
  const path = `${TABLE_NAME}?select=*&order=created_at.desc`;
  return supabaseFetch(path, { method: 'GET' });
}

// POST: Save a new confirmation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companions, message } = body;

    // Basic validation
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const dataToInsert = {
      name,
      companions: companions ? parseInt(companions, 10) : 0, // Ensure companions is a number
      message: message || null, // Allow empty message
    };

    const path = `${TABLE_NAME}`;
    return supabaseFetch(path, {
      method: 'POST',
      body: JSON.stringify(dataToInsert),
    });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to parse request body or save confirmation' }, { status: 400 });
  }
}

// DELETE: Clear all confirmations
export async function DELETE(request: Request) {
    // Delete all rows. Use a filter that always matches (e.g., id is not null)
    // Supabase requires a filter for DELETE, even to delete all rows.
    // We use `Prefer: return=minimal` because we don't need the deleted data back.
    const path = `${TABLE_NAME}?id=not.is.null`;
    return supabaseFetch(path, {
        method: 'DELETE',
        headers: {
            'Prefer': 'return=minimal'
        }
    });
}

