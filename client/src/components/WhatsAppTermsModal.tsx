import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

interface WhatsAppTermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  userPhone: string
}

export function WhatsAppTermsModal({
  isOpen,
  onClose,
  onAccept,
  userPhone,
}: WhatsAppTermsModalProps) {
  const [accepted, setAccepted] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Termos de Uso do WhatsApp</DialogTitle>
          <DialogDescription>
            Para proteger a privacidade e segurança de todos os usuários, por favor leia e aceite os termos antes de continuar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4 text-sm">
            <p>Ao utilizar o WhatsApp para contacto, você concorda em:</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Ser respeitoso e profissional nas conversas</li>
              <li>Usar o contacto apenas para fins de permuta</li>
              <li>Não compartilhar o número com terceiros</li>
              <li>Respeitar os horários (8h-19h) para contacto</li>
              <li>Não enviar conteúdo inadequado ou spam</li>
              <li>Se for vítima de qualquer tipo de abuso ou assédio, denuncie o perfil</li>
             <li>Tenha cuidado, evite cair em Burlas, lembre-se que a permuta não se paga.</li>
             </ul>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Eu li e aceito os termos de uso do WhatsApp
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!accepted}
            onClick={() => {
              onAccept()
              onClose()
            }}
          >
            Continuar para WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}