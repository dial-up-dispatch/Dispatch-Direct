// The Void — response library
// Copy is final. Do not alter response strings.
// Bucket structure supports V2 time-aware selection — do not flatten.

const quietWitness = [
  "received.",
  "it was heard.",
  "noted. it joins the others.",
  "acknowledged.",
]

const releaseConfirmation = [
  "you don't need to carry that one anymore.",
  "it's handled.",
  "it left you. that's what matters.",
  "it no longer belongs to you.",
]

const ancientCosmic = [
  "the void has been holding things since before language existed. this one is safe.",
  "it joins everything that was too big to say out loud.",
  "some things just need somewhere to land.",
  "it settles somewhere very deep.",
]

const dryWry = [
  "filed under: things that felt enormous at 2am.",
  "acknowledged. the void remains unmoved. so can you.",
  "the void has received stranger. considerably stranger.",
  "it will not follow you back.",
]

const allResponses = [
  ...quietWitness,
  ...releaseConfirmation,
  ...ancientCosmic,
  ...dryWry,
]

let lastResponse: string | null = null

export function pickResponse(): string {
  const available = allResponses.filter(r => r !== lastResponse)
  const picked = available[Math.floor(Math.random() * available.length)] ?? allResponses[0]
  lastResponse = picked
  return picked
}
