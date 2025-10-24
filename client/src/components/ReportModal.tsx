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

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (type: string, reason: string, details: string) => void
  userName: string
}

const REPORT_TYPES = [
  "Informações falsas",
  "Comportamento inadequado",
  "Spam",
  "Assédio",
  "Outro"
]

const REPORT_REASONS = {
  "Informações falsas": [
    "Localização incorreta",
    "Nível salarial incorreto",
    "Setor incorreto",
    "Informações de contato falsas",
    "Outro"
  ],
  "Comportamento inadequado": [
    "Linguagem ofensiva",
    "Comportamento não profissional",
    "Solicitações inadequadas",
    "Outro"
  ],
  "Spam": [
    "Mensagens repetitivas",
    "Propaganda não relacionada",
    "Links suspeitos",
    "Outro"
  ],
  "Assédio": [
    "Assédio verbal",
    "Ameaças",
    "Perseguição",
    "Outro"
  ],
  "Outro": ["Outro"]
}

export function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
}: ReportModalProps) {
  const [type, setType] = useState("")
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

  const handleSubmit = () => {
    onSubmit(type, reason, details)
    onClose()
    // Reset form
    setType("")
    setReason("")
    setDetails("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Denunciar {userName}</DialogTitle>
          <DialogDescription>
            Ajude-nos a manter a comunidade segura. Sua denúncia será analisada pela nossa equipe.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Tipo de Denúncia</label>
            <Select value={type} onValueChange={(value) => {
              setType(value)
              setReason("") // Reset reason when type changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de denúncia" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {type && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Motivo</label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo específico" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS[type as keyof typeof REPORT_REASONS].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Detalhes adicionais</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva a situação com mais detalhes..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!type || !reason}
            onClick={handleSubmit}
            variant="destructive"
          >
            Enviar Denúncia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}