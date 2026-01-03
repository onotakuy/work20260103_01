import { NextRequest, NextResponse } from 'next/server'
import { uploadToR2 } from '@/lib/r2'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'ファイルが提供されていません' }, { status: 400 })
    }

    // ファイル名を生成（タイムスタンプ + 元のファイル名）
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    
    // R2にアップロード
    const buffer = Buffer.from(await file.arrayBuffer())
    const success = await uploadToR2(fileName, buffer, file.type)
    
    if (!success) {
      return NextResponse.json({ error: 'アップロードに失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      fileName,
      url: `/api/files/${fileName}` 
    })
  } catch (error) {
    console.error('アップロードエラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
