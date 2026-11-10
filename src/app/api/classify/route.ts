import { NextResponse } from 'next/server';
import { classifyAspiration } from '@/lib/nlpClassifier';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Teks tidak boleh kosong' }, { status: 400 });
    }

    const result = classifyAspiration(text);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal melakukan klasifikasi', details: String(error) }, { status: 500 });
  }
}
