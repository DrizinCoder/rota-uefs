/**
 * Verifica se o botão de ação de uma viagem (iniciar/checkin) deve estar travado
 * com base no dia da semana e horário de partida.
 *
 * @param tripWeekday  - dia da semana da viagem (ex: "Segunda")
 * @param referenceWeekday - dia de referência retornado pelo backend (ex: "Segunda")
 * @param departureTime - horário de partida no formato "HH:MM" ou "HH:MM:SS"
 * @param minutesBeforeUnlock - quantos minutos antes do departure_time o botão desbloqueia
 * @returns true se o botão deve estar TRAVADO, false se estiver LIBERADO
 */
export function isTripButtonLocked(
  tripWeekday: string,
  referenceWeekday: string,
  departureTime: string,
  minutesBeforeUnlock: number
): boolean {
  // Se a viagem não é do dia de referência, trava automaticamente
  if (tripWeekday !== referenceWeekday) {
    return true;
  }

  // Parse do departure_time para minutos desde meia-noite
  const [hStr, mStr] = departureTime.split(":");
  const departureMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);

  // Hora atual em minutos desde meia-noite
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Libera se o horário atual for maior que o departure_time (viagem já deveria ter saído)
  if (currentMinutes >= departureMinutes) {
    return false;
  }

  // Libera se faltar menos de X minutos para o horário de partida
  const minutesUntilDeparture = departureMinutes - currentMinutes;
  if (minutesUntilDeparture <= minutesBeforeUnlock) {
    return false;
  }

  // Falta mais de X minutos → trava
  return true;
}
