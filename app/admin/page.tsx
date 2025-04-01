"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Music } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()

  // Perguntas em português
  const questions = [
    "Qual nosso momento mais engraçado?",
    "O que você aprecia em mim? (sem mentir...)",
    "Se eu ainda escrevesse sobre você, gostaria de ler?",
    "Já sonhou comigo sem querer?",
    "Alguma vez, sem querer, você sorriu ao lembrar de mim?",
    "Se eu pudesse te dar um momento de volta, qual você escolheria?",
    "Se fechasse os olhos agora, conseguiria sentir o calor do meu abraço e meu perfume?",
    "Se o tempo voltasse por um instante, você me abraçaria mais forte?",
    "Se eu dissesse que ainda lembro do som da sua risada e o aperto do seu abraço, acreditaria?",
    "Se tudo que vivemos fosse um livro, qual seria o título do nosso capítulo, minha pequena?",
  ]

  // URLs dos arquivos de áudio - COLOQUE SEUS ARQUIVOS MP3 NA PASTA /public/audios/
  const audioUrls = [
    "/audios/audio1.mp3", // Substitua por seus arquivos reais
    "/audios/audio2.mp3",
    "/audios/audio3.mp3",
    "/audios/audio4.mp3",
    "/audios/audio5.mp3",
    "/audios/audio6.mp3",
    "/audios/audio7.mp3",
    "/audios/audio8.mp3",
    "/audios/audio9.mp3",
    "/audios/audio10.mp3",
  ]

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleLogout} className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Voltar ao questionário</span>
            </Button>
            <h1 className="text-2xl font-bold text-slate-700">Painel de Administração</h1>
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle>Instruções para Adicionar Músicas</CardTitle>
            <CardDescription>Siga estes passos para adicionar músicas ao questionário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">Como adicionar músicas ao questionário:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                <li>
                  Crie uma pasta chamada <code className="bg-white px-1 py-0.5 rounded">audios</code> dentro da pasta{" "}
                  <code className="bg-white px-1 py-0.5 rounded">public</code> do seu projeto.
                </li>
                <li>
                  Nomeie seus arquivos MP3 como <code className="bg-white px-1 py-0.5 rounded">audio1.mp3</code>,{" "}
                  <code className="bg-white px-1 py-0.5 rounded">audio2.mp3</code>, etc. (um para cada pergunta).
                </li>
                <li>
                  Coloque os arquivos MP3 na pasta <code className="bg-white px-1 py-0.5 rounded">public/audios/</code>.
                </li>
                <li>Reinicie o servidor para que as mudanças tenham efeito.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Músicas Atuais</CardTitle>
            <CardDescription>Visualize as músicas atualmente configuradas para cada pergunta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="border border-slate-200 p-4 rounded-md">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Music className="h-4 w-4 text-blue-500" /> Pergunta {index + 1}
                  </p>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{question}</p>

                  <div className="mb-4 bg-slate-50 p-3 rounded-md">
                    <p className="text-xs text-slate-400 mb-2">Arquivo: {audioUrls[index]}</p>
                    <audio controls className="w-full">
                      <source src={audioUrls[index]} type="audio/mpeg" />
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              Voltar ao Questionário
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

