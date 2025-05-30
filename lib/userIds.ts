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
  'fitnessambassadorshq_check_in'
];

export function addUserId(id: string) {
  if (!userIds.includes(id)) {
    userIds.push(id);
  }
}
