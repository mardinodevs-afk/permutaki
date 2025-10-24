import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import StarRating from "./StarRating"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, reason: string, comment: string) => void
  userName: string
}

const RATING_REASONS = [
  "Comunicação profissional",
  "Processo de permuta bem-sucedido",
  "Resposta rápida",
  "Informações precisas",
  "Outro"
]

export function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [reason, setReason] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (rating === 0) {
      return; // Não permitir avaliação sem estrelas
    }
    onSubmit(rating, reason, comment)
    onClose()
    // Reset form
    setRating(0)
    setReason("")
    setComment("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Avaliar {userName}</DialogTitle>
          <DialogDescription>
            Como foi sua experiência com este usuário? Sua avaliação ajuda a comunidade.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Avaliação</label>
              <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive
              size="lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Motivo principal</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {RATING_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Comentário (opcional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Compartilhe mais detalhes sobre sua experiência..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={rating === 0 || !reason}
            onClick={handleSubmit}
          >
            Enviar Avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}