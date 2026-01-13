"use client"

import { useEffect, useState } from "react"
import { Bell, BellOff } from "lucide-react"
import OneSignal from "react-onesignal"

export function SubscriptionButton() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (OneSignal.User) {
          const optedIn = OneSignal.User.PushSubscription.optedIn;
          setIsSubscribed(!!optedIn);
          
          OneSignal.User.PushSubscription.addEventListener("change", (event) => {
            setIsSubscribed(!!event.current.optedIn);
          });
        }
      } catch (error) {
        console.error("Erro ao checar status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [])

  const handleToggle = async () => {
    if (!OneSignal.User) return;
    if (isSubscribed) {
      await OneSignal.User.PushSubscription.optOut();
    } else {
      await OneSignal.User.PushSubscription.optIn();
    }
  }

  if (loading) return null;

  // MUDANÇA AQUI: Tiramos o 'fixed' e colocamos centralizado com margem
  return (
    <div className="flex justify-center w-full mb-6">
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-6 py-3 border-[3px] border-black neo-shadow transition-all font-display text-lg
          ${isSubscribed 
            ? "bg-white text-gray-500 hover:bg-gray-100 scale-90 opacity-80" // Mais discreto se já inscrito
            : "bg-[#FFD700] text-black hover:-translate-y-1 hover:neo-shadow-lg" // Chamativo se não inscrito
          }
        `}
      >
        {isSubscribed ? (
          <>
            <BellOff className="w-5 h-5" />
            <span className="font-bold font-mono text-sm">NOTIFICAÇÕES ATIVAS</span>
          </>
        ) : (
          <>
            <Bell className="w-5 h-5 fill-black" />
            <span className="font-bold font-mono text-sm">RECEBER NOVIDADES</span>
          </>
        )}
      </button>
    </div>
  )
}