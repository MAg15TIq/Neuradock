import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Check if ads.txt exists in public folder
    const adsTextPath = path.join(process.cwd(), 'public', 'ads.txt');
    
    try {
      const adsTextContent = await fs.readFile(adsTextPath, 'utf8');
      const lines = adsTextContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      
      return NextResponse.json({
        success: true,
        exists: true,
        accessible: true,
        lineCount: lines.length,
        totalLines: adsTextContent.split('\n').length,
        fileSize: adsTextContent.length,
        hasNetpubEntries: adsTextContent.includes('netpub.media'),
        hasOwnerDomain: adsTextContent.includes('OWNERDOMAIN=neuradock.online'),
        preview: adsTextContent.substring(0, 500) + (adsTextContent.length > 500 ? '...' : '')
      });
    } catch (fileError) {
      return NextResponse.json({
        success: false,
        exists: false,
        accessible: false,
        error: 'ads.txt file not found in public folder',
        details: fileError instanceof Error ? fileError.message : 'Unknown error'
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check ads.txt file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
