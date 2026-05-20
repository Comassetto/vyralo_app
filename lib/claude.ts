import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface SlideData {
  numero: number
  tipo: 'capa' | 'conteudo' | 'lista' | 'citacao' | 'estatistica' | 'cta'
  titulo: string
  subtitulo?: string
  conteudo: string
  destaque?: string
  itens?: string[]
}

export interface GeracaoResult {
  slides: SlideData[]
  legenda: string
}

export function calcularCreditos(numSlides: number): number {
  if (numSlides <= 5) return 1
  if (numSlides <= 8) return 2
  return 3
}

export async function gerarCarrossel(params: {
  tema: string
  descricao: string
  rede: string
  estilo: string
  tom: string
  idioma: string
  numSlides: number
}): Promise<GeracaoResult> {
  const { tema, descricao, rede, estilo, tom, idioma, numSlides } = params

  const systemPrompt = `Você é um especialista em criação de conteúdo para redes sociais, com foco em carrosséis de alta performance para Instagram e outras plataformas.

Suas habilidades incluem:
- Copywriting persuasivo e engajante
- Estruturação de conteúdo educativo em formato de carrossel
- Domínio de hooks, storytelling e CTAs
- Adaptação de tom para diferentes públicos e redes sociais

Ao criar um carrossel, você sempre:
1. Cria um slide de CAPA impactante com hook forte
2. Desenvolve slides de CONTEÚDO com informações valiosas e sucintas
3. Finaliza com um slide de CTA claro e motivador
4. Mantém consistência de tom em todos os slides
5. Usa linguagem adequada para a rede social escolhida

Responda SEMPRE em JSON válido, sem texto antes ou depois, seguindo exatamente o schema solicitado.`

  const userPrompt = `Crie um carrossel com as seguintes especificações:

**Tema:** ${tema}
**Contexto:** ${descricao}
**Rede social:** ${rede}
**Tom de voz:** ${tom}
**Idioma:** ${idioma}
**Número de slides:** ${numSlides}
**Estilo visual:** ${estilo}

Retorne um JSON com este schema exato:
{
  "slides": [
    {
      "numero": 1,
      "tipo": "capa",
      "titulo": "Título principal impactante",
      "subtitulo": "Subtítulo opcional",
      "conteudo": "Texto principal do slide",
      "destaque": "Palavra ou frase em destaque visual (opcional)",
      "itens": ["item 1", "item 2"]
    }
  ],
  "legenda": "Legenda completa para ${rede} com emojis relevantes e hashtags no final. Mínimo 150 palavras, máximo 300."
}

Tipos de slide: "capa", "conteudo", "lista", "citacao", "estatistica", "cta"
O campo "itens" só é necessário quando tipo for "lista".
O último slide deve ser sempre do tipo "cta".
Crie exatamente ${numSlides} slides.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Resposta inesperada da IA')

  const jsonText = content.text.trim()
  const result = JSON.parse(jsonText) as GeracaoResult
  return result
}
