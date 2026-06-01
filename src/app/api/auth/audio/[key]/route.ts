import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    const { key } = await params
    const buffer = (global as any).audioCache?.[key]
    if (!buffer) {
        return NextResponse.json({ error: 'Audio not found' }, { status: 404 })
    }
    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': buffer.length.toString(),
        },
    })
}