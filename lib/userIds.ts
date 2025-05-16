// src/lib/userIds.ts
export const userIds: string[] = [
  'fitnessambassadorshq',
  'averiebishop',
  'atriumsalonstudio',
  'kushakapila30302',
  'kushakapila80003',
  'kushakapila_kompj',
  'fashionlior_bgkbq',
  'fitnessambassadorshq_check_in'
];

export function addUserId(id: string) {
  if (!userIds.includes(id)) {
    userIds.push(id);
  }
}
