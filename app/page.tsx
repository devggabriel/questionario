"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Music, Star, Sparkles, Mail } from "lucide-react"

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(""))
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [showEmailSent, setShowEmailSent] = useState(false)
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

  // Carrega respostas do localStorage no carregamento inicial
  useEffect(() => {
    const savedAnswers = localStorage.getItem("questionnaire-answers")
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [])

  // Salva respostas no localStorage quando elas mudam
  useEffect(() => {
    localStorage.setItem("questionnaire-answers", JSON.stringify(answers))
  }, [answers])

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Envia email com todas as respostas
      sendAnswersByEmail()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleLogin = () => {
    // Em um app real, você validaria contra uma senha segura
    if (password === "123123") {
      setIsAdmin(true)
      setShowLogin(false)
      router.push("/admin")
    } else {
      alert("Senha incorreta")
    }
  }

  // Função para enviar respostas por email
  const sendAnswersByEmail = () => {
    // Prepara o conteúdo do email
    let emailBody = "Respostas do Questionário:\n\n"

    questions.forEach((question, index) => {
      emailBody += `${index + 1}. ${question}\n`
      emailBody += `Resposta: ${answers[index] || "Sem resposta"}\n\n`
    })

    // Codifica o corpo do email para o link mailto
    const encodedBody = encodeURIComponent(emailBody)
    const encodedSubject = encodeURIComponent("Respostas do Questionário")

    // Cria e abre o link mailto
    const mailtoLink = `mailto:gabty.gh@gmail.com?subject=${encodedSubject}&body=${encodedBody}`
    window.open(mailtoLink)

    // Mostra confirmação
    setShowEmailSent(true)
  }

  // Obtém ícone decorativo com base no número da pergunta
  const getQuestionIcon = (index: number) => {
    const icons = [
      <Heart key="heart" className="h-6 w-6 text-rose-400" />,
      <Star key="star" className="h-6 w-6 text-amber-400" />,
      <Sparkles key="sparkles" className="h-6 w-6 text-sky-400" />,
      <Music key="music" className="h-6 w-6 text-purple-400" />,
    ]
    return icons[index % icons.length]
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {showLogin ? (
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Login de Administrador</CardTitle>
            <CardDescription>Digite sua senha para acessar a área de administrador</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowLogin(false)}>
              Cancelar
            </Button>
            <Button onClick={handleLogin}>Entrar</Button>
          </CardFooter>
        </Card>
      ) : showEmailSent ? (
        <Card className="w-full max-w-md shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              Respostas Enviadas!
            </CardTitle>
            <CardDescription>Obrigado por responder todas as perguntas!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-2">Suas respostas foram preparadas para envio por email.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => setShowEmailSent(false)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              Voltar ao início
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="w-full max-w-2xl z-10">
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLogin(true)}
              className="text-slate-400 hover:text-slate-600"
            >
              Admin
            </Button>
          </div>

          <div className="mb-8 space-y-2">
            <Progress value={(currentQuestion + 1) * 10} className="h-2" />
            <p className="text-sm text-center text-slate-500">
              Pergunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 transition-all duration-300 hover:shadow-blue-100/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                {getQuestionIcon(currentQuestion)}
                <CardTitle className="text-xl text-slate-700">{questions[currentQuestion]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg overflow-hidden bg-slate-50 p-3">
                <audio controls className="w-full">
                  <source src={audioUrls[currentQuestion]} type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
              <Textarea
                placeholder="Responda com atenção e carinho!"
                className="min-h-[150px] border-slate-200 focus:border-blue-300"
                value={answers[currentQuestion]}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="border-slate-200 hover:bg-slate-50"
              >
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {currentQuestion < questions.length - 1 ? "Próximo" : "Finalizar"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Adiciona estilos de animação personalizados */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}

