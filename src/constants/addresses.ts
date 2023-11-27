export const TOKEN_CONTRACT = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TOKEN_CONTRACT! : '';
export const MANAGER_CONTRACT = {
  '1': '0xd310A3041dFcF14Def5ccBc508668974b5da7174',
  '5': '0x0E9F3382Cf2508E3bc83248B5b4707FbA86D7Ee0',
  '999': '0xc521f85613985b7e417fccd5b348f64263d79397',
  '7777777': '0x3ac0e64fe2931f8e082c6bb29283540de9b5371c',
}[typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TOKEN_NETWORK ?? '1' : '1']!;
