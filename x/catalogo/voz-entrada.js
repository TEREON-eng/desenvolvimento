/* TEREON X — voz opcional para o mesmo campo de texto do intérprete.
   Sem armazenamento de áudio no TEREON; o serviço de reconhecimento é do navegador. */
(function(root){'use strict';
 let active=null;
 const ctor=()=>root.SpeechRecognition||root.webkitSpeechRecognition;
 function supported(){return !!ctor();}
 function stop(){if(!active)return;const instance=active;active=null;try{instance.abort();}catch(_){}}
 function start(onText,onStatus){
  const Engine=ctor();
  if(!Engine){onStatus('Voz indisponível neste navegador. Use texto ou ditado do teclado.',false);return false;}
  if(active){stop();onStatus('Microfone interrompido.',false);return false;}
  try{
   const recognizer=new Engine();active=recognizer;
   recognizer.lang='pt-BR';recognizer.continuous=false;recognizer.interimResults=false;recognizer.maxAlternatives=1;
   recognizer.onstart=()=>{if(active===recognizer)onStatus('Ouvindo… fale o nome do material.',true)};
   recognizer.onresult=event=>{
    if(active!==recognizer)return;
    const transcript=String(event.results?.[event.resultIndex||0]?.[0]?.transcript||'').trim().slice(0,300);
    if(transcript){onText(transcript);onStatus('Transcrição pronta. Confira o texto e confirme as sugestões.',false)}
    else onStatus('Não entendi a fala. Tente novamente ou digite.',false);
   };
   recognizer.onerror=event=>{
    if(active!==recognizer)return;
    const error=String(event.error||'');
    onStatus(error==='not-allowed'||error==='service-not-allowed'?
     'Permissão de microfone negada. Você pode digitar.':
     error==='network'?'Reconhecimento sem conexão. Você pode digitar.':
     error==='no-speech'?'Nenhuma fala reconhecida. Tente novamente.':
     'Não consegui transcrever. Use o texto ou tente outra vez.',false);
   };
   recognizer.onend=()=>{if(active===recognizer){active=null;onStatus('',false)}};
   recognizer.start();return true;
  }catch(_){active=null;onStatus('Não foi possível iniciar o microfone. Confira a permissão ou digite.',false);return false}
 }
 root.TereonXVoice=Object.freeze({supported,start,stop});
})(typeof window!=='undefined'?window:globalThis);
