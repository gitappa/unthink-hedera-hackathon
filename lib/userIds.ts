// src/lib/userIds.ts
export const userIds: string[] = [
  'fitnessambassadorshq',
  'averiebishop',
  'atriumsalonstudio',
  'kushakapila30302',
  'kushakapila80003',
  'kushakapila_kompj',
  'fashionlior_bgkbq',
  'omgheysam',
  'stats_agent_unthink_ai_event_stats_9287rt',
  'fitnessambassadorshq_check_in',
  'joshemmettufc',
  'johnkoetsier_rycrq',
  'gerber_media_flfvr',
  'holly.fishuhh_tyhiq',
  'therealaanchalarora_tdkzs',
  'tourifique_rnjaq',
  'quarters.app_mkffx',
  'fitqueen.0_azpex',
  'mightymomjess_libkg',
  'torontonewmom_dczed',
  'ishitasalujaimageconsultancy_pieay'
];

export function addUserId(id: string) {
  if (!userIds.includes(id)) {
    userIds.push(id);
  }
}
