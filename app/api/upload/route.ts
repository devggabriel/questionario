// Este arquivo cria uma API route para upload de arquivos de áudio
import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { mkdir } from "fs/promises"

// Função para garantir que o diretório exista
async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    // Ignora erro se o diretório já existir
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Recebe o arquivo enviado pelo formulário
    const formData = await request.formData()
    const file = formData.get("file") as File
    const questionId = formData.get("questionId") as string

    if (!file || !questionId) {
      return NextResponse.json({ error: "Arquivo ou ID da pergunta não fornecido" }, { status: 400 })
    }

    // Converte o arquivo para um buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Define o caminho onde o arquivo será salvo
    // IMPORTANTE: Em produção, você deve usar um serviço de armazenamento em nuvem como Vercel Blob, AWS S3, etc.
    const uploadDir = path.join(process.cwd(), "public", "uploads")

    // Garante que o diretório exista
    await ensureDirectoryExists(uploadDir)

    // Cria um nome de arquivo único baseado no ID da pergunta
    const filename = `question_${questionId}_${Date.now()}.mp3`
    const filePath = path.join(uploadDir, filename)

    // Salva o arquivo no servidor
    await writeFile(filePath, buffer)

    // Retorna o caminho público do arquivo
    const publicPath = `/uploads/${filename}`

    // Em produção, você salvaria este caminho em um banco de dados
    return NextResponse.json({
      success: true,
      filePath: publicPath,
    })
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error)
    return NextResponse.json({ error: "Falha ao fazer upload do arquivo" }, { status: 500 })
  }
}

// NOTA: Esta implementação salva os arquivos localmente no servidor.
// Para uma solução em produção, você deve usar um serviço de armazenamento em nuvem.
// Veja os comentários abaixo para implementações alternativas.

/*
OPÇÃO 1: USANDO VERCEL BLOB STORAGE (RECOMENDADO PARA PROJETOS HOSPEDADOS NA VERCEL)

import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string;
    
    if (!file || !questionId) {
      return NextResponse.json({ error: 'Arquivo ou ID da pergunta não fornecido' }, { status: 400 });
    }

    // Faz upload para o Vercel Blob Storage
    const blob = await put(`audios/question_${questionId}_${Date.now()}.mp3`, file, {
      access: 'public',
    });

    // Retorna a URL do arquivo
    return NextResponse.json({ 
      success: true, 
      filePath: blob.url 
    });
    
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    return NextResponse.json({ error: 'Falha ao fazer upload do arquivo' }, { status: 500 });
  }
}

PARA CONFIGURAR:
1. Instale o pacote: npm install @vercel/blob
2. Configure as variáveis de ambiente no seu projeto Vercel:
   - BLOB_READ_WRITE_TOKEN (obtenha este token no dashboard da Vercel)
*/

/*
OPÇÃO 2: USANDO AWS S3

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string;
    
    if (!file || !questionId) {
      return NextResponse.json({ error: 'Arquivo ou ID da pergunta não fornecido' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `question_${questionId}_${Date.now()}.mp3`;
    
    // Faz upload para o S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `audios/${filename}`,
      Body: buffer,
      ContentType: 'audio/mpeg',
    }));

    // Constrói a URL do arquivo
    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/audios/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      filePath: fileUrl 
    });
    
  } catch (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    return NextResponse.json({ error: 'Falha ao fazer upload do arquivo' }, { status: 500 });
  }
}

PARA CONFIGURAR:
1. Instale os pacotes: npm install @aws-sdk/client-s3
2. Configure as variáveis de ambiente:
   - AWS_REGION
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_S3_BUCKET_NAME
*/

