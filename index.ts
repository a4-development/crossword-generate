import { Word } from './lib/word'
import { BaseWord, Crossword } from './lib/crossword'

const GENE_COUNT = 10

export function createCrosswordWords(baseWords: BaseWord[]): Word[] {
  const crossword = Crossword.initialize(baseWords)

  let genes = initialGene(baseWords)

  for (let i = 0; i < 100; i++) {
    const geneWithEvaluations = genes.map((gene) => {
      crossword.generate(gene)
      return { gene: gene, evaluation: crossword.evaluate() }
    })

    geneWithEvaluations.sort((a, b) => b.evaluation - a.evaluation)

    const nextGenes = []
    nextGenes.push(geneWithEvaluations[0].gene)
    nextGenes.push(geneWithEvaluations[1].gene)

    do {
      let [gene1, gene2] = crossGene(
        geneWithEvaluations[0].gene,
        geneWithEvaluations[1].gene
      )

      if (Math.random() < 0.05) {
        gene1 = mutateGene(gene1)
      } else if (Math.random() < 0.1) {
        gene2 = mutateGene(gene2)
      }

      nextGenes.push(gene1)
      nextGenes.push(gene2)
    } while (nextGenes.length < 10)

    genes = nextGenes
  }
  crossword.generate(genes[0])
  return crossword.words
}

function initialGene(baseWords: BaseWord[]): number[][] {
  let genes = []
  for (let i = 0; i < GENE_COUNT; i++) {
    let gene = baseWords.map((_, i) => i)
    gene = mutateGene(gene, 20)
    genes.push(gene)
  }
  return genes
}

function mutateGene(gene: number[], count: number = 1): number[] {
  for (let i = 0; i < count; i++) {
    let mutatedGene = [...gene]
    const p1 = Math.floor(Math.random() * gene.length)
    const p2 = Math.floor(Math.random() * gene.length)
    mutatedGene[p1] = gene[p2]
    mutatedGene[p2] = gene[p1]
    gene = mutatedGene
  }
  return gene
}

function crossGene(gene1: number[], gene2: number[]): [number[], number[]] {
  const geneLength = gene1.length
  const crossPoints = [
    Math.floor((Math.random() * geneLength) / 2),
    Math.floor((Math.random() * geneLength) / 2) + geneLength / 2,
  ]

  let childGene1 = [...gene1]
  let childGene2 = [...gene2]

  const tmp1 = gene1.slice(crossPoints[0], crossPoints[1])
  const tmp2 = gene2.slice(crossPoints[0], crossPoints[1])

  const replaceRule = tmp1.map((t1, i) => [t1, tmp2[i]])

  childGene1.splice(crossPoints[0], crossPoints[1] - crossPoints[0], ...tmp2)
  childGene2.splice(crossPoints[0], crossPoints[1] - crossPoints[0], ...tmp1)

  for (let i = 0; i < crossPoints[0]; i++) {
    replaceRule.forEach(([a, b]) => {
      if (childGene1[i] === b) childGene1[i] = a
      if (childGene2[i] === a) childGene2[i] = b
    })
  }

  for (let i = crossPoints[1]; i < childGene1.length; i++) {
    replaceRule.forEach(([a, b]) => {
      if (childGene1[i] === b) childGene1[i] = a
      if (childGene2[i] === a) childGene2[i] = b
    })
  }

  return [childGene1, childGene2]
}
