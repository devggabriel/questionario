// Este arquivo cria uma API route para salvar e recuperar perguntas e URLs de áudio
import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

// Caminho para o arquivo JSON que armazenará os dados
const dataFilePath = path.join(process.cwd(), "data", "questions.json")

// Função para garantir que o diretório exista
async function ensureDirectoryExists() {
  const dir = path.dirname(dataFilePath)
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    // Ignora erro se o diretório já existir
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error
    }
  }
}

// Função para ler os dados do arquivo
async function readData() {
  try {
    await ensureDirectoryExists()
    const data = await fs.readFile(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    // Se o arquivo não existir, retorna um objeto vazio
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { questions: [], audioUrls: [] }
    }
    throw error
  }
}

// Função para escrever dados no arquivo
async function writeData(data: any) {
  await ensureDirectoryExists()
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8")
}

// Rota GET para obter perguntas e URLs de áudio
export async function GET() {
  try {
    const data = await readData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Erro ao ler dados:", error)
    return NextResponse.json({ error: "Falha ao ler dados" }, { status: 500 })
  }
}

// Rota POST para salvar perguntas e URLs de áudio
export async function POST(request: NextRequest) {
  try {
    const { questions, audioUrls } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Formato de dados inválido" }, { status: 400 })
    }

    await writeData({ questions, audioUrls })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar dados:", error)
    return NextResponse.json({ error: "Falha ao salvar dados" }, { status: 500 })
  }
}

// NOTA: Esta implementação salva os dados em um arquivo JSON no servidor.
// Para uma solução em produção, você deve usar um banco de dados.
// Veja os comentários abaixo para implementações alternativas.

/*
OPÇÃO 1: USANDO MONGODB

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Conecta ao MongoDB
const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const database = client.db('questionnaire');
const collection = database.collection('questions');

export async function GET() {
  try {
    await client.connect();
    const data = await collection.findOne({ id: 'main' });
    return NextResponse.json(data || { questions: [], audioUrls: [] });
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    return NextResponse.json({ error: 'Falha ao ler dados' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { questions, audioUrls } = await request.json();
    
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Formato de dados inválido' }, { status: 400 });
    }
    
    await client.connect();
    await collection.updateOne(
      { id: 'main' },
      { $set: { questions, audioUrls } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return NextResponse.json({ error: 'Falha ao salvar dados' }, { status: 500 });
  } finally {
    await client.close();
  }
}

PARA CONFIGURAR:
1. Instale o pacote: npm install mongodb
2. Configure a variável de ambiente MONGODB_URI com sua string de conexão
*/

/*
OPÇÃO 2: USANDO SUPABASE

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('questionnaire')
      .select('*')
      .eq('id', 'main')
      .single();
      
    if (error) throw error;
    
    return NextResponse.json(data || { questions: [], audioUrls: [] });
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    return NextResponse.json({ error: 'Falha ao ler dados' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { questions, audioUrls } = await request.json();
    
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Formato de dados inválido' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('questionnaire')
      .upsert({ 
        id: 'main', 
        questions, 
        audioUrls,
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    return NextResponse.json({ error: 'Falha ao salvar dados' }, { status: 500 });
  }
}

PARA CONFIGURAR:
1. Instale o pacote: npm install @supabase/supabase-js
2. Configure as variáveis de ambiente:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
3. Crie uma tabela 'questionnaire' no Supabase com as colunas:
   - id (text, primary key)
   - questions (jsonb)
   - audioUrls (jsonb)
   - updated_at (timestamp)
*/

