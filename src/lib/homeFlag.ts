/**
 * Inlined in <head> by the root layout. Before first paint it marks <html data-home-exam> when this
 * browser has a saved exam, so on the home page a returning visitor sees a placeholder (not the
 * picker and hero) while the dashboard loads. First-time visitors, and browsers without JavaScript,
 * get the picker and hero straight away. It lives in <head> because a <script> rendered inside a
 * React component is not run on client-side navigation (React warns about it).
 */
export const homeExamFlagScript = `try{var s=JSON.parse(localStorage.getItem("studyclip:v1")||"{}");if(s&&s.examId)document.documentElement.dataset.homeExam="1"}catch(e){}`;
