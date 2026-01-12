"use client"

import { useState } from "react"
import { FloatingAddButton } from "@/components/floating-add-button"
import { QuoteModal } from "@/components/quote-modal"

export function ClientPageWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <FloatingAddButton onClick={() => setIsModalOpen(true)} />
      <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}