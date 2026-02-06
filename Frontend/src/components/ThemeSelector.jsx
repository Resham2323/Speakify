import { PaletteIcon } from 'lucide-react';
import { useThemeStore } from '../store/useTheme';
import { THEMES } from '../constant/index';

const ThemeSelector = () => {
  const {theme, setTheme} = useThemeStore() 
  return (
    <div className='dropdown dropdown-end'>
      <button tabIndex={0} className='btn btn-ghost btn-circle'>
        <PaletteIcon className='size-5'/>
      </button>

      <div tabIndex={0} className="dropdown-content p-1 shadow-2xl bg-base-200 backdrop-blur-bg mt-2 rounded-2xl w-56 border 
      border-base-content/10 max-h-80 overflow-y-auto">
        <div className="space-y-1">
          {THEMES.map((themeoptions) => (
            <button key={themeoptions.name}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transitions-colors
              ${
                theme === themeoptions.name
                ? 'bg-primary/10 text-primary'
                :  'hover:bg-base-contebt/5'
              }`
            }
            onClick={()=> setTheme(themeoptions.name)}
            >
              <PaletteIcon className='size-4'/>
              <span className='text-sm font-medium'>{themeoptions.label}</span>
              <div className="ml-auto flex gap-1">
                {
                  themeoptions.colors.map((color, i) => (
                    <span
                     key={i}
                     style={{backgroundColor:color}}
                     className='size-2 rounded-full'
                    />
                  ))
                }
              </div>
            </button>
          ))}
        </div>
      </div> 
    </div>
  )
}

export default ThemeSelector
