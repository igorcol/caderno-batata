"use client"

import { useEffect } from "react"
import OneSignal from "react-onesignal"

export function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID

      if (!appId) {
        console.error("⚠️ OneSignal App ID não encontrado no .env")
        return
      }

      try {
        OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true, 
          // notifyButton: {
          //   enable: true,
          //   prenotify: true,
          //   size: 'medium',
          //   position: 'bottom-left',
          //   showCredit: false,
          //   text: {
          //     'tip.state.unsubscribed': 'Inscreva-se para receber novas batatadas',
          //     'tip.state.subscribed': 'Você está inscrito!',
          //     'tip.state.blocked': 'Você bloqueou as notificações',
          //     'message.action.subscribed': "Obrigado por se inscrever!",
          //     'message.action.resubscribed': "Você está inscrito novamente!",
          //     'message.action.unsubscribed': "Você não receberá mais notificações",
          //     'dialog.main.title': 'Quer saber das novidades?',
          //     'dialog.main.button.subscribe': 'INSCREVER',
          //     'dialog.main.button.unsubscribe': 'SAIR',
          //     'dialog.blocked.title': 'Desbloquear Notificações',
          //     'dialog.blocked.message': 'Siga as instruções para permitir notificações:',
          //     'message.action.subscribing': "Inscrevendo...",
          //     'message.prenotify': "Clique para receber batatadas"
          //   }
          // },
        }).then(() => {
            console.log("✅ OneSignal Inicializado com Sucesso!");
            
            // ATIVA O DEBUG DO JEITO CERTO:
            // Isso vai mostrar logs detalhados no console (F12) se algo estiver bloqueando
            OneSignal.Debug.setLogLevel("trace");
        })
      } catch (error) {
        console.error("Erro ao iniciar OneSignal:", error)
      }
    }
  }, [])

  return null
}