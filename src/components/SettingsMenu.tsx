import { useEffect, useState } from 'react';
import { Menu, X, KeyRound, Trash2 } from 'lucide-react';

const KEY = 'openai_api_key';

export function getOpenAIKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(KEY) || '';
}

export function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const k = getOpenAIKey();
    setValue(k);
    setSaved(!!k);
  }, [open]);

  const save = () => {
    localStorage.setItem(KEY, value.trim());
    setSaved(!!value.trim());
    setOpen(false);
  };
  const remove = () => {
    localStorage.removeItem(KEY);
    setValue('');
    setSaved(false);
  };

  return (
    <>
      <button
        aria-label="Abrir menu"
        onClick={() => setOpen(true)}
        className="fixed right-3 top-3 z-40 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-black/60 text-white backdrop-blur"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[85vw] max-w-sm overflow-y-auto border-l border-white/10 bg-[#11151c] p-5 text-left text-white"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Menu</h2>
              <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <KeyRound className="h-4 w-4 text-emerald-400" /> Chave API da OpenAI
            </div>
            <p className="mt-2 text-sm text-white/60">
              Use sua própria chave quando os créditos de IA da Lovable acabarem. Ela fica salva só neste navegador.
            </p>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="sk-..."
              className="mt-4 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
            <div className="mt-3 flex gap-2">
              <button onClick={save} className="flex-1 rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-black">
                Salvar
              </button>
              {saved && (
                <button onClick={remove} aria-label="Remover chave" className="grid w-11 place-items-center rounded-lg border border-white/15">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-white/50">{saved ? '✓ Chave salva' : 'Nenhuma chave salva'}</p>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs text-emerald-400 underline">
              Obter uma chave na OpenAI
            </a>
          </aside>
        </div>
      )}
    </>
  );
}
