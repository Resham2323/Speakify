import {LoaderIcon} from 'lucide-react';
import { useThemeStore } from '../store/useTheme';

const PageLoader = () => {
    const {theme} = useThemeStore()
    return(
        <div data-theme={theme} className="min-h-screen flex items-center justify-center">
        <LoaderIcon className='animate-spin size-9 text-primary'/>
        </div>
    )
}

export default PageLoader;