import React, { useState } from 'react';
import {
  MessageCircle, Send, Clock, CheckCheck, Eye, Zap, Filter,
  AlertTriangle, Scale, Heart, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Reminder, ReminderTone } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { api } from '../lib/api';

const toneConfig: Record<ReminderTone, { label: string; color: string; icon: React.ElementType; bg: string; border: string }> = {
  cordial: { label: 'Cordial', color: 'text-emerald-600', icon: Heart, bg: 'bg-emerald-50', border: 'border-emerald-200' },
  firm: { label: 'Ferme', color: 'text-amber-600', icon: MessageSquare, bg: 'bg-amber-50', border: 'border-amber-200' },
  urgent: { label: 'Urgent', color: 'text-orange-600', icon: AlertTriangle, bg: 'bg-orange-50', border: 'border-orange-200' },
  legal: { label: 'Mise en demeure', color: 'text-red-600', icon: Scale, bg: 'bg-red-50', border: 'border-red-200' },
};

const statusConfig = {
  sent: { label: 'Envoyé', icon: Send, color: 'text-slate-400' },
  delivered: { label: 'Livré', icon: CheckCheck, color: 'text-blue-500' },
  read: { label: 'Lu', icon: CheckCheck, color: 'text-emerald-500' },
  pending: { label: 'En attente', icon: Clock, color: 'text-amber-500' },
};

export function Reminders() {
  const [dbReminders, setDbReminders] = useState<any[]>([]);
  const [selectedReminderId, setSelectedReminderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    api.get('/reminders')
      .then(res => {
        setDbReminders(res.data);
        if (res.data.length > 0) setSelectedReminderId(res.data[0].id);
      })
      .catch(err => {
        console.error(err);
        toast.error('Erreur lors du chargement des relances');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const selectedReminder = dbReminders.find(r => r.id === selectedReminderId);

  const handleSendReminder = (reminder: any) => {
    toast.success('Relance envoyée !', {
      description: `WhatsApp envoyé à ${reminder.client_name} (${reminder.client_phone})`,
    });
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Chargement de l'historique WhatsApp...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Relances automatiques</h2>
          <p className="text-slate-500 mt-1 text-sm">Scénarios de relance configurables via WhatsApp, SMS et Email.</p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-9 text-sm"
          onClick={() => toast.info('Scénario activé', { description: 'Le moteur de relance n8n est actif.' })}
        >
          <Zap className="w-3.5 h-3.5" />
          Activer le moteur
        </Button>
      </div>

      {/* Reminder Scenarios Timeline */}
      <Card className="border border-slate-100 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Scénario de relance automatique</CardTitle>
          <CardDescription className="text-xs">Escalade automatique du ton selon les jours de retard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {reminderScenarios.map((scenario, index) => {
              const cfg = toneConfig[scenario.tone];
              return (
                <div key={index} className="flex items-start flex-1 min-w-[180px]">
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn('w-10 h-10 rounded-full border-2 flex items-center justify-center', cfg.bg, cfg.border)}>
                      <cfg.icon className={cn('w-4 h-4', cfg.color)} />
                    </div>
                    <div className="mt-3 text-center px-2">
                      <p className="text-xs font-bold text-slate-800">{scenario.label}</p>
                      <p className={cn('text-[10px] font-semibold mt-0.5', cfg.color)}>{cfg.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 capitalize">{scenario.channel}</p>
                    </div>
                  </div>
                  {index < reminderScenarios.length - 1 && (
                    <div className="flex-1 h-0.5 bg-slate-200 mt-5 mx-1 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Reminders List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Relances récentes</h3>
          {dbReminders.length === 0 ? (
            <div className="text-xs text-slate-400 p-4 border border-dashed rounded-xl">Aucune relance envoyée.</div>
          ) : dbReminders.map((reminder) => {
            const toneCfg = toneConfig[reminder.tone as ReminderTone] || toneConfig.cordial;
            const statusCfg = statusConfig[reminder.status as keyof typeof statusConfig] || statusConfig.sent;
            const isSelected = selectedReminderId === reminder.id;
            return (
              <button
                key={reminder.id}
                onClick={() => setSelectedReminderId(reminder.id)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-all duration-150',
                  isSelected
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 truncate">{reminder.client_name}</span>
                      <Badge className={cn('text-[10px] border-none shadow-none px-2 py-0', toneCfg.bg, toneCfg.color)}>
                        {toneCfg.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{reminder.invoice_number} · {Math.floor((Date.now() - new Date(reminder.due_date).getTime()) / 86400000)}j de retard</p>
                  </div>
                  <statusCfg.icon className={cn('w-4 h-4 shrink-0 mt-0.5', statusCfg.color)} />
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {new Date(reminder.sent_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </button>
            );
          })}
        </div>

        {/* WhatsApp Preview */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Aperçu du message</h3>
          {selectedReminder ? (
            <Card className="border border-slate-100 shadow-sm bg-white h-full">
              <CardHeader className="border-b border-slate-50 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{selectedReminder.client_name}</p>
                      <p className="text-xs text-slate-400">{selectedReminder.client_phone} · WhatsApp</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    'text-xs border-none shadow-none',
                    toneConfig[selectedReminder.tone as ReminderTone]?.bg || 'bg-slate-50',
                    toneConfig[selectedReminder.tone as ReminderTone]?.color || 'text-slate-500'
                  )}>
                    {toneConfig[selectedReminder.tone as ReminderTone]?.label || 'Inconnu'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Chat bubble */}
                <div className="flex justify-end mb-4">
                  <div className="max-w-[85%] bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                    <p className="text-sm leading-relaxed">{selectedReminder.message}</p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <p className="text-[10px] text-emerald-200">
                        {new Date(selectedReminder.sent_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {React.createElement(statusConfig[selectedReminder.status as keyof typeof statusConfig]?.icon || statusConfig.sent.icon, { className: "w-3 h-3 text-emerald-200" })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 justify-center mb-6">
                  {React.createElement(statusConfig[selectedReminder.status as keyof typeof statusConfig]?.icon || statusConfig.sent.icon, { className: cn('w-3 h-3', statusConfig[selectedReminder.status as keyof typeof statusConfig]?.color || 'text-slate-400') })}
                  <span>{statusConfig[selectedReminder.status as keyof typeof statusConfig]?.label || 'Envoyé'}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Facture</span>
                    <span className="font-medium">{selectedReminder.invoice_number}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Jours de retard</span>
                    <span className="font-medium text-red-600">{Math.floor((Date.now() - new Date(selectedReminder.due_date).getTime()) / 86400000)} jours</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Canal</span>
                    <span className="font-medium capitalize">WhatsApp</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 text-sm"
                  onClick={() => handleSendReminder(selectedReminder)}
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer une nouvelle relance
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
              Sélectionnez une relance pour voir l'aperçu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
