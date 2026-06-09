import { Suspense } from "react"
import { EmbarqueScreen } from "@/components/passageiro/screens/embarque-screen"

export default function TelaEmbarquePage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EmbarqueScreen />
    </Suspense>
  )
}